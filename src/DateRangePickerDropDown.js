import React, {Component} from "react";
import {DateRangePicker} from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import "./react_dates_overrides.css"
import "./styles.css";

class DateRangePickerDropDown extends Component {
    state = {
        focusedInput: null
    };

    handleDateChange = ({startDate, endDate}) => {
        this.props.handleSelectDate(startDate, endDate);
    };

    handleFocusChange = focusedInput => this.setState({focusedInput});

    render() {
        return (
            <DateRangePicker
                endDate={this.props.endDate}
                endDateId="endDate"
                focusedInput={this.state.focusedInput}
                isOutsideRange={() => null}
                onDatesChange={this.handleDateChange}
                onFocusChange={this.handleFocusChange}
                startDate={this.props.startDate}
                startDateId="startDate"
            />
        )
    }
}

export default DateRangePickerDropDown;