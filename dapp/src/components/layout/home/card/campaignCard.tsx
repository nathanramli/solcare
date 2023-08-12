import { useEffect, useState } from 'react';
import { API_BASE_URL, USDC_DECIMALS, now } from '../../../../utils';
import { Link } from 'react-router-dom';
import { BN } from '@project-serum/anchor';

const CampaignCard = (props: any) => {
    const campaign = props.data;

    const [textTime, setTextTime] = useState('0D 0J 0M 0D');

    const countRemainingTime = () => {
        const remainingTime = Math.max(
            campaign.createdAt.toNumber() +
                campaign.duration.toNumber() -
                now(),
            0
        );
        return remainingTime;
    };

    const showRemainingDays = () => {
        const DAY_IN_SECOND = 60 * 60 * 24;

        if (countRemainingTime() > 0) {
            if (countRemainingTime() > DAY_IN_SECOND) {
                return Math.floor(countRemainingTime() / DAY_IN_SECOND);
            } else {
                return '< 1';
            }
        } else {
            return '0';
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTextTime(getTimers());
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    });

    const getTimers = () => {
        const DAY_IN_SECOND = 60 * 60 * 24;

        if (countRemainingTime() > 0) {
            let remainingTime = countRemainingTime();
            const days = Math.floor(remainingTime / DAY_IN_SECOND);
            remainingTime = remainingTime % DAY_IN_SECOND;
            const hours = Math.floor(remainingTime / (60 * 60));
            remainingTime = remainingTime % (60 * 60);
            const minutes = Math.floor(remainingTime / 60);
            remainingTime = remainingTime % 60;
            const seconds = remainingTime;
            return `${days}H ${hours}J ${minutes}M ${seconds}D`;
        } else {
            return 'Habis';
        }
    };

    return (
        <Link to={`/campaign/${campaign.campaign.toBase58()}`}>
            <div className="mx-3 rounded-[20px] text-black h-max shadow-[0px_4px_4px_0px_rgba(0,123,199,0.25)] hover:shadow-[0px_10px_10px_0px_rgba(0,123,199,0.5)] mb-4">
                <img
                    className="w-screen h-[200px] object-cover rounded-[20px]"
                    src={`${API_BASE_URL}/${campaign.banner}`}
                />
                <div className="py-4 px-6">
                    <h1 className="line-clamp-1 text-md font-bold mb-2 xl:text-2xl xl:my-2">
                        {campaign.title}
                    </h1>
                    {props.type === 'Voting' ? (
                        <div className="text-xs xl:text-base text-center">
                            <p>Sisa waktu</p>
                            <p className="font-bold">{textTime}</p>
                        </div>
                    ) : (
                        <div className="text-xs xl:text-base">
                            <p>
                                <span className="font-bold">
                                    {campaign.collected}
                                    <span className="text-[6px] xl:text-[8px]">
                                        USDC
                                    </span>
                                </span>{' '}
                                terkumpulkan
                            </p>
                            <p>
                                <span className="font-bold">
                                    {Math.floor(
                                        Math.min(
                                            100,
                                            (campaign.collected /
                                                campaign.target) *
                                                100
                                        )
                                    ).toString()}
                                    %
                                </span>{' '}
                                terpenuhi
                            </p>
                            <p>
                                <span className="font-bold">
                                    {showRemainingDays()}
                                </span>{' '}
                                hari tersisa
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CampaignCard;
