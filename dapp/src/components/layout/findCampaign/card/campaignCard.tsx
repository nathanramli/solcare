import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Thumbnail from '../../../../image/placeholder.svg';
import { API_BASE_URL, now } from '../../../../utils';

const CampaignCard = (props: any) => {
    let campaign = props.campaign;

    const countRemainingTime = () => {
        const remainingTime = Math.max(
            campaign.createdAt + campaign.duration - now(),
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

    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        setInitializing(false);
    }, []);

    if (initializing) {
        return <progress className="progress w-[90%] flex mx-auto my-20" />;
    }

    return (
        <Link to={`/campaign/${campaign.address}`}>
            <div className="w-full h-[100%] rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,123,199,0.25)] hover:shadow-[0px_10px_10px_0px_rgba(0,123,199,0.5)]">
                <img
                    className="w-screen h-[200px] object-cover rounded-[20px] xl:max-h-[300px]"
                    src={`${API_BASE_URL}/${campaign.banner}`}
                />
                <div className="p-6">
                    <h1 className="line-clamp-1 text-md font-bold my-2 xl:text-2xl xl:my-4">
                        {campaign.title}
                    </h1>

                    {campaign.collected === campaign.target ? (
                        <p className="text-xs xl:text-base">
                            <b className="text-green-600">
                                {campaign.collected} USDC
                            </b>{' '}
                            berhasil terkumpul
                        </p>
                    ) : (
                        <div className="grid grid-cols-5 gap-4 mb-3 items-center">
                            <div className="col-span-4 bg-gray-200 rounded-full h-2 dark:bg-gray-700 xl:h-4">
                                <div
                                    className="bg-[#007BC7] h-2 rounded-full xl:h-4"
                                    style={{
                                        width:
                                            Math.floor(
                                                Math.min(
                                                    100,
                                                    (campaign.collected /
                                                        campaign.target) *
                                                        100
                                                )
                                            ).toString() + '%',
                                    }}
                                />
                            </div>
                            <p className="font-bold text-xs text-center xl:text-lg">
                                {Math.floor(
                                    Math.min(
                                        100,
                                        (campaign.collected / campaign.target) *
                                            100
                                    )
                                )}
                                %
                            </p>
                        </div>
                    )}
                    <div className="text-xs xl:text-base ">
                        {campaign.collected === campaign.target ? (
                            <></>
                        ) : (
                            <p>
                                <b>{showRemainingDays()}</b> hari tersisa
                            </p>
                        )}
                    </div>

                    <p className="line-clamp-4 text-xs text-justify my-4 xl:text-base ">
                        {campaign.description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default CampaignCard;
