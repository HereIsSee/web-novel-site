import InputStyles from './input.module.css'

const InputField = ({id, type, styleType='basic', placeholder, name, value, onChange, required=false})=>{
    const buttonProps = {
        id,
        type,
        name,
        value,
        required,
        placeholder,
        className: InputStyles[styleType],
        ...(onChange && { onChange }),
    };

    return <input {...buttonProps} />;
}

export default InputField;