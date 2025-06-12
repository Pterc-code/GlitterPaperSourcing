import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import './styles/ProductDetail.css';
import RfqFormList from './RfqFormList';
import ProductDetailHeaderButton from './ProductDetailHeaderButton';
import { useState } from 'react';
import CreateRfqForm from './CreateRfqForm';


const ProductDetail = ({ product, onBack, onSettings  }) => {

    const [viewMode, setViewMode] = useState('list');
    const getIcon = (iconName) => Icons[iconName] || Icons.faBox;

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

                    <RfqFormList productId={product.id} />
                </>
            )}

            {/* Viewmode Create */}
            {viewMode === 'create' && (
                <CreateRfqForm
                    product={product}
                    onBack={() => setViewMode('list')}
                    onCreated={() => {
                        setViewMode('list'); // reloads RfqFormList
                    }}
                />
            )}
        </div>

  );
};

export default ProductDetail;
