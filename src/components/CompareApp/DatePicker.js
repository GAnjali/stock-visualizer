import React, {Component} from "react";
import {SingleDatePicker} from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import "../../styles/react_dates_overrides.css"
import "../../styles/styles.css";

class DatePicker extends Component {
    state = {
        focusedInput: null,
    };

    handleFocusChange = focusedInput => this.setState({focusedInput});

    render() {
        return (
            <div>
                <h3 className={"date-picker-label"}>{"Select Date:"}</h3>
                <SingleDatePicker
                    date={this.props.date}
                    onDateChange={this.props.handleDateChange}
                    focused={this.state.focusedInput}
                    onFocusChange={this.handleFocusChange}
                    id={"date-picker"}
                />
            </div>
        )
    }
}

export default DatePicker;