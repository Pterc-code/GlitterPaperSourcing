import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 
import './styles/LoginForm.css'; 
import TextInput from './TextInput';

const LoginForm = () => {
    // Setting form, error, success variables
    const [form, setForm] = useState({  
        email: '', 
        password: '' 
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Handling form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    //  Handling form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    try {
        const response = await axios.post('api/accounts/login/', {
            email: form.email,
            password: form.password,
    });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        navigate('/dashboard');; 
    } catch (err) {
      setError('登录失败，请检查邮箱和密码');
    }
    };

    return (
        <div>
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">登录</h2>
                <TextInput
                    name="email"
                    label="邮箱"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <TextInput
                    name="password"
                    type="password"
                    label="密码"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                {error && <div className="login-error">{error}</div>}

                <button type="submit" className="login-button">登录</button>

                <div className="form-divider"></div>

                <div>
                    <a href="/register" className="login-register-link">
                        注册账号
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
