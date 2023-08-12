import React, { useEffect, useState } from 'react';
import HistoryCard from './card/historyCard';
import axios from 'axios';
import { API_BASE_URL } from '../../../utils';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

interface HistoryProps {
    signature: string;
    userAddress: string;
    campaignAddress: string;
    createdAt: number;
    amount: number;
    type: number;
}

const HistoryTransaction = () => {
    const { publicKey } = useWallet();

    let today = new Date();
    let tomorrow = new Date();
    today.setDate(tomorrow.getDate());
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [currentDateFrom, setCurrentDateFrom] = useState(
        today.toISOString().substring(0, 10)
    );
    const [currentDateTo, setCurrentDateTo] = useState(
        tomorrow.toISOString().substring(0, 10)
    );

    const [dateFrom, setDateFrom] = useState(currentDateFrom);

    const [dateTo, setDateTo] = useState(currentDateTo);

    const handleDateFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentDateFrom(event.target.value);
    };

    const handleDateTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentDateTo(event.target.value);
    };

    const [historyData, setHistoryData] = useState<HistoryProps[]>([]);

    const fetchHistory = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/transaction/${publicKey}`
        );

        if (resp.data.status === 200) {
            setHistoryData(resp.data.data);
        }
    };

    const generateCard = () => {
        let components = [];
        let txData = [];
        txData.push(...historyData);
        for (
            let d = new Date(dateFrom);
            d <= new Date(dateTo);
            d.setDate(d.getDate() + 1)
        ) {
            let datas = [];
            let tempTxData = [];
            tempTxData.push(...historyData);
            for (let i = 0; i < tempTxData.length; i++) {
                const dataDate = new Date(tempTxData[i].createdAt * 1000);
                if (
                    dataDate.getDate() == d.getDate() &&
                    dataDate.getMonth() == d.getMonth() &&
                    dataDate.getFullYear() == d.getFullYear()
                ) {
                    datas.push(tempTxData[i]);
                    const delIndex = txData.indexOf(tempTxData[i]);
                    txData.splice(delIndex, 1);
                }
            }
            if (datas.length > 0) {
                components.push(
                    <HistoryCard key={d} date={d.getTime()} data={datas} />
                );
            }
        }
        return components;
    };

    const filterHistory = () => {
        if (currentDateFrom > currentDateTo) {
            toast.error(
                `Tanggal pencarian awal lebih besar dibandingkan tanggal pencarian akhir. Silahkan set ulang!`
            );
        } else {
            setDateFrom(currentDateFrom);
            setDateTo(currentDateTo);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (historyData === undefined) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row">
                <div className="flex flex-row sm:basis-4/5 max-[369px]:flex-col max-[639px]:mb-2">
                    <div className="basis-1/2">
                        <p className="text-left font-bold text-xs sm:text-lg">
                            Dari Tanggal
                        </p>
                        <input
                            className="
                        text-xs text-center p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none
                        sm:text-xl sm:p-4 sm:rounded-[10px]"
                            type="date"
                            defaultValue={currentDateFrom}
                            max={tomorrow.toISOString().substring(0, 10)}
                            onChange={handleDateFrom}
                        />
                    </div>
                    <div className="max-[369px]:mt-2 basis-1/2 min-[369px]:ml-2">
                        <p className="text-left font-bold text-xs sm:text-lg">
                            Sampai Tanggal
                        </p>
                        <input
                            className="
                    text-xs text-center p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none
                    sm:text-xl sm:p-4 sm:rounded-[10px]"
                            type="date"
                            defaultValue={currentDateTo}
                            max={tomorrow.toISOString().substring(0, 10)}
                            onChange={handleDateTo}
                        />
                    </div>
                </div>
                <button
                    className="
                    sm:ml-2 sm:basis-1/5 self-end bg-[#007BC7] text-xs w-full p-2 border border-[2px] border-[#007BC7] text-white font-bold rounded-[5px]
                    sm:text-xl sm:p-4 sm:rounded-[10px]"
                    onClick={filterHistory}
                >
                    Cari
                </button>
            </div>
            <p className="text-left font-bold text-xs mt-2 sm:text-lg sm:mt-4">
                Daftar Transaksi
            </p>
            <div className="flex flex-col">{generateCard()}</div>
        </div>
    );
};

export default HistoryTransaction;
