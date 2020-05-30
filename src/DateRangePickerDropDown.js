import React, {Component} from "react";
import {DateRangePicker} from "react-dates";
import 'react-dates/initialize';
import "./styles.css";

class DateRangePickerDropDown extends Component {
    state = {
        focusedInput: null
    };

    handleDateChange = ({startDate, endDate}) => {
        this.props.handleSelectStartDate(startDate);
        this.props.handleSelectEndDate(endDate);
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