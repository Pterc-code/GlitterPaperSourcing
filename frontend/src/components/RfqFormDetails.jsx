import { useEffect, useState } from 'react';
import axios from '../api/axios';
import './styles/FormDetails.css';
import './styles/UniversalStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const FormDetails = ({ formId, onBack }) => {
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [responseInputs, setResponseInputs] = useState({});


    const getStickyLeft = (headers, idx, columnWidth = 120) =>
        headers.slice(0, idx).reduce((sum, h) => sum + (h.is_fixed ? columnWidth : 0), 0);


    const handleInputChange = (rowId, field, value) => {
        setResponseInputs(prev => ({
            ...prev,
            [rowId]: {
                ...prev[rowId],
                [field]: value
            }
        }));
    };

    const handleSubmitAll = async () => {
        try {
            for (const row of form.row_templates) {
                const responseData = {
                    row_template: row.id,
                    data: responseInputs[row.id] || {}
                };
                await axios.post('/api/forms/form-response/', responseData);
            }
            alert("全部提交成功！");
        } catch (error) {
            alert("提交失败！");
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await axios.get(`/api/forms/form/${formId}/`);
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
            <button className="standard-button" onClick={onBack}>
                <FontAwesomeIcon icon={faArrowLeft} />返回
            </button>

            <div className="form-detail-view-information">
                <div className="form-details-header-wrapper">
                    <p className="company-title">
                        <img src="/images/fzglitterlogo.png" alt="科瑞特 Logo" />
                        科瑞特纸品有限公司
                    </p>
                    <div>
                        <p className="product-name">{form.product_name}采购单</p>
                        <p className="product-description">{form.product_description}</p>
                    </div>
                    <p className="product-closing-date">
                        截止日期：{form.closing_date}
                    </p>
                </div>

                <div className="form-details-additional-info-wrapper">
                    {form.remarks && <div>备注：{form.remarks}</div>}
                    {form.pdf_file && (
                        <div>
                            <a href={form.pdf_file} target="_blank" rel="noopener noreferrer">
                                参考文件
                            </a>
                        </div>
                    )}
                </div>
                    
                <div className="form-details-table-wrapper">
                    <table className="form-details-table">
                        <thead>
                            <tr>
                                {form.headers.map((header, idx) => (
                                    <th
                                        key={header.id}
                                        className={header.is_fixed ? 'sticky-col' : ''}
                                        style={header.is_fixed ? { left: `${getStickyLeft(form.headers, idx)}px` } : {}}
                                    >
                                        {header.name}
                                    </th>
                                ))}
                                <th>报价</th>
                            </tr>
                        </thead>
                        <tbody>
                            {form.row_templates.length > 0 ? (
                                form.row_templates.map(row => (
                                    <tr key={row.id}>
                                        {form.headers.map((header, idx) => (
                                            <td
                                                key={header.id}
                                                className={header.is_fixed ? 'sticky-col' : ''}
                                                style={header.is_fixed ? { left: `${getStickyLeft(form.headers, idx)}px` } : {}}
                                            >
                                                {row.data[header.name] ?? ''}
                                            </td>
                                        ))}
                                        <td>
                                            <input
                                                type="text"
                                                value={responseInputs[row.id]?.报价 || ''}
                                                onChange={(e) =>
                                                    handleInputChange(row.id, '报价', e.target.value)
                                                }
                                                placeholder="填写报价"
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={form.headers.length}>无数据</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
                

                <button onClick={handleSubmitAll} className="standard-button">
                    提交
                </button>
            </div>
        </div>
    );
};

export default FormDetails;
