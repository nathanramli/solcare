import axios from 'axios';
import { API_BASE_URL } from '../../../../../utils';
import { useEffect, useState } from 'react';

const TransactionInfo = (props: any) => {
    const data = props.data;

    const [campaignName, setCampaignName] = useState();

    const showTransaction = (type: number) => {
        if (type === 0) {
            return 'Donasi';
        } else if (type === 1) {
            return 'Refund';
        } else if (type === 2) {
            return 'Klaim';
        }
    };

    const fetchCampaignName = async () => {
        const resp = await axios.get(
            `${API_BASE_URL}/v1/campaign/${data.campaignAddress}`
        );
        const respData = resp.data;

        if (respData.status === 200) {
            setCampaignName(respData.data.title);
        }
    };

    useEffect(() => {
        fetchCampaignName();
    }, []);

    if (campaignName === undefined) return null;

    return (
        <div className="flex flex-row mb-2">
            <div className="text-white basis-2/3 flex flex-col bg-[#007BC7] rounded-[5px] sm:rounded-[10px] p-2 sm:p-4">
                <p className="max-[369px]:text-[8px]">
                    {showTransaction(data.type)}
                </p>
                <p
                    id="address-tag"
                    className="line-clamp-2 max-[369px]:text-[8px] font-normal"
                >
                    {campaignName}
                </p>
                <p className="text-[8px] sm:text-[15px] leading-none font-thin">
                    {data.campaignAddress}
                </p>
            </div>
            <div className="basis-1/3 flex flex-col text-center justify-center">
                <p className="text-base sm:text-3xl leading-none">
                    {data.amount}
                </p>
                <p className="text-[8px] sm:text-[15px] leading-none">USDC</p>
            </div>
        </div>
    );
};

export default TransactionInfo;
