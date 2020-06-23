import ValueForm from "./ValueForm";
import DatePicker from "./DatePicker";
import React from "react";

const Dashboard = (props) => {
    return (
        <div className="app">
            <header className="App-header">
                <h2 className="App-title">Compare Stocks for a Mutual fund</h2>
            </header>
            <div className="App-intro">
                <ValueForm className={"amount-value-form"} amountToInvest={props.amountToInvest}
                           label={"Amount to invest:"}
                           name={"amountToInvest"}
                           placeholder={"Enter the Amount"} handleChange={props.handleAmountInput}/>
                <DatePicker date={props.date}
                            handleDateChange={props.handleDateChange}/>
                <div id={"graph"}/>
            </div>
        </div>
    )
};

export default Dashboard;