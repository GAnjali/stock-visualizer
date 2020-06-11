import React, {Component} from 'react';
import * as d3 from 'd3';
import * as stocksData from "../../data/all_stocks_5yr.csv";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import moment from "moment";
import createGraph from "./Graph";
import Dashboard from "./Dashboard";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStock: 'Nothing selected',
            selectedStartDate: moment().subtract(7, "year").subtract(4, "month"),
            selectedEndDate: moment().subtract(2, "year").subtract(2, "month"),
            stockData: [],
            filteredData: [],
            stocks: []
        }
    }

    componentWillMount() {
        this.readStockData();
    }

    readStockData() {
        d3.csv(stocksData, function (d) {
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

    handleSelectStock = (selectedStock) => {
        this.setState({
            filteredData: this.getFilteredData(selectedStock, this.state.selectedStartDate, this.state.selectedEndDate),
            selectedStock: selectedStock
        }, () => {
            createGraph(this.state.filteredData, this.state.selectedStartDate, this.state.selectedEndDate)
        });
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            filteredData: this.getFilteredData(this.state.selectedStock, selectedStartDate, selectedEndDate),
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
        }, () => {
            createGraph(this.state.filteredData, this.state.selectedStartDate, this.state.selectedEndDate)
        });
    };

    getFilteredData(selectedStock, selectedStartDate, selectedEndDate) {
        let filteredData = [];
        const dateFormat = d3.timeParse("%Y-%m-%d");
        const inputData = this.state.stockData;
        filteredData = inputData.filter((record) => {
                if (typeof record.date === "string") {
                    if (dateFormat(record.date) >= selectedStartDate && dateFormat(record.date) <= selectedEndDate && record.Name === selectedStock)
                        return record;
                } else {
                    if (record.date >= selectedStartDate && record.date <= selectedEndDate && record.Name === selectedStock)
                        return record;
                }
            }
        );
        return filteredData;
    };

    render() {
        return (
            <Dashboard stocks={this.state.stocks}
                       selectedStartDate={this.state.selectedStartDate}
                       selectedEndDate={this.state.selectedEndDate}
                       handleSelectDate={this.handleSelectDate}
                       handleSelectStock={this.handleSelectStock}/>
        );
    }
}

export default App;