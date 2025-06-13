import { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import RfqActionBar from './RfqActionBar';
import RfqTable from './RfqTable';
import './styles/RfqFormList.css';

const RfqFormList = ({ productId, onFormClick}) => {
    const [forms, setForms] = useState([]);
    const [filteredForms, setFilteredForms] = useState([]);
    const [selectedForms, setSelectedForms] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');

    // Table update on checkbox update
    const handleCheckboxChange = (rfq_number) => {
        setSelectedForms(prev =>
            prev.includes(rfq_number)
                ? prev.filter(n => n !== rfq_number)
                : [...prev, rfq_number]
        );
    };

    // Search result update on search bar change
    const handleSearchChange = (e) => {
        const value = e.target.value.trim();
        setSearchText(value);
        setFilteredForms(
            value === ''
                ? forms
                : forms.filter(form =>
                    form.rfq_number?.toLowerCase().includes(value.toLowerCase()) ||
                    form.id.toString().includes(value)
                )
        );
    };

    // Loads forms when called
    const loadForms = useCallback(async () => {
        try {
            const response = await axios.get('/api/forms/');
            const filtered = productId
                ? response.data.filter(form => form.product_id === productId)
                : response.data;
            setForms(filtered);
            setFilteredForms(filtered);
        } catch (err) {
            console.error(err);
            setError('无法加载RFQ表单列表');
        }
    }, [productId]);

    // Change form status based on which forms are checked
    const updateStatus = async (status) => {
        try {
            await Promise.all(
                selectedForms.map(rfq_number =>
                    axios.patch(`/api/forms/${rfq_number}/`, { sourcing_status: status })
                )
            );
            setSelectedForms([]);
            await loadForms();
        } catch (err) {
            console.error(err);
            alert('更新失败');
        }
    };

    // Delete form based on which forms are checked
    const deleteForms = async () => {
        try {
            await Promise.all(
                selectedForms.map(rfq_number =>
                    axios.delete(`/api/forms/${rfq_number}/`)
                )
            );
            setSelectedForms([]);
            await loadForms();
        } catch (err) {
            console.error(err);
            alert('删除失败');
        }
    };

    // Load forms on render
    useEffect(() => {
        loadForms();
    }, [loadForms]);

    // Loads user role on render
    

    return (
        <div className="rfq-forms-wrapper">
            {error && <p className="rfq-error">{error}</p>}
            <RfqActionBar
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                updateStatus={updateStatus}
                deleteForms={deleteForms}
                selectedCount={selectedForms.length}
            />
            <RfqTable
                forms={filteredForms}
                selectedForms={selectedForms}
                handleCheckboxChange={handleCheckboxChange}
                onFormClick={onFormClick}
            />
        </div>
    );
};

export default RfqFormList;
