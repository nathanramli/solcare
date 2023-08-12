import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../utils';
const ReportActions = (props: any) => {
    const [delisted, setDelisted] = useState(true);

    const acceptReports = async () => {
        let token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.post(
            `${API_BASE_URL}/v1/admins/reports/verify`,
            {
                campaignAddress: props.id,
                isAccepted: true,
            },
            { headers }
        );
        if (resp.data.status !== 200) {
            toast.error(`Laporan gagal diproses. Silahkan coba kembali.`);
            return;
        }
        toast.success('Campaign berhasil didelisted!');
        fetchCampaign();
    };

    const fetchCampaign = async () => {
        const response = await axios.get(
            API_BASE_URL + '/v1/campaign/' + props.id
        );
        const responseData = response.data.data;

        setDelisted(responseData.delisted);
    };

    useEffect(() => {
        fetchCampaign();
    }, []);

    return (
        <div className="flex flex-row justify-center">
            <Link
                to={`/admin/manage-pengaduan/detail/${props.id}`}
                className="hover:stroke-[#007BC7] stroke-black tooltip"
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
            {delisted ? (
                <></>
            ) : (
                <>
                    <label
                        htmlFor={`${props.id}-validation-modal-true`}
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
                                d="M5.5 17.9091V6.5C5.5 6.23478 5.60536 5.98043 5.79289 5.79289C5.98043 5.60536 6.23478 5.5 6.5 5.5H25.5C25.7652 5.5 26.0196 5.60536 26.2071 5.79289C26.3946 5.98043 26.5 6.23478 26.5 6.5V25.5C26.5 25.7652 26.3946 26.0196 26.2071 26.2071C26.0196 26.3946 25.7652 26.5 25.5 26.5H16.9545"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16 19L8 27L4 23"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </label>
                    <div>
                        <input
                            type="checkbox"
                            id={`${props.id}-validation-modal-true`}
                            className="modal-toggle"
                        />
                        <label
                            htmlFor={`${props.id}-validation-modal-true`}
                            className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                        >
                            <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[42rem] max-w-screen-2xl md:max-h-screen-2xl">
                                <h1 className="text-md font-bold md:text-3xl text-black">
                                    Konfirmasi Tindakan
                                </h1>
                                <div className="divider" />
                                <p className="text-xs md:text-xl text-black">
                                    Apakah anda yakin untuk menerima pengaduan
                                    oleh user kepada campaign{' '}
                                    <b>{props.title}</b> dengan owner address{' '}
                                    <b>{props.owner}</b>?
                                </p>
                                <div className="flex flex-row justify-end font-bold text-white text-center mt-4">
                                    <label
                                        htmlFor={`${props.id}-validation-modal-true`}
                                        className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px] cursor-pointer"
                                    >
                                        Tutup
                                    </label>
                                    <label
                                        onClick={acceptReports}
                                        className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7] cursor-pointer"
                                    >
                                        Terima
                                    </label>
                                </div>
                            </label>
                        </label>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportActions;
