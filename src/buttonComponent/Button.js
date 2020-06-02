import React from 'react';

const Button = ({onClick, className, children}) => {
    return (
        <button onClick={onClick} children={children} className={className} type="button">
            {children}
        </button>
    );
}

export default Button;
