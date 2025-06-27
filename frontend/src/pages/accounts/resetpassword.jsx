import { useState } from 'react';
import axios from 'axios';
import RegisterLoginBanner from '../../components/RegisterLoginBanner';
import './styles/login.css';

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('请输入邮箱地址');
            return;
        }

        // Create form data just like Postman x-www-form-urlencoded
        const formData = new URLSearchParams();
        formData.append('email', email);

        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/api/password_reset/`,
                formData, // not JSON!
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    withCredentials: false,
                }
            );
            setMessage('密码重置邮件已发送，请检查您的邮箱。');
            setError('');
        } catch (err) {
            console.error("Reset error:", err.response?.data || err.message);
            setMessage('');
            setError('发送失败，请确认邮箱是否正确。');
        }
    };



    return (

        <div className="login-container">
            <div className="login-left">
                <RegisterLoginBanner />
            </div>
            <div className='login-right'>
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className="login-title">重置密码</h2>
                    <label>请输入注册邮箱：</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {message && <div className="login-success">{message}</div>}
                    {error && <div className="login-error">{error}</div>}
                    <button type="submit" className="login-button">发送重置链接</button>

                    <a href="/" className="login-register-link">
                        登录账号
                    </a>
                </form>

                
            </div>

            
            
        </div>        
        
    );
};

export default ForgotPasswordForm;
