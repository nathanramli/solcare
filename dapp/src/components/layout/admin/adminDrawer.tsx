import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminContent from './adminContent';

const AdminDrawer = (props: any) => {
    const [currentDrawerStatus, setDrawerStatus] = useState(true);

    const handleClick = () => {
        if (window.matchMedia('(min-width: 1024px)').matches) {
            setDrawerStatus(false);
        } else {
            currentDrawerStatus == false
                ? setDrawerStatus(true)
                : setDrawerStatus(false);
        }
    };

    return (
        <div className="lg:pt-[50px]">
            <div className="drawer drawer-mobile h-full">
                <input
                    type="checkbox"
                    className="drawer-toggle"
                    checked={currentDrawerStatus}
                />
                <div className="drawer-content flex flex-col items-start justify-start max-[1023px]:pt-[25px] px-10 lg:pl-6 lg:ml-[20rem] lg:!z-20">
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row items-center mb-2">
                            <button
                                onClick={handleClick}
                                className="drawer-button lg:hidden p-0 m-2 ml-0 bg-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="text-[#007BC7] inline-block w-6 h-6 stroke-current"
                                >
                                    <path
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </button>
                            <h1 className="font-bold text-2xl lg:hidden text-[#007BC7]">
                                {props.page}
                            </h1>
                        </div>
                        {props.children}
                    </div>
                </div>

                <div className="drawer-side lg:fixed lg:z-10">
                    <label className="drawer-overlay"></label>
                    <ul className="menu p-4 w-64 sm:w-80 bg-base-100 text-base-content">
                        <li className="font-bold max-[1023px]:hidden text-3xl text-[#007BC7] mb-5">
                            {props.page}
                        </li>
                        <li
                            onClick={handleClick}
                            className="w-12 h-12 lg:hidden"
                        >
                            <a className="active:bg-[#007BC7] active:stroke-white stroke-black">
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
                            </a>
                        </li>

                        <li>
                            <Link
                                to="/admin"
                                onClick={handleClick}
                                className="active:bg-[#007BC7] stroke-black active:stroke-white"
                            >
                                <div className="text-lg font-bold flex items-center gap-2">
                                    <span className="pr-1">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M3.4375 16.25V10.625H7.8125"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M17.8125 16.25H2.1875"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M7.8125 16.25V6.875H12.1875"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16.5625 3.125H12.1875V16.25H16.5625V3.125Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span>Dashboard</span>
                                </div>
                            </Link>
                        </li>

                        <div className="collapse collapse-arrow">
                            <input type="checkbox" />
                            <div className="collapse-title">
                                <a className="active:bg-[#007BC7] !flex !flex-row items-center text-lg font-bold stroke-black active:stroke-white gap-2">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z"
                                            stroke="black"
                                            strokeWidth="2"
                                            strokeMiterlimit="10"
                                        />
                                        <path
                                            d="M2.4209 16.8743C3.1893 15.5442 4.29419 14.4398 5.62456 13.672C6.95493 12.9042 8.46393 12.5 9.99997 12.5C11.536 12.5 13.045 12.9043 14.3754 13.6721C15.7057 14.44 16.8106 15.5444 17.579 16.8744"
                                            stroke="black"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <span className="pl-1">User</span>
                                </a>
                            </div>
                            <div className="collapse-content">
                                <li>
                                    <Link
                                        to="/admin/manage-KYC"
                                        onClick={handleClick}
                                        className="active:bg-[#007BC7] !flex !flex-row items-center text-lg stroke-black active:stroke-white"
                                    >
                                        Verifikasi User
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/admin/manage-user"
                                        onClick={handleClick}
                                        className="active:bg-[#007BC7] !flex !flex-row items-center text-lg stroke-black active:stroke-white"
                                    >
                                        Manajemen User
                                    </Link>
                                </li>
                            </div>
                        </div>

                        <li>
                            <Link
                                to="/admin/manage-campaign"
                                onClick={handleClick}
                                className="active:bg-[#007BC7] stroke-black active:stroke-white"
                            >
                                <div className="text-lg font-bold flex items-center gap-2">
                                    <span className="pr-1">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M7.5 11.875H12.5"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M7.5 9.375H12.5"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12.5002 3.125H15.625C15.7908 3.125 15.9497 3.19085 16.0669 3.30806C16.1842 3.42527 16.25 3.58424 16.25 3.75V16.875C16.25 17.0408 16.1842 17.1997 16.0669 17.3169C15.9497 17.4342 15.7908 17.5 15.625 17.5H4.375C4.20924 17.5 4.05027 17.4342 3.93306 17.3169C3.81585 17.1997 3.75 17.0408 3.75 16.875V3.75C3.75 3.58424 3.81585 3.42527 3.93306 3.30806C4.05027 3.19085 4.20924 3.125 4.375 3.125H7.49983"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M6.875 5.625V5C6.875 4.1712 7.20424 3.37634 7.79029 2.79029C8.37634 2.20424 9.1712 1.875 10 1.875C10.8288 1.875 11.6237 2.20424 12.2097 2.79029C12.7958 3.37634 13.125 4.1712 13.125 5V5.625H6.875Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span>Campaign</span>
                                </div>
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/admin/manage-pengaduan"
                                onClick={handleClick}
                                className="active:bg-[#007BC7] stroke-black active:stroke-white"
                            >
                                <div className="text-lg font-bold flex items-center gap-2">
                                    <span className="pr-1">
                                        <svg
                                            width="24"
                                            height="24"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                                                stroke="black"
                                                strokeWidth="2"
                                                strokeMiterlimit="10"
                                            />
                                            <path
                                                d="M10 6.25V10.625"
                                                stroke="black"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M10 14.375C10.5178 14.375 10.9375 13.9553 10.9375 13.4375C10.9375 12.9197 10.5178 12.5 10 12.5C9.48223 12.5 9.0625 12.9197 9.0625 13.4375C9.0625 13.9553 9.48223 14.375 10 14.375Z"
                                                fill="black"
                                            />
                                        </svg>
                                    </span>
                                    <span>Pengaduan</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminDrawer;
