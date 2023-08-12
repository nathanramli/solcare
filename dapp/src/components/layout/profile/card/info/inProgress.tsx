import { now } from '../../../../../utils';

interface CampaignInProgressCardProps {
    target: number;
    collected: number;
    createdAt: number;
    duration: number;
}

const InProgress: React.FC<CampaignInProgressCardProps> = (props) => {
    const countRemainingTime = () => {
        const remainingTime = Math.max(
            props.createdAt + props.duration - now(),
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

    return (
        <div className="text-white flex flex-col">
            <div className="text-center bg-[#007BC7] rounded-[5px] rounded-tr-none sm:rounded-[10px] sm:rounded-tr-none p-2 sm:p-4">
                <p className="line-clamp-1 text-start max-[369px]:text-[8px]">
                    TARGET PENDANAAN
                </p>
                <p className="text-lg sm:text-3xl mt-2 sm:mt-4 leading-none">
                    {props.target}
                </p>
                <p className="text-[8px] sm:text-[15px] mb-2 sm:mb-4 leading-none">
                    USDC
                </p>
            </div>
            <div className="text-black mt-2 rounded-[5px] sm:rounded-[10px] p-2 sm:p-4">
                <p className="line-clamp-1 text-start max-[369px]:text-[8px]">
                    PROGRESS PENDANAAN
                </p>
                <div className="col-span-4 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-2 sm:h-4 sm:mb-4">
                    <div
                        className="bg-[#007BC7] h-2 rounded-full sm:h-4"
                        style={{
                            width:
                                Math.floor(
                                    Math.min(
                                        100,
                                        (props.collected / props.target) * 100
                                    )
                                ).toString() + '%',
                        }}
                    />
                </div>
                <div className="grid sm:grid-cols-3 sm:grid-rows-1 gap-4 text-center max-[369px]:gap-2 max-[369px]:text-[8px] grid-rows-3 grid-cols-1">
                    <div>
                        <p className="text-lg sm:text-3xl">
                            {Math.floor(
                                Math.min(
                                    100,
                                    (props.collected / props.target) * 100
                                )
                            )}
                            %
                        </p>
                        <p className="text-[8px] sm:text-[15px] leading-none">
                            Terpenuhi
                        </p>
                    </div>
                    <div>
                        <p className="text-lg sm:text-3xl">
                            {props.collected}
                            <span className="text-[8px] sm:text-[15px] leading-none">
                                USDC
                            </span>
                        </p>
                        <p className="text-[8px] sm:text-[15px] leading-none">
                            Dana Terkumpul
                        </p>
                    </div>
                    <div>
                        <p className="text-lg sm:text-3xl">
                            {showRemainingDays()}
                        </p>
                        <p className="text-[8px] sm:text-[15px] leading-none">
                            Hari Tersisa
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InProgress;
