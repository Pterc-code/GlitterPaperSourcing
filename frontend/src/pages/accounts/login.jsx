import './styles/login.css';
import LoginForm from '../../components/LoginForm';
import RegisterLoginBanner from '../../components/RegisterLoginBanner';

const Login = () => {
  return (
    <div className="login-container">
        {/* Left Side */}
        <div className="login-left">
            <RegisterLoginBanner />
        </div>

        {/* Right Side */}
        <div className='login-right'>
            <LoginForm />
        </div>
    </div>
  );
};


export default Login;
