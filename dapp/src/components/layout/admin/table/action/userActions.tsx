import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../../../../utils';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
const UserActions = (props: any) => {
    const [userData, setUserData] = useState(props.data);

    const fetchUser = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/users/info/${userData.address}`
        );

        if (resp.data.status === 200) {
            setUserData(resp.data.data);
        }
    };

    const removeVerification = async () => {
        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.delete(
            `${API_BASE_URL}/v1/admins/kyc/${userData.address}`,
            { headers }
        );
        if (resp.data.status !== 200) {
            toast.error(`Verifikasi gagal dicabut. Silahkan coba kembali.`);
            return;
        }
        toast.success('Verifikasi berhasil dicabut.');
        fetchUser();
    };
    return (
        <div className="flex flex-row justify-center">
            <Link
                to={`/admin/manage-user/detail/${userData.address}`}
                className="hover:stroke-[#007BC7] stroke-black tooltip cursor-pointer"
                data-tip="Detail"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M14.5 25C20.299 25 25 20.299 25 14.5C25 8.70101 20.299 4 14.5 4C8.70101 4 4 8.70101 4 14.5C4 20.299 8.70101 25 14.5 25Z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M21.9238 21.9248L27.9989 27.9999"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </Link>

            {userData.isVerified === true ? (
                <>
                    <label
                        htmlFor={`${userData.address}-validation-modal-true`}
                        className="ml-2 hover:stroke-[#007BC7] stroke-black tooltip cursor-pointer"
                        data-tip="Cabut"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M25 7L7 25"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M25 25L7 7"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </label>
                    <div>
                        <input
                            type="checkbox"
                            id={`${userData.address}-validation-modal-true`}
                            className="modal-toggle"
                        />
                        <label
                            htmlFor={`${userData.address}-validation-modal-true`}
                            className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                        >
                            <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[42rem] max-w-screen-2xl md:max-h-screen-2xl">
                                <h1 className="text-md font-bold md:text-3xl text-black text-left">
                                    Konfirmasi Tindakan
                                </h1>
                                <div className="divider" />
                                <p className="text-xs md:text-xl text-black text-left">
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
                                        htmlFor={`${userData.address}-validation-modal-true`}
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

export default UserActions;
