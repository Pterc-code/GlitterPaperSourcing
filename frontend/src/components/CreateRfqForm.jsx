import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from '../api/axios';
import './styles/CreateRfqForm.css';

const CreateRfqForm = ({ product, onBack, onCreated }) => {

    const initialHeaders = Array.from({ length: 6 }, (_, i) => ({
        name: `字段${i + 1}`,
        is_fixed: false,
        order: i + 1
    }));

    const initialRowData = Object.fromEntries(initialHeaders.map(h => [h.name, '']));


    const [form, setForm] = useState({
        product: product?.id,
        rfq_number: '',
        closing_date: '',
        remarks: '',
        pdf_file: null,
        headers: initialHeaders,
        row_templates: [{ data: initialRowData, order: 1 }]
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
            console.log(formData);
            alert('RFQ 表单创建成功');
            onCreated?.();
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


            <div className="rfq-form-table-wrapper">
                <div className="rfq-form-table-scroll">
                    <table>
                        <thead className="rfq-form-table-col-wrapper">
                            <tr>
                                {form.headers.map((header, idx) => (
                                    <th className="rfq-form-table-col" key={idx}>
                                        <div className="rfq-form-col-header-wrapper">
                                            <div className="rfq-form-col-header-buttons">
                                                <button onClick={() => removeColumn(idx)}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="rfq-form-col-header-inputs">
                                            <input
                                                value={header.name}
                                                onChange={(e) => updateHeader(idx, 'name', e.target.value)}
                                            />
                                            <select
                                                value={(header.is_fixed ?? false).toString()}
                                                onChange={(e) => updateHeader(idx, 'is_fixed', e.target.value)}
                                            >
                                                <option value="true">固定</option>
                                                <option value="false">可变</option>
                                            </select>
                                        </div>
                                        
                                    </th>
                                ))}
                                <button className="rfq-form-add-col-button" onClick={addColumn}>
                                    <FontAwesomeIcon icon={faPlus} /> 添加列
                                </button>
                            </tr>
                        </thead>
                        <tbody>
                            {form.row_templates.map((row, rIdx) => (
                                <tr className="rfq-form-table-row" key={rIdx}>
                                    {form.headers.map((header, hIdx) => (
                                    <td className="rfq-form-table-row" key={hIdx}>
                                        <input
                                        value={row.data[header.name] || ''}
                                        onChange={(e) => updateCell(rIdx, header.name, e.target.value)}
                                        />
                                    </td>
                                    ))}
                                    <button className="rfq-form-del-col-button" onClick={() => removeRow(rIdx)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </tr>
                             
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="rfq-form-add-row-button-wrapper">
                    <button className="rfq-form-add-row-button" onClick={addRow}>
                        <FontAwesomeIcon icon={faPlus} /> 添加行
                    </button>   
                </div>
                <div className="rfq-form-create-button-wrapper">
                    <button className="rfq-form-create-button" onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faPlus} /> 创建采购单
                    </button>
                </div>
                
            </div>
        </div>
  ) ;
};

export default CreateRfqForm;