import React, {Component} from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import ValueForm from "./ValueForm";
import moment from "moment";
import DatePicker from "./DatePicker";
import * as d3 from "d3";
import * as inputfile from "../../data/all_stocks_5yr.csv";
import MultipleStockSelector from "./MultipleStockSelector";
import createGraph from "./Graph";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToInvest: '',
            stockPercentage: '',
            date: moment(),
            stockData: [],
            stocks: [],
            selectedStocks: []
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

    handleSelectStock = (selectedStocks) => {
        this.setState({
            selectedStocks: selectedStocks.map((stock) => {
                return stock.value;
            })
        }, () => {
            this.renderGraph();
        })
    };

    componentWillMount() {
        console.log(process.env.REACT_APP_STOCKS_PERCENTAGES);
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
        if (this.state.date !== null && this.state.amountToInvest !== null && this.state.stockPercentage !== null && this.state.selectedStocks.length !== 0) {
            const selectedStocksData = this.getFilteredStocksData(this.state.selectedStocks);

            const unSelectedStocks = this.getUnSelectedStockNames();
            const unSelectedStocksData = this.getFilteredStocksData(unSelectedStocks);

            const startDate = moment().subtract(7, "year").subtract(4, "month");
            const endDate = moment().subtract(2, "year").subtract(2, "month");
            createGraph(selectedStocksData, unSelectedStocksData, startDate, endDate);
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
                    <MultipleStockSelector arrayOfData={this.state.stocks}
                                           onSelectChange={this.handleSelectStock}/>
                    <div id={"graph"}/>
                </div>
            </div>
        )
    }

    getFilteredStocksData = (filteredStocksNames) => {
        const dateFormat = d3.timeParse("%Y-%m-%d");
        return this.state.stockData.filter((stock) => {
            return filteredStocksNames.includes(stock.Name) && dateFormat(stock.date) >= this.state.date;
        });
    };

    getUnSelectedStockNames() {
        return this.state.stocks.filter((stockName) => {
            return !this.state.selectedStocks.includes(stockName);
        })
    }
}

export default App;