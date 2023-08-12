import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ProfilePlaceholder from '../../../image/profilePic.png';
import { API_BASE_URL, OPACITY } from '../../../utils';
import KYC from './kyc';
import { ProfileProps } from './mainProfile';
import SetInfo from './setInfo';

const AccountSetting = () => {
    const { connected, publicKey } = useWallet();
    const [userInfo, setUserInfo] = useState<ProfileProps>();
    const [uploadedAvatar, setUploadedAvatar] = useState();

    const fetchUser = async () => {
        const userData = await axios.get(
            `${API_BASE_URL}/v1/users/info/${publicKey?.toBase58()}`
        );
        if (userData.data.data != undefined) {
            setUserInfo(userData.data.data);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const [input, setInput] = useState<{ [string: string]: any }>({
        picture: null,
    });

    const handleInputChange = async (e: any) => {
        const target = e.target;
        let file = target.files[0];
        if (file.type === 'image/png' || file.type === 'image/jpeg') {
            setUploadedAvatar(file.name);
            setInput(file);
        } else {
            toast.error('Format file invalid');
        }

        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const formData = new FormData();
        formData.append('picture', file);

        try {
            const resp = await axios.put(
                `${API_BASE_URL}/v1/users/avatar/${publicKey?.toBase58()}`,
                formData,
                { headers }
            );

            if (resp.data.status !== 200) {
                toast.error(`Profile picture gagal disimpan!`);
                return;
            }
            toast.success('Profile picture berhasil disimpan!');
        } catch (e) {
            console.log(e);
            toast.error(`Profile picture gagal disimpan!`);
        }
    };

    if (userInfo === undefined) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col md:flex-row items-center shadow-[0px_4px_6px_2px_rgba(0,123,199,0.5)] p-8 rounded-[10px] py-8">
                <label
                    htmlFor="dropzone-file"
                    style={{
                        backgroundImage: `linear-gradient(
                            rgba(0, 0, 0, ${
                                userInfo.profilePicture == '' ? 0 : OPACITY
                            }), 
                            rgba(0, 0, 0, ${
                                userInfo.profilePicture == '' ? 0 : OPACITY
                            })
                          ),url(${API_BASE_URL}/resources/${
                            userInfo.profilePicture
                        })`,
                    }}
                    className={`shrink-0 md:h-28 md:w-28 h-24 w-24 bg-cover bg-center flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-full cursor-pointer hover:brightness-90`}
                >
                    <svg
                        aria-hidden="true"
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                    </svg>
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        name="avatar"
                        onChange={handleInputChange}
                        accept="image/png, image/jpeg"
                    />
                    <div
                        id="address-tag"
                        className="text-center text-xs md:text-base"
                    >
                        {uploadedAvatar === undefined ? (
                            <></>
                        ) : (
                            <p className="w-[100px] px-2 h-6 truncate">
                                {uploadedAvatar}
                            </p>
                        )}
                    </div>
                </label>
                <div className="basis-10/12 shrink flex flex-col items-center md:items-start my-4 md:my-0 md:mx-4">
                    <div className="text-center text-sm md:self-start md:text-right md:basis-1/12 text-gray-500">
                        {userInfo.isVerified ? (
                            <p className="text-green-600 text-base">
                                Terverifikasi
                            </p>
                        ) : (
                            <p>Belum Verifikasi</p>
                        )}
                    </div>

                    <div className="divider my-1" />

                    <h2 className="text-lg font-bold flex flex-row items-center md:text-xl">
                        <span className="mr-2 md:w-[20px] w-[18px]">
                            {userInfo.gender ? (
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
                            {userInfo.firstName === '' ||
                            userInfo.firstName === ''
                                ? 'Nama'
                                : userInfo.firstName + ' ' + userInfo.lastName}
                        </span>
                    </h2>
                    <p className="text-sm mb-2 md:text-base">
                        {userInfo.email === '' ? '-' : userInfo.email}
                    </p>
                    <p id="address-tag" className="text-xs md:text-base">
                        {userInfo.address}
                    </p>
                </div>
                <div className="text-sm text-center md:self-start md:text-right md:basis-1/12">
                    {userInfo.isWarned ? (
                        <p className="text-red-600 text-bold">Diperingati</p>
                    ) : (
                        <p className="text-green-600 text-bold">
                            Belum Diperingati
                        </p>
                    )}
                </div>
            </div>
            <SetInfo
                refetch={fetchUser}
                email={userInfo.email}
                firstName={userInfo.firstName}
                gender={userInfo.gender}
                lastName={userInfo.lastName}
            />
            <div className="divider" />
            <KYC />
        </div>
    );
};

export default AccountSetting;
