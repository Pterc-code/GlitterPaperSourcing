import './styles/dashboard.css';
import DashboardNav from '../../components/DashboardNav';
import SideNav from '../../components/SideNav';
import BreadCrumbs from '../../components/BreadCrumbs';

const Dashboard = () => {   
  return (
    <div className="dashboard">
        <div className='dashboard-left'>
            <SideNav />
        </div>
        <div className='dashboard-right'>
            <h1>控制面板</h1>
            <BreadCrumbs />
            <DashboardNav />
        </div>
    </div>
  );
};

export default Dashboard;
