import InputStyles from "./input.module.css";

const InputField = ({
  id,
  type,
  styleType = "basic",
  style = {},
  placeholder,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  step,
}) => {
  const inputProps = {
    id,
    type,
    name,
    value,
    required,
    placeholder,
    style,
    className: InputStyles[styleType],
    ...(onChange && { onChange }),
    ...(min !== undefined && { min }),
    ...(max !== undefined && { max }),
    ...(step !== undefined && { step }),
  };

  return <input {...inputProps} />;
};

export default InputField;
