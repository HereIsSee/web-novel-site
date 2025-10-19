import InputStyles from './input.module.css'

const InputField = ({id, type, styleType='basic', placeHolder, name, value, onChange, required=false})=>{
    const buttonProps = {
        id,
        type,
        name,
        value,
        required,
        placeHolder,
        className: InputStyles[styleType],
        ...(onChange && { onChange }),
    };

    return <input {...buttonProps} />;
}

export default InputField;