import * as spl from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { web3 } from '@project-serum/anchor';
import { useRef } from 'react';
import { Id, toast } from 'react-toastify';
import { useSmartContract } from '../../../context/connection';
import {
    API_BASE_URL,
    CAMPAIGN_AUTHORITY_SEED,
    DONOR_SEED,
    getDerivedAccount,
    PROPOSAL_SEED,
    USDC_MINT,
} from '../../../utils';
import { DonorInfo } from '../../../views/DetailCampaign';
import axios from 'axios';

const Refund = ({
    campaignPubkey,
    refetch,
    donorInfo,
}: {
    campaignPubkey: web3.PublicKey;
    refetch: () => void;
    donorInfo: DonorInfo | null;
}) => {
    const { publicKey, connected, sendTransaction } = useWallet();
    const { smartContract } = useSmartContract();
    const toastId = useRef<Id | null>(null);

    const toastDone = () => {
        if (toastId.current) toast.done(toastId.current);
        toastId.current = null;
    };

    const claimRefund = async () => {
        if (!connected || !publicKey || toastId.current) return;

        toastId.current = toast('Memproses klaim dana kamu!', {
            progress: 0.1,
            autoClose: false,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        });

        const campaignAuthorityDerivedAccount = getDerivedAccount(
            [CAMPAIGN_AUTHORITY_SEED, campaignPubkey],
            smartContract.programId
        );

        const donorDerivedAccount = getDerivedAccount(
            [DONOR_SEED, campaignPubkey, publicKey],
            smartContract.programId
        );

        const proposalDerivedAccount = getDerivedAccount(
            [PROPOSAL_SEED, campaignPubkey],
            smartContract.programId
        );

        const campaignVault = await spl.getAssociatedTokenAddress(
            USDC_MINT,
            campaignAuthorityDerivedAccount.publicKey,
            true
        );

        const userToken = await spl.getAssociatedTokenAddress(
            USDC_MINT,
            publicKey
        );

        const preIxs = new Array<web3.TransactionInstruction>();
        if (
            (await smartContract.provider.connection.getAccountInfo(
                userToken
            )) === null
        ) {
            preIxs.push(
                spl.createAssociatedTokenAccountInstruction(
                    publicKey,
                    userToken,
                    publicKey,
                    USDC_MINT
                )
            );
        }

        toast.update(toastId.current, { progress: 0.5 });

        try {
            const ix = await smartContract.methods
                .refund()
                .accounts({
                    authority: publicKey,
                    donor: donorDerivedAccount.publicKey,
                    donorToken: userToken,
                    campaign: campaignPubkey,
                    campaignAuthority:
                        campaignAuthorityDerivedAccount.publicKey,
                    usdcMint: USDC_MINT,
                    campaignVault: campaignVault,
                    proposal: proposalDerivedAccount.publicKey,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    tokenProgram: spl.TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                })
                .instruction();

            const tx = new web3.Transaction();
            if (preIxs.length) {
                tx.add(...preIxs);
            }
            tx.add(ix);

            const txSignature = await sendTransaction(
                tx,
                smartContract.provider.connection
            );

            let token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post(
                `${API_BASE_URL}/v1/transaction`,
                {
                    signature: txSignature,
                    campaignAddress: campaignPubkey,
                    amount: donorInfo?.amount,
                    type: 1,
                },
                { headers }
            );

            toast.update(toastId.current, { progress: 1 });
            toastDone();
            refetch();

            toast(
                `🚀 Klaim refund berhasil dilakukan! Signature transaksi: ${txSignature}`
            );
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Klaim refund gagal dilakukan!`);
            return;
        }
    };

    return (
        <div className="flex flex-col mt-2 md:mt-6 text-justify">
            {donorInfo !== null && (
                <>
                    <h2 className="text-xs font-bold mb-1 md:text-xl md:mb-2">
                        Refund
                    </h2>

                    <p className="text-[8px] mb-2 md:text-[15px] md:mb-4">
                        Kamu telah berkontribusi pada campaign sebanyak:
                    </p>
                    <p className="text-base leading-none text-center mb-2 md:text-3xl md:mb-4">
                        <b>
                            {donorInfo.amount}
                            <span className="text-[8px] md:text-[15px]">
                                USDC
                            </span>
                        </b>
                    </p>
                    {donorInfo.refunded ? (
                        <p className="mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4">
                            Kamu telah{' '}
                            <b className="text-green-600">mengklaim donasi</b>{' '}
                            kamu kembali.
                        </p>
                    ) : (
                        <>
                            {' '}
                            <p className="text-[6px] mb-2 md:text-[12px] md:mb-4">
                                Silahkan menekan tombol dibawah untuk klaim
                                kembali donasi yang telah kamu berikan.
                            </p>
                            <button
                                onClick={() => claimRefund()}
                                className="bg-[#007BC7] text-xs w-full h-8 text-white font-bold 
                                rounded-[5px] md:text-xl md:h-16 md:rounded-[10px]"
                            >
                                Klaim Refund
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Refund;
