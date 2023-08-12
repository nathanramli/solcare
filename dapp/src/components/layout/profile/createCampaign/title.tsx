const Title = () => {
    return (
        <>
            <p className="text-xs md:text-lg">Judul</p>
            <input
                className="text-xs p-2 w-full rounded-[5px] border border-gray-300 hover:bg-gray-100 
                hover:text-gray-700 focus:outline-none md:text-xl md:p-4 md:rounded-[10px]"
                type="text"
            />
        </>
    );
};

export default Title;
