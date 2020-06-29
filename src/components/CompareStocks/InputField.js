import React from 'react';

const InputField = (props) => {
    return (
        <div className={props.className}>
            <h3 className={"input-label"}>{props.label}</h3>
            <input className="text-input" placeholder={props.placeholder} value={props.amountToInvest} name={props.name}
                   onChange={props.handleChange}/>
        </div>
    );
};

export default InputField;