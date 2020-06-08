import React, {Component} from 'react';
import StockSelector from '../StockVisualizer/StockSelector';
import * as d3 from 'd3';
import * as inputfile from "../../data/all_stocks_5yr.csv";
import DateRangeSelector from '../StockVisualizer/DateRangeSelector';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import moment from "moment";
import ValueForm from "./ValueForm";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToInvest: ''
        }
    }

    handleAmountInput = (event) => {
        const regExp = /^[0-9\b]+$/;
        if (event.target.value === '' || regExp.test(event.target.value)) {
            this.setState({
                amountToInvest: event.target.value
            });
        }
    };

    render() {
        return (
            <div className="app">
                <header className="App-header">
                    <h2 className="App-title">Compare Stocks for a Mutual fund</h2>
                </header>
                <div className="App-intro">
                    <ValueForm amountToInvest={this.state.amountToInvest} label={"Amount to invest:"}
                               placeholder={"Enter the Amount"} handleChange={this.handleAmountInput}/>
                </div>
            </div>
        )
    }
}

export default App;