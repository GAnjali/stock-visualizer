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

    componentDidMount() {
        const width = 1300, height = 500;
        d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
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
        const width = 1300, height = 500, margin = 30, offset = 5;
        const dateFormat = d3.timeParse("%Y-%m-%d");
        const filterData = this.state.filteredData;
        const svg = d3.select("#graph svg");
        svg.selectAll('*').remove();
        if (filterData !== undefined && filterData.length > 0) {
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
                .range([margin, width - 100]);
            const yScale = d3.scaleLinear()
                .range([height - 100, margin]);

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
                .attr("transform", "translate(0, " + (height - 100) + ")")
                .call(xAxis);
            svg.select(".xAxis").append("svg:line")
                .style('stroke', 'black')
                .attr('class', 'line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', width - 100)
                .attr('y2', 0);

            svg.append("g")
                .attr("class", "yAxis")
                .attr("transform", "translate(" + (width - 100) + ", 0)")
                .call(yAxis);

            svg.select(".yAxis").append("svg:line")
                .style('stroke', 'black')
                .attr('class', 'line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', 0)
                .attr('y2', height - 100);

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