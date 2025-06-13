import { useEffect, useState } from 'react';
import './styles/RfqTable.css';

// CHANGE SO THAT SUPPLIER RENDER ONLY PRODUCTS THEY HAVE
const RfqTable = ({
    forms,
    selectedForms,
    handleCheckboxChange,
    onFormClick,
    userRole: propUserRole, // allow prop override if needed
}) => {
    const [userRole, setUserRole] = useState(propUserRole || 'supplier');
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    useEffect(() => {
        if (propUserRole) {
            setUserRole(propUserRole);
            return;
        }
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                setUserRole(decodedPayload.role || 'supplier');
            } catch (err) {
                setUserRole('supplier');
            }
        }
    }, [propUserRole]);

    return (
        <table className="rfq-table">
            <thead>
                <tr>
                    {isStaffOrAdmin && <th></th>}
                    <th>订单号</th>
                    <th>产品</th>
                    <th>开单日期</th>
                    <th>截止日期</th>
                    <th>采购状态</th>
                    {isStaffOrAdmin && <th>操作</th>}
                </tr>
            </thead>
            <tbody>
                {forms.length === 0 ? (
                    <tr>
                        <td className="rfq-empty">没有匹配的表单</td>
                    </tr>
                ) : (
                    forms.map(form => (
                        <tr key={form.id}>
                            {isStaffOrAdmin && (
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedForms.includes(form.rfq_number)}
                                        onChange={() => handleCheckboxChange(form.rfq_number)}
                                        className="rfq-checkbox"
                                    />
                                </td>
                                
                            )}
                            <td>
                                <button
                                    className="rfq-view-button"
                                    onClick={() => onFormClick(form.rfq_number)}
                                >
                                    <span className="rfq-number">{form.rfq_number}</span>
                                </button>
                            </td>
                            <td>
                                {form.product_name}
                                <br />
                                <span className="subtext">{form.product_description}</span>
                            </td>
                            <td>{form.creation_date}</td>
                            <td>{form.closing_date}</td>
                            <td>
                                <span className={`status-tag ${form.sourcing_status ? 'ongoing' : 'closed'}`}>
                                    {form.sourcing_status ? '进行中' : '已截止'}
                                </span>
                            </td>
                            {isStaffOrAdmin && (
                                <td>
                                    <button className="rfq-action-button">查看报价</button>
                                </td>
                            )}
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default RfqTable;
