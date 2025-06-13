import './styles/ProductDashboard.css';
import { useEffect, useState } from 'react';
import axios from '../api/axios'; 
import CreateProductForm from './CreateProductForm';
import ProductDetail from './ProductDetail';
import ProductSettings from './ProductSettings';
import ProductListView from './ProductListView';

const ProductDashboard = () => {
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState('');
    const [viewMode, setViewMode] = useState('dashboard'); 
    const [viewPayload, setViewPayload] = useState(null); 

    useEffect(() => {
        axios.get('api/products/')
        .then(res => setProducts(res.data))
        .catch(err => console.error('Failed to fetch products:', err));
    }, []);

    return (
        <div className="product-dashboard">
            {viewMode === 'dashboard' && (
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

            {viewMode === 'create-product' && (
                <CreateProductForm 
                    onBack={() => setViewMode('dashboard')}
                    onCreated={() => {
                        axios.get('api/products/').then(res => setProducts(res.data));
                    }}
                />
            )}

            {viewMode === 'product-detail' && viewPayload && (
                <ProductDetail
                    product={viewPayload}
                    onBack={() => setViewMode('dashboard')}
                    onSettings={() => setViewMode('product-settings')}
                />
            )}

            {viewMode === 'product-settings' && viewPayload && (
                <ProductSettings
                    product={viewPayload}
                    onBack={() => setViewMode('product-detail')}
                    onUpdate={() => {
                    axios.get('api/products/').then(res => {
                        setProducts(res.data);
                        const updated = res.data.find(p => p.id === viewPayload.id);
                        setViewPayload(updated);});
                    }}
                    onDelete={() => {
                    axios.get('api/products/').then(res => {
                        setProducts(res.data);
                        setViewMode('dashboard');
                    });
                    }}
                />
            )}
        </div>
  );
};

export default ProductDashboard;
