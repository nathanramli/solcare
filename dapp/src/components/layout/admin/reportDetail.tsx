import ReportCard from './card/reportCard';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, ITEM_PER_PAGE } from '../../../utils';
import { toast } from 'react-toastify';
const ReportDetail = () => {
    const { id } = useParams();

    const [currentValue, setValue] = useState('1');
    const [reportData, setReportData] = useState();
    const [reportLength, setReportLength] = useState(0);
    const [title, setTitle] = useState();
    const [delisted, setDelisted] = useState(true);

    const fetchCampaign = async () => {
        const response = await axios.get(API_BASE_URL + '/v1/campaign/' + id);
        const responseData = response.data.data;
        setTitle(responseData.title);
        setDelisted(responseData.delisted);
    };

    const fetchReports = async () => {
        const resp = await axios.get(`${API_BASE_URL}/v1/report/group/${id}`);

        if (resp.data.status === 200) {
            setReportData(resp.data.data);
            setReportLength(resp.data.data.length);
        }
    };

    const generateReports = (page: number, reportData: Array<any>) => {
        let components = [];
        for (
            let i = ITEM_PER_PAGE * page - ITEM_PER_PAGE;
            i < Math.min(ITEM_PER_PAGE * page, reportData.length);
            i++
        ) {
            components.push(<ReportCard key={i} data={reportData[i]} />);
        }
        return components;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (parseInt(event.target.value) < 1 || event.target.value == '') {
            setValue('1');
        } else {
            setValue(event.target.value);
        }
    };

    const decrease = () => {
        var value = parseInt(currentValue);
        if (value - 1 < 1) {
            setValue('1');
        } else {
            setValue((value - 1).toString());
        }
    };

    const increase = () => {
        var value = parseInt(currentValue);
        if (value + 1 > 20) {
            setValue('20');
        } else {
            setValue((value + 1).toString());
        }
    };

    const acceptReports = async () => {
        let token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${token}`,
        };
        const resp = await axios.post(
            `${API_BASE_URL}/v1/admins/reports/verify`,
            {
                campaignAddress: id,
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

    useEffect(() => {
        fetchReports();
        fetchCampaign();
    }, []);

    if (reportData === undefined || title === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div
            className="
            mt-2
            md:mt-6"
        >
            <div className="flex flex-row items-center mb-2 md:mb-6 justify-between">
                <h1
                    className="
                    text-md font-bold
                    md:text-3xl"
                >
                    {title}
                </h1>
                <button
                    className="w-6 h-6 md:w-12 md:h-12 stroke-black hover:stroke-[#007BC7] tooltip"
                    data-tip="Lihat Campaign"
                    onClick={() => {
                        window.open('/campaign/' + id, '_blank', 'noreferrer');
                    }}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M16.198,10.896c-0.252,0-0.455,0.203-0.455,0.455v2.396c0,0.626-0.511,1.137-1.138,1.137H5.117c-0.627,0-1.138-0.511-1.138-1.137V7.852c0-0.626,0.511-1.137,1.138-1.137h5.315c0.252,0,0.456-0.203,0.456-0.455c0-0.251-0.204-0.455-0.456-0.455H5.117c-1.129,0-2.049,0.918-2.049,2.047v5.894c0,1.129,0.92,2.048,2.049,2.048h9.488c1.129,0,2.048-0.919,2.048-2.048v-2.396C16.653,11.099,16.45,10.896,16.198,10.896z"></path>
                        <path d="M14.053,4.279c-0.207-0.135-0.492-0.079-0.63,0.133c-0.137,0.211-0.077,0.493,0.134,0.63l1.65,1.073c-4.115,0.62-5.705,4.891-5.774,5.082c-0.084,0.236,0.038,0.495,0.274,0.581c0.052,0.019,0.103,0.027,0.154,0.027c0.186,0,0.361-0.115,0.429-0.301c0.014-0.042,1.538-4.023,5.238-4.482l-1.172,1.799c-0.137,0.21-0.077,0.492,0.134,0.629c0.076,0.05,0.163,0.074,0.248,0.074c0.148,0,0.294-0.073,0.382-0.207l1.738-2.671c0.066-0.101,0.09-0.224,0.064-0.343c-0.025-0.118-0.096-0.221-0.197-0.287L14.053,4.279z"></path>
                    </svg>
                </button>
            </div>
            <h2
                className="
                text-xs font-bold mb-1
                md:text-xl md:mb-2"
            >
                Daftar Laporan
            </h2>
            <div>{generateReports(parseInt(currentValue), reportData!!)}</div>

            <nav
                className="
                flex flex-col-reverse items-center py-4
                md:py-8 md:flex-row md:justify-between"
                aria-label="Table navigation"
            >
                <span
                    className="
                    text-sm font-normal text-gray-500 pt-2
                    md:text-xl md:pt-4"
                >
                    Showing{' '}
                    <span className="font-bold text-gray-900">
                        {parseInt(currentValue) * ITEM_PER_PAGE -
                            ITEM_PER_PAGE +
                            1}
                        -{parseInt(currentValue) * reportLength}
                    </span>{' '}
                    of{' '}
                    <span className="font-bold text-gray-900">
                        {reportLength}
                    </span>
                </span>
                <ul className="inline-flex items-center -space-x-px">
                    <li>
                        <button
                            onClick={decrease}
                            className="
                            block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700
                            md:py-4 md:px-6"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="
                                w-5 h-5
                                md:w-8 md:h-8"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </li>
                    <li>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            onChange={handleChange}
                            className="
                            text-center py-2 min-w-[75px] max-w-[100px] px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none
                            md:px-6 md:py-4 md:text-2xl"
                            value={currentValue}
                        />
                    </li>
                    <li>
                        <button
                            onClick={increase}
                            className="
                            block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700
                            md:py-4 md:px-6"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="
                                w-5 h-5
                                md:w-8 md:h-8"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="flex flex-col md:flex-row gap-2">
                {/*<button
                    className="
                    self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white font-bold rounded-[5px]
                    md:text-xl md:p-4 md:rounded-[10px]"
                >
                    Tolak Laporan
                </button>*/}
                {delisted ? (
                    <></>
                ) : (
                    <>
                        <label
                            htmlFor="my-modal-4"
                            className="self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white font-bold rounded-[5px]
                    md:text-xl md:p-4 md:rounded-[10px] text-center hover:cursor-pointer"
                        >
                            Terima Laporan
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
                                    <h1 className="text-md font-bold md:text-3xl text-black">
                                        Konfirmasi Tindakan
                                    </h1>
                                    <div className="divider" />
                                    <p className="text-xs md:text-xl text-black">
                                        Apakah anda yakin untuk menerima
                                        pengaduan oleh user kepada campaign{' '}
                                        <b>{title}</b>?
                                    </p>
                                    <div className="flex flex-row justify-end font-bold text-white text-center mt-4">
                                        <label
                                            htmlFor="my-modal-4"
                                            className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                                        >
                                            Tutup
                                        </label>
                                        <label
                                            onClick={acceptReports}
                                            className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
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
        </div>
    );
};

export default ReportDetail;
