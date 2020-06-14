import React, {Component} from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import ValueForm from "./ValueForm";
import moment from "moment";
import DatePicker from "./DatePicker";
import * as d3 from "d3";
import * as inputfile from "../../data/all_stocks_5yr.csv";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToInvest: '',
            stockPercentage: '',
            date: moment(),
            stockData: [],
            stocks: []
        }
    }

    handleAmountInput = (event) => {
        const regExp = /^[0-9\b]+$/;
        if (event.target.value === '' || regExp.test(event.target.value)) {
            this.setState({
                [event.target.name]: event.target.value
            });
        }
    };

    handleDateChange = (date) => {
        this.setState({
            date: date
        }, this.renderGraph);
    };

    componentWillMount() {
        console.log("will mount");
        d3.csv(inputfile, function (d) {
            return {
                date: d.date,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close,
                Name: d.Name,
            };
        }).then(data => {
            this.setState({
                stockData: data,
                stocks: this.getStocks(data)
            });
        });
    }

    getStocks = (data) => {
        const stocksNames = new Set();
        data.map(function (d) {
            return stocksNames.add(d.Name);
        });
        return Array.from(stocksNames);
    };

    renderGraph() {
        if (this.state.date != null && this.state.amountToInvest != null && this.state.stockPercentage != null) {
            console.log("rendering graph");
        }
    }

    render() {
        return (
            <div className="app">
                <header className="App-header">
                    <h2 className="App-title">Compare Stocks for a Mutual fund</h2>
                </header>
                <div className="App-intro">
                    <ValueForm className={"amount-value-form"} amountToInvest={this.state.amountToInvest}
                               label={"Amount to invest:"}
                               name={"amountToInvest"}
                               placeholder={"Enter the Amount"} handleChange={this.handleAmountInput}/>
                    <ValueForm className={"percentage-value-form"} amountToInvest={this.state.stockPercentage}
                               label={"Percentage of stock:"}
                               name={"stockPercentage"}
                               placeholder={"Enter the Percentage of stock"} handleChange={this.handleAmountInput}/>
                    <DatePicker date={this.state.date}
                                handleDateChange={this.handleDateChange}/>
                </div>
            </div>
        )
    }
}

export default App;