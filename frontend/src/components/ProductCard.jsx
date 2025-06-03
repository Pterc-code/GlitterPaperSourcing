import './styles/ProductCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ product, onClick }) => {
  const toCamelCase = (str) =>
    str
      .split('-')
      .map((word, i) =>
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');

  const getIcon = (iconName) => {
    const camelCaseName = toCamelCase(iconName); 
    const icon = Icons[camelCaseName];
    if (!icon) {
      console.warn(`Invalid icon: "${iconName}" → "${camelCaseName}". Using fallback.`);
    }
    return icon || Icons.faBox;
  };

  return (
    <div className="product-card" onClick={onClick}>
      <FontAwesomeIcon
        icon={getIcon(product.product_icon)}
        className="product-icon"
        size="lg"
      />
      <h3>{product.product_name}</h3>
      <p>{product.product_description}</p>
    </div>
  );
};

export default ProductCard;
