import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';
import './styles/CreateRfqForm.css';

const CreateRfqForm = ({ product, onBack, onCreated }) => {
    const [form, setForm] = useState({
        product: product?.id,
        rfq_number: '',
        closing_date: '',
        remarks: '',
        pdf_file: null,
        headers: [],
        row_templates: []
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'pdf_file') {
        setForm({ ...form, pdf_file: files[0] });
        } else {
        setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product', form.product);
        formData.append('rfq_number', form.rfq_number);
        formData.append('closing_date', form.closing_date);
        formData.append('remarks', form.remarks);

        if (form.pdf_file) {
            formData.append('pdf_file', form.pdf_file);
        }

        form.headers.forEach((h) => formData.append('headers', JSON.stringify(h)));
        form.row_templates.forEach((r) => formData.append('row_templates', JSON.stringify(r)));
        
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        try {
            await axios.post('/api/forms/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('RFQ 表单创建成功');
            onCreated?.(); // callback to return to list or update UI
        } catch (error) {
            console.error('提交失败:', error.response?.data || error);
            alert('提交失败，请检查输入内容');
        }
    };

    const addColumn = () => {
        const newName = `字段${form.headers.length + 1}`;
        const newHeader = { name: newName, is_fixed: false, order: form.headers.length + 1 };
        const newHeaders = [...form.headers, newHeader];
        const newRows = form.row_templates.map(row => ({
        ...row,
        data: { ...row.data, [newName]: '' }
        }));
        setForm({ ...form, headers: newHeaders, row_templates: newRows });
    };

    const addRow = () => {
        const newData = Object.fromEntries(form.headers.map(h => [h.name, '']));
        const newRow = { data: newData, order: form.row_templates.length + 1 };
        setForm({ ...form, row_templates: [...form.row_templates, newRow] });
    };

    const removeColumn = (index) => {
        const headerName = form.headers[index].name;
        const newHeaders = form.headers.filter((_, i) => i !== index);
        const newRows = form.row_templates.map(row => {
        const newData = { ...row.data };
        delete newData[headerName];
        return { ...row, data: newData };
        });
        setForm({ ...form, headers: newHeaders, row_templates: newRows });
    };

    const removeRow = (index) => {
        const newRows = form.row_templates.filter((_, i) => i !== index);
        setForm({ ...form, row_templates: newRows });
    };

    const updateHeader = (index, field, value) => {
        const headers = [...form.headers];
        headers[index][field] = field === 'is_fixed' ? value === 'true' : value;
        setForm({ ...form, headers });
    };

    const updateCell = (rowIdx, key, value) => {
        const rows = [...form.row_templates];
        rows[rowIdx].data[key] = value;
        setForm({ ...form, row_templates: rows });
    };

    return (
        <div className="create-rfq-form-wrapper">
            <div>
                <button className="create-rfq-form-back-button" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} /> 返回
                </button>
            </div>

            <div className="rfq-form-number-date-wrapper">
                <div className="rfq-form-number-input-wrapper">
                    <label>订单号</label>
                    <input
                        type="text"
                        name="rfq_number"
                        value={form.rfq_number}
                        placeholder="请输入订单号..."
                        className="create-rfq-form-inputs"
                        onChange={handleChange}
                    />
                </div>

                <div className="rfq-form-closing-date-wrapper">
                    <label>截止日期</label>
                    <input
                        type="date"
                        name="closing_date"
                        value={form.closing_date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            
            <div className="rfq-form-remarks-wrapper">
                <label>备注</label>
                <input
                    type="text"
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                />
            </div>

            <div className="rfq-form-pdf-wrapper">
                <label>上传 PDF 文件</label>
                <input
                    type="file"
                    name="pdf_file"
                    accept="application/pdf"
                    onChange={handleChange}
                />
            </div>

            <div className="excel-table">
                <table>
                <thead>
                    <tr>
                    {form.headers.map((header, idx) => (
                        <th key={idx}>
                        <input
                            value={header.name}
                            onChange={(e) => updateHeader(idx, 'name', e.target.value)}
                        />
                        <select
                            value={header.is_fixed.toString()}
                            onChange={(e) => updateHeader(idx, 'is_fixed', e.target.value)}
                        >
                            <option value="true">固定</option>
                            <option value="false">可变</option>
                        </select>
                        <button onClick={() => removeColumn(idx)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        </th>
                    ))}
                    <th>
                        <button onClick={addColumn}>
                        <FontAwesomeIcon icon={faPlus} /> 添加列
                        </button>
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {form.row_templates.map((row, rIdx) => (
                    <tr key={rIdx}>
                        {form.headers.map((header, hIdx) => (
                        <td key={hIdx}>
                            <input
                            value={row.data[header.name] || ''}
                            onChange={(e) => updateCell(rIdx, header.name, e.target.value)}
                            />
                        </td>
                        ))}
                        <td>
                        <button onClick={() => removeRow(rIdx)}>
                            <FontAwesomeIcon icon={faTrash} /> 删除行
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                <button onClick={addRow}>
                    <FontAwesomeIcon icon={faPlus} /> 添加行
                </button>

                <button onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faPlus} /> 创建采购单
                </button>
            </div>
        </div>
  ) ;
};

export default CreateRfqForm;