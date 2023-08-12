const Description = () => {
    return (
        <>
            <p className="text-xs md:text-lg">Deskripsi</p>
            <textarea
                className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 
                hover:text-gray-700 focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
            />
        </>
    );
};

export default Description;
