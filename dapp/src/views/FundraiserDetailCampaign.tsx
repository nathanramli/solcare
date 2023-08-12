import { web3 } from '@project-serum/anchor';
import axios from 'axios';
import { BN } from 'bn.js';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MyDetailCampaign from '../components/layout/profile/detailCampaign';
import { useSmartContract } from '../context/connection';
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
} from '../utils';

interface CampaignInfo {
    address: string;
    ownerAddress: string;
    title: string;
    description: string;
    banner: string;

    target: number;
    collected: number;

    createdAt: number;
    duration: number;
    status: number;
    statusEvidence: number;
}

const FundraiserDetailCampaign = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState<CampaignInfo>();
    const [initializing, setInitializing] = useState(true);

    const { smartContract } = useSmartContract();

    const fetchCampaignDetail = async () => {
        const response = await axios.get(API_BASE_URL + '/v1/campaign/' + id);
        const responseData = response.data.data;
        const e = responseData;

        const campaign = await smartContract.account.campaign.fetchNullable(
            e.address
        );

        if (!campaign) {
            console.log('campaign is not found');
            return;
        }

        let status = campaign.status;
        if (
            status === STATUS_ACTIVE &&
            campaign.createdAt.toNumber() + campaign.heldDuration.toNumber() <
                now()
        ) {
            status = STATUS_NOT_FILLED;
        } else if (status === STATUS_VOTING) {
            const proposalDerivedAccount = getDerivedAccount(
                [PROPOSAL_SEED, new web3.PublicKey(e.address)],
                smartContract.programId
            );
            const proposal = await smartContract.account.proposal.fetchNullable(
                proposalDerivedAccount.publicKey
            );

            if (!proposal) {
                console.log('Unexpected error, proposal not found!');
                return;
            }
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

        const data: CampaignInfo = {
            address: e.address,
            ownerAddress: e.ownerAddress,
            title: e.title,
            description: e.description,
            banner: e.banner,

            target: campaign.targetAmount
                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                .toNumber(),
            collected: campaign.fundedAmount
                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                .toNumber(),

            createdAt: campaign.createdAt.toNumber(),
            duration: campaign.heldDuration.toNumber(),
            status: status,
            statusEvidence: e.status,
        };

        setDetail(data);
    };

    useEffect(() => {
        fetchCampaignDetail();
        setInitializing(false);
    }, [id]);

    if (initializing || detail === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <main className="max-w-screen-xl mx-auto">
            <div>
                <MyDetailCampaign
                    campaign={detail}
                    refetch={fetchCampaignDetail}
                />
            </div>
        </main>
    );
};

export default FundraiserDetailCampaign;
