import './styles/ProcurementTable.css';
import RfqFormList from './RfqFormList';
import RfqFormDetails from './RfqFormDetails';
import RfqFormResponse from './RfqFormResponse';
import { useState } from 'react';

/**
 * ProcurementTable component.
 *
 * Handles the main procurement table view and navigation between:
 * - RFQ form list (RfqFormList)
 * - RFQ form details (RfqFormDetails)
 * - RFQ form response (RfqFormResponse)
 *
 * Uses viewMode and selectedFormId state to control which view is shown.
 * Child components are rendered conditionally based on user interaction.
 */

const ProcurementTable = () => {
    const [viewMode, setViewMode] = useState('RfqFormList');
    const [selectedFormId, setSelectedFormId] = useState(null);

    return (
        <div className='procurement-table-wrapper'>
            {/* RFQ form list */}
            {viewMode === 'RfqFormList' && (
                <RfqFormList
                    productId={null}
                    onFormDetailClick={formId => {
                        setSelectedFormId(formId);
                        setViewMode('RfqFormDetails');
                    }}
                    onFormResponseClick={formId => {
                        setSelectedFormId(formId);
                        setViewMode('RfqFormResponse');
                    }}
                />
            )}

            {/* RFQ form details */}
            {viewMode === 'RfqFormDetails' && selectedFormId && (
                <RfqFormDetails
                    formId={selectedFormId}
                    onBack={() => setViewMode('RfqFormList')}
                />
            )}

            {/* RFQ form response */}
            {viewMode === 'RfqFormResponse' && selectedFormId && (
                <RfqFormResponse
                    formId={selectedFormId}
                    onBack={() => setViewMode('RfqFormList')}
                />
            )}
        </div>
    );
};

export default ProcurementTable;
