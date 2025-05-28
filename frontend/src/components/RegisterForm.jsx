import './styles/RegisterForm.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from './TextInput';
import axios from '../api/axios';
// import DropdownInput from './DropdownInput';

const RegisterForm = () => {
    // Setting form, error, success variables
    const [form, setForm] = useState(
        {
            email: '',
            password: '',
            supplier_name: '',
            supplier_representative: '',
            phone_number: ''
        }
    )
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Handling form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    //  Handling form submit
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
        setError('密码不一致');
        return;
    }

    try {
        const response = await axios.post('api/accounts/register/', {
            supplier_representative: form.supplier_representative,
            supplier_name: form.supplier_name,
            email: form.email,
            password: form.password,
            phone_number: form.phone_number,
            // Add products later
        });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        setForm({
            email: '',
            password: '',
            supplier_name: '',
            supplier_representative: '',
            phone_number: '',
        });
        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.detail || '注册失败，请重试');
    }
    };

    return (
        <div>            
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">注册</h2>
                <div className="register-row">
                    <TextInput
                        name="supplier_representative"
                        label="联系人"
                        value={form.contactPerson}
                        onChange={handleChange}
                    />
                    <TextInput
                        name="supplier_name"
                        label="公司名称"
                        value={form.companyName}
                        onChange={handleChange}
                    />
                </div>
                <TextInput
                    name="email"
                    type="email"
                    label="邮箱"
                    value={form.email}
                    onChange={handleChange}
                />

                <TextInput
                    name="password"
                    type="password"
                    label="密码"
                    value={form.password}
                    onChange={handleChange}
                />

                <TextInput
                    name="confirmPassword"
                    type="password"
                    label="确认密码"
                    value={form.confirmPassword}
                    onChange={handleChange}
                />

                <TextInput
                    name="phone_number"
                    label="电话号码"
                    value={form.phone}
                    onChange={handleChange}
                />

                {/* <DropdownInput endpoint="http://localhost:8000/api/competitive-products/"/> */}

                {/* Change these sometime maybe*/}
                {error && <div className="register-error">{error}</div>} 

                <button type="submit" className="register-button">
                    注册
                </button>

                <div className="form-divider"></div>

                <div>
                    <a href="/" className="register-login-link">
                        登录账号
                    </a>
                </div>
                

            </form>
        </div>
        
    );
};

export default RegisterForm;