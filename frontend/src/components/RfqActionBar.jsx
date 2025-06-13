import { useEffect, useState } from 'react';
import './styles/RfqActionBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const RfqActionBar = ({ 
    searchText, 
    handleSearchChange, 
    updateStatus, 
    deleteForms, 
    selectedCount 
}) => {
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
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
    }, []);

    return (
        <div className="rfq-status-buttons">
            <div className={`rfq-search-bar ${userRole === 'admin' ? 'admin' : 'user'}`}>
                <FontAwesomeIcon icon={faSearch} className="rfq-search-icon" />
                <input
                    type="text"
                    className="rfq-search"
                    placeholder="查询采购单"
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>
            
            {/* Only show buttons for staff/admin */}
            {(userRole === 'admin' || userRole === 'staff') && (
                <>
                    {userRole === 'admin' && (
                        <>
                            <button onClick={() => updateStatus(true)} disabled={selectedCount === 0}>
                                <FontAwesomeIcon icon={faCheck} className="rfq-icon" />
                                设为进行中
                            </button>
                        </>
                    )}
                    <button onClick={() => updateStatus(false)} disabled={selectedCount === 0}>
                        <FontAwesomeIcon icon={faXmark} className="rfq-icon" />
                        设为已截止
                    </button>
                    <button onClick={deleteForms} disabled={selectedCount === 0}>
                        <FontAwesomeIcon icon={faTrashCan} className="rfq-icon" />
                        删除表单
                    </button>
                </>
            )}
            {/* No buttons for suppliers */}
        </div>
    );
};

export default RfqActionBar;
