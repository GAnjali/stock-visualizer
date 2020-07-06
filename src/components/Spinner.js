import React from 'react';
import loadIcon from "../styles/loadIcon.gif";

const Spinner = () => {
    const getSpinner = () => {
        return (
            <div>
                <img style={{
                }} src={loadIcon}/>
            </div>
        );
    };
    return (
        <div id={"spinner"}>
            <div style={{position: 'absolute', top: '50%', left: '45%'}}>{getSpinner()}</div>
        </div>
    );
};

export default Spinner;