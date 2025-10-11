import InputStyles from './input.module.css'

const InputField = ({id, type, name, value, onChange, required=false})=>{
    const buttonProps = {
        id,
        type,
        name,
        value,
        required,
        className: InputStyles.inputText,
        ...(onChange && { onChange }),
    };

    return <input {...buttonProps} />;
}

export default InputField;