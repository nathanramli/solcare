const UploadThumbnail = () => {
    return (
        <>
            <p className="text-xs md:text-lg">Upload Gambar</p>
            <label
                htmlFor="dropzone-file"
                className={`hover:brightness-90 shrink-0 h-28 w-full bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center border-2 border-gray-300 border-dashed rounded-[10px] cursor-pointer`}
            >
                <div className="w-full h-full flex flex-col items-center justify-center rounded-[10px]">
                    <svg
                        aria-hidden="true"
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                    </svg>
                    <input id="dropzone-file" type="file" className="hidden" />
                </div>
            </label>
        </>
    );
};

export default UploadThumbnail;
