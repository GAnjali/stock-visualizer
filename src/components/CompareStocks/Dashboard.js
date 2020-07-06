import InputField from "./InputField";
import DatePicker from "./DatePicker";
import React from "react";
import Spinner from "../Spinner";

const Dashboard = (props) => {
    console.log(props)
    return (
        <div className="app">
            <header className="app-header">
                <h2 className="app-title">Compare Stocks for a Mutual fund</h2>
            </header>
            <div className="app-intro">
                <InputField className={"amount-value-form"} amountToInvest={props.amountToInvest}
                            label={"Amount to invest:"}
                            name={"amountToInvest"}
                            placeholder={"Enter the Amount"} handleChange={props.handleAmountInput}/>
                <DatePicker date={props.date}
                            handleDateChange={props.handleDateChange}/>
                <button className={"submit"} onClick={props.renderGraph}>Submit</button>
                {props.loading && <Spinner/>}
                <div id={"graph"}/>
            </div>
        </div>
    )
};

export default Dashboard;