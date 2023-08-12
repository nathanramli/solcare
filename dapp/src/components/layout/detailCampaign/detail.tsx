import Progress from './progress';
import CollectedFund from './collectedFund';
import Description from './description';
import FunderList from './funderList';
import Donation from './donation';
import FundraiserInfo from './fundraiserInfo';
import Voting from './voting';
import Claim from './claim';
import { useEffect, useState } from 'react';
import {
    now,
    STATUS_ACTIVE,
    STATUS_FILLED,
    STATUS_FUNDED,
    STATUS_NOT_FUNDED,
    STATUS_VOTING,
    VOTE_SEED,
    PROPOSAL_SEED,
    getDerivedAccount,
    STATUS_SUCCESS,
    STATUS_NOT_FILLED,
    STATUS_FAILED,
    STATUS_FUND_CLAIMABLE,
    EVIDENCE_STATUS_SUCCESS,
    EVIDENCE_STATUS_FAILED,
    EVIDENCE_STATUS_WAITING,
    EVIDENCE_STATUS_REQUESTED,
} from '../../../utils';
import { PublicKey } from '@solana/web3.js';
import Refund from './claim';
import { useSmartContract } from '../../../context/connection';
import { useWallet } from '@solana/wallet-adapter-react';
import { isAccountsGeneric } from '@project-serum/anchor/dist/cjs/program/accounts-resolver';
import SuccessInfo from './successInfo.';
import FilledInfo from './filledInfo';

const Detail = (props: any) => {
    const [initializing, setInitializing] = useState(true);
    const [voteTime, setVoteTime] = useState(0);
    const campaign = props.campaign;

    // console.log(props.donor);

    useEffect(() => {
        if (campaign.proposal !== null) {
            const interval = setInterval(() => {
                setVoteTime(
                    campaign.proposal.createdAt +
                        campaign.proposal.duration -
                        now()
                );
            }, 1000);
            return () => clearInterval(interval);
        }
    }, []);

    const countRemainingTime = () => {
        let remainingTime = 0;
        remainingTime = Math.max(
            campaign.createdAt + campaign.duration - now(),
            0
        );

        return remainingTime;
    };

    const showRemainingDays = () => {
        const DAY_IN_SECOND = 60 * 60 * 24;
        if (campaign.status == STATUS_VOTING) {
            let seconds = voteTime;
            if (seconds > 0) {
                let days = Math.floor(seconds / (3600 * 24));
                seconds -= days * 3600 * 24;
                let hours = Math.floor(seconds / 3600);
                seconds -= hours * 3600;
                let minutes = Math.floor(seconds / 60);
                seconds -= minutes * 60;
                return `${days}D ${hours}J ${minutes}M ${seconds}D`;
            } else {
                return '0H 0J 0M 0D';
            }
        } else {
            if (countRemainingTime() > 0) {
                if (countRemainingTime() > DAY_IN_SECOND) {
                    return Math.floor(countRemainingTime() / DAY_IN_SECOND);
                } else {
                    return '< 1';
                }
            } else {
                return '0';
            }
        }
    };

    const changeButton = (status: number) => {
        if (status === STATUS_ACTIVE) {
            return (
                <Donation
                    campaignAddress={new PublicKey(campaign.address)}
                    refetch={props.refetch}
                    campaign={campaign}
                />
            );
        } else if (status == STATUS_VOTING) {
            return (
                <Voting
                    refetchDonor={props.refetchDonor}
                    refetch={props.refetch}
                    donorInfo={props.donor}
                    campaignAddress={new PublicKey(campaign.address)}
                />
            );
        } else if (status == STATUS_FILLED) {
            return (
                <FilledInfo refetch={props.refetch} donorInfo={props.donor} />
            );
        } else if (status == STATUS_SUCCESS || status == STATUS_FAILED) {
            return (
                <SuccessInfo
                    refetch={props.refetch}
                    donorInfo={props.donor}
                    status={status}
                />
            );
        } else if (status == STATUS_NOT_FUNDED || status == STATUS_NOT_FILLED) {
            return (
                <Refund
                    campaignPubkey={new PublicKey(campaign.address)}
                    donorInfo={props.donor}
                    refetch={props.refetch}
                />
            );
        }
    };

    const showStatus = (status: number) => {
        if (status === STATUS_ACTIVE) {
            return <p className="text-green-600">Status Campaign Aktif</p>;
        } else if (status === STATUS_FILLED) {
            return (
                <p className="text-green-600">
                    Status Campaign Target Terpenuhi
                </p>
            );
        } else if (status === STATUS_NOT_FILLED) {
            return (
                <p className="text-red-600">
                    Status Campaign Target Gagal Terpenuhi
                </p>
            );
        } else if (status === STATUS_VOTING) {
            return <p className="text-blue-400">Status Campaign Voting</p>;
        } else if (status === STATUS_FUND_CLAIMABLE) {
            return (
                <p className="text-blue-600">Status Campaign Voting Selesai</p>
            );
        } else if (status === STATUS_FUNDED) {
            return <p className="text-green-600">Status Campaign Didanai</p>;
        } else if (status === STATUS_NOT_FUNDED) {
            return (
                <p className="text-red-600">Status Campaign Gagal Didanai</p>
            );
        }
        return <p>Unknown</p>;
    };

    const showEvidenceStatus = (status: number) => {
        if (status === EVIDENCE_STATUS_WAITING) {
            return (
                <p className="text-green-600">
                    Status Campaign Berhasil Didanai
                </p>
            );
        } else if (status === EVIDENCE_STATUS_REQUESTED) {
            return (
                <p className="text-blue-600">
                    Status Campaign Menunggu Verifikasi Kesuksesan
                </p>
            );
        } else if (status === EVIDENCE_STATUS_SUCCESS) {
            return <p className="text-green-600">Status Campaign Sukses</p>;
        } else if (status === EVIDENCE_STATUS_FAILED) {
            return <p className="text-red-600">Status Campaign Gagal</p>;
        }
        return <p>Unknown</p>;
    };

    useEffect(() => {
        setInitializing(false);
    }, []);

    if (initializing) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="w-full px-12 md:flex md:flex-row md:pl-12">
            <div className="md:basis-9/12">
                <h1 className="text-md font-bold mb-2  md:text-2xl">
                    {campaign.title}
                </h1>

                <div className="divider my-2" />

                <h2 className="text-md font-bold mb-2 md:mb-4 md:text-xl">
                    {campaign.status === STATUS_FUNDED
                        ? showEvidenceStatus(campaign.statusEvidence)
                        : showStatus(campaign.status)}
                </h2>
                <p className="text-xs md:text-xl mb-2">
                    Dibantu <b>{props.funders.length}</b> funders
                </p>

                {campaign.collected !== campaign.target ? (
                    <></>
                ) : (
                    <Progress
                        percentage={Math.min(
                            100,
                            (campaign.collected / campaign.target) * 100
                        )}
                    />
                )}

                <div className="mb-[3px] md:mb-3">
                    <p className="text-base leading-none md:text-3xl">
                        <b>
                            {campaign.collected}
                            <span className="text-[8px] md:text-[15px]">
                                USDC
                            </span>
                        </b>
                    </p>
                    <p>
                        Dana terkumpul dari{' '}
                        <b className="text-xl">
                            {campaign.target}
                            <span className="text-[10px]">USDC</span>
                        </b>
                    </p>
                </div>

                {campaign.collected === campaign.target ? (
                    <></>
                ) : (
                    <div className=" mb-[3px] md:mb-[9px]">
                        <p className="text-md leading-none md:text-3xl">
                            <b>{showRemainingDays()}</b>
                        </p>
                        <p className="text-[8px] md:text-[15px]">
                            Hari tersisa
                        </p>
                    </div>
                )}

                <div className="md:hidden">
                    <FundraiserInfo campaign={campaign} />
                    {changeButton(campaign.status)}
                </div>
                <Description campaign={campaign} />
                <FunderList key={campaign.address} funders={props.funders} />
            </div>
            <aside className="hidden ml-6 flex flex-col basis-3/12 md:block">
                <FundraiserInfo campaign={campaign} />
                {changeButton(campaign.status)}
            </aside>
        </div>
    );
};

export default Detail;
