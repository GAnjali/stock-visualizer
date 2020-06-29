import React, {Component} from 'react';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import moment from "moment";
import createGraph from "./Graph";
import Dashboard from "./Dashboard";
import {readStockData} from "../../data/dataloader";
import {getFilteredStocksData, getNonMfStockNames, getPorLPercentagesByDay, readConfigData} from "./CompareAppUtil";

class CompareStocks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amountToInvest: null,
            date: moment().subtract(7, "year").subtract(4, "month"),
            stocksData: [],
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
        const [mfStockNames, mfStockPercentages] = readConfigData();
        if (mfStockNames !== null && mfStockPercentages !== null && mfStockNames !== undefined && mfStockPercentages !== undefined)
            this.setState({
                mfStockNames: mfStockNames,
                mfStockPercentages: mfStockPercentages
            });
    }

    componentDidMount = async () => {
        const [stocksData, stocks] = await readStockData();
        if (stocksData !== null && stocks !== null && stocks !== undefined && stocksData !== undefined) {
            this.setState({
                stocksData: stocksData,
                stocks: stocks
            }, this.renderGraph)
        }
    };

    renderGraph() {
        if (this.state.date !== null && this.state.amountToInvest !== null && this.state.mfStockNames.length !== 0) {
            const mfStocksData = getFilteredStocksData(this.state.mfStockNames, this.state.stocksData, this.state.date);
            const nonMfStocksNames = getNonMfStockNames(this.state.stocks, this.state.mfStockNames);
            const nonMfStocksData = getFilteredStocksData(nonMfStocksNames, this.state.stocksData, this.state.date);

            const endDate = moment("2018-02-07");
            const startDate = moment(endDate).subtract(parseInt(process.env.REACT_APP_COMPARE_STOCKS_MONTH_STOCKS), "month");
            const mfStockPercentagesByDay = getPorLPercentagesByDay(this.state.mfStockNames, mfStocksData, startDate, endDate, this.state.date);
            const nonMfStocksPercentagesByDay = getPorLPercentagesByDay(nonMfStocksNames, nonMfStocksData, startDate, endDate, this.state.date);

            createGraph(mfStockPercentagesByDay, nonMfStocksPercentagesByDay, startDate, endDate);
        }
    }

    render() {
        return (
            <Dashboard amountToInvest={this.state.amountToInvest} date={this.state.date}
                       handleAmountInput={this.handleAmountInput} handleDateChange={this.handleDateChange}/>
        )
    }
}

export default CompareStocks;