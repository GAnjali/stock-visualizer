import StockSelector from "./StockSelector";
import DateRangeSelector from "./DateRangeSelector";
import React from "react";

const Dashboard = (props) => {
    return (
        <div className="app">
            <header className="App-header">
                <h2 className="App-title">Stock Visualizer</h2>
            </header>
            <div className="App-intro">
                <h3 className={"stock-title"}>Stock:</h3>
                <div className="Stock-selection">
                    <StockSelector stocks={props.stocks} onSelectChange={props.handleSelectStock}/>
                    <br/><br/>
                </div>
                <h3 className={"date-range-title"}>Date Range:</h3>
                <div className="DateRange-selection">
                    <DateRangeSelector
                        startDate={props.selectedStartDate}
                        endDate={props.selectedEndDate}
                        handleSelectDate={props.handleSelectDate}/>
                </div>
            </div>
            <div id={"graph"}/>
        </div>
    )
};

export default Dashboard;