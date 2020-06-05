import React  from 'react';
import Select from 'react-select';

const DropDown = (props) => {
    let arrayOfData = props.arrayOfData;
    let options = arrayOfData.map((data) => {
            return {value: data, label: data}
        }
    );

    return (
        <Select id="stock-selection" options={options} onChange={(selectedOption) => {
            props.onSelectChange(selectedOption.value);
        }}/>
    )
};

export default DropDown;