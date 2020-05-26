import React, {Component} from 'react';

class DropDown extends Component {

    handleChange = (event) => {
        let selectedValue = event.target.value;
        this.props.onSelectChange(selectedValue);
    };

    render() {
        let arrayOfData = this.props.arrayOfData;
        let options = arrayOfData.map((data) =>
            <option
                key={data}
                value={data}
            >
                {data}
            </option>
        );

        return (
            <select name="customSearch" className="custom-search-select" onChange={this.handleChange}>
                <option>Select Stock</option>
                {options}
            </select>
        )
    }
}

export default DropDown;