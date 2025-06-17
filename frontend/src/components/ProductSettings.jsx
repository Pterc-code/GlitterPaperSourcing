import { useState } from 'react';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import IconDropdown from './IconDropdown';
import './styles/ProductSettings.css';
import './styles/UniversalStyles.css';

const ProductSettings = ({ product, onBack, onUpdate, onDelete}) => {
    const [form, setForm] = useState({
        product_name: product.product_name,
        product_description: product.product_description,
        product_icon: product.product_icon
    });

    const handleIconSelect = (icon) => {
        setForm(prev => ({ ...prev, product_icon: icon }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
        await axios.put(
            `api/products/${product.product_name}/${product.product_description}/`,
            form
        );
        alert('产品更新成功');
        onUpdate();
        onBack();
        } catch (err) {
        alert('更新失败');
        console.error(err);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('确认要删除此产品吗？');
        if (!confirmed) return;

        try {
        await axios.delete(
            `api/products/${product.product_name}/${product.product_description}/`
        );
        alert('产品已删除');
        onDelete();
        onBack();
        } catch (err) {
        alert('删除失败');
        console.error(err);
        }
    };

    return (
        <div className="product-settings-view">
            <div className="product-settings-back-delete">
                <button onClick={onBack} className="standard-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> 返回
                </button>
                <button className="standard-button" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrash} /> 删除
                </button>
            </div>
            <div className="product-settings-inputs">
                <div className="product-name-input">
                    <label>产品名称</label>
                    <input
                        type="text"
                        name="product_name"
                        value={form.product_name}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="product-description-input">
                    <label>产品描述</label>
                    <input
                        type="text"
                        name="product_description"
                        value={form.product_description}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="product-icon-dropdown">
                    <IconDropdown onSelect={handleIconSelect}/>
                </div>
            </div>

            <button className="product-update-button" onClick={handleUpdate}>
                <FontAwesomeIcon icon={faCheck} /> 保存
            </button>

        </div>
    );
};

export default ProductSettings;
