import React, {Component} from 'react';
import DropDown from './DropDown';
import * as d3 from 'd3';
import * as inputfile from "./all_stocks_5yr.csv";
import DateRangePickerDropDown from './DateRangePickerDropDown';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./styles.css";
import Graph from "./Graph";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedValue: 'Nothing selected',
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

    handleSelectChange = (selectedValue) => {
        this.setState({
            selectedValue: selectedValue
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
                        <DropDown arrayOfData={this.state.stocks} onSelectChange={this.handleSelectChange}/> <br/><br/>
                    </div>
                    <div className="DateRange-selection">
                        <DateRangePickerDropDown/>
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