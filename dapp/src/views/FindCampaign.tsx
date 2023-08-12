import SearchBar from '../components/layout/findCampaign/searchBar';
import Category from '../components/layout/findCampaign/categories';
import Sort from '../components/layout/findCampaign/sort';
import CampaignList from '../components/layout/findCampaign/campaignList';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';

const FindCampaign = () => {
    const { connected, publicKey } = useWallet();

    const [categories, setCategories] = useState<any[]>();

    const fetchCategories = async () => {
        const categories = await axios.get(API_BASE_URL + '/v1/categories');
        categories.data.data.unshift({
            id: 0,
            name: 'Semua',
            description: '',
        });
        setCategories(categories.data.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <main className="max-w-screen-xl mx-auto px-12">
            <SearchBar />
            <Category categories={categories} />
            <Sort />
            <CampaignList />
        </main>
    );
};

export default FindCampaign;
