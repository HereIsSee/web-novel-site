import ButtonStyles from "./button.module.css";

const Styles = [
  "dark-golden",
  "blue-white",
  "blue-white-rounded",
  "text-only-gray",
  "gray-blue",
  "white-text-only",
  "red-white",
];

const Button = ({
  children,
  styleType = "blue-white",
  type = "button",
  align = "center",
  onClick,
  disabled = false,
  style = {},
}) => {
  if (!Styles.includes(styleType))
    console.error(`Button does not have such a style type: "${styleType}"`);

  const className = `${ButtonStyles[styleType]} ${ButtonStyles[align]} ${disabled ? ButtonStyles.disabled : ""}`;

  const buttonProps = {
    type,
    className,
    style,
    ...(onClick && { onClick }),
  };

  return <button {...buttonProps}>{children}</button>;
};

export default Button;
