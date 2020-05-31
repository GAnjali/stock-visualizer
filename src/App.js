import React, {Component} from 'react';
import DropDown from './DropDown';
import * as d3 from 'd3';
import * as inputfile from "./XYZ.csv";
import DateRangePickerDropDown from './DateRangePickerDropDown';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./styles.css";
import Graph from "./Graph";
import moment from "moment";

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

    handleSelectStock = (selectedStock) => {
        this.setState({
            filteredData: this.getFilteredData(selectedStock, this.state.selectedStartDate, this.state.selectedEndDate),
            selectedStock: selectedStock
        });
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            filteredData: this.getFilteredData(this.state.selectedStock, selectedStartDate, selectedEndDate),
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
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
            <div className="app">
                <header className="App-header">
                    <h1 className="App-title">Stock Visualizer</h1>
                </header>
                <div className="App-intro">
                    <div className="Stock-selection">
                        <DropDown arrayOfData={this.state.stocks} onSelectChange={this.handleSelectStock}/> <br/><br/>
                    </div>
                    <div className="DateRange-selection">
                        <DateRangePickerDropDown
                            startDate={this.state.selectedStartDate}
                            endDate={this.state.selectedEndDate}
                            handleSelectDate={this.handleSelectDate}/>
                    </div>
                </div>
                <div>
                    <Graph data={this.state.filteredData} startDate={this.state.selectedStartDate}
                           endDate={this.state.selectedEndDate} stockName={this.state.selectedStock}/>
                </div>
            </div>
        );
    }

    getStocks = (data) => {
        const stocksNames = new Set();
        data.map(function (d) {
            return stocksNames.add(d.Name);
        });
        return Array.from(stocksNames);
    }
}

export default App;