import './styles/dashboard.css';
import DashboardNav from '../../components/DashboardNav';
import SideNav from '../../components/SideNav';

/**
 * Dashboard page component.
 * 
 * Renders the main dashboard layout, including:
 * - Side navigation (SideNav)
 * - Top navigation (DashboardNav)
 * - Main dashboard heading
 * 
 * The layout is split into a left sidebar and a right main content area.
 */

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className='dashboard-left'>
                <SideNav />
            </div>
            <div className='dashboard-right'>
                <h1>控制面板</h1>
                <DashboardNav />
            </div>
        </div>
    );
};

export default Dashboard;
