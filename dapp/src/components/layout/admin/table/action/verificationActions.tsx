import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../../../utils';

const VerificationActions = (props: any) => {
    const userData = props.userData;
    const refetch = props.refetch;

    const acceptKYC = async () => {
        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const resp = await axios.post(
            `${API_BASE_URL}/v1/admins/kyc`,
            {
                address: userData.usersWalletAddress,
                isAccepted: true,
            },
            { headers }
        );

        if (resp.data.status !== 200) {
            toast.error(`Verifikasi gagal disetujui. Silahkan coba kembali.`);
            return;
        }
        toast.success('Permintaan verifikasi berhasil disetujui');
        refetch();
    };

    const declineKYC = async () => {
        let token = localStorage.getItem('token');
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.post(
            `${API_BASE_URL}/v1/admins/kyc`,
            {
                address: userData.usersWalletAddress,
                isAccepted: false,
            },
            { headers }
        );
        if (resp.data.status !== 200) {
            toast.error(`Verifikasi gagal ditolak. Silahkan coba kembali.`);
            return;
        }
        toast.success('Permintaan verifikasi berhasil ditolak');
        refetch();
    };

    return (
        <div className="flex flex-row justify-center">
            <>
                <label
                    htmlFor={`${userData.usersWalletAddress}-validation-modal-true`}
                    className="ml-2 hover:stroke-[#007BC7] stroke-black tooltip cursor-pointer"
                    data-tip="Terima"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M27 9.00073L13 23.0001L6 16.0007"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </label>
                <div>
                    <input
                        type="checkbox"
                        id={`${userData.usersWalletAddress}-validation-modal-true`}
                        className="modal-toggle"
                    />
                    <label
                        htmlFor={`${userData.usersWalletAddress}-validation-modal-true`}
                        className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                    >
                        <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[42rem] max-w-screen-2xl md:max-h-screen-2xl">
                            <h1 className="text-md font-bold md:text-3xl text-black">
                                Konfirmasi Tindakan
                            </h1>
                            <div className="divider" />
                            <p className="text-xs md:text-xl text-black">
                                Apakah anda yakin untuk menerima permintaan
                                verifikasi user bernama{' '}
                                <b>
                                    {userData.name === ''
                                        ? 'Anonymous'
                                        : userData.name}
                                </b>{' '}
                                dengan wallet address{' '}
                                <b>{userData.usersWalletAddress}</b>?
                            </p>
                            <div className="flex flex-row justify-end font-bold text-white text-center mt-4">
                                <label
                                    htmlFor={`${userData.usersWalletAddress}-validation-modal-true`}
                                    className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                                >
                                    Tutup
                                </label>
                                <label
                                    onClick={acceptKYC}
                                    className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                >
                                    Terima
                                </label>
                            </div>
                        </label>
                    </label>
                </div>
            </>
            <>
                <label
                    htmlFor={`${userData.usersWalletAddress}-validation-modal-false`}
                    className="ml-2 hover:stroke-[#007BC7] stroke-black tooltip cursor-pointer"
                    data-tip="Tolak"
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
                        id={`${userData.usersWalletAddress}-validation-modal-false`}
                        className="modal-toggle"
                    />
                    <label
                        htmlFor={`${userData.usersWalletAddress}-validation-modal-false`}
                        className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                    >
                        <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[42rem] max-w-screen-2xl md:max-h-screen-2xl">
                            <h1 className="text-md font-bold md:text-3xl text-black">
                                Konfirmasi Tindakan
                            </h1>
                            <div className="divider" />
                            <p className="text-xs md:text-xl text-black">
                                Apakah anda yakin untuk menolak permintaan
                                verifikasi user bernama{' '}
                                <b>
                                    {userData.name === ''
                                        ? 'Anonymous'
                                        : userData.name}
                                </b>{' '}
                                dengan wallet address{' '}
                                <b>{userData.usersWalletAddress}</b>?
                            </p>
                            <div className="flex flex-row justify-end font-bold text-white text-center mt-4">
                                <label
                                    htmlFor={`${userData.usersWalletAddress}-validation-modal-false`}
                                    className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                                >
                                    Tutup
                                </label>
                                <label
                                    onClick={declineKYC}
                                    className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                >
                                    Tolak
                                </label>
                            </div>
                        </label>
                    </label>
                </div>
            </>
        </div>
    );
};

export default VerificationActions;
