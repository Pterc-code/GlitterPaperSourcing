import './styles/DashboardNav.css';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProductDashboard from './ProductDashboard';  
import ProcurementTable from './ProcurementTable';
import SupplierList from './SupplierList';

const DashboardNav = () => {
    const [activeTab, setActiveTab] = useState('procurement');
    const [role, setRole] = useState('');

    // Just for testing, delete later
    const OverviewSummary = () => <div>📊 This is the Overview Summary</div>;
    const renderContent = () => {
        switch (activeTab) {
            case 'procurement':
                return <ProcurementTable />;
            case 'products':
                return <ProductDashboard />;
            case 'suppliers':
                return <SupplierList />;
            case 'overview':
                return <OverviewSummary />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decoded = jwtDecode(token);
            setRole(decoded.role); 
        }
    }, []);


    return (
        <div className="dashboard-nav">
                <div className="tabs">
                    <button
                        className={activeTab === 'procurement' ? 'tab-button active' : 'tab-button'}
                        onClick={() => setActiveTab('procurement')}
                    >
                        采购
                    </button>

                    {(role === 'staff' || role === 'admin') && (
                    <button
                        className={activeTab === 'products' ? 'tab-button active' : 'tab-button'}
                        onClick={() => setActiveTab('products')}
                    >
                        产品
                    </button>
                    )}
                    
                    {(role === 'staff' || role === 'admin') && (
                        <button
                            className={activeTab === 'suppliers' ? 'tab-button active' : 'tab-button'}
                            onClick={() => setActiveTab('suppliers')}
                        >
                            供应商
                        </button>
                    )}
                    {(role === 'staff' || role === 'admin') && (
                        <button
                            className={activeTab === 'overview' ? 'tab-button active' : 'tab-button'}
                            onClick={() => setActiveTab('overview')}
                        >
                            总览
                        </button>
                    )}
                </div>

                <div className="content">
                    {renderContent()}
                </div>
        </div>
  );
};

export default DashboardNav;
