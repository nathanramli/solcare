const TargetValue = () => {
    return (
        <div>
            <p className="text-xs md:text-lg">Target Pendanaan</p>
            <div className="w-full flex flex-row items-center">
                <input
                    className="text-xs basis-11/12 text-center p-2 mr-2 min-w-[100px] rounded-[5px] border 
                    border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none md:text-xl md:p-4 md:mr-4 md:rounded-[10px]"
                    type="number"
                    min="1"
                    defaultValue="1"
                />
                <p className="basis-1/12 text-xs font-bold text-center md:text-xl">
                    USDC
                </p>
            </div>
        </div>
    );
};
export default TargetValue;
