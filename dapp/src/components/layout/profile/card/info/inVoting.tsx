import { ProposalInfo } from '../../campaignList';

interface CampaignInVotingCardProps {
    collected: number;
    proposal: ProposalInfo | null;
}

const InVoting: React.FC<CampaignInVotingCardProps> = (props) => {
    const countDisagreePercentage = () => {
        if (props.proposal === null) return 50;
        if (props.proposal.agree + props.proposal.disagree === 0) return 50;
        return Math.floor(
            (props.proposal.disagree /
                (props.proposal.disagree + props.proposal.agree)) *
                100
        );
    };

    return (
        <div className="text-white flex flex-col">
            <div className="text-center bg-[#007BC7] rounded-[5px] rounded-tr-none sm:rounded-[10px] sm:rounded-tr-none p-2 sm:p-4">
                <p className="line-clamp-1 text-start max-[369px]:text-[8px]">
                    DANA TERKUMPUL
                </p>
                <p className="text-lg sm:text-3xl mt-2 sm:mt-4 leading-none">
                    {props.collected}
                </p>
                <p className="text-[8px] sm:text-[15px] mb-2 sm:mb-4 leading-none">
                    USDC
                </p>
            </div>
            <div className="text-black mt-2 rounded-[5px] sm:rounded-[10px] p-2 sm:p-4">
                <p className="line-clamp-1 text-start max-[369px]:text-[8px]">
                    PROGRESS VOTING
                </p>
                <div className="text-center">
                    <p className="text-lg sm:text-3xl mt-2 sm:mt-4">
                        {(props.proposal?.agree || 0) +
                            (props.proposal?.disagree || 0)}{' '}
                        dari {props.collected}
                    </p>
                    <p className="text-[8px] sm:text-[15px] leading-none">
                        Suara
                    </p>
                </div>
                <div className="col-span-4 bg-green-600 rounded-full h-2 my-2 sm:h-4 sm:my-4">
                    <div
                        className="bg-red-600 h-2 rounded-full sm:h-4"
                        style={{
                            width: countDisagreePercentage().toString() + '%',
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-rows-1 gap-4 text-center max-[369px]:gap-2 max-[369px]:text-[8px]">
                    <div>
                        <p className="text-lg sm:text-3xl">
                            {props.proposal?.disagree || 0}
                        </p>
                        <p className="text-[8px] sm:text-[15px] leading-none">
                            Tidak Setuju
                        </p>
                    </div>
                    <div>
                        <p className="text-lg sm:text-3xl">
                            {props.proposal?.agree || 0}
                        </p>
                        <p className="text-[8px] sm:text-[15px] leading-none">
                            Setuju
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InVoting;
