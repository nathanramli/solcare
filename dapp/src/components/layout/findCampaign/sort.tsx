import Select from 'react-select';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
const options = [
    {
        label: 'Terbaru',
        value: 'newest',
    },
    {
        label: 'Terlama',
        value: 'oldest',
    },
];

const Sort = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    let filter = searchParams.get('order');

    let defaultOption = 0;
    if (filter === 'oldest') {
        defaultOption = 1;
    } else {
        defaultOption = 0;
    }

    const handleInputChange = (e: any) => {
        searchParams.set('order', e.value);
        setSearchParams(searchParams);
    };

    return (
        <div className="flex flex-col mt-6 flex-col-reverse">
            <div className="flex flex-row flex-end items-center justify-end">
                <label
                    htmlFor="sortFilter"
                    className="text-xs font-bold mr-5 xl:text-xl"
                >
                    Urutkan berdasarkan
                </label>
                <Select
                    className="w-[200px] text-xs xl:text-xl xl:w-[300px]"
                    options={options}
                    defaultValue={options[defaultOption]}
                    isSearchable={false}
                    styles={{
                        control: (baseStyles, state) => ({
                            ...baseStyles,
                            padding: '4px',
                            borderRadius: '10px',
                            fontWeight: 'bold',
                            '&:hover': {
                                borderColor: 'rgba(0, 123, 199, 1)',
                            },
                            '@media only screen and (min-width: 1280px)': {
                                padding: '16px',
                            },
                        }),
                        option: (baseStyles, state) => ({
                            ...baseStyles,
                            padding: '8px',
                            backgroundColor: state.isDisabled
                                ? undefined
                                : state.isSelected
                                ? 'rgba(0, 123, 199, 1)'
                                : state.isFocused
                                ? 'rgba(0, 123, 199, 0.3)'
                                : undefined,
                            '@media only screen and (min-width: 1280px)': {
                                padding: '16px',
                            },
                        }),
                    }}
                    onChange={(choice) => handleInputChange(choice)}
                />
            </div>
        </div>
    );
};

export default Sort;
