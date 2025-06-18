import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import './styles/IconDropdown.css';

const IconDropdown = ({ onSelect }) => {
  const [selectedIcon, setSelectedIcon] = useState('faTags');
  const [open, setOpen] = useState(false);

  const solidIcons = Object.entries(SolidIcons)
    .filter(([key, value]) => key.startsWith('fa') && value?.iconName)
    .map(([name, icon]) => ({ name, icon }));

  const iconObject = SolidIcons[selectedIcon] || SolidIcons['faTags'];

  useEffect(() => {
  if (typeof onSelect === 'function') {
    onSelect(selectedIcon); // send only once
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleSelect = (name) => {
    setSelectedIcon(name);
    setOpen(false);
    if (onSelect) onSelect(name); // pass string like 'faBox'
  };

  return (
    <div className="icon-dropdown">
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        <label>产品标签</label>
        <FontAwesomeIcon icon={iconObject} size="sm" />
        <span className="caret">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="dropdown-list">
          {solidIcons.map(({ name, icon }) => (
            <div key={name} className="dropdown-item" onClick={() => handleSelect(name)}>
              <FontAwesomeIcon icon={icon} size="sm" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IconDropdown;
