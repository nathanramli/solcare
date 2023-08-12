import Detail from '../components/layout/detailCampaign/detail';
import Thumbnail from '../image/placeholder.svg';
import Action from '../components/layout/detailCampaign/action';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    API_BASE_URL,
    DONOR_SEED,
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
    VOTE_SEED,
} from '../utils';
import { useEffect, useState } from 'react';
import BannerContainer from '../components/layout/detailCampaign/bannerContainer';
import { useSmartContract } from '../context/connection';
import { BN } from 'bn.js';
import { ACCOUNT_DISCRIMINATOR_SIZE, utils, web3 } from '@project-serum/anchor';
import { FunderInfo } from '../components/layout/detailCampaign/funderList';
import { useWallet } from '@solana/wallet-adapter-react';

interface VoteInfo {
    agree: boolean;
    date: number;
}

export interface DonorInfo {
    donor: string;
    donorAddress: string;

    amount: number;
    refunded: boolean;

    vote: VoteInfo | null;
}

interface Proposal {
    agree: number;
    disagree: number;

    createdAt: number;
    duration: number;
}

interface DetailCampaign {
    address: string;
    ownerAddress: string;

    title: string;
    description: string;
    banner: string;
    status: number;
    delisted: boolean;

    createdAt: number;
    duration: number;

    collected: number;
    target: number;
    statusEvidence: number;

    proposal: Proposal | null;
}

const DetailCampaign = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState<DetailCampaign>();
    const [donor, setDonor] = useState<DonorInfo | null>(null);
    const [funders, setFunders] = useState<FunderInfo[]>([]);
    const [initializing, setInitializing] = useState(true);
    const { smartContract } = useSmartContract();

    const { connected, publicKey } = useWallet();

    const fetchCampaignDetail = async () => {
        const response = await axios.get(API_BASE_URL + '/v1/campaign/' + id);
        const responseData = response.data.data;
        // console.log(responseData)

        const campaign = await smartContract.account.campaign.fetchNullable(
            responseData.address
        );

        if (!campaign) {
            console.log('Unexpected error, campaign not found!');
            return;
        }

        let proposalInfo: Proposal | null = null;

        let status = campaign.status;
        if (
            status === STATUS_ACTIVE &&
            campaign.createdAt.toNumber() + campaign.heldDuration.toNumber() <
                now()
        ) {
            status = STATUS_NOT_FILLED;
        } else if (status === STATUS_VOTING) {
            const proposalDerivedAccount = getDerivedAccount(
                [PROPOSAL_SEED, new web3.PublicKey(responseData.address)],
                smartContract.programId
            );
            const proposal = await smartContract.account.proposal.fetchNullable(
                proposalDerivedAccount.publicKey
            );

            if (!proposal) {
                console.log('Unexpected error, proposal not found!');
                return;
            }

            proposalInfo = {
                agree: proposal.agree
                    .div(new BN(Math.pow(10, USDC_DECIMALS)))
                    .toNumber(),
                disagree: proposal.disagree
                    .div(new BN(Math.pow(10, USDC_DECIMALS)))
                    .toNumber(),
                createdAt: proposal.createdAt.toNumber(),
                duration: proposal.duration.toNumber(),
            };
            // clock.unix_timestamp <= proposal.created_at + proposal.duration) @ CustomError::CampaignIsNotInVotingPeriod
            if (
                now() >
                    proposal.createdAt.toNumber() +
                        proposal.duration.toNumber() ||
                proposal.agree.add(proposal.disagree).eq(campaign.fundedAmount)
            ) {
                if (
                    (proposal.agree.eqn(0) && proposal.disagree.eqn(0)) ||
                    proposal.agree.gt(proposal.disagree)
                ) {
                    status = STATUS_FUND_CLAIMABLE;
                } else {
                    status = STATUS_NOT_FUNDED;
                }
            }
        }

        setDetail({
            address: responseData.address,
            ownerAddress: responseData.ownerAddress,
            title: responseData.title,
            description: responseData.description,
            banner: responseData.banner,
            status: status,
            delisted: responseData.delisted,
            createdAt: campaign.createdAt.toNumber(),
            duration: campaign.heldDuration.toNumber(),
            collected: campaign.fundedAmount
                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                .toNumber(),
            target: campaign.targetAmount
                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                .toNumber(),
            proposal: proposalInfo,
            statusEvidence: responseData.status,
        });
    };

    const fetchUser = async (props: any) => {
        const resp = await axios.get(`${API_BASE_URL}/v1/users/info/${props}`);

        if (resp.data.status === 200) {
            return resp.data.data;
        }
        return resp.data.data;
    };

    const fetchFunders = async () => {
        const donors = await smartContract.account.donor.all([
            {
                memcmp: {
                    offset: ACCOUNT_DISCRIMINATOR_SIZE + 32 /*donor: Pubkey*/,
                    bytes: utils.bytes.bs58.encode(
                        new web3.PublicKey(id!).toBuffer()
                    ),
                },
            },
        ]);

        setFunders(
            await Promise.all(
                donors.map(async (e) => {
                    let user = await fetchUser(e.account.donor.toBase58());
                    return {
                        address: e.publicKey.toBase58(),
                        owner: e.account.donor.toBase58(),
                        name:
                            user.firstName === '' || user.lastName === ''
                                ? '-'
                                : `${user.firstName} ${user.lastName}`,
                        amount: e.account.donatedAmount
                            .div(new BN(Math.pow(10, USDC_DECIMALS)))
                            .toNumber(),
                        date: e.account.updatedAt.toNumber(),
                        profilePicture: user.profilePicture,
                    };
                })
            )
        );
    };

    const fetchDonor = async () => {
        if (connected && publicKey) {
            const donorDerivedAccount = getDerivedAccount(
                [DONOR_SEED, new web3.PublicKey(id!), publicKey],
                smartContract.programId
            );

            const donorInfo = await smartContract.account.donor.fetchNullable(
                donorDerivedAccount.publicKey
            );
            if (donorInfo !== null) {
                const proposalDerivedAccount = getDerivedAccount(
                    [PROPOSAL_SEED, new web3.PublicKey(id!)],
                    smartContract.programId
                );

                const voteDerivedAccount = getDerivedAccount(
                    [VOTE_SEED, proposalDerivedAccount.publicKey, publicKey],
                    smartContract.programId
                );

                const voteInfo = await smartContract.account.vote.fetchNullable(
                    voteDerivedAccount.publicKey
                );

                let vote: VoteInfo | null = null;
                if (voteInfo !== null) {
                    vote = {
                        agree: voteInfo.isAgree,
                        date: voteInfo.createdAt.toNumber(),
                    };
                }

                setDonor({
                    donor: publicKey.toBase58(),
                    donorAddress: donorDerivedAccount.publicKey.toBase58(),
                    amount: donorInfo.donatedAmount
                        .div(new BN(Math.pow(10, USDC_DECIMALS)))
                        .toNumber(),
                    vote: vote,
                    refunded: donorInfo.refunded,
                });
            }
        }
    };

    useEffect(() => {
        if (!connected && !publicKey) {
            setDonor(null);
        }
        fetchDonor();
    }, [connected, publicKey]);

    useEffect(() => {
        fetchCampaignDetail();
        fetchFunders();
        setInitializing(false);
    }, []);

    if (initializing === true || detail === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <main className="max-w-screen-xl mx-auto">
            <div>
                <BannerContainer campaign={detail} />
                <Action campaignAddress={detail.address} />
                <Detail
                    donor={donor}
                    campaign={detail}
                    funders={funders}
                    refetchDonor={fetchDonor}
                    refetch={fetchCampaignDetail}
                />
            </div>
        </main>
    );
};

export default DetailCampaign;
