import TransactionInfo from './info/transactionInfo';

const HistoryCard = (props: any) => {
    const showFormattedDate = (date: number) => {
        return new Date(date).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const generateInfo = () => {
        let components = [];
        for (let i = 0; i < props.data.length; i++) {
            components.push(<TransactionInfo key={i} data={props.data[i]} />);
        }
        return components;
    };

    return (
        <div className="my-2 flex flex-col text-xs sm:text-lg font-bold">
            <div className="bg-white rounded-t-[5px] sm:rounded-t-[10px]">
                <p className="line-clamp-1 p-2 sm:p-4">
                    {showFormattedDate(props.date)}
                </p>
            </div>
            <div className="flex flex-col">{generateInfo()}</div>
        </div>
    );
};

export default HistoryCard;
