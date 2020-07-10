import React, {useState} from "react";
import {SingleDatePicker} from "react-dates";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import "../../styles/react_dates_overrides.css"
import "../../styles/styles.css";

const DatePicker = (props) => {
    const [focused, handleFocusChange] = useState(false);
    return (
        <div>
            <h3 className={"date-picker-label"}>{"Select Date:"}</h3>
            <div className={"single-date-picker"}>
                <SingleDatePicker
                    id="date"
                    date={props.date}
                    onDateChange={(date) => props.handleDateChange(date)}
                    focused={focused}
                    onFocusChange={({focused}) => handleFocusChange(focused)}
                    numberOfMonths={1}
                    isOutsideRange={() => false}
                />
            </div>
        </div>
    )
};

export default DatePicker;