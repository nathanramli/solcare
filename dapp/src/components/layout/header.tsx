import {
    useCallback,
    useEffect,
    useState,
    useRef,
    useMemo,
    useContext,
} from 'react';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import Logo from '../../image/Logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { API_BASE_URL, LOGIN_MESSAGE, now } from '../../utils';
import base58 from 'bs58';
import { useSmartContract } from '../../context/connection';
import { decodeJwt } from 'jose';
import { AdminContext } from '../../utils/state';
import { ActionType } from '../../utils/reducer';

const Header = () => {
    const { state, dispatch } = useContext(AdminContext);
    const { isAdmin } = state;
    const { connected, signMessage, publicKey, disconnect, disconnecting } =
        useWallet();

    const navigate = useNavigate();

    const signIn = async () => {
        if (signMessage && publicKey) {
            const tokenString = localStorage.getItem('token');
            if (
                !tokenString ||
                (decodeJwt(tokenString).exp || 0) < now() ||
                decodeJwt(tokenString)['address'] !== publicKey.toBase58()
            ) {
                try {
                    navigate('/');
                    const message = new TextEncoder().encode(LOGIN_MESSAGE);
                    const signature = await signMessage(message);

                    const resp = await axios.post(
                        API_BASE_URL + '/v1/users/login',
                        {
                            address: publicKey.toBase58(),
                            signedMessage: base58.encode(signature),
                        }
                    );

                    localStorage.setItem('token', resp.data.data.token);

                    const tokenTemp = localStorage.getItem('token');

                    if (tokenTemp) {
                        const tokenDetail = decodeJwt(tokenTemp);
                        if (typeof tokenDetail.isAdmin == 'boolean') {
                            if (tokenDetail.isAdmin) {
                                dispatch({ type: ActionType.IsAdmin });
                                navigate('/admin');
                            } else {
                                dispatch({ type: ActionType.NotAdmin });
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);

                    await disconnect();
                }
            }
        }
    };

    const fetchToken = () => {
        const tokenString = localStorage.getItem('token');
        if (tokenString) {
            const tokenDetail = decodeJwt(tokenString);
            if (typeof tokenDetail.isAdmin == 'boolean') {
                tokenDetail.isAdmin
                    ? dispatch!({ type: ActionType.IsAdmin })
                    : dispatch!({ type: ActionType.NotAdmin });
            }
        }
    };

    useEffect(() => {
        if (connected) {
            signIn();
        }
    }, [connected, publicKey]);

    useEffect(() => {
        if (disconnecting) {
            dispatch({ type: ActionType.NotAdmin });
            localStorage.removeItem('token');

            navigate('/');
        }
    }, [disconnecting, publicKey]);

    useEffect(() => {
        fetchToken();
    }, []);

    return (
        <div className="navbar sticky top-0 z-50 bg-white py-4 lg:px-12">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </label>

                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        {!isAdmin ? (
                            <>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/explore">Cari Campaign</Link>
                                </li>
                            </>
                        ) : (
                            <></>
                        )}

                        {connected && !isAdmin ? (
                            <li>
                                <Link to="/profile/my-campaign/create">
                                    Buat Campaign
                                </Link>
                            </li>
                        ) : (
                            <></>
                        )}
                        {connected && !isAdmin ? (
                            <li>
                                <Link to="/profile">Profil</Link>
                            </li>
                        ) : (
                            <></>
                        )}
                        {connected && isAdmin ? (
                            <li>
                                <Link to="/admin">Dashboard</Link>
                            </li>
                        ) : (
                            <></>
                        )}
                    </ul>
                </div>
                <Link to="/">
                    <div className="pt-3 lg:pt-1 btn btn-ghost hover:bg-white hover:brightness-125 hidden sm:block">
                        <img
                            className="sm:w-[62.5px] sm:h-[20px] lg:w-[125px] lg:h-[40px]"
                            src={Logo}
                        />
                    </div>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal p-0">
                    {!isAdmin ? (
                        <>
                            <li>
                                <Link
                                    to="/"
                                    className="rounded-[5px] lg:rounded-[10px] active:bg-[#007BC7] active:text-white"
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="ml-5">
                                <Link
                                    to="/explore"
                                    className="rounded-[5px] lg:rounded-[10px] active:bg-[#007BC7] active:text-white"
                                >
                                    Cari Campaign
                                </Link>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}

                    {connected && !isAdmin ? (
                        <li className="ml-5">
                            <Link
                                to="/profile/my-campaign/create"
                                className="rounded-[5px] lg:rounded-[10px] active:bg-[#007BC7] active:text-white"
                            >
                                Buat Campaign
                            </Link>
                        </li>
                    ) : (
                        <></>
                    )}
                    {connected && !isAdmin ? (
                        <li className="ml-5">
                            <Link
                                to="/profile"
                                className="rounded-[5px] lg:rounded-[10px] active:bg-[#007BC7] active:text-white"
                            >
                                Profil
                            </Link>
                        </li>
                    ) : (
                        <></>
                    )}
                    {connected && isAdmin ? (
                        <li className="ml-5">
                            <Link
                                to="/admin"
                                className="rounded-[5px] lg:rounded-[10px] active:bg-[#007BC7] active:text-white"
                            >
                                Dashboard
                            </Link>
                        </li>
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
            <div className="navbar-end">
                <WalletMultiButton
                    style={{ backgroundColor: '#007BC7' }}
                    className="btn !text-xs rounded-[5px] lg:!rounded-[10px] lg:!text-lg capitalize !border-none !bg-[#007BC7]"
                />
            </div>
        </div>
    );
};

export default Header;
