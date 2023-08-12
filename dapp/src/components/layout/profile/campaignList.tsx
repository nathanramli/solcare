import { web3 } from '@project-serum/anchor';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';
import { BN } from 'bn.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSmartContract } from '../../../context/connection';
import {
    API_BASE_URL,
    getDerivedAccount,
    now,
    PROPOSAL_SEED,
    STATUS_ACTIVE,
    STATUS_FUNDED,
    STATUS_FUND_CLAIMABLE,
    STATUS_NOT_FILLED,
    STATUS_NOT_FUNDED,
    STATUS_VOTING,
    USDC_DECIMALS,
    USDC_MINT,
} from '../../../utils';
import CampaignCard from './card/campaignCard';

export interface ProposalInfo {
    agree: number;
    disagree: number;
}

interface Campaign {
    address: string;
    title: string;
    description: string;
    status: number;

    createdAt: number;
    duration: number;

    collected: number;
    target: number;
    statusEvidence: number;

    proposal: ProposalInfo | null;
}

const CampaignList = () => {
    const { connected, publicKey } = useWallet();
    const { smartContract } = useSmartContract();

    const [campaignList, setCampaignList] = useState<Campaign[]>();

    const getAllCampaign = async () => {
        if (!connected || !publicKey) {
            setCampaignList([]);
            return;
        }

        const list = await axios.get(
            API_BASE_URL + '/v1/campaign/user/' + publicKey.toBase58()
        );
        const campaignList: Campaign[] = [];

        await Promise.all(
            list.data.data.map(async (e: any) => {
                const campaign =
                    await smartContract.account.campaign.fetchNullable(
                        e.address
                    );
                if (campaign !== null) {
                    let status = campaign.status;
                    let proposalInfo: ProposalInfo | null = null;
                    if (
                        status === STATUS_ACTIVE &&
                        campaign.createdAt.toNumber() +
                            campaign.heldDuration.toNumber() <
                            now()
                    ) {
                        status = STATUS_NOT_FILLED;
                    } else if (status === STATUS_VOTING) {
                        const proposalDerivedAccount = getDerivedAccount(
                            [PROPOSAL_SEED, new web3.PublicKey(e.address)],
                            smartContract.programId
                        );
                        const proposal =
                            await smartContract.account.proposal.fetchNullable(
                                proposalDerivedAccount.publicKey
                            );

                        if (!proposal) {
                            console.log(
                                'Unexpected error, proposal not found!'
                            );
                            return;
                        }

                        proposalInfo = {
                            agree: proposal.agree
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                            disagree: proposal.disagree
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                        };

                        if (
                            now() >
                                proposal.createdAt.toNumber() +
                                    proposal.duration.toNumber() ||
                            proposal.agree
                                .add(proposal.disagree)
                                .eq(campaign.fundedAmount)
                        ) {
                            if (
                                (proposal.agree.eqn(0) &&
                                    proposal.disagree.eqn(0)) ||
                                proposal.agree.gt(proposal.disagree)
                            ) {
                                status = STATUS_FUND_CLAIMABLE;
                            } else {
                                status = STATUS_NOT_FUNDED;
                            }
                        }
                    }

                    campaignList.push({
                        address: e.address,
                        title: e.title,
                        description: e.description,
                        status: status,
                        createdAt: campaign.createdAt.toNumber(),
                        duration: campaign.heldDuration.toNumber(),
                        collected: campaign.fundedAmount
                            .div(new BN(Math.pow(10, USDC_DECIMALS)))
                            .toNumber(),
                        target: campaign.targetAmount
                            .div(new BN(Math.pow(10, USDC_DECIMALS)))
                            .toNumber(),
                        statusEvidence: e.status,
                        proposal: proposalInfo,
                    });
                }
            })
        );

        setCampaignList(campaignList);
    };

    useEffect(() => {
        getAllCampaign();
    }, [connected, publicKey]);

    if (campaignList === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }
    return (
        <div className="flex flex-col max-[369px]:flex-col-reverse">
            <Link
                to="/profile/my-campaign/create"
                className="btn self-end bg-[#007BC7] text-xs text-white font-bold rounded-[5px] max-[369px]:w-full sm:text-base sm:rounded-[10px] capitalize border-none"
            >
                Buat Campaign
            </Link>
            <p className="text-left font-bold text-xs mt-2 sm:text-lg sm:mt-4">
                Daftar Campaign
            </p>
            <div className="flex flex-col">
                {campaignList?.length === 0 ? (
                    <p className="text-center my-5">Belum ada campaign ...</p>
                ) : (
                    campaignList?.map((e) => {
                        return <CampaignCard key={e.address} {...e} />;
                    })
                )}
            </div>
        </div>
    );
};

export default CampaignList;
