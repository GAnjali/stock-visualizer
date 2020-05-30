import React, {Component} from 'react';
import DropDown from './DropDown';
import * as d3 from 'd3';
import * as inputfile from "./all_stocks_5yr.csv";
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
            selectedStartDate: moment(),
            selectedEndDate: moment(),
            arrayOfData: [],
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
                arrayOfData: data,
                stocks: this.getStocks(data)
            })
        });
    }

    handleSelectStock = (selectedStock) => {
        this.setState({
            selectedStock: selectedStock
        });
    };

    handleSelectStartDate = (selectedStartDate) => {
        this.setState({
            selectedStartDate: selectedStartDate
        });
    };

    handleSelectEndDate = (selectedEndDate) => {
        this.setState({
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
                            handleSelectStartDate={this.handleSelectStartDate}
                            handleSelectEndDate={this.handleSelectEndDate}/>
                    </div>
                </div>
                <div>
                    <Graph data={this.state.arrayOfData}/>
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