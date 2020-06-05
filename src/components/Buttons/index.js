import SubmitButton from './SubmitButton';
import SaveButton from './SaveButton';
import CancelButton from './CancelButton';
import React from 'react';
import PropTypes from "prop-types";

const Button = ({onClick, className = '', children}) => {
    return (
        <button onClick={onClick} children={children} className={className} type="button">
            {children}
        </button>
    );
}
Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};
export default Button;

export {
    SubmitButton,
    SaveButton,
    CancelButton
};