import { web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSmartContract } from '../../../context/connection';
import {
    API_BASE_URL,
    DONOR_SEED,
    getDerivedAccount,
    PROPOSAL_SEED,
    VOTE_SEED,
} from '../../../utils';
import { DonorInfo } from '../../../views/DetailCampaign';

const Voting = ({
    campaignAddress,
    donorInfo,
    refetch,
    refetchDonor,
}: {
    campaignAddress: web3.PublicKey;
    donorInfo: DonorInfo | null;
    refetch: () => void;
    refetchDonor: () => void;
}) => {
    const [url, setUrl] = useState('');
    const { smartContract } = useSmartContract();

    const { connected, publicKey, sendTransaction } = useWallet();

    const submitVote = async (agree: boolean) => {
        if (!connected || !publicKey) return;

        const donorDerivedAccount = getDerivedAccount(
            [DONOR_SEED, campaignAddress, publicKey],
            smartContract.programId
        );

        const proposalDerivedAccount = getDerivedAccount(
            [PROPOSAL_SEED, campaignAddress],
            smartContract.programId
        );

        const voteDerivedAccount = getDerivedAccount(
            [VOTE_SEED, proposalDerivedAccount.publicKey, publicKey],
            smartContract.programId
        );

        try {
            const ix = await smartContract.methods
                .voting(agree)
                .accounts({
                    campaign: campaignAddress,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    authority: publicKey,
                    donor: donorDerivedAccount.publicKey,
                    proposal: proposalDerivedAccount.publicKey,
                    vote: voteDerivedAccount.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .instruction();

            const tx = await sendTransaction(
                new Transaction().add(ix),
                smartContract.provider.connection
            );

            toast(`🚀 Berhasil melakukan vote! Signature transaksi: ${tx}`);
            refetch();
            refetchDonor();
        } catch (e) {
            console.log('Error: ', e);
            toast.error(`Vote gagal!`);
            return;
        }
    };

    useEffect(() => {
        const proposalDerivedAccount = getDerivedAccount(
            [PROPOSAL_SEED, campaignAddress],
            smartContract.programId
        );

        axios
            .get(
                API_BASE_URL +
                    '/v1/campaign/proposal/' +
                    proposalDerivedAccount.publicKey.toBase58()
            )
            .then((e) => {
                setUrl(e.data.data.url);
            })
            .catch((e) => {
                console.log('Error: ', e);
            });
    }, []);

    return (
        <div>
            <div className="flex flex-col mt-2 md:mt-6">
                {donorInfo !== null ? (
                    <>
                        <h2 className="md:text-xl md:mb-2">Voting</h2>
                        <button
                            onClick={(e) => {
                                window.open(
                                    API_BASE_URL + '/resources/' + url,
                                    '_blank'
                                );
                            }}
                            className="border-solid border-2 border-[#007BC7] text-xs w-full h-8 text-[#007BC7] 
                            font-normal rounded-[5px] flex flex-row items-center hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                            md:text-xl md:h-16 md:rounded-[10px] md:border-2"
                        >
                            <svg
                                className="w-5 h-5 ml-2 mr-1 md:w-8 md:h-8 md:ml-4 md:mr-2"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15.475,6.692l-4.084-4.083C11.32,2.538,11.223,2.5,11.125,2.5h-6c-0.413,0-0.75,0.337-0.75,0.75v13.5c0,0.412,0.337,0.75,0.75,0.75h9.75c0.412,0,0.75-0.338,0.75-0.75V6.94C15.609,6.839,15.554,6.771,15.475,6.692 M11.5,3.779l2.843,2.846H11.5V3.779z M14.875,16.75h-9.75V3.25h5.625V7c0,0.206,0.168,0.375,0.375,0.375h3.75V16.75z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            <p className="line-clamp-1">proposal.pdf</p>
                        </button>
                        <p className="mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4">
                            Kamu telah berkontribusi pada campaign sebanyak:
                        </p>
                        <p className="text-base leading-none text-center mb-2 md:text-3xl md:mb-4">
                            <b>
                                {donorInfo.amount || 0}
                                <span className="text-[8px] md:text-[15px]">
                                    USDC
                                </span>
                            </b>
                        </p>
                        {donorInfo.vote === null ? (
                            <div className="w-full flex flex-row items-center justify-between mt-2 text-xs font-bold text-white md:mt-4 md:text-xl">
                                <button
                                    onClick={() => {
                                        submitVote(false);
                                    }}
                                    className="basis-3/6 bg-red-600 h-8 rounded-[5px] mr-[2px] md:h-16 md:rounded-[10px] md:mr-[6px]"
                                >
                                    Tolak
                                </button>
                                <button
                                    onClick={() => {
                                        submitVote(true);
                                    }}
                                    className="basis-3/6 bg-green-600 h-8 rounded-[5px] ml-[2px] md:h-16 md:rounded-[10px] md:ml-[6px]"
                                >
                                    Setuju
                                </button>
                            </div>
                        ) : (
                            <p className="mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4">
                                Kamu memilih{' '}
                                {donorInfo.vote.agree ? (
                                    <b className="text-green-600">menyetujui</b>
                                ) : (
                                    <b className="text-red-600">menolak</b>
                                )}{' '}
                                proposal.
                            </p>
                        )}
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Voting;
