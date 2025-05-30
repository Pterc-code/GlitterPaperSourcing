import './styles/SideNav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRectangleList  } from '@fortawesome/free-solid-svg-icons';

const SideNav = () => {   
  return (
    <div className="side-nav">
        <div className="side-nav-banner">
            <img src="/images/fzglitterlogo.png" alt="科瑞特 Logo" />
            <h2>科瑞特采购系统</h2>
        </div>
        <div className="side-nav-account-wrapper">
            <button className="side-nav-account">
                <FontAwesomeIcon icon={faUser} className="account-icon" />
            </button>
        </div>
        <div className="side-nav-control-wrapper">
            <button className="side-nav-control">
                <FontAwesomeIcon icon={faRectangleList} className="control-panel-icon" />
                控制面板
            </button>
        </div>
        <div className="side-nav-divider"></div>
        <div>
            
        </div>
    </div>
  );
};

export default SideNav;
