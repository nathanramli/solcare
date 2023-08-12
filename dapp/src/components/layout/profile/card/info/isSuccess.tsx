import {
    EVIDENCE_STATUS_FAILED,
    EVIDENCE_STATUS_REQUESTED,
    EVIDENCE_STATUS_SUCCESS,
    EVIDENCE_STATUS_WAITING,
    STATUS_ACTIVE,
    STATUS_FAILED,
    STATUS_FILLED,
    STATUS_FUNDED,
    STATUS_FUND_CLAIMABLE,
    STATUS_NOT_FILLED,
    STATUS_NOT_FUNDED,
    STATUS_SUCCESS,
    STATUS_VOTING,
} from '../../../../../utils';
interface CampaignIsSuccessCardProps {
    collected: number;
    status: number;
    statusEvidence: number;
}

const IsSuccess: React.FC<CampaignIsSuccessCardProps> = (props) => {
    // console.log(props);

    const statusToString = (status: number) => {
        switch (status) {
            case STATUS_NOT_FILLED:
                return <p className="text-red-600">Gagal</p>;
            case STATUS_NOT_FUNDED:
                return <p className="text-red-600">Gagal</p>;
            default:
                return 'Unknown';
        }
    };

    const showEvidenceStatus = (status: number) => {
        switch (status) {
            case EVIDENCE_STATUS_WAITING:
                return (
                    <p className="text-green-600">
                        {/* Menunggu Pengajuan Verifikasi Kesuksesan Campaign */}
                        Berhasil Didanai
                    </p>
                );
            case EVIDENCE_STATUS_REQUESTED:
                return (
                    <p className="text-blue-600">
                        Menunggu Verifikasi Kesuksesan
                    </p>
                );
            case EVIDENCE_STATUS_SUCCESS:
                return <p className="text-green-600">Sukses</p>;
            case EVIDENCE_STATUS_FAILED:
                return <p className="text-red-600">Gagal</p>;
            default:
                return 'Unknown';
        }
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
                <div className="text-center">
                    <div className="text-lg sm:text-xl">
                        {props.status === STATUS_FUNDED
                            ? showEvidenceStatus(props.statusEvidence)
                            : statusToString(props.status)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IsSuccess;
