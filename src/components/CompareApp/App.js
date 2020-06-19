import React, {Component} from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import ValueForm from "./ValueForm";
import moment from "moment";
import DatePicker from "./DatePicker";
import * as d3 from "d3";
import * as inputfile from "../../data/all_stocks_5yr.csv";
import createGraph from "./Graph";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToInvest: null,
            date: moment().subtract(7, "year").subtract(4, "month"),
            stockData: [],
            stocks: [],
            mfStockNames: [],
            mfStockPercentages: []
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
        this.readConfigData();
        this.readStocksData();
    }

    componentDidMount() {
        this.renderGraph();
    }

    readConfigData = () => {
        const mfStocks = process.env.REACT_APP_STOCKS_PERCENTAGES.split(",");
        const mfStockNames = [];
        const mfStockPercentages = [];
        mfStocks.map((mfStock) => {
            const stocksValues = mfStock.split(':');
            mfStockNames.push(stocksValues[0].trim());
            mfStockPercentages.push(stocksValues[1].trim());
        });
        this.setState({
            mfStockNames: mfStockNames,
            mfStockPercentages: mfStockPercentages
        });
    };

    readStocksData() {
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
            }, this.renderGraph);
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
        if (this.state.date !== null && this.state.amountToInvest !== null && this.state.mfStockNames.length !== 0) {
            const mfStocksData = this.getFilteredStocksData(this.state.mfStockNames);
            const nonMfStocksNames = this.getNonMfStockNames();
            const nonMfStocksData = this.getFilteredStocksData(nonMfStocksNames);

            const startDate = moment().subtract(7, "year").subtract(4, "month");
            const endDate = moment().subtract(7, "year").subtract(2, "month");
            const mfStockPercentagesByDay = this.getPorLPercentagesByDay(this.state.mfStockNames, mfStocksData, this.state.date, endDate);
            const nonMfStocksPercentagesByDay = this.getPorLPercentagesByDay(nonMfStocksNames, nonMfStocksData, this.state.date, endDate);
            createGraph(mfStockPercentagesByDay, nonMfStocksPercentagesByDay, startDate, endDate);
        }
    }

    getPorLPercentagesByDay(stocksNames, stocksData, startDate, endDate) {
        const percentagesByDay = new Map();
        let currentDate = Object.assign({}, startDate);
        const boughtPricesForStocks = this.getBoughtPricesPerStock(stocksData);
        while (moment(currentDate).isBefore(moment(endDate))) {
            percentagesByDay.set(moment(currentDate).format("YYYY-MM-DD"), this.getPercentage(currentDate, boughtPricesForStocks, stocksNames, stocksData));
            currentDate = this.getNextDay(currentDate);
        }
        return percentagesByDay;
    }

    getBoughtPricesPerStock(stocksData) {
        const boughtPricesPerStock = new Map();
        Array.from(stocksData.keys()).map((stockName) => {
            boughtPricesPerStock.set(stockName, this.getPrice(this.state.date, stocksData.get(stockName)))
        });
        return boughtPricesPerStock;
    }

    getPrice(date, stockData) {
        let presentDay = date;
        let boughtPrice = null;
        const dateFormat = d3.timeParse("%Y-%m-%d");
        do {
            const nextDay = this.getNextDay(presentDay).format("YYYY-MM-DD");
            boughtPrice = stockData.get(nextDay);
            presentDay = moment(dateFormat(nextDay));
        } while (boughtPrice === undefined);
        return boughtPrice;
    }

    getNextDay = (date) => {
        const day = Object.assign({}, date);
        return moment(day).add(1, "days");
    };

    getPercentage(date, boughtPrices, stockNames, stocksData) {
        let percentageSum = 0;
        const formattedDate = moment(date);
        stockNames.map((stock) => {
            const boughtPriceOfStock = boughtPrices.get(stock);
            const openPrice = this.getPrice(formattedDate, stocksData.get(stock));
            const percentageOfStock = ((openPrice - boughtPriceOfStock) / boughtPriceOfStock) * 100;
            if (isNaN(percentageOfStock))
                return 0;
            percentageSum = percentageSum + percentageOfStock;
        });

        return percentageSum / stockNames.length;
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
                    <DatePicker date={this.state.date}
                                handleDateChange={this.handleDateChange}/>
                    <div id={"graph"}/>
                </div>
            </div>
        )
    }

    getFilteredStocksData = (stocksNames) => {
        const filteredStocksMap = new Map();
        stocksNames.map((stockName) => {
            filteredStocksMap.set(stockName, this.getOpenPricesByDay(stockName));
        });
        return filteredStocksMap;
    };

    getOpenPricesByDay(stockName) {
        const openPriceByDay = new Map();
        this.state.stockData.map((stock) => {
            if (stock.Name === stockName && this.getFormattedDate(stock.date) > this.state.date) {
                openPriceByDay.set(stock.date, stock.open);
            }
        });
        return openPriceByDay;
    }

    getFormattedDate(date) {
        const dateFormat = d3.timeParse("%Y-%m-%d");
        if (typeof date === "string")
            return dateFormat(date);
        return date;
    }

    getNonMfStockNames() {
        return this.state.stocks.filter((stockName) => {
            return !this.state.mfStockNames.includes(stockName);
        })
    }
}

export default App;