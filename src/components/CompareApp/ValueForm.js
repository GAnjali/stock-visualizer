import React from 'react';

const ValueForm = (props) => {
    return (
        <div>
            <h3 className={"input-label"}>{props.label}</h3>
            <input className="text-input" placeholder={props.placeholder} value={props.amountToInvest}
                   onChange={props.handleChange}/>
        </div>
    );
};

export default ValueForm;