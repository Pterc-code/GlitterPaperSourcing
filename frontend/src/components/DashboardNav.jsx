import './styles/DashboardNav.css';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import ProductDashboard from './ProductDashboard';
import ProcurementTable from './ProcurementTable';
import SupplierList from './SupplierList';

/**
 * DashboardNav component.
 *
 * Renders the main navigation tabs for the dashboard and displays the corresponding content
 * based on the selected tab. Tabs and content are conditionally shown depending on the user's role.
 *
 * Tabs:
 * - 采购 (Procurement): Always visible.
 * - 产品 (Products): Staff/Admin only.
 * - 供应商 (Suppliers): Staff/Admin only.
 * - 总览 (Overview): Staff/Admin only.
 *
 * Content for each tab is rendered via child components.
 * User role is determined from the JWT token in localStorage.
 */

const DashboardNav = () => {
    const [activeTab, setActiveTab] = useState('procurement');
    const [role, setRole] = useState('');

    const renderContent = () => {
        switch (activeTab) {
            case 'procurement':
                return <ProcurementTable />;
            case 'products':
                return <ProductDashboard />;
            case 'suppliers':
                return <SupplierList />;
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
        <div className="dashboard-nav-wrapper">
            <div className="dashboard-tabs">
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
            </div>

            <div className="dashboard-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default DashboardNav;
