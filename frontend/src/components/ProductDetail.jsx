import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import './styles/ProductDetail.css';

const ProductDetail = ({ product, onBack, onSettings  }) => {
  const getIcon = (iconName) => Icons[iconName] || Icons.faBox;

  return (
    <div className="product-detail-view">
        <button onClick={onBack}>
            <FontAwesomeIcon icon={Icons.faArrowLeft} /> 返回
        </button>
        <div className="product-detail-title">
            <FontAwesomeIcon icon={getIcon(product.product_icon)} className="product-detail-icon" />
            <p>{product.product_name} - {product.product_description}</p>
        </div>
        <button onClick={onSettings}>
            <FontAwesomeIcon icon={Icons.faGear} /> 设置
        </button>
    </div>
  );
};

export default ProductDetail;
