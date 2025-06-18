import './styles/ProcurementTable.css';
import RfqFormList from './RfqFormList';
import RfqFormDetails from './RfqFormDetails';
import RfqFormResponse from './RfqFormResponse';
import { useState } from 'react';

const ProcurementTable = () => {
    const [viewMode, setViewMode] = useState('list'); // 'list', 'formDetails'
    const [selectedFormId, setSelectedFormId] = useState(null);

    return (
        <>
            {viewMode === 'list' && (
                <RfqFormList 
                    productId={null} 
                    onFormDetailClick={formId => {
                        setSelectedFormId(formId);
                        setViewMode('formDetails');
                    }}
                    onFormResponseClick={formId => {
                        setSelectedFormId(formId);
                        setViewMode('formResponse');
                    }}
                />
            )}
            {viewMode === 'formDetails' && selectedFormId && (
                <div className="form-details-wrapper">
                    <RfqFormDetails
                        formId={selectedFormId}
                        onBack={() => setViewMode('list')}
                    />
                </div>
            )}

            {/* Viewmode FormResponse */}
            {viewMode === 'formResponse' && selectedFormId && (
                <RfqFormResponse
                    formId={selectedFormId}
                    onBack={() => setViewMode('list')}
                />
            )}
        </>
    );
};

export default ProcurementTable;
