import './styles/ProcurementTable.css';
import RfqFormList from './RfqFormList';
import FormDetails from './FormDetails';
import { useState } from 'react';

const ProcurementTable = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'formDetails'
    const [selectedFormId, setSelectedFormId] = useState(null);

    return (
        <>
            {viewMode === 'list' && (
                <RfqFormList 
                    productId={null} 
                    onFormClick={formId => {
                        setSelectedFormId(formId);
                        setViewMode('formDetails');
                    }}
                />
            )}
            {viewMode === 'formDetails' && selectedFormId && (
                <FormDetails
                    formId={selectedFormId}
                    onBack={() => setViewMode('list')}
                />
            )}
        </>
    );
};

export default ProcurementTable;
