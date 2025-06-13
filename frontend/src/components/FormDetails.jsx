import { useEffect, useState } from 'react';
import axios from '../api/axios';

const FormDetails = ({ formId, onBack }) => {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`/api/forms/${formId}/`);
                setForm(response.data);
            } catch (err) {
                setError('无法加载表单详情');
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    if (loading) return <div className="form-details-loading">加载中...</div>;
    if (error) return <div className="form-details-error">{error}</div>;
    if (!form) return null;

    return (
        <div className="form-details-view">
            <button className="form-details-back" onClick={onBack}>返回</button>
            <h2>采购单详情</h2>
            <div className="form-details-section">
                <strong>订单号：</strong> {form.rfq_number}
            </div>
            <div className="form-details-section">
                <strong>产品ID：</strong> {form.product_id}
            </div>
            <div className="form-details-section">
                <strong>开单日期：</strong> {form.creation_date}
            </div>
            <div className="form-details-section">
                <strong>截止日期：</strong> {form.closing_date}
            </div>
            <div className="form-details-section">
                <strong>采购状态：</strong> {form.sourcing_status ? '进行中' : '已截止'}
            </div>
            <div className="form-details-section">
                <strong>备注：</strong> {form.remarks || '无'}
            </div>
            <div className="form-details-section">
                <strong>PDF文件：</strong> 
                {form.pdf_file ? (
                    <a href={form.pdf_file} target="_blank" rel="noopener noreferrer">
                        查看PDF
                    </a>
                ) : '无'}
            </div>

            {/* 动态表格 */}
            <h3 style={{ marginTop: '2em' }}>表单内容</h3>
            <table className="form-headers-table" style={{ width: '100%', marginTop: '1em', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                    <tr>
                        {form.headers.map(header => (
                            <th key={header.id} style={{ border: '1px solid #ccc', padding: '8px' }}>{header.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {form.row_templates.length > 0 ? (
                        form.row_templates.map(row => (
                            <tr key={row.id}>
                                {form.headers.map(header => (
                                    <td key={header.id} style={{ border: '1px solid #ccc', padding: '8px' }}>
                                        {row.data[header.name] ?? ''}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={form.headers.length} style={{ textAlign: 'center', color: '#aaa' }}>无数据</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default FormDetails;
