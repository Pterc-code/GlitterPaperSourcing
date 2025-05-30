import './styles/DashboardNav.css';
import React, { useState } from 'react';

const DashboardNav = () => {
    const [activeTab, setActiveTab] = useState('procurement');
    const ProcurementTable = () => <div>📦 This is the Procurement Table</div>;
    const ProductList = () => <div>📋 This is the Product List</div>;
    const SupplierList = () => <div>🏭 This is the Supplier List</div>;
    const OverviewSummary = () => <div>📊 This is the Overview Summary</div>;
    const renderContent = () => {
        switch (activeTab) {
            case 'procurement':
                return <ProcurementTable />;
            case 'products':
                return <ProductList />;
            case 'suppliers':
                return <SupplierList />;
            case 'overview':
                return <OverviewSummary />;
            default:
                return null;
        }
    };

  return (
    <div className="dashboard-nav">
        <div className="tabs">
            <button
                className={activeTab === 'procurement' ? 'tab-button active' : 'tab-button'}
                onClick={() => setActiveTab('procurement')}
            >
                采购
            </button>
            <button
                className={activeTab === 'products' ? 'tab-button active' : 'tab-button'}
                onClick={() => setActiveTab('products')}
            >
                产品
            </button>
            <button
                className={activeTab === 'suppliers' ? 'tab-button active' : 'tab-button'}
                onClick={() => setActiveTab('suppliers')}
            >
                供应商
            </button>
            <button
                className={activeTab === 'overview' ? 'tab-button active' : 'tab-button'}
                onClick={() => setActiveTab('overview')}
            >
                总览
            </button>
            </div>

        <div className="content">
            {renderContent()}
        </div>
    </div>
  );
};

export default DashboardNav;
