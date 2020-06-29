import React, {Component} from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import moment from "moment";
import createGraph from "./Graph";
import Dashboard from "./Dashboard";
import {getFilteredData} from "./StockVisualizerUtil";
import {readStockData} from "../../data/dataloader";

class StockVisualizer extends Component {
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

    componentDidMount = async () => {
        const [stocksData, stocks] = await readStockData();
        if (stocksData !== null && stocks !== null && stocks !== undefined && stocksData !== undefined) {
            this.setState({
                stocksData: stocksData,
                stocks: stocks
            })
        }
    };

    handleSelectStock = (selectedStock) => {
        this.setState({
            filteredData: getFilteredData(this.state.stocksData, selectedStock, this.state.selectedStartDate, this.state.selectedEndDate),
            selectedStock: selectedStock
        }, () => {
            createGraph(this.state.filteredData, this.state.selectedStartDate, this.state.selectedEndDate)
        });
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            filteredData: getFilteredData(this.state.stocksData, this.state.selectedStock, selectedStartDate, selectedEndDate),
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
        }, () => {
            createGraph(this.state.filteredData, this.state.selectedStartDate, this.state.selectedEndDate)
        });
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

export default StockVisualizer;