import { useState } from 'react';
import axios from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';
import IconDropdown from './IconDropdown';
import './styles/CreateProductForm.css';
import './styles/UniversalStyles.css';

const CreateProductForm = ({ onBack, onCreated }) => {
    const [form, setForm] = useState({
        product_name: '',
        product_description: '',
        product_icon: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleIconSelect = (icon) => {
        setForm(prev => ({ ...prev, product_icon: icon }));
    };

    const handleSubmit = async () => {
        try {
            console.log(form)
            await axios.post('api/products/', form);
            alert('产品创建成功');
            onCreated();
            onBack(); 
        } catch (err) {
            alert('创建失败');
            console.error(err);
        }
    };

    return (
        <div className="create-product-form-container">
            <div>
                <button className="standard-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 返回
                </button>
            </div>
            
            <div className="create-product-form-inputs">
                <div className="product-name-input">
                    <label>产品名称</label>
                    <input
                        type="text"
                        name="product_name"
                        value={form.product_name}
                        placeholder="请输入产品名称..."
                        onChange={handleChange}
                    />
                </div>
                
                <div className="product-description-input">
                    <label>产品描述</label>
                    <input
                        type="text"
                        name="product_description"
                        value={form.product_description}
                        placeholder="请输入产品描述..."
                        onChange={handleChange}
                    />
                </div>
                
                <div className="product-icon-dropdown">
                    <IconDropdown onSelect={handleIconSelect}/>
                </div>
                
            </div>
            <button className="create-product-form-button" onClick={handleSubmit}>
                <FontAwesomeIcon icon={faCheck} /> 创建
            </button>
        </div>
  );
};

export default CreateProductForm;
