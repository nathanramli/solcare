import { useState } from 'react';
import UserActions from './action/userActions';
import { ITEM_PER_PAGE } from '../../../../utils';
const UserTable = (props: any) => {
    let userData = props.userData;

    const [page, setPage] = useState('1');

    const generateTable = (page: number) => {
        let rows = [];
        for (
            let i = ITEM_PER_PAGE * page - ITEM_PER_PAGE;
            i < Math.min(ITEM_PER_PAGE * page, userData.length);
            i++
        ) {
            rows.push(
                <tr
                    className={
                        userData[i].isWarned
                            ? 'bg-white hover:bg-red-200 bg-red-100'
                            : 'bg-white hover:bg-[rgba(0,123,199,0.25)]'
                    }
                    key={i}
                >
                    <th
                        scope="row"
                        className="text-center py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                    >
                        {i + 1}
                    </th>
                    <td className="py-4 px-6">
                        {userData[i].firstName === ''
                            ? 'User'
                            : userData[i].firstName +
                              ' ' +
                              userData[i].lastName}
                    </td>
                    <td id="address-tag" className="py-4 px-6">
                        {userData[i].address}
                    </td>
                    <td className="py-4 px-6 text-center">
                        <UserActions data={userData[i]} id={i + 1} />
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
        const maxPage = Math.ceil(userData.length / ITEM_PER_PAGE);
        if (value + 1 > maxPage) {
            setPage(maxPage.toString());
        } else {
            setPage((value + 1).toString());
        }
    };

    if (userData === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="mt-2 md:mt-6">
            {userData.length === 0 ? (
                <h2 className="text-center text-xl font-bold lg:mt-52">
                    Tidak ada user terdaftar saat ini
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
                                {parseInt(page) * ITEM_PER_PAGE -
                                    ITEM_PER_PAGE +
                                    1}
                                -
                                {Math.min(
                                    parseInt(page) * ITEM_PER_PAGE,
                                    userData.length
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-bold text-gray-900">
                                {userData.length}
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
                                    className="text-center py-2 min-w-[75px] max-w-[100px] px-3 leading-tight text-gray-500 
                                    bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:px-6 md:py-4 md:text-2xl"
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

export default UserTable;
