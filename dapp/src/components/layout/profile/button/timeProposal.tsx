const TimeProposal = () => {
    return (
        <div className="flex flex-col">
            <label
                htmlFor="my-modal-4"
                className="text-center mt-4 self-end bg-[#007BC7] w-full text-xs p-2 border border-[2px] border-[#007BC7] text-white font-bold rounded-[5px]
                    md:text-xl md:p-4 md:rounded-[10px]"
            >
                Ajukan Perpanjangan Waktu
            </label>
            <div>
                <input
                    type="checkbox"
                    id="my-modal-4"
                    className="modal-toggle"
                />
                <label
                    htmlFor="my-modal-4"
                    className="modal max-[768px]:modal-bottom cursor-pointer px-0 md:px-12"
                >
                    <label className="modal-box relative rounded-t-[10px] md:rounded-[20px] w-[54rem] max-w-screen-2xl md:max-h-screen-2xl">
                        <h1 className="text-md font-bold md:text-3xl">
                            Perpanjangan Waktu
                        </h1>
                        <div className="divider" />
                        <div className="grid sm:grid-rows-2 sm:grid-cols-2 grid-rows-4 grid-cols-1 items-center gap-x-2 mb-2">
                            <p className="text-xs md:text-xl font-bold">
                                Sisa Hari Belum Terpakai
                            </p>
                            <p className="self-center justify-self-center text-base font-bold md:text-3xl py-auto">
                                60
                                <span className="text-[8px] md:text-[15px]">
                                    {' '}
                                    Hari
                                </span>
                            </p>
                            <p className="text-xs md:text-xl font-bold">
                                Tambahan Hari
                            </p>
                            <div className="w-full flex flex-row items-center">
                                <input
                                    className="text-xs basis-11/12 text-center p-2 mr-2 min-w-[100px] rounded-[5px] border border-gray-300 
                                    hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:text-xl md:p-4 md:mr-4 md:rounded-[10px]"
                                    type="number"
                                    min="1"
                                    max="90"
                                    defaultValue="1"
                                />
                                <p className="basis-1/12 text-xs font-bold text-center md:text-xl">
                                    Hari
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row justify-end font-bold text-white text-center">
                            <label
                                htmlFor="my-modal-4"
                                className="basis-6/12 md:basis-3/12 text-[#007BC7] border-solid border-2 border-white hover:border-[#007BC7] p-2 md:p-4 text-[8px] md:text-[15px] rounded-[5px] md:rounded-[10px]"
                            >
                                Batal
                            </label>
                            <label
                                className="basis-6/12 md:basis-3/12 rounded-[5px] md:rounded-[10px] p-2 md:p-4 text-[8px] md:text-[15px] ml-1 md:ml-2 bg-[#007BC7] border border-2 border-white hover:bg-[#007BC7] hover:border-[#007BC7]"
                                onClick={() => {
                                    console.log('Send');
                                }}
                            >
                                Kirim
                            </label>
                        </div>
                    </label>
                </label>
            </div>
        </div>
    );
};

export default TimeProposal;
