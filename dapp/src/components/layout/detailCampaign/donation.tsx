import { web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { BN } from 'bn.js';
import * as spl from '@solana/spl-token';
import { useState } from 'react';
import { useSmartContract } from '../../../context/connection';
import {
    CAMPAIGN_AUTHORITY_SEED,
    DONOR_SEED,
    getDerivedAccount,
    USDC_DECIMALS,
    USDC_MINT,
    API_BASE_URL,
} from '../../../utils';
import { toast } from 'react-toastify';
import axios from 'axios';

const Donation = (props: any) => {
    const campaignAddress = props.campaignAddress;
    const refetch = props.refetch;
    const campaign = props.campaign;

    const { connected, publicKey, sendTransaction } = useWallet();
    const { smartContract } = useSmartContract();
    const [amount, setAmount] = useState(1);

    const submitDonation = async (e: any) => {
        if (!connected) {
            return toast.error('Select Wallet anda terlebih dahulu');
        } else if (amount === 0) {
            return toast.error('Jumlah donasi minimal 1 USDC');
        } else if (amount > campaign.target - campaign.collected) {
            return toast.error(`Jumlah donasi melebihi yang dibutuhkan`);
        }
        if (!connected || !publicKey) return;

        const tokenAddress = spl.getAssociatedTokenAddressSync(
            USDC_MINT,
            publicKey
        );
        if (
            (await smartContract.provider.connection.getAccountInfo(
                tokenAddress
            )) === null
        ) {
            toast.error('Wallet tidak memiliki USDC!');
            return;
        }

        const donorDerivedAccount = getDerivedAccount(
            [DONOR_SEED, campaignAddress, publicKey],
            smartContract.programId
        );

        const preIxs = new Array<web3.TransactionInstruction>();
        if (
            (await smartContract.provider.connection.getAccountInfo(
                donorDerivedAccount.publicKey
            )) === null
        ) {
            const initDonor = await smartContract.methods
                .initDonor()
                .accounts({
                    authority: publicKey,
                    campaign: campaignAddress,
                    donor: donorDerivedAccount.publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .instruction();
            preIxs.push(initDonor);
        }

        const campaignAuthorityDerivedAccount = getDerivedAccount(
            [CAMPAIGN_AUTHORITY_SEED, campaignAddress],
            smartContract.programId
        );

        const campaignVault = await spl.getAssociatedTokenAddress(
            USDC_MINT,
            campaignAuthorityDerivedAccount.publicKey,
            true
        );

        const ix = await smartContract.methods
            .donate(new BN(amount * Math.pow(10, USDC_DECIMALS)))
            .accounts({
                authority: publicKey,
                campaign: campaignAddress,
                campaignAuthority: campaignAuthorityDerivedAccount.publicKey,
                campaignVault: campaignVault,
                usdcMint: USDC_MINT,
                donor: donorDerivedAccount.publicKey,
                donorToken: tokenAddress,
                clock: web3.SYSVAR_CLOCK_PUBKEY,
                tokenProgram: spl.TOKEN_PROGRAM_ID,
                associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
            })
            .instruction();

        const tx = new web3.Transaction();
        if (preIxs.length) {
            tx.add(...preIxs);
        }
        tx.add(ix);

        try {
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
                    campaignAddress: campaignAddress,
                    amount: amount,
                    type: 0,
                },
                { headers }
            );

            toast(`Donasi berhasil!\nTx signature: ${txSignature}`);
            refetch();
        } catch (e) {
            toast.error(`Donasi gagal dilakukan!`);
        }
        refetch();
    };

    return (
        <div className="flex flex-col mt-2 md:mt-6">
            <h2 className="text-xs font-bold mb-1 md:text-xl md:mb-2">
                Donasi
            </h2>
            <div className="w-full flex flex-row items-center mb-2 md:mb-4">
                <input
                    className="text-xs basis-11/12 text-center p-2 mr-2 min-w-[100px] rounded-[5px] border 
                    border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none
                    md:text-xl md:p-4 md:mr-4 md:rounded-[10px]"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    min="1"
                />
                <p className="basis-1/12 text-xs font-bold text-center md:text-xl">
                    USDC
                </p>
            </div>
            <button
                onClick={submitDonation}
                className="bg-[#007BC7] text-xs w-full h-8 text-white font-bold rounded-[5px] md:text-xl md:h-16 md:rounded-[10px]"
            >
                Donasikan Sekarang
            </button>
        </div>
    );
};

export default Donation;
