import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfileContent from './profileContent';

const ProfileDrawer = (props: any) => {
    const [currentDrawerStatus, setDrawerStatus] = useState(false);

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
                    readOnly
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
                                to="/profile"
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
                                                d="M10 12.5C11.7259 12.5 13.125 11.1009 13.125 9.375C13.125 7.64911 11.7259 6.25 10 6.25C8.27411 6.25 6.875 7.64911 6.875 9.375C6.875 11.1009 8.27411 12.5 10 12.5Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M16.25 3.125H3.75C3.40482 3.125 3.125 3.40482 3.125 3.75V16.25C3.125 16.5952 3.40482 16.875 3.75 16.875H16.25C16.5952 16.875 16.875 16.5952 16.875 16.25V3.75C16.875 3.40482 16.5952 3.125 16.25 3.125Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M4.5144 16.875C4.79796 15.6322 5.49513 14.5225 6.49172 13.7277C7.48832 12.9329 8.72528 12.5 10 12.5C11.2748 12.5 12.5117 12.9329 13.5083 13.7277C14.5049 14.5225 15.2021 15.6322 15.4856 16.875"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>{' '}
                                    <span>Profile</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile/my-campaign"
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
                                    <span>Campaign Anda</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile/transaction-history"
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
                                                d="M10 6.25V10"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M13.2476 11.875L10 10"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M5.61194 7.79053H2.48694V4.66553"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M5.13865 14.8614C6.10014 15.8228 7.32514 16.4776 8.65876 16.7429C9.99238 17.0082 11.3747 16.872 12.631 16.3517C13.8872 15.8313 14.9609 14.9501 15.7164 13.8195C16.4718 12.689 16.875 11.3597 16.875 10C16.875 8.64026 16.4718 7.31105 15.7164 6.18046C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52238 6.10014 4.17716 5.13865 5.13864L2.487 7.79029"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span>Riwayat Transaksi</span>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile/settings"
                                onClick={handleClick}
                                className="active:bg-[#007BC7] stroke-black active:stroke-white"
                            >
                                <div className="text-lg font-bold flex items-center gap-2">
                                    <span className="pr-1">
                                        <svg
                                            className=""
                                            width="24"
                                            height="24"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M10 13.75C12.0711 13.75 13.75 12.0711 13.75 10C13.75 7.92893 12.0711 6.25 10 6.25C7.92893 6.25 6.25 7.92893 6.25 10C6.25 12.0711 7.92893 13.75 10 13.75Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M9.59932 3.44944L8.12514 2.34413C8.04605 2.28463 7.95394 2.24478 7.85642 2.22786C7.7589 2.21094 7.65876 2.21744 7.56424 2.24682C7.10767 2.38979 6.66472 2.57306 6.2406 2.79446C6.15281 2.84051 6.07722 2.90678 6.02008 2.9878C5.96295 3.06882 5.9259 3.16227 5.91199 3.26043L5.65139 5.08472C5.55206 5.17278 5.45481 5.26436 5.35964 5.35947C5.2645 5.45461 5.1729 5.55188 5.08482 5.6513L5.08478 5.65133L3.26082 5.91217C3.16281 5.92602 3.06951 5.96297 2.98858 6.01996C2.90766 6.07695 2.84144 6.15236 2.79539 6.23997C2.57364 6.66391 2.39002 7.10672 2.24668 7.56317C2.21716 7.65781 2.21057 7.75812 2.22746 7.85581C2.24435 7.9535 2.28423 8.04578 2.34381 8.12502L3.4495 9.59926C3.44152 9.73176 3.43751 9.86529 3.43747 9.99983C3.43747 10.1344 3.44148 10.2679 3.4495 10.4005L3.4495 10.4006L2.34419 11.8747C2.28469 11.9538 2.24484 12.0459 2.22792 12.1435C2.211 12.241 2.2175 12.3411 2.24688 12.4356C2.38985 12.8922 2.57312 13.3352 2.79452 13.7593C2.84057 13.8471 2.90685 13.9227 2.98787 13.9798C3.06889 14.0369 3.16233 14.074 3.26049 14.0879L5.08478 14.3485C5.17283 14.4478 5.26442 14.5451 5.35953 14.6402C5.45466 14.7354 5.55194 14.827 5.65136 14.9151L5.65139 14.9151L5.91222 16.7391C5.92608 16.8371 5.96303 16.9304 6.02002 17.0113C6.07701 17.0922 6.15242 17.1584 6.24003 17.2045C6.66397 17.4262 7.10678 17.6099 7.56323 17.7532C7.65787 17.7827 7.75818 17.7893 7.85587 17.7724C7.95356 17.7555 8.04583 17.7157 8.12508 17.6561L9.59932 16.5504C9.73182 16.5584 9.86535 16.5624 9.99989 16.5624C10.1344 16.5624 10.268 16.5584 10.4006 16.5504L10.4006 16.5504L11.8748 17.6557C11.9539 17.7152 12.046 17.755 12.1435 17.772C12.241 17.7889 12.3412 17.7824 12.4357 17.753C12.8923 17.61 13.3352 17.4268 13.7593 17.2054C13.8471 17.1593 13.9227 17.093 13.9799 17.012C14.037 16.931 14.074 16.8376 14.088 16.7394L14.3486 14.9151C14.4479 14.8271 14.5451 14.7355 14.6403 14.6404C14.7354 14.5452 14.827 14.4479 14.9151 14.3485L14.9152 14.3485L16.7391 14.0877C16.8371 14.0738 16.9304 14.0369 17.0114 13.9799C17.0923 13.9229 17.1585 13.8475 17.2046 13.7599C17.4263 13.3359 17.6099 12.8931 17.7533 12.4367C17.7828 12.342 17.7894 12.2417 17.7725 12.144C17.7556 12.0463 17.7157 11.9541 17.6561 11.8748L16.5504 10.4006C16.5584 10.2681 16.5624 10.1345 16.5625 9.99999C16.5625 9.86545 16.5585 9.73189 16.5504 9.59931L16.5504 9.59926L17.6558 8.12508C17.7153 8.04599 17.7551 7.95388 17.772 7.85636C17.7889 7.75884 17.7824 7.6587 17.7531 7.56418C17.6101 7.10761 17.4268 6.66466 17.2054 6.24054C17.1594 6.15275 17.0931 6.07716 17.0121 6.02002C16.9311 5.96289 16.8376 5.92584 16.7395 5.91193L14.9152 5.65133C14.8271 5.552 14.7355 5.45474 14.6404 5.35958C14.5453 5.26444 14.448 5.17284 14.3486 5.08476L14.3486 5.08472L14.0877 3.26075C14.0739 3.16275 14.0369 3.06944 13.9799 2.98852C13.9229 2.9076 13.8475 2.84138 13.7599 2.79533C13.336 2.57358 12.8932 2.38996 12.4367 2.24662C12.3421 2.2171 12.2418 2.21051 12.1441 2.2274C12.0464 2.24429 11.9541 2.28417 11.8749 2.34374L10.4006 3.44944C10.2681 3.44146 10.1346 3.43745 10.0001 3.43741C9.86551 3.43741 9.73195 3.44142 9.59937 3.44944L9.59932 3.44944Z"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>
                                    <span>Pengaturan Akun</span>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileDrawer;
