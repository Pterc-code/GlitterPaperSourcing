import './styles/TextInput.css';

const TextInput = ({ 
        label, 
        type = 'text', 
        placeholder, 
        value, 
        onChange, 
        name, 
        required = false
    }) => {
  return (
    <div className="text-input-group">
      {label && <label className="text-input-label">{label}</label>}
      <input
        className="text-input"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default TextInput;
