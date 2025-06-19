import { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import './styles/SupplierList.css';
import './styles/UniversalStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    // Load all suppliers
    const loadSuppliers = useCallback(async () => {
        try {
            const response = await axios.get('/api/accounts/suppliers/');
            setSuppliers(response.data);
            setFilteredSuppliers(response.data);
        } catch (err) {
            console.error(err);
            setError('无法加载供应商列表');
        }
    }, []);

    // Load all products
    const loadProducts = useCallback(async () => {
        try {
            const response = await axios.get('/api/products/');
            setAllProducts(response.data);
        } catch (err) {
            console.error(err);
            setError('无法加载产品列表');
        }
    }, []);

    useEffect(() => {
        loadSuppliers();
        loadProducts();
    }, [loadSuppliers, loadProducts]);

    const handleSearchChange = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setSearchText(value);

        const filtered = suppliers.filter(supplier => {
            const matchesName = supplier.supplier_name?.toLowerCase().includes(value);
            const matchesRep = supplier.supplier_representative?.toLowerCase().includes(value);
            const matchesProduct = supplier.products.some(product =>
                product.product_name.toLowerCase().includes(value)
            );
            return matchesName || matchesRep || matchesProduct;
        });

        setFilteredSuppliers(filtered);
    };

    const handleEditProducts = (supplier) => {
        setSelectedSupplier(supplier);
        setSelectedProductIds(supplier.products.map(p => p.id));
    };

    const handleProductCheckboxChange = (productId) => {
        setSelectedProductIds(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSaveProducts = async () => {
        try {
            await axios.patch(`/api/accounts/${selectedSupplier.id}/update/`, {
                products: selectedProductIds
            });
            alert('产品已更新');
            setSelectedSupplier(null);
            setSelectedProductIds([]);
            await loadSuppliers();
        } catch (err) {
            console.error(err);
            alert('更新失败，请重试');
        }
    };

    const handleCancelEdit = () => {
        setSelectedSupplier(null);
        setSelectedProductIds([]);
    };

    const handleDeleteSupplier = async (supplier) => {
        const confirmed = window.confirm(`确定要删除供应商 "${supplier.supplier_name}" 的账户吗？`);
        if (!confirmed) return;

        try {
            await axios.delete(`/api/accounts/delete/${supplier.id}/`);
            alert('供应商账户已删除');
            await loadSuppliers();
        } catch (err) {
            console.error(err);
            alert('删除失败，请重试');
        }
    };

    return (
        <div className="supplier-list-wrapper">
            {error && <p className="supplier-list-error">{error}</p>}
            {selectedSupplier && (
                <div className="supplier-edit-product-wrapper">
                    <div className="supplier-edit-product-content">
                        <h3>编辑 {selectedSupplier.supplier_name} 的产品</h3>
                        <div className="supplier-edit-product-checkbox-list">
                            {allProducts.map(product => (
                                <label key={product.id} className="supplier-checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={selectedProductIds.includes(product.id)}
                                    onChange={() => handleProductCheckboxChange(product.id)}
                                />
                                <span>
                                    {product.product_name}
                                    <br />
                                    <span className="subtext">{product.product_description}</span>
                                </span>
                                </label>
                            ))}
                        </div>
                        <div className="supplier-edit-product-edit-actions">
                            <button className="standard-button" onClick={handleSaveProducts}>保存</button>
                            <button className="standard-button" onClick={handleCancelEdit}>取消</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="supplier-list-search-bar-wrapper">
                <FontAwesomeIcon icon={faSearch} className="supplier-list-search-icon" />
                <input
                    type="text"
                    placeholder="搜索供应商或产品..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="supplier-search-bar"
                />
            </div>
            
            <table className="supplier-list-table">
                <thead>
                    <tr>
                        <th>供应商名称</th>
                        <th>代表人</th>
                        <th>用户名</th>
                        <th>联系电话</th>
                        <th>产品</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSuppliers.length === 0 ? (
                        <tr>
                            <td colSpan={4}>
                                <div className="supplier-list-empty">没有匹配的供应商</div>
                            </td>
                        </tr>
                    ) : (
                        filteredSuppliers.map(supplier => (
                            <tr key={supplier.id}>
                                <td>{supplier.supplier_name}</td>
                                <td>{supplier.supplier_representative}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.phone_number}</td>
                                <td>
                                    {supplier.products.length > 0 ? (
                                        <ul className="supplier-products-list">
                                            {supplier.products.map(product => (
                                                <li key={product.id}>
                                                    {product.product_name}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="subtext">无关联产品</span>
                                    )}
                                    
                                </td>
                                <td>
                                    <button
                                        className="standard-button"
                                        onClick={() => handleEditProducts(supplier)}
                                    >
                                        编辑产品
                                    </button>
                                    <button
                                        className="standard-button"
                                        onClick={() => handleDeleteSupplier(supplier)}
                                    >
                                        删除账户
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            
        </div>
    );
};

export default SupplierList;
