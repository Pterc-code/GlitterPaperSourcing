import './styles/RfqActionBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const RfqActionBar = ({ 
    userRole, 
    searchText, 
    handleSearchChange, 
    updateStatus, 
    deleteForms, 
    selectedCount 
}) => {
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
            
            {userRole === 'admin' ? (
                <>  
                    <button onClick={() => updateStatus(true)} disabled={selectedCount === 0}>
                        <FontAwesomeIcon icon={faCheck} className="rfq-icon" />
                        设为进行中
                    </button>
                    <button onClick={() => updateStatus(false)} disabled={selectedCount === 0}>
                        <FontAwesomeIcon icon={faXmark} className="rfq-icon" />
                        设为已截止
                    </button>
                    <button onClick={deleteForms} disabled={selectedCount === 0}>
                        <FontAwesomeIcon icon={faTrashCan} className="rfq-icon" />
                        删除表单
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => updateStatus(false)} disabled={selectedCount === 0}>设为已截止</button>
                    <button onClick={deleteForms} disabled={selectedCount === 0}>删除表单</button>
                </>
            )}
        </div>
    );
};

export default RfqActionBar;
