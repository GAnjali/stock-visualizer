import React, {Component} from "react";
import {SingleDatePicker} from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import "../../styles/react_dates_overrides.css"
import "../../styles/styles.css";

class DatePicker extends Component {
    state = {
        focusedInput: false,
    };

    handleFocusChange = () => this.setState({focusedInput: true});

    handleDateChange = (date) => {
        this.setState({
            focusedInput: false
        }, this.props.handleDateChange(date));
    };

    render() {
        return (
            <div>
                <h3 className={"date-picker-label"}>{"Select Date:"}</h3>
                <div className={"single-date-picker"}>
                    <SingleDatePicker
                        date={this.props.date}
                        onDateChange={this.handleDateChange}
                        focused={this.state.focusedInput}
                        onFocusChange={this.handleFocusChange}
                        numberOfMonths={1}
                    />
                </div>
            </div>
        )
    }
}

export default DatePicker;