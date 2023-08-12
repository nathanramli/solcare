import { now } from '../../../utils';

const CollectedFund = (props: any) => {
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
    return (
        <div className="mb-[3px] md:mb-3">
            <p className="text-base leading-none md:text-3xl">
                <b>
                    {campaign.collected}
                    <span className="text-[8px] md:text-[15px]">USDC</span>
                </b>
            </p>
            <p>
                Dana terkumpul dari{' '}
                <b className="text-xl">
                    {campaign.target}
                    <span className="text-[10px]">USDC</span>
                </b>
            </p>

            {campaign.collected === campaign.target ? (
                <></>
            ) : (
                <div className="mb-[3px] md:mb-[9px]">
                    <p className="text-md leading-none md:text-3xl">
                        <b>{showRemainingDays()}</b>
                    </p>
                    <p className="text-[8px] md:text-[15px]">Hari tersisa</p>
                </div>
            )}
        </div>
    );
};

export default CollectedFund;
