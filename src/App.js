import React, {Component} from 'react';
import DropDown from './DropDown';
import * as d3 from 'd3';
import * as inputfile from "./all_stocks_5yr.csv";
import DateRangePickerDropDown from './DateRangePickerDropDown';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "./styles.css";
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
        }, this.createGraph);
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            filteredData: this.getFilteredData(this.state.selectedStock, selectedStartDate, selectedEndDate),
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
        }, this.createGraph);
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
                    <h2 className="App-title">Stock Visualizer</h2>
                </header>
                <div className="App-intro">
                    <h3 className={"stock-title"}>Stock:</h3>
                    <div className="Stock-selection">
                        <DropDown arrayOfData={this.state.stocks} onSelectChange={this.handleSelectStock}/> <br/><br/>
                    </div>
                    <h3 className={"date-range-title"}>Date Range:</h3>
                    <div className="DateRange-selection">
                        <DateRangePickerDropDown
                            startDate={this.state.selectedStartDate}
                            endDate={this.state.selectedEndDate}
                            handleSelectDate={this.handleSelectDate}/>
                    </div>
                </div>
                <div id={"graph"}/>
            </div>
        );
    }

    getStocks = (data) => {
        const stocksNames = new Set();
        data.map(function (d) {
            return stocksNames.add(d.Name);
        });
        return Array.from(stocksNames);
    };

    createGraph = () => {
        const width = 1200, height = 400, margin = 30, offset = 5;
        const dateFormat = d3.timeParse("%Y-%m-%d");
        const filterData = this.state.filteredData;
        d3.select("#graph svg").remove();
        if (filterData !== undefined && filterData.length > 0) {
            const svg = d3.select("#graph")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("padding-top", 40);
            const data = filterData.map(function (d) {
                return Object.assign({}, d);
            });
            data.forEach(function (d) {
                d.date = dateFormat(d.date);
                d.close = +d.close;
            });

            const minPrice = d3.min(data.map(function (d) {
                    return d.close;
                })),
                maxPrice = d3.max(data.map(function (d) {
                    return d.close;
                }));

            const minDate = this.state.selectedStartDate,
                maxDate = this.state.selectedEndDate;

            let minOffsetDate = d3.timeDay.offset(minDate, -offset);
            let maxOffsetDate = d3.timeDay.offset(maxDate, +offset);
            const dateDiff = maxDate - minDate;
            if (dateDiff % 30000000000 <= 1) {
                minOffsetDate = d3.timeMonth.offset(minDate, -offset);
                maxOffsetDate = d3.timeMonth.offset(maxDate, +offset);
            } else if (dateDiff > 2000000000) {
                minOffsetDate = d3.timeDay.offset(minDate, -offset);
                maxOffsetDate = d3.timeDay.offset(maxDate, +offset);
            }

            const xScale = d3.scaleTime()
                .range([0, width - 60]);
            const yScale = d3.scaleLinear()
                .range([height - 60, 0]);

            xScale.domain([minOffsetDate, maxOffsetDate]);
            yScale.domain([minPrice - offset, maxPrice + offset]);

            const xAxis = d3.axisBottom().scale(xScale)
                .tickSizeInner(-height)
                .tickSizeOuter(0)
                .tickPadding(10)
                .ticks(15);
            const yAxis = d3.axisRight().scale(yScale)
                .tickSizeInner(-width)
                .tickSizeOuter(0)
                .tickPadding(10)
                .ticks(15);

            svg.append("g")
                .attr("class", "xAxis")
                .attr("transform", "translate(0, " + (height - 50) + ")")
                .call(xAxis)
                .append("text")
                .attr("y", margin + 10)
                .attr("x", width / 2)
                .attr("text-anchor", "end")
                .attr("font-size", "16")
                .style("fill", "black")
                .text("Date");
            svg.select(".xAxis").append("svg:line")
                .style('stroke', 'black')
                .attr('class', 'line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', width - margin)
                .attr('y2', 0);

            svg.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width - 50) + ", 0)")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", margin + 10)
                .attr("x", -150)
                .attr("text-anchor", "end")
                .attr("font-size", "16")
                .style("fill", "black")
                .text("Stock Price");
            svg.select(".yAxis").append("svg:line")
                .style('stroke', 'black')
                .attr('class', 'line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', height - margin);

            const getTime = (date) => {
                if (typeof date === "string")
                    return date.getTime();
                else
                    return date;
            };

            const getMax = (a, b) => {
                return a < b ? b : a;
            };

            const getMin = (a, b) => {
                return a < b ? a : b;
            };

            svg.selectAll("rect")
                .data(data)
                .enter().append("svg:rect")
                .attr("x", (d) => {
                    return xScale(getTime(d.date));
                })
                .attr("y", (d) => {
                    return yScale(getMax(d.open, d.close));
                })
                .attr("height", (d) => {
                    return yScale(getMin(d.open, d.close)) - yScale(getMax(d.open, d.close));
                })
                .attr("width", (d) => {
                    return 0.3 * (width - 2 * margin) / data.length;
                })
                .attr("fill", (d) => {
                    return d.open > d.close ? "red" : "green";
                });
        }
    };
}

export default App;