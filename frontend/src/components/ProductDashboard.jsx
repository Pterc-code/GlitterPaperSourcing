import './styles/ProductDashboard.css';
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import CreateProductForm from './CreateProductForm';
import ProductDetail from './ProductDetail';
import ProductSettings from './ProductSettings';
import ProductListView from './ProductListView';

/**
 * ProductDashboard component.
 *
 * Manages the main product dashboard workflow, including:
 * - Displaying a searchable list of products
 * - Creating a new product
 * - Viewing product details
 * - Editing product settings
 *
 * Uses viewMode and viewPayload state to control which view is shown and which product is selected.
 * Handles product data fetching and updates via API calls.
 *
 * Child components:
 * - ProductListView: Shows the product list and search bar.
 * - CreateProductForm: Form for creating a new product.
 * - ProductDetail: Shows details for a selected product.
 * - ProductSettings: Allows editing or deleting a selected product.
 */

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [viewMode, setViewMode] = useState('product-list');
    const [viewPayload, setViewPayload] = useState(null);

    useEffect(() => {
        axios.get('api/products/')
            .then(res => setProducts(res.data))
            .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    return (
        <div className="product-dashboard">
            {/* Product List */}
            {viewMode === 'product-list' && (
                <ProductListView
                    products={products}
                    query={query}
                    setQuery={setQuery}
                    onCreate={() => setViewMode('create-product')}
                    onSelectProduct={(product) => {
                        setViewPayload(product);
                        setViewMode('product-detail');
                    }}
                />
            )}

            {/* Create Product */}
            {viewMode === 'create-product' && (
                <CreateProductForm
                    onBack={() => setViewMode('product-list')}
                    onCreated={() => {
                        axios.get('api/products/').then(res => setProducts(res.data));
                    }}
                />
            )}

            {/* Product Detail */}
            {viewMode === 'product-detail' && viewPayload && (
                <ProductDetail
                    product={viewPayload}
                    onBack={() => setViewMode('product-list')}
                    onSettings={() => setViewMode('product-settings')}
                />
            )}

            {/* Product Setting */}
            {viewMode === 'product-settings' && viewPayload && (
                <ProductSettings
                    product={viewPayload}
                    onBack={() => setViewMode('product-detail')}
                    onUpdate={() => {
                        axios.get('api/products/').then(res => {
                            setProducts(res.data);
                            const updated = res.data.find(p => p.id === viewPayload.id);
                            setViewPayload(updated);
                        });
                    }}
                    onDelete={() => {
                        axios.get('api/products/').then(res => {
                            setProducts(res.data);
                            setViewMode('product-list');
                        });
                    }}
                />
            )}
        </div>
    );
};

export default ProductDashboard;
