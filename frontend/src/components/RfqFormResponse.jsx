import { useEffect, useState } from 'react';
import axios from '../api/axios';
import './styles/RfqFormResponse.css';
import './styles/UniversalStyles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const RfqFormResponse = ({ formId, onBack }) => {
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState('');

    const fixedColumns = ['供应商', '联系人', '电话号码', '备注'];
    const getStickyLeft = (idx, columnWidthVw = 4.8) => idx * columnWidthVw;

    useEffect(() => {
        if (!formId) return;

        const fetchData = async () => {
            try {
                const formRes = await axios.get(`/api/forms/form/${formId}/`);
                const responseRes = await axios.get(`/api/forms/form-response/?form=${formId}`);
                setForm(formRes.data);
                setResponses(responseRes.data);
            } catch (err) {
                setError('无法加载响应数据');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                setUserRole(decodedPayload.role);
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }

        fetchData();
    }, [formId]);

    const showQuotes = !form?.sourcing_status || userRole === 'admin';

    const handleExportToExcel = () => {
        if (!form || responses.length === 0) return;

        const tableData = responses.map((res) => {
            const row = form.row_templates.find(r => r.id === res.row_template);
            const dataRow = {
                供应商: res.supplier_name || '无数据',
                联系人: res.supplier_representative || '无数据',
                电话号码: res.phone_number || '无数据',
                备注: res.remark || '无数据',
            };

            form.headers.forEach(header => {
                dataRow[header.name] = row?.data?.[header.name] || '';
            });

            if (showQuotes) {
                dataRow['报价'] = res.data?.报价 || '—';
            }

            return dataRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(tableData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, '报价汇总');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(
            blob,
            `${form.product_name}_${form.product_description}_${form.creation_date.replaceAll(/[: ]/g, '-').slice(0, 10)}_${form.closing_date.replaceAll(/[: ]/g, '-').slice(0, 10)}_报价汇总.xlsx`
        );
    };

    if (loading) return <div className="form-details-loading">加载中...</div>;
    if (error) return <div className="form-details-error">{error}</div>;
    if (!form || responses.length === 0) return <div>暂无供应商报价</div>;

    return (
        <div className="form-response-view">
            <div className="form-response-buttons">
                <button className="standard-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 返回
                </button>
                <button className="standard-button" onClick={handleExportToExcel}>
                    导出 Excel
                </button>
            </div>

            <div className="form-response-view-information">
                <div className="form-response-header-wrapper">
                    <p className="company-title">
                        <img src="/images/fzglitterlogo.png" alt="科瑞特 Logo" />
                        科瑞特纸品有限公司
                    </p>
                    <div>
                        <p className="product-name">{form.product_name}报价汇总</p>
                        <p className="product-description">{form.product_description}</p>
                    </div>
                    <p className="product-closing-date">截止日期：{form.closing_date}</p>
                </div>

                <div className="form-response-table-wrapper">
                    <table className="form-response-table">
                        <thead>
                            <tr>
                                {fixedColumns.map((label, i) => (
                                    <th key={label} className="sticky-col" style={{ left: `${getStickyLeft(i)}vw` }}>
                                        {label}
                                    </th>
                                ))}
                                {form.headers.map((header, idx) => (
                                    <th
                                        key={header.id}
                                        className={header.is_fixed ? 'sticky-col' : ''}
                                        style={
                                            header.is_fixed
                                                ? { left: `${getStickyLeft(fixedColumns.length + idx)}vw` }
                                                : {}
                                        }
                                    >
                                        {header.name}
                                    </th>
                                ))}
                                {showQuotes && <th>报价</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((res) => {
                                const row = form.row_templates.find(r => r.id === res.row_template);
                                return (
                                    <tr key={res.id}>
                                        <td className="sticky-col" style={{ left: `${getStickyLeft(0)}vw` }}>
                                            {res.supplier_name || '无数据'}
                                        </td>
                                        <td className="sticky-col" style={{ left: `${getStickyLeft(1)}vw` }}>
                                            {res.supplier_representative || '无数据'}
                                        </td>
                                        <td className="sticky-col" style={{ left: `${getStickyLeft(2)}vw` }}>
                                            {res.phone_number || '无数据'}
                                        </td>
                                        <td className="sticky-col" style={{ left: `${getStickyLeft(3)}vw` }}>
                                            {res.remark || '无数据'}
                                        </td>
                                        {form.headers.map((header, idx) => (
                                            <td
                                                key={header.id}
                                                className={header.is_fixed ? 'sticky-col' : ''}
                                                style={
                                                    header.is_fixed
                                                        ? { left: `${getStickyLeft(fixedColumns.length + idx)}vw` }
                                                        : {}
                                                }
                                            >
                                                {row?.data?.[header.name] ?? ''}
                                            </td>
                                        ))}
                                        {showQuotes && <td>{res.data?.报价 ?? '—'}</td>}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RfqFormResponse;
