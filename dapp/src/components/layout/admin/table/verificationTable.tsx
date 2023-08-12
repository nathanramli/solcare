import JSZip from 'jszip';
import { useState } from 'react';
import { API_BASE_URL, ITEM_PER_PAGE } from '../../../../utils';
import VerificationActions from './action/verificationActions';
import saveAs from 'file-saver';

const VerificationTable = (props: any) => {
    let userVerificationData = props.userVerificationData;

    const refetch = props.refetch;

    const [page, setPage] = useState('1');

    const saveZip = (data: any) => {
        const zip = new JSZip();

        const URLs = [
            API_BASE_URL + '/resources/' + data.idCardPicture,
            API_BASE_URL + '/resources/' + data.facePicture,
            API_BASE_URL + '/resources/' + data.selfieWithIdCardPicture,
        ];
        URLs.forEach((url) => {
            const blobPromise = fetch(url).then((r) => {
                if (r.status === 200) return r.blob();
                return Promise.reject(new Error(r.statusText));
            });
            const name = url.substring(url.lastIndexOf('/') + 1);
            zip.file(name, blobPromise);
        });

        zip.generateAsync({ type: 'blob' }).then((blob) =>
            saveAs(blob, data.nik)
        );
    };

    const generateTable = (page: number) => {
        let rows = [];

        for (
            let i = ITEM_PER_PAGE * page - ITEM_PER_PAGE;
            i < Math.min(ITEM_PER_PAGE * page, userVerificationData.length);
            i++
        ) {
            rows.push(
                <tr
                    className="bg-white hover:bg-[rgba(0,123,199,0.25)]"
                    key={i}
                >
                    <th
                        scope="row"
                        className="text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                        {i + 1}
                    </th>
                    <td className="py-4 px-6">
                        {userVerificationData[i].name === ''
                            ? 'User'
                            : userVerificationData[i].name}
                    </td>
                    <td id="address-tag" className="py-4 px-6">
                        {userVerificationData[i].usersWalletAddress}
                    </td>
                    <td className="py-4 px-6 text-center">
                        <button
                            onClick={() => saveZip(userVerificationData[i])}
                            className="hover:stroke-[#007BC7] stroke-black tooltip"
                            data-tip="Unduh"
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 32 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10.75 13.7515L16 19.0001L21.25 13.7515"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 5V18.9963"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M27 19V26C27 26.2652 26.8946 26.5196 26.7071 26.7071C26.5196 26.8946 26.2652 27 26 27H6C5.73478 27 5.48043 26.8946 5.29289 26.7071C5.10536 26.5196 5 26.2652 5 26V19"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </td>
                    <td className="py-4 px-6">
                        <VerificationActions
                            userData={userVerificationData[i]}
                            refetch={refetch}
                        />
                    </td>
                </tr>
            );
        }
        return rows;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (parseInt(event.target.value) < 1 || event.target.value == '') {
            setPage('1');
        } else {
            setPage(event.target.value);
        }
    };

    const decrease = () => {
        var value = parseInt(page);
        if (value - 1 < 1) {
            setPage('1');
        } else {
            setPage((value - 1).toString());
        }
    };

    const increase = () => {
        var value = parseInt(page);
        const maxPage = Math.ceil(userVerificationData.length / ITEM_PER_PAGE);
        if (value + 1 > maxPage) {
            setPage(maxPage.toString());
        } else {
            setPage((value + 1).toString());
        }
    };

    if (userVerificationData === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="mt-2 md:mt-6">
            {userVerificationData.length === 0 ? (
                <h2 className="text-center text-xl font-bold lg:mt-52">
                    Tidak ada permintaan verifikasi saat ini
                </h2>
            ) : (
                <>
                    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                        <table className="w-full text-xs lg:text-lg text-left text-gray-500">
                            <thead className="text-xs lg:text-lg text-center bg-[#007BC7] text-white">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-3 px-6 border-r"
                                    >
                                        No.
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-6 border-r"
                                    >
                                        Nama
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-6 border-r"
                                    >
                                        Wallet Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-6 border-r"
                                    >
                                        Berkas
                                    </th>
                                    <th scope="col" className="py-3 px-6">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>{generateTable(parseInt(page))}</tbody>
                        </table>
                    </div>
                    <nav
                        className="flex flex-col-reverse items-center py-4 md:py-8 md:flex-row md:justify-between"
                        aria-label="Table navigation"
                    >
                        <span className="text-sm font-normal text-gray-500 pt-2 md:text-xl md:pt-4">
                            Showing{' '}
                            <span className="font-bold text-gray-900">
                                {parseInt(page) * 10 - 10 + 1}-
                                {Math.min(
                                    parseInt(page) * 10,
                                    userVerificationData.length
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-gray-900">
                                {userVerificationData.length}
                            </span>
                        </span>
                        <ul className="inline-flex items-center -space-x-px">
                            <li>
                                <button
                                    onClick={decrease}
                                    className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 md:py-4 md:px-6"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="w-5 h-5 md:w-8 md:h-8"
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
                                    className="text-center py-2 min-w-[75px] max-w-[100px] px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:px-6 md:py-4 md:text-2xl"
                                    value={page}
                                />
                            </li>
                            <li>
                                <button
                                    onClick={increase}
                                    className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 md:py-4 md:px-6"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="w-5 h-5 md:w-8 md:h-8"
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
                </>
            )}
        </div>
    );
};

export default VerificationTable;
