import { DonorInfo } from '../../../views/DetailCampaign';

const FilledInfo = ({
    donorInfo,
    refetch,
}: {
    donorInfo: DonorInfo | null;
    refetch: () => void;
}) => {
    return (
        <>
            {donorInfo !== null ? (
                <>
                    <p className="mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4 text-justify">
                        Kamu telah berkontribusi pada campaign sebanyak:
                    </p>
                    <p className="text-base leading-none text-center mb-2 md:text-3xl md:mb-4">
                        <b>
                            {donorInfo.amount || 0}
                            <span className="text-[8px] md:text-[15px]">
                                USDC
                            </span>
                        </b>
                    </p>
                    {donorInfo.vote === null ? (
                        <div className="w-full flex flex-row items-center justify-between mt-2 text-xs font-bold text-white md:mt-4 md:text-xl"></div>
                    ) : (
                        <p className=" mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4 text-justify">
                            Kamu memilih{' '}
                            {donorInfo.vote.agree ? (
                                <b className="text-green-600">menyetujui</b>
                            ) : (
                                <b className="text-red-600">menolak</b>
                            )}{' '}
                            proposal.
                        </p>
                    )}
                </>
            ) : (
                <></>
            )}

            <p className="mt-5 text-[8px] mb-2 md:text-[15px] md:mb-4 text-justify">
                Campaign telah mencapai targetnya, silahkan menunggu pengiriman
                berkas dari fundraiser untuk melakukan voting.
            </p>
        </>
    );
};

export default FilledInfo;
