import ButtonStyles from './button.module.css'

const Styles = ['dark-golden', 'blue-white', 'text-only-gray', 'gray-blue']

const Button = ({ children, styleType = 'blue-white', type = 'button', onClick }) => {
  
    if(!Styles.includes(styleType))
        console.error("Button does have such a style type");

    const buttonProps = {
        type,
        className: ButtonStyles[styleType],
        ...(onClick && { onClick }),
    };

    return <button {...buttonProps}>{children}</button>;
};

export default Button;
