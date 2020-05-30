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
            selectedStartDate: moment().subtract(7, "year").subtract(3, "month"),
            selectedEndDate: moment().subtract(7, "year").subtract(3, "month"),
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        let filteredData = null;
        if (this.state.selectedStartDate !== prevState.selectedStartDate || this.state.selectedEndDate !== prevState.selectedEndDate) {
            const inputData = this.state.stockData;
            filteredData = inputData.filter((record) => {
                    if (record.date >= this.state.selectedStartDate && record.date <= this.state.selectedEndDate)
                        return record;
                }
            );
            this.setState({
                filteredData: filteredData
            })
        }
    }

    handleSelectStock = (selectedStock) => {
        this.setState({
            selectedStock: selectedStock
        });
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
        });
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
                    <Graph data={this.state.stockData} startDate={this.state.selectedStartDate}
                           endDate={this.state.selectedEndDate}/>
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