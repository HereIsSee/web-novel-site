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
}) => {
  if (!Styles.includes(styleType))
    console.error("Button does have such a style type");

  const className = `${ButtonStyles[styleType]} ${ButtonStyles[align]}`;

  const buttonProps = {
    type,
    className,
    ...(onClick && { onClick }),
  };

  return <button {...buttonProps}>{children}</button>;
};

export default Button;
