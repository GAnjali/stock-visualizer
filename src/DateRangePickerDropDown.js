import React from 'react';
import moment from 'moment';
import 'react-dates/initialize'

import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';


var SelectedStartDate = moment('2017-05-05');
var SelectedEndDate = moment('2017-05-09');


class DateRangePickerDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            focusedInput: null,
            startDate: SelectedStartDate,
            endDate:SelectedEndDate
        };
        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
    }

    onDatesChange({ startDate, endDate }) {

        this.setState({ startDate, endDate });
    }

    onFocusChange(focusedInput) {
        this.setState({ focusedInput });
    }

    render() {
        const { focusedInput, startDate, endDate } = this.state;
        return (
            <div>
                <DateRangePicker
                    onDatesChange={this.onDatesChange}
                    onFocusChange={this.onFocusChange}
                    focusedInput={focusedInput}
                    //Here is the change:
                    date={startDate}
                    startDate={startDate}
                    endDate={endDate}
                    startDateId="datepicker_start_home"
                    endDateId="datepicker_end_home"
                    startDatePlaceholderText="Check In"
                    endDatePlaceholderText="Check Out"
                />
            </div>
        );
    }
}

export default DateRangePickerDropDown;