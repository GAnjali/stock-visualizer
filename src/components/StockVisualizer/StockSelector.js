import React from 'react';
import Select from 'react-select';

const StockSelector = (props) => {
    let stocks = props.stocks;
    let selectorOptions = stocks.map((data) => {
            return {value: data, label: data}
        }
    );

    return (
        <Select id="stock-selector"
                options={selectorOptions}
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

export default StockSelector;