import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../utils';

const Action = ({ campaignAddress }: { campaignAddress: string }) => {
    function saveURL() {
        let url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('URL berhasil disimpan');
    }

    const [description, setDescription] = useState('');
    const { connected, publicKey } = useWallet();

    const submitReport = async () => {
        if (!connected || !publicKey) return;

        try {
            const resp = await axios.post(
                API_BASE_URL + '/v1/report',
                {
                    campaignAddress: campaignAddress,
                    description: description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            if (resp.data.status === 200) {
                toast.success('Berhasil membuat laporan');
                setDescription('');
                (
                    document.getElementById('my-modal-4') as HTMLInputElement
                ).checked = false;
            } else {
                console.log('Error: ', resp);
                toast.error('Gagal membuat laporan');
            }
        } catch (e) {
            console.log('Catch error: ', e);
            toast.error('Gagal membuat laporan');
        }
    };

    return (
        <div className="flex flex-row mb-3 pl-12 md:mb-6">
            <button className="tooltip tooltip-bottom" data-tip="Pengaduan">
                <label htmlFor="my-modal-4" className="hover:cursor-pointer">
                    <svg
                        className="w-5 h-5 rounded-full mr-2 hover:text-red-600 md:w-8 md:h-8 md:mr-4"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221"></path>
                    </svg>
                </label>
            </button>

            <button
                onClick={saveURL}
                className="tooltip tooltip-bottom"
                data-tip="Copy URL"
            >
                <svg
                    className="w-5 h-5 rounded-full hover:text-[#007BC7] md:w-8 md:h-8"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M14.68,12.621c-0.9,0-1.702,0.43-2.216,1.09l-4.549-2.637c0.284-0.691,0.284-1.457,0-2.146l4.549-2.638c0.514,0.661,1.315,1.09,2.216,1.09c1.549,0,2.809-1.26,2.809-2.808c0-1.548-1.26-2.809-2.809-2.809c-1.548,0-2.808,1.26-2.808,2.809c0,0.38,0.076,0.741,0.214,1.073l-4.55,2.638c-0.515-0.661-1.316-1.09-2.217-1.09c-1.548,0-2.808,1.26-2.808,2.809s1.26,2.808,2.808,2.808c0.9,0,1.702-0.43,2.217-1.09l4.55,2.637c-0.138,0.332-0.214,0.693-0.214,1.074c0,1.549,1.26,2.809,2.808,2.809c1.549,0,2.809-1.26,2.809-2.809S16.229,12.621,14.68,12.621M14.68,2.512c1.136,0,2.06,0.923,2.06,2.06S15.815,6.63,14.68,6.63s-2.059-0.923-2.059-2.059S13.544,2.512,14.68,2.512M5.319,12.061c-1.136,0-2.06-0.924-2.06-2.06s0.923-2.059,2.06-2.059c1.135,0,2.06,0.923,2.06,2.059S6.454,12.061,5.319,12.061M14.68,17.488c-1.136,0-2.059-0.922-2.059-2.059s0.923-2.061,2.059-2.061s2.06,0.924,2.06,2.061S15.815,17.488,14.68,17.488"></path>
                </svg>
            </button>

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
                    <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[54rem] max-w-screen-2xl md:max-h-screen-2xl">
                        <h1 className="text-md font-bold mb-2 md:text-3xl md:mb-6">
                            Buat Laporan
                        </h1>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            className="w-full text-black border rounded-[5px] text-[8px] max-h-[100px] md:h-[16rem] md:max-h-[22rem] border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:text-[15px] md:rounded-[10px] mb-1 md:mb-2 p-2 md:p-4"
                            placeholder="Isi laporan..."
                        />
                        <div className="flex flex-row justify-end font-bold text-white text-center">
                            <label
                                htmlFor="my-modal-4"
                                className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                            >
                                Batal
                            </label>
                            <label
                                className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                onClick={() => {
                                    submitReport();
                                }}
                            >
                                Kirim
                            </label>
                        </div>
                    </label>
                </label>
            </div>
        </div>
    );
};

export default Action;
