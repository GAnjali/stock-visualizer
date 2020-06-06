import React from 'react';
import Select from 'react-select';

const DropDown = (props) => {
    let arrayOfData = props.arrayOfData;
    let options = arrayOfData.map((data) => {
            return {value: data, label: data}
        }
    );

    return (
        <Select id="stock-selection"
                options={options}
                onChange={(selectedOption) => {
                    props.onSelectChange(selectedOption.value);
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 0,
                    boxShadow: 2,
                    colors: {
                        ...theme.colors,
                        text: 'orangered',
                        primary25: '#d1cbcb',
                        primary: '#d1cbcb',
                        primary50: '#d1cbcb'
                    }
                })}
        />
    )
};

export default DropDown;