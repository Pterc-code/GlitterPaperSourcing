import './styles/BreadCrumbs.css';

import { useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const pathMap = {
        dashboard: "控制面板"
    };

    return (
        <div className="breadcrumb">
            {pathnames.map((segment, index) => {
            const label = pathMap[segment] || segment;
            const isLast = index === pathnames.length - 1;
            return (
                <span key={index}>
                {label}
                {!isLast && ' / '}
                </span>
            );
            })}
        </div>
    );
};

export default BreadCrumbs;
