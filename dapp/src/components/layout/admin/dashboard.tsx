import { useEffect, useState } from 'react';
import PieChart from './pieChart';
import HorizontalStackedBarChart from './horizontalStackedBarChart';
import axios from 'axios';
import {
    API_BASE_URL,
    PROPOSAL_SEED,
    STATUS_ACTIVE,
    STATUS_VOTING,
    getDerivedAccount,
    now,
} from '../../../utils';
import { useSmartContract } from '../../../context/connection';
import { ACCOUNT_DISCRIMINATOR_SIZE, utils } from '@project-serum/anchor';

const Dashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalUsersWarned, setTotalUsersWarned] = useState(0);

    const { smartContract } = useSmartContract();

    const [totalCampaigns, setTotalCampaigns] = useState(0);
    const [totalSuccessCampaign, setTotalSuccessCampaign] = useState(0);
    const [totalFailedCampaign, setTotalFailedCampaign] = useState(0);
    const [totalDelistedCampaigns, setTotalDelistedCampaigns] = useState(0);

    const fetchTotalUsers = async () => {
        const resp = await axios.get(`${API_BASE_URL}/v1/users`);
        let respData = [];
        if (resp.data.status === 200) {
            respData = resp.data.data;

            setTotalUsers(respData.length);

            let warnedUsers = 0;
            respData.forEach((e: any) => {
                if (e.isWarned === true) {
                    warnedUsers += 1;
                }
            });

            setTotalUsersWarned(warnedUsers);
        }
    };

    const fetchTotalCampaign = async () => {
        const resp = await axios.get(`${API_BASE_URL}/v1/campaign/summary`);
        if (resp.data.status === 200) {
            const respData = resp.data.data;

            setTotalCampaigns(respData.totalCampaigns);
            setTotalSuccessCampaign(respData.totalSuccessCampaigns);
            setTotalDelistedCampaigns(respData.totalDelistedCampaigns);

            const votingCampaigns = await smartContract.account.campaign.all([
                {
                    memcmp: {
                        offset:
                            ACCOUNT_DISCRIMINATOR_SIZE +
                            32 +
                            8 +
                            8 +
                            8 +
                            8 +
                            32,
                        bytes: utils.bytes.bs58.encode(
                            new Uint8Array([STATUS_VOTING])
                        ),
                    },
                },
            ]);
            const activeCampaigns = await smartContract.account.campaign.all([
                {
                    memcmp: {
                        offset:
                            ACCOUNT_DISCRIMINATOR_SIZE +
                            32 +
                            8 +
                            8 +
                            8 +
                            8 +
                            32,
                        bytes: utils.bytes.bs58.encode(
                            new Uint8Array([STATUS_ACTIVE])
                        ),
                    },
                },
            ]);

            const campaigns = [...votingCampaigns, ...activeCampaigns];

            let countFailedCampaings = 0;
            await Promise.all(
                campaigns.map(async (v) => {
                    if (v.account.status === STATUS_ACTIVE) {
                        if (
                            now() >
                            v.account.createdAt.toNumber() +
                                v.account.heldDuration.toNumber()
                        ) {
                            countFailedCampaings++;
                        }
                    } else if (v.account.status === STATUS_VOTING) {
                        const proposalDerivedAccount = getDerivedAccount(
                            [PROPOSAL_SEED, v.publicKey],
                            smartContract.programId
                        );
                        const proposal =
                            await smartContract.account.proposal.fetchNullable(
                                proposalDerivedAccount.publicKey
                            );
                        if (proposal) {
                            if (
                                v.account.fundedAmount.lte(
                                    proposal.agree.add(proposal.disagree)
                                ) ||
                                now() >
                                    proposal.createdAt.toNumber() +
                                        proposal.duration.toNumber()
                            ) {
                                if (
                                    !(
                                        proposal.agree.eqn(0) &&
                                        proposal.disagree.eqn(0)
                                    ) &&
                                    proposal.agree.lt(proposal.disagree)
                                ) {
                                    countFailedCampaings++;
                                }
                            }
                        }
                    }
                })
            );

            setTotalFailedCampaign(
                respData.totalFailedCampaigns + countFailedCampaings
            );
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalCampaign();
    }, []);

    if (totalCampaigns === 0) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-bold xl:text-base">
                        Jumlah User
                    </p>
                    <p className="text-2xl font-bold xl:text-4xl xl:my-4">
                        {totalUsers}
                    </p>
                </div>
                {/* <div>
                    <p className="text-xs font-bold xl:text-base">
                        Jumlah User Tidak Diperingati
                    </p>
                    <p className="text-2xl font-bold xl:text-4xl xl:my-4">
                        {totalUsers-totalUsersWarned}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-bold xl:text-base">
                        Jumlah User Diperingati
                    </p>
                    <p className="text-2xl font-bold xl:text-4xl xl:my-4">
                        {totalUsersWarned}
                    </p>
                </div> */}
                <div>
                    <p className="text-xs font-bold xl:text-base">
                        Jumlah Campaign
                    </p>
                    <p className="text-2xl font-bold xl:text-4xl xl:my-4">
                        {totalCampaigns}
                    </p>
                </div>
            </div>
            <p className="text-xs font-bold xl:text-base my-4">
                Status Progres Campaign
            </p>
            <div className="sm:grid mt-4 sm:mt-0 sm:gap-8 sm:grid-cols-3">
                <div className="sm:col-span-1 items-center">
                    <PieChart
                        label={'Jumlah Campaign'}
                        title={['Sukses', 'Pending', 'Gagal']}
                        data={[
                            totalSuccessCampaign,
                            totalCampaigns -
                                totalSuccessCampaign -
                                totalFailedCampaign,
                            totalFailedCampaign,
                        ]}
                    />
                </div>
                <div className="grid grid-rows-2 gap-4">
                    <div className="grid grid-cols-3 justify-center items-end">
                        <p className="text-xs xl:text-base col-span-2 font-bold">
                            Status Peringatan User
                        </p>
                        <div className="col-span-1">
                            <HorizontalStackedBarChart
                                title={'Jumlah User'}
                                label={'User Yang Tidak Diperingati '}
                                labelWarned={'User Yang Diperingati '}
                                data={totalUsers - totalUsersWarned}
                                warnedData={totalUsersWarned}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 justify-center items-start">
                        <p className="text-xs xl:text-base col-span-2 font-bold">
                            Status Keamanan Campaign
                        </p>
                        <div className="col-span-1">
                            <HorizontalStackedBarChart
                                title={'Jumlah Campaign'}
                                label={'Campaign Yang Tidak Diperingati '}
                                labelWarned={'Campaign Yang Diperingati '}
                                data={totalCampaigns - totalDelistedCampaigns}
                                warnedData={totalDelistedCampaigns}
                            />
                            <HorizontalStackedBarChart legendUsage={true} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
