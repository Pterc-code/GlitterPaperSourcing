import './styles/ProcurementTable.css';
import RfqFormList from './RfqFormList';
import FormDetails from './RfqFormDetails';
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
                <div className="form-details-wrapper">
                    <FormDetails
                        formId={selectedFormId}
                        onBack={() => setViewMode('list')}
                    />
                </div>
                
            )}
        </>
    );
};

export default ProcurementTable;
