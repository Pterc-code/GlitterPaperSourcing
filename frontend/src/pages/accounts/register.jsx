import './styles/register.css';
import RegisterForm from '../../components/RegisterForm';
import RegisterLoginBanner from '../../components/RegisterLoginBanner';

const Register = () => {
  return (
    <div className="register-container">
      {/* Left Side */}
      <div className="register-left">
        <RegisterLoginBanner />
      </div>

      {/* Right Side */}
      <div className='register-right'>
        <RegisterForm />
      </div>
    </div>
  );
};


export default Register;
