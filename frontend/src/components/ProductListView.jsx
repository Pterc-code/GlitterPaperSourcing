import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';
import ProductCard from './ProductCard';
import './styles/ProductListView.css';

const ProductListView = ({
    products, 
    query, 
    setQuery, 
    onCreate, 
    onSelectProduct 
}) => {
    const filtered = products.filter((p) =>
        p.product_name.toLowerCase().includes(query.toLowerCase()) ||
        p.product_description.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            {/* Search & Add Button */}
            <div className="product-controls-wrapper">
                <div className="product-search-bar">
                    <FontAwesomeIcon icon={Icons.faSearch} className="product-search-icon" />
                    <input
                        type="text"
                        placeholder="查询产品"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div>
                    <button className="create-product-button" onClick={onCreate}>
                        <FontAwesomeIcon icon={Icons.faPlusCircle} />
                        添加产品
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="product-list">
                {filtered.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onSelectProduct(product)}
                    />
                ))}
            </div>
        </>
    );
};

export default ProductListView;
