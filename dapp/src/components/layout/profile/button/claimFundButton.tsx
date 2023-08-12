import { web3 } from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, TransactionInstruction } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id, toast } from 'react-toastify';
import { useSmartContract } from '../../../../context/connection';
import {
    API_BASE_URL,
    CAMPAIGN_AUTHORITY_SEED,
    getDerivedAccount,
    PROPOSAL_SEED,
    USDC_MINT,
} from '../../../../utils';
import axios from 'axios';

const ClaimFundButton = ({
    campaignAddress,
    amount,
    refetch,
}: {
    campaignAddress: string;
    amount: number;
    refetch: () => void;
}) => {
    const { publicKey, connected, sendTransaction } = useWallet();
    const { smartContract } = useSmartContract();
    const toastId = useRef<Id | null>(null);

    const toastDone = () => {
        if (toastId.current) toast.done(toastId.current);
        toastId.current = null;
    };

    const claimFund = async () => {
        if (!connected || !publicKey || toastId.current) return;

        toastId.current = toast('Memproses klaim dana kamu!', {
            progress: 0.1,
            autoClose: false,
            closeButton: false,
            draggable: false,
            closeOnClick: false,
        });

        const campaignPubkey = new web3.PublicKey(campaignAddress);
        const campaignAuthorityDerivedAccount = getDerivedAccount(
            [CAMPAIGN_AUTHORITY_SEED, campaignPubkey],
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

        const ownerToken = await spl.getAssociatedTokenAddress(
            USDC_MINT,
            publicKey
        );

        const preIxs = new Array<TransactionInstruction>();
        if (
            (await smartContract.provider.connection.getAccountInfo(
                ownerToken
            )) === null
        ) {
            preIxs.push(
                spl.createAssociatedTokenAccountInstruction(
                    publicKey,
                    ownerToken,
                    publicKey,
                    USDC_MINT
                )
            );
        }

        toast.update(toastId.current, { progress: 0.5 });

        try {
            const ix = await smartContract.methods
                .claimFunds()
                .accounts({
                    owner: publicKey,
                    campaign: campaignPubkey,
                    campaignAuthority:
                        campaignAuthorityDerivedAccount.publicKey,
                    usdcMint: USDC_MINT,
                    campaignVault: campaignVault,
                    proposal: proposalDerivedAccount.publicKey,
                    ownerToken: ownerToken,
                    clock: web3.SYSVAR_CLOCK_PUBKEY,
                    tokenProgram: spl.TOKEN_PROGRAM_ID,
                    associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
                    systemProgram: web3.SystemProgram.programId,
                })
                .instruction();

            const tx = new Transaction();
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
                    campaignAddress: campaignAddress,
                    amount: amount,
                    type: 2,
                },
                { headers }
            );

            toast.update(toastId.current, { progress: 1 });
            toastDone();
            toast(
                `🚀 Klaim dana berhasil dilakukan! Signature transaksi: ${txSignature}`
            );
        } catch (e) {
            toastDone();
            console.log('Error: ', e);
            toast.error(`Klaim dana gagal dilakukan!`);
            return;
        }
        refetch();
    };

    return (
        <div className="flex flex-col">
            <button
                className="text-center self-end bg-[#007BC7] w-full text-xs p-2 border border-[2px] border-[#007BC7] text-white 
                font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px] cursor-pointer"
                onClick={() => claimFund()}
            >
                Klaim Dana
            </button>
        </div>
    );
};

export default ClaimFundButton;
