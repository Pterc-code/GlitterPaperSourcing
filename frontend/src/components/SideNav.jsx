import './styles/SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';

const SideNav = () => {
    // Initialize the useNavigate hook from react-router-dom
    const navigate = useNavigate();

    // State to hold the user's email
    const [userEmail, setUserEmail] = useState('');

    // Fetch user information when the component mounts
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const { data } = await axiosInstance.get('/api/accounts/user/');
                setUserEmail(data.email);
            } catch (e) {
                console.error('Failed to load user:', e);
                return null;
            }
        };

        fetchUserInfo();
    }, []);

    // Handle logout functionality
    const handleLogout = async () => {
        const refresh = localStorage.getItem('refresh_token');

        try {
            await axiosInstance.post('/api/accounts/logout/', { refresh }, {
            headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });
        } catch (error) {
            console.error('Logout failed:', error);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };
    
    return (
        <div className="sideNav_container">
            <div className="sideNav_banner">
                <img src="/images/fzglitterlogo.png" alt="科瑞特 Logo" />
                <h2>科瑞特采购系统</h2>
            </div>

            <div className="sideNav_emailWrapper">
                <div>{userEmail || '加载中...'}</div>
            </div>

            <div className="sideNav_logoutWrapper">
                <button onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="sideNav_logoutIcon" />
                    退出登录
                </button>
            </div>

            <div className="side-nav-divider"></div>

        </div>
    );
};

export default SideNav;
