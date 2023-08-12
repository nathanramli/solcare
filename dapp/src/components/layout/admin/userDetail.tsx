import ProfilePlaceholder from '../../../image/profilePic.png';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, USDC_DECIMALS } from '../../../utils';
import { useParams } from 'react-router';
import { ProfileProps } from '../profile/mainProfile';
import { toast } from 'react-toastify';
import { useSmartContract } from '../../../context/connection';
import { useWallet } from '@solana/wallet-adapter-react';
import { ACCOUNT_DISCRIMINATOR_SIZE, BN, utils } from '@project-serum/anchor';
import { TransactionProps } from '../profile/mainProfile';

const UserDetail = () => {
    const { address } = useParams();
    const { connected, publicKey } = useWallet();
    const { smartContract } = useSmartContract();

    const [userData, setUserData] = useState<ProfileProps>();
    const [createCampaign, setCreatedCampaign] = useState();
    const [donatedCampaigns, setDonatedCampaigns] = useState(new Array<any>());

    const fetchUser = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/users/info/${address}`
        );

        if (resp.data.status === 200) {
            setUserData(resp.data.data);
        }
    };

    const fetchCreatedCampaign = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/campaign/user/${address}`
        );

        if (resp.data.status === 200) {
            setCreatedCampaign(resp.data.data.length);
        }
    };

    const fetchDonatedCampaign = async () => {
        if (connected && publicKey) {
            const newDonatedCampaigns: any[] = [];

            const donors = await smartContract.account.donor.all([
                {
                    memcmp: {
                        offset: ACCOUNT_DISCRIMINATOR_SIZE,
                        bytes: utils.bytes.bs58.encode(publicKey.toBuffer()),
                    },
                },
            ]);

            await Promise.all(
                donors.map(async (e) => {
                    try {
                        const campaignData =
                            await smartContract.account.campaign.fetch(
                                e.account.campaign
                            );

                        const response = await axios.get(
                            API_BASE_URL + '/v1/campaign/' + e.account.campaign
                        );
                        const responseData = response.data.data;

                        newDonatedCampaigns.push({
                            ...campaignData,
                            campaign: e.account.campaign,
                            collected: campaignData.fundedAmount
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                            target: campaignData.targetAmount
                                .div(new BN(Math.pow(10, USDC_DECIMALS)))
                                .toNumber(),
                            duration: campaignData.heldDuration,
                            title: responseData.title,
                            banner: responseData.banner,
                        });
                    } catch (e) {}
                })
            );

            setDonatedCampaigns(newDonatedCampaigns);
        }
    };

    const removeVerification = async () => {
        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.delete(
            `${API_BASE_URL}/v1/admins/kyc/${address}`,
            { headers }
        );
        if (resp.data.status !== 200) {
            toast.error(`Verifikasi gagal dicabut. Silahkan coba kembali.`);
            return;
        }
        toast.success('Verifikasi berhasil dicabut.');
        fetchUser();
    };

    const [donationData, setDonationData] = useState<TransactionProps[]>([]);

    const fetchTransaction = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/transaction/${address}`
        );

        if (resp.data.status === 200) {
            setDonationData(resp.data.data);
        }
    };

    const getTotalDonation = () => {
        let total = 0;
        for (let i = 0; i < donationData.length; i++) {
            if (donationData[i].type == 0) {
                total += donationData[i].amount;
            }
            if (donationData[i].type == 1) {
                total -= donationData[i].amount;
            }
        }
        return total;
    };

    const getTotalIncome = () => {
        let total = 0;
        for (let i = 0; i < donationData.length; i++) {
            if (donationData[i].type == 2) {
                total += donationData[i].amount;
            }
        }
        return total;
    };

    useEffect(() => {
        fetchUser();
        fetchCreatedCampaign();
        fetchDonatedCampaign();
        fetchTransaction();
    }, []);

    if (userData === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row items-center shadow-[0px_4px_6px_2px_rgba(0,123,199,0.5)] p-8 rounded-[10px]">
                <img
                    className="md:basis-1/12 w-24 h-24 rounded-full md:w-28 md:h-28"
                    src={
                        userData.profilePicture === ''
                            ? ProfilePlaceholder
                            : `${API_BASE_URL}/resources/${userData.profilePicture}`
                    }
                    alt="placeholder"
                />
                <div className="md:basis-10/12 flex flex-col items-center md:items-start my-4 md:my-0 md:mx-4">
                    <div className="text-center text-sm md:self-start md:text-right md:basis-1/12 text-gray-500">
                        {userData.isVerified ? (
                            <p className="text-green-600 text-base">
                                Terverifikasi
                            </p>
                        ) : (
                            <p>Belum Verifikasi</p>
                        )}
                    </div>

                    <div className="divider my-1" />

                    <h2 className="text-lg font-bold flex flex-row items-centermd:text-xl">
                        <span className="mr-2 md:w-[20px] w-[18px]">
                            {userData.gender ? (
                                <svg
                                    viewBox="0 0 158 158"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M157.7 45.2H143.2V25.14L116.6 51.69C126.1 63.65 130.9 77.3 130.9 92.5C130.9 110.5 124.5 125.8 111.7 138.6C98.9 151.4 83.5 157.8 65.6 157.8C47.7 157.8 32.3 151.4 19.5 138.6C6.7 125.8 0.300003 110.5 0.300003 92.5C0.300003 74.67 6.7 59.34 19.5 46.56C32.3 33.77 47.7 27.38 65.6 27.38C80.9 27.38 94.5 32.1 106.4 41.54L133 14.98H112.9V0.470001H157.7V45.2ZM65.6 143.4C79.5 143.4 91.5 138.4 101.4 128.5C111.4 118.5 116.4 106.5 116.4 92.5C116.4 78.5 111.4 66.56 101.5 56.65C91.6 46.73 79.6 41.78 65.6 41.78C51.7 41.78 39.7 46.75 29.8 56.71C19.8 66.66 14.9 78.6 14.9 92.5C14.9 106.5 19.8 118.5 29.8 128.5C39.7 138.4 51.7 143.4 65.6 143.4Z"
                                        fill="#34AAE2"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    viewBox="0 0 131 194"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M58.04 130.6C40.89 128.5 26.94 121.2 16.2 108.8C5.46 96.3 0.0939941 81.98 0.0939941 65.85C0.0939941 47.91 6.46999 32.55 19.21 19.76C31.96 6.98 47.34 0.584 65.36 0.584C83.22 0.584 98.6 7 111.4 19.82C124.2 32.65 130.6 47.99 130.6 65.85C130.6 81.98 125.2 96.3 114.5 108.8C103.7 121.2 89.71 128.5 72.56 130.6V155.1H96.8V169.6H72.56V193.8H58.04V169.6H33.97V155.1H58.04V130.6ZM65.36 116.6C79.29 116.6 91.23 111.6 101.2 101.7C111.1 91.82 116.1 79.86 116.1 65.85C116.1 51.85 111.2 39.89 101.2 29.97C91.33 20.06 79.37 15.1 65.36 15.1C51.36 15.1 39.4 20.08 29.48 30.03C19.57 39.98 14.61 51.92 14.61 65.85C14.61 79.86 19.57 91.82 29.48 101.7C39.4 111.6 51.36 116.6 65.36 116.6Z"
                                        fill="#E6007D"
                                    />
                                </svg>
                            )}
                        </span>
                        <span>
                            {userData.firstName === '' ||
                            userData.firstName === ''
                                ? 'Nama'
                                : userData.firstName + ' ' + userData.lastName}
                        </span>
                    </h2>
                    <p className="text-sm mb-2 md:text-base">
                        {userData.email === '' ? '-' : userData.email}
                    </p>
                    <p id="address-tag" className="text-sm md:text-base">
                        {userData.address}
                    </p>
                </div>

                <div className="text-sm text-center md:self-start md:text-right md:basis-1/12">
                    {userData.isWarned ? (
                        <p className="text-red-600 text-bold">Diperingati</p>
                    ) : (
                        <p className="text-green-600 text-bold">
                            Belum Diperingati
                        </p>
                    )}
                </div>
            </div>

            <div className="divider" />

            <div className="grid grid-cols-1 gap-6 font-bold text-xs sm:text-lg md:grid-cols-2 md:gap-4 items-center mb-4">
                <div className="col-span-1">
                    <p>Total Donasi</p>
                    <div className="text-3xl">
                        <p>{getTotalDonation()}</p>
                        <p className="text-[15px] leading-none">USDC</p>
                    </div>
                </div>
                <div className="col-span-1">
                    <p>Total Pendapatan</p>
                    <div className="text-3xl">
                        <p>{getTotalIncome()}</p>
                        <p className="text-[15px] leading-none">USDC</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 font-bold text-xs sm:text-lg md:grid-cols-2 md:grid-rows-2 md:gap-4 items-center">
                <div className="col-span-1">
                    <p>Campaign Yang Dibuat</p>
                    <div className="text-3xl">
                        <p>{createCampaign}</p>
                        <p className="text-[15px] leading-none">Campaign</p>
                    </div>
                </div>
                <div className="col-span-1">
                    <p>Campaign Yang Dibantu</p>
                    <div className="text-3xl">
                        <p>{donatedCampaigns.length}</p>
                        <p className="text-[15px] leading-none">Campaign</p>
                    </div>
                </div>
            </div>
            {userData.isVerified === true ? (
                <>
                    <label
                        htmlFor="my-modal-4"
                        className="mt-4 self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white 
                        font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px] hover:cursor-pointer text-center"
                    >
                        Cabut Verifikasi
                    </label>
                    <div>
                        <input
                            type="checkbox"
                            id="my-modal-4"
                            className="modal-toggle"
                        />
                        <label
                            htmlFor="my-modal-4"
                            className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                        >
                            <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[42rem] max-w-screen-2xl md:max-h-screen-2xl">
                                <h1 className="text-md font-bold md:text-3xl">
                                    Konfirmasi Tindakan
                                </h1>
                                <div className="divider" />
                                <p className="text-xs md:text-xl">
                                    Apakah anda yakin untuk mencabut verifikasi
                                    user bernama{' '}
                                    <b>
                                        {userData.firstName === '' ||
                                        userData.firstName === ''
                                            ? 'Anonymous'
                                            : userData.firstName +
                                              ' ' +
                                              userData.lastName}
                                    </b>{' '}
                                    dengan wallet address{' '}
                                    <b>{userData.address}</b>?
                                </p>
                                <div className="flex flex-row justify-end font-bold text-white text-center mt-4">
                                    <label
                                        htmlFor="my-modal-4"
                                        className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                                    >
                                        Batal
                                    </label>
                                    <label
                                        onClick={removeVerification}
                                        className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                    >
                                        Cabut
                                    </label>
                                </div>
                            </label>
                        </label>
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
};

export default UserDetail;
