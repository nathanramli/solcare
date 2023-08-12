import CollectedFund from '../detailCampaign/collectedFund';
import Description from '../detailCampaign/description';
import FunderList, { FunderInfo } from '../detailCampaign/funderList';
import Progress from '../detailCampaign/progress';
import Thumbnail from '../../../image/placeholder.svg';
import MoneyProposalButton from './button/moneyProposalBtn';
import EvidenceProposalButton from './button/evidenceProposalButton';
import {
    API_BASE_URL,
    STATUS_ACTIVE,
    STATUS_FILLED,
    STATUS_FUNDED,
    STATUS_FUND_CLAIMABLE,
    STATUS_VOTING,
    USDC_DECIMALS,
    EVIDENCE_STATUS_FAILED,
    EVIDENCE_STATUS_REQUESTED,
    EVIDENCE_STATUS_SUCCESS,
    EVIDENCE_STATUS_WAITING,
    STATUS_NOT_FUNDED,
    STATUS_NOT_FILLED,
} from '../../../utils';
import { useEffect, useState } from 'react';
import { useSmartContract } from '../../../context/connection';
import {
    ACCOUNT_DISCRIMINATOR_SIZE,
    BN,
    utils,
    web3,
} from '@project-serum/anchor';
import ClaimFundButton from './button/claimFundButton';
import axios from 'axios';

const MyDetailCampaign = (props: any) => {
    let campaign = props.campaign;
    // console.log(campaign);

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

    const changeButton = (status: number) => {
        if (status === STATUS_ACTIVE) {
            return (
                <div className="flex flex-col">
                    <label
                        className="text-center mt-4 self-end bg-[#007BC7] opacity-50 w-full text-xs p-2 border border-[2px] 
                        border-[#007BC7] text-white font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px] cursor-not-allowed"
                    >
                        Belum Bisa Mengajukan Pencairan Dana
                    </label>
                </div>
            );
        } else if (status === STATUS_FILLED) {
            return (
                <MoneyProposalButton
                    campaignAddress={campaign.address}
                    refetch={props.refetch}
                />
            );
        } else if (status === STATUS_VOTING) {
            return (
                <div className="flex flex-col">
                    <label
                        className="text-center mt-4 self-end bg-[#007BC7] opacity-50 w-full text-xs p-2 border border-[2px] 
                        border-[#007BC7] text-white font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px] cursor-not-allowed"
                    >
                        Dalam Masa Voting
                    </label>
                </div>
            );
        } else if (status === STATUS_FUND_CLAIMABLE) {
            return (
                <ClaimFundButton
                    campaignAddress={campaign.address}
                    amount={campaign.collected}
                    refetch={props.refetch}
                />
            );
        } else if (status == STATUS_FUNDED) {
            if (campaign.statusEvidence === EVIDENCE_STATUS_WAITING) {
                return (
                    <EvidenceProposalButton
                        campaignAddress={campaign.address}
                        refetch={props.refetch}
                    />
                );
            } else if (campaign.statusEvidence === EVIDENCE_STATUS_REQUESTED) {
                return (
                    <div className="flex flex-col">
                        <label
                            className="text-center mt-4 self-end bg-[#007BC7] opacity-50 w-full text-xs p-2 border border-[2px] 
                            border-[#007BC7] text-white font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px] cursor-not-allowed"
                        >
                            Menunggu Verifikasi Kesuksesan Campaign
                        </label>
                    </div>
                );
            }
        }
    };

    const [funders, setFunders] = useState<FunderInfo[]>([]);
    const { smartContract } = useSmartContract();

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
                        new web3.PublicKey(props.campaign.address).toBuffer()
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

    useEffect(() => {
        fetchFunders();
    }, []);

    return (
        <div className="w-[100%] px-12 md:pl-12 mx-auto">
            <div className="md:basis-10/12">
                <img
                    className="w-screen max-h-[250px] object-cover mb-1 md:max-h-[300px] lg:max-h-[350px] md:rounded-[20px] md:mb-4"
                    src={`${API_BASE_URL}/${campaign.banner}`}
                />
                <h2 className="text-md font-bold my-2 md:text-3xl">
                    {campaign.title}
                </h2>

                <div className="divider my-2" />

                <h1 className="text-md font-bold mb-2 md:mb-4 md:text-xl">
                    {campaign.status === STATUS_FUNDED
                        ? showEvidenceStatus(campaign.statusEvidence)
                        : showStatus(campaign.status)}
                </h1>
                <p className="text-xs md:text-xl mb-2">
                    Dibantu <b>{funders.length}</b> funders
                </p>

                {campaign.collected === campaign.target ? (
                    <></>
                ) : (
                    <Progress
                        percentage={Math.min(
                            100,
                            (campaign.collected / campaign.target) * 100
                        )}
                    />
                )}

                <CollectedFund campaign={campaign} />
                <Description campaign={campaign} />
                <FunderList funders={funders} />
                {changeButton(campaign.status)}
            </div>
        </div>
    );
};

export default MyDetailCampaign;
