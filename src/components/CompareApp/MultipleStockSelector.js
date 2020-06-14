import React from 'react';
import Select from 'react-select';

const MultipleStockSelector = (props) => {
    let arrayOfData = props.arrayOfData;
    let options = arrayOfData.map((data) => {
            return {value: data, label: data}
        }
    );

    return (
        <div className={"multiple-stock-selector"}>
            <h3 className={"select-stocks-title"}>Stocks:</h3>
            <div className={"multi-stock-selection"}>
                <Select id="stock-selection"
                        style={{width: `${(50) + 100}px`, height: '20px'}}
                        options={options}
                        onChange={(selectedOption) => {
                            props.onSelectChange(selectedOption);
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
                        isMulti
                /></div>
        </div>
    )
};

export default MultipleStockSelector;