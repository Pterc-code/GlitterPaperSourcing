import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../api/axios';
import RegisterLoginBanner from '../../components/RegisterLoginBanner';
import './styles/login.css';
import './styles/resetpasswordform.css';

const ResetPasswordForm = () => {
	const { token } = useParams();
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleReset = async (e) => {
		e.preventDefault();
		try {
			await axios.post('/api/password_reset/confirm/', {
				token,
				password,
			});
			setMessage('密码已重置成功，请返回登录页面。');
			setError('');
			setTimeout(() => navigate('/'), 1500);
		} catch (err) {
			console.error("❌ Reset error:", err.response?.data || err.message);
			setError(
				err.response?.data?.non_field_errors?.[0] ||
				err.response?.data?.password?.[0] ||
				err.response?.data?.token?.[0] ||
				'密码重置失败，请稍后再试。'
			);
			setMessage('');
		}
	};

	return (
		<div className="login-container">
			<div className="login-left">
				<RegisterLoginBanner />
			</div>

			<div className="reset-right">
				<h2>重置密码</h2>
				{error && <p className="error-message">{error}</p>}
				{message ? (
					<p className="success-message">{message}</p>
				) : (
					<form onSubmit={handleReset}>
						<input
							type="password"
							placeholder="新密码"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button type="submit" disabled={!password}>
							提交
						</button>
					</form>
				)}
			</div>
		</div>
	);
};

export default ResetPasswordForm;
