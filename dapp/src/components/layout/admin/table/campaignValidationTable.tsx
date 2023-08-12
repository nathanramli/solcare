import { useState } from 'react';
import ValidationActions from './action/validationActions';
import { ITEM_PER_PAGE } from '../../../../utils';
import { API_BASE_URL } from '../../../../utils';

const CampaignValidationTable = (props: any) => {
    const campaignData = props.campaignData;
    const [currentValue, setValue] = useState('1');

    const generateTable = (page: number) => {
        let rows = [];
        for (
            let i = ITEM_PER_PAGE * page - ITEM_PER_PAGE;
            i < Math.min(ITEM_PER_PAGE * page, campaignData.length);
            i++
        ) {
            rows.push(
                <tr
                    key={i}
                    className="bg-white hover:bg-[rgba(0,123,199,0.25)]"
                >
                    <th
                        scope="row"
                        className="text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                        {i + 1}
                    </th>
                    <td id="address-tag" className="py-4 px-6">
                        {campaignData[i].address}
                    </td>
                    <td id="address-tag" className="py-4 px-6">
                        {campaignData[i].ownerAddress}
                    </td>
                    <td className="py-4 px-6 text-center">
                        <button
                            className="hover:stroke-[#007BC7] stroke-black tooltip"
                            data-tip="Lihat"
                            onClick={(e) => {
                                window.open(
                                    API_BASE_URL +
                                        '/' +
                                        campaignData[i].evidence,
                                    '_blank'
                                );
                            }}
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
                        </button>
                    </td>
                    <td className="py-4 px-6">
                        <ValidationActions
                            campaignData={campaignData[i]}
                            refetch={props.refetch}
                        />
                    </td>
                </tr>
            );
        }
        return rows;
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
        const maxPage = Math.ceil(campaignData.length / ITEM_PER_PAGE);
        if (value + 1 > maxPage) {
            setValue(maxPage.toString());
        } else {
            setValue((value + 1).toString());
        }
    };

    if (campaignData === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="mt-2 md:mt-6">
            {campaignData.length === 0 ? (
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
                                        Campaign Address
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-6 border-r"
                                    >
                                        Wallet Address Fundraiser
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
                            <tbody>
                                {generateTable(parseInt(currentValue))}
                            </tbody>
                        </table>
                    </div>
                    <nav
                        className="flex flex-col-reverse items-center py-4 md:py-8 md:flex-row md:justify-between"
                        aria-label="Table navigation"
                    >
                        <span className="text-sm font-normal text-gray-500 pt-2 md:text-xl md:pt-4">
                            Showing{' '}
                            <span className="font-bold text-gray-900">
                                {parseInt(currentValue) * ITEM_PER_PAGE -
                                    ITEM_PER_PAGE +
                                    1}
                                -{parseInt(currentValue) * campaignData.length}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-gray-900">
                                {campaignData.length}
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
                                        />
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
                                    value={currentValue}
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

export default CampaignValidationTable;
