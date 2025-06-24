import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import './styles/ProductDetailHeaderButton.css';
import './styles/UniversalStyles.css';

const ProductDetailHeaderButton = ({ product, onBack, onSettings, getIcon }) => {
    return (
        <div className="product-detail-view-back-setting">
            <button onClick={onBack} className="standard-button">
                <FontAwesomeIcon icon={Icons.faArrowLeft} /> 返回
            </button>

            <div className="product-detail-title">
                <FontAwesomeIcon
                    icon={getIcon(product.product_icon)}
                    className="product-detail-icon"
                />
                <p>{product.product_name} - {product.product_description}</p>
            </div>

            <button onClick={onSettings} className="standard-button">
                <FontAwesomeIcon icon={Icons.faGear} /> 设置
            </button>
        </div>
    );
};

export default ProductDetailHeaderButton;
