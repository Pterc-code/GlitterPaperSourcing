import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import './styles/ProductDetail.css';
import RfqFormList from './RfqFormList';
import ProductDetailHeaderButton from './ProductDetailHeaderButton';
import { useState } from 'react';
import CreateRfqForm from './CreateRfqForm';
import FormDetails from './RfqFormDetails';
import RfqFormResponse from './RfqFormResponse';
const ProductDetail = ({ product, onBack, onSettings  }) => {

    const getIcon = (iconName) => Icons[iconName] || Icons.faBox;
    const [viewMode, setViewMode] = useState('list'); // 'list', 'create', 'formDetails'
    const [selectedFormId, setSelectedFormId] = useState(null);

    return (
        <div className="product-detail-view">
            {/* View mode List */}
            {viewMode === 'list' && (
                <>
                    <ProductDetailHeaderButton
                        product={product}
                        onBack={onBack}
                        onSettings={onSettings}
                        getIcon={getIcon}
                    />
                    <div className="create-rfq-form-button-wrapper">
                        <button className="create-rfq-form-button" onClick={() => setViewMode('create')}>
                            <FontAwesomeIcon icon={Icons.faPlus} /> 创建采购单
                        </button>
                    </div>

                    <RfqFormList 
                        productId={product.id}
                        onFormDetailClick={formId => {
                            setSelectedFormId(formId);
                            setViewMode('formDetails');
                        }}
                        onFormResponseClick={formId => {
                            setSelectedFormId(formId);
                            setViewMode('formResponse');
                        }}
                    />
                </>
            )}

            {/* Viewmode Create */}
            {viewMode === 'create' && (
                <CreateRfqForm
                    product={product}
                    onBack={() => setViewMode('list')}
                    onCreated={() => {
                        setViewMode('list'); 
                    }}
                />
            )}

            {/* Viewmode FormDetails */}
            {viewMode === 'formDetails' && selectedFormId && (
                <FormDetails
                    formId={selectedFormId}
                    onBack={() => setViewMode('list')}
                />
            )}

            {/* Viewmode FormResponse */}
            {viewMode === 'formResponse' && selectedFormId && (
                <RfqFormResponse
                    formId={selectedFormId}
                    onBack={() => setViewMode('list')}
                />
            )}

        </div>

  );
};

export default ProductDetail;
