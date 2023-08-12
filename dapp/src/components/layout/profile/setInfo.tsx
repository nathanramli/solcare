import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../utils';

const SetInfo = (props: any) => {
    const { publicKey } = useWallet();

    const [input, setInput] = useState<{ [string: string]: any }>({
        email: props.email,
        firstName: props.firstName,
        lastName: props.lastName,
        gender: props.gender,
    });

    const handleInputChange = (e: any) => {
        const target = e.target;
        const name = target.name;

        setInput((state) => {
            const newState = {
                ...state,
            };
            newState[name] = name;
            if (newState[name] === 'gender') {
                newState[name] = target.value === 'Wanita' ? false : true;
            } else {
                newState[name] = target.value;
            }

            return newState;
        });
    };

    const submitInfo = async () => {
        let token = localStorage.getItem('token');

        const headers = {
            Authorization: `Bearer ${token}`,
        };
        if (
            input.email === '' ||
            input.firstName === '' ||
            input.lastName === ''
        ) {
            return toast.error(
                'Mohon isi seluruh data pada form terlebih dahulu'
            );
        }
        try {
            const content = {
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName,
                gender: input.gender,
            };

            const resp = await axios.put(
                API_BASE_URL + '/v1/users/info/' + publicKey?.toBase58(),
                content,
                { headers }
            );
            if (resp.data.status !== 200) {
                toast.error(
                    `Data Gagal Disimpan! Pastikan data baru tidak sama dengan data sebelumnya`
                );
                return;
            }
            props.refetch();

            toast.success('Data Berhasil Tersimpan');
        } catch (e) {
            console.log(e);
            toast.error(
                `Data Gagal Disimpan! Pastikan data sudah ditulis dengan format yang benar`
            );
            return;
        }
    };

    return (
        <div className="flex flex-col">
            <p className="font-bold text-xs mt-8 md:text-lg">Data Diri</p>
            <div className="mt-2">
                <p className="text-xs md:text-lg">Nama Depan</p>
                <input
                    className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                    focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                    type="text"
                    name="firstName"
                    onChange={handleInputChange}
                    value={input.firstName}
                />
            </div>
            <div className="mt-2">
                <p className="text-xs md:text-lg">Nama Belakang</p>
                <input
                    className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                    focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                    type="text"
                    name="lastName"
                    onChange={handleInputChange}
                    value={input.lastName}
                />
            </div>
            <div className="mt-2">
                <p className="text-xs md:text-lg">E-mail</p>
                <input
                    className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 
                    focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                    type="text"
                    name="email"
                    onChange={handleInputChange}
                    value={input.email}
                />
            </div>
            <div className="mt-2">
                <p className="text-xs md:text-lg">Gender</p>
                <div className="flex">
                    <div className="flex items-center mr-4">
                        <input
                            id="m-radio"
                            type="radio"
                            value="Pria"
                            name="gender"
                            checked={input.gender == true}
                            onChange={handleInputChange}
                            className="w-2 h-2 md:w-4 md:h-4 text-[#007BC7] bg-gray-100 border-gray-300"
                        />
                        <label
                            htmlFor="m-radio"
                            className="ml-2 text-xs md:text-lg"
                        >
                            Pria
                        </label>
                    </div>
                    <div className="flex items-center mr-4">
                        <input
                            id="f-radio"
                            type="radio"
                            value="Wanita"
                            name="gender"
                            checked={input.gender == false}
                            onChange={handleInputChange}
                            className="w-2 h-2 md:w-4 md:h-4 text-[#007BC7] bg-gray-100 border-gray-300"
                        />
                        <label
                            htmlFor="f-radio"
                            className="ml-2 text-xs md:text-lg"
                        >
                            Wanita
                        </label>
                    </div>
                </div>
            </div>
            <button
                className="mt-4 self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white 
                font-bold rounded-[5px] md:text-xl md:p-4 md:rounded-[10px]"
                onClick={submitInfo}
            >
                Simpan Data
            </button>
        </div>
    );
};

export default SetInfo;
