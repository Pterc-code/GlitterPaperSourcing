import './styles/RfqTable.css';


const RfqTable = ({ forms, selectedForms, handleCheckboxChange }) => {
    return (
        <table className="rfq-table">
            <thead>
                <tr>
                    <th></th>
                    <th>订单号</th>
                    <th>产品</th>
                    <th>开单日期</th>
                    <th>截止日期</th>
                    <th>采购状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                {forms.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="rfq-empty">没有匹配的表单</td>
                    </tr>
                ) : (
                    forms.map(form => (
                        <tr key={form.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedForms.includes(form.rfq_number)}
                                    onChange={() => handleCheckboxChange(form.rfq_number)}
                                    className="rfq-checkbox"
                                />
                            </td>
                            <td>{form.rfq_number}</td>
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
                            <td>
                                <button className="rfq-action-button">查看报价</button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
};

export default RfqTable;
