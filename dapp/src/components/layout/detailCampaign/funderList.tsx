import ProfilePlaceholder from '../../../image/profilePic.png';
import { SetStateAction, useEffect, useState } from 'react';
import { useSmartContract } from '../../../context/connection';
import { ACCOUNT_DISCRIMINATOR_SIZE, BN, utils } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { API_BASE_URL, USDC_DECIMALS } from '../../../utils';

export interface FunderInfo {
    address: string;
    owner: string;
    name: string;
    amount: number;
    date: number;
    profilePicture: string;
}

const FunderList = ({ funders }: { funders: FunderInfo[] }) => {
    const [page, setPage] = useState('1');

    const ITEM_PER_PAGE = 5;

    const generateTable = (page: number) => {
        let rows = [];
        // for (var i = 5 * page - 5; i < Math.min(5 * page, props.donor.length); i++) {
        for (
            let i = ITEM_PER_PAGE * page - ITEM_PER_PAGE;
            i < Math.min(ITEM_PER_PAGE * page, funders.length);
            i++
        ) {
            rows.push(
                <tr className="bg-white border-b" key={i}>
                    <th
                        scope="row"
                        className="flex items-center py-1 text-gray-900 md:py-2"
                    >
                        <img
                            className="w-8 h-8 object-cover rounded-full md:w-16 md:h-16"
                            src={
                                funders[i].profilePicture === '' ||
                                funders[i].profilePicture === undefined
                                    ? ProfilePlaceholder
                                    : `${API_BASE_URL}/resources/${funders[i].profilePicture}`
                            }
                            alt="placeholder"
                        />
                        <div className="pl-3 md:pl-6">
                            <p className="text-xs font-bold line-clamp-1 md:text-xl">
                                {funders[i].name === '-'
                                    ? 'Funder'
                                    : funders[i].name}
                            </p>
                            <p
                                id="address-tag"
                                className="text-[8px] font-normal text-gray-500 md:text-[15px] leading-normal"
                            >
                                {funders[i].owner}
                            </p>
                        </div>
                    </th>
                    <td className="py-1 text-right text-lg font-bold md:py-2 md:text-4xl">
                        {funders[i].amount}
                        <span className="text-[9px] md:text-lg">USDC</span>
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
        const value = parseInt(page);
        const maxPage = Math.ceil(funders.length / ITEM_PER_PAGE);
        if (value + 1 > maxPage) {
            setPage(maxPage.toString());
        } else {
            setPage((value + 1).toString());
        }
    };

    return (
        <div className="mt-2 md:mt-6">
            <h2 className="text-xs font-bold mb-1 md:text-xl md:mb-2">
                Daftar Funders
            </h2>
            {funders.length === 0 ? (
                <h2>Tidak ada donatur saat ini.</h2>
            ) : (
                <>
                    <table className="w-full text-sm text-left">
                        <tbody>{generateTable(parseInt(page))}</tbody>
                    </table>
                    <nav
                        className="flex flex-col-reverse items-center py-4 md:py-8 md:flex-row md:justify-between"
                        aria-label="Table navigation"
                    >
                        <span className="text-sm font-normal text-gray-500 pt-2 md:text-xl md:pt-4">
                            Showing{' '}
                            <span className="font-bold text-gray-900">
                                {parseInt(page) * 5 - 5 + 1}-
                                {Math.min(parseInt(page) * 5, funders.length)}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-gray-900">
                                {funders.length}
                            </span>
                        </span>
                        <ul className="inline-flex items-center -space-x-px">
                            <li>
                                <button
                                    onClick={decrease}
                                    className="block py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg 
                                    border border-gray-300 hover:bg-gray-100 hover:text-gray-700 md:py-4 md:px-6"
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
                                    className="text-center py-2 min-w-[75px] max-w-[100px] px-3 leading-tight text-gray-500 bg-white border border-gray-300 
                                    hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:px-6 md:py-4 md:text-2xl"
                                    value={page}
                                />
                            </li>
                            <li>
                                <button
                                    onClick={increase}
                                    className="block py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 
                                    hover:bg-gray-100 hover:text-gray-700 md:py-4 md:px-6"
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

export default FunderList;
