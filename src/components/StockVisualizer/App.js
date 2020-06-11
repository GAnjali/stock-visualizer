import React, {Component} from 'react';
import StockSelector from './StockSelector';
import * as d3 from 'd3';
import * as stocksData from "../../data/all_stocks_5yr.csv";
import DateRangeSelector from './DateRangeSelector';
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import "../../styles/styles.css";
import moment from "moment";

const width = 1200, height = 350, margin = 30, offset = 5;

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

    handleSelectStock = (selectedStock) => {
        this.setState({
            filteredData: this.getFilteredData(selectedStock, this.state.selectedStartDate, this.state.selectedEndDate),
            selectedStock: selectedStock
        }, () => {
            this.createGraph(this.state.filteredData)
        });
    };

    handleSelectDate = (selectedStartDate, selectedEndDate) => {
        this.setState({
            filteredData: this.getFilteredData(this.state.selectedStock, selectedStartDate, selectedEndDate),
            selectedStartDate: selectedStartDate,
            selectedEndDate: selectedEndDate
        }, () => {
            this.createGraph(this.state.filteredData)
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
                    <h2 className="App-title">Stock Visualizer</h2>
                </header>
                <div className="App-intro">
                    <h3 className={"stock-title"}>Stock:</h3>
                    <div className="Stock-selection">
                        <StockSelector arrayOfData={this.state.stocks} onSelectChange={this.handleSelectStock}/>
                        <br/><br/>
                    </div>
                    <h3 className={"date-range-title"}>Date Range:</h3>
                    <div className="DateRange-selection">
                        <DateRangeSelector
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

    createGraph = (data) => {
        this.removeSVGIfPresent();
        if (data !== undefined && data.length > 0) {
            const formattedData = this.getFormattedData(data);
            const svg = this.createSVG();
            const [xScale, yScale] = this.createScales(formattedData);
            this.createAxes(svg, formattedData, [xScale, yScale]);
            this.drawRectangles(svg, formattedData, [xScale, yScale]);
            this.drawMedianLine(svg, formattedData, [xScale, yScale]);
        }
    };

    removeSVGIfPresent() {
        d3.select("#graph svg").remove();
    }

    createSVG() {
        return d3.select("#graph")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("padding-top", 40);
    }

    getFormattedData(filterData) {
        const dateFormat = d3.timeParse("%Y-%m-%d");
        const data = filterData.map(function (d) {
            return Object.assign({}, d);
        });
        data.forEach(function (d) {
            d.date = dateFormat(d.date);
            d.close = +d.close;
        });
        return data;
    }

    getMinPrice(data) {
        return d3.min(data.map(function (d) {
            return d.close;
        }));
    }

    getMaxPrice(data) {
        return d3.max(data.map(function (d) {
            return d.close;
        }));
    }

    getOffsetDates(startDate, endDate) {
        let minOffsetDate = d3.timeDay.offset(startDate, -offset);
        let maxOffsetDate = d3.timeDay.offset(endDate, +offset);
        const dateDiff = endDate - startDate;
        if (dateDiff % 30000000000 <= 1) {
            minOffsetDate = d3.timeMonth.offset(startDate, -offset);
            maxOffsetDate = d3.timeMonth.offset(endDate, +offset);
        } else if (dateDiff > 2000000000) {
            minOffsetDate = d3.timeDay.offset(startDate, -offset);
            maxOffsetDate = d3.timeDay.offset(endDate, +offset);
        }
        return [minOffsetDate, maxOffsetDate];
    }

    createXAxis(scale, size, ticks) {
        return d3.axisBottom().scale(scale)
            .tickSizeInner(size)
            .tickSizeOuter(0)
            .tickPadding(10)
            .ticks(ticks);
    }

    createYAxis(scale, size, ticks) {
        return d3.axisRight().scale(scale)
            .tickSizeInner(size)
            .tickSizeOuter(0)
            .tickPadding(10)
            .ticks(ticks);
    }

    createAxes(svg, data, scales) {
        console.log(scales);
        const xAxis = this.createXAxis(scales[0], -height, 15);
        const yAxis = this.createYAxis(scales[1], -width, 15);
        this.appendXAxisToSVG(svg, xAxis);
        this.appendYAxisToSVG(svg, yAxis);
    };

    createScales = (data) => {
        const minPrice = this.getMinPrice(data),
            maxPrice = this.getMaxPrice(data);
        const offsetDates = this.getOffsetDates(this.state.selectedStartDate, this.state.selectedEndDate);
        const minOffsetDate = offsetDates[0];
        const maxOffsetDate = offsetDates[1];

        const xScale = d3.scaleTime()
            .range([0, width - 60]);
        const yScale = d3.scaleLinear()
            .range([height - 60, 0]);

        xScale.domain([minOffsetDate, maxOffsetDate]);
        yScale.domain([minPrice - offset, maxPrice + offset]);

        return [xScale, yScale];
    };

    appendXAxisToSVG(svg, xAxis) {
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
    }

    appendYAxisToSVG(svg, yAxis) {
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
    }

    getFormattedTime = (date) => {
        if (typeof date === "string")
            return date.getTime();
        else
            return date;
    };

    getMax = (a, b) => {
        return a < b ? b : a;
    };

    getMin = (a, b) => {
        return a < b ? a : b;
    };

    drawRectangles(svg, data, scales) {
        const [xScale, yScale] = scales;
        svg.selectAll("rect")
            .data(data)
            .enter().append("svg:rect")
            .attr("x", (d) => {
                return xScale(this.getFormattedTime(d.date));
            })
            .attr("y", (d) => {
                return yScale(this.getMax(d.open, d.close));
            })
            .attr("height", (d) => {
                return yScale(this.getMin(d.open, d.close)) - yScale(this.getMax(d.open, d.close));
            })
            .attr("width", (d) => {
                return 0.3 * (width - 2 * margin) / data.length;
            })
            .attr("fill", (d) => {
                return d.open > d.close ? "red" : "green";
            });
    }

    drawMedianLine(svg, data, scales) {
        const [xScale, yScale] = scales;
        const medianAvgPrice = this.getMedianAveragePrice(data);

        const medianLine = svg.append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * medianAvgPrice + ")";
            });
        medianLine.append("svg:line")
            .style('stroke', '#63c98c')
            .attr('class', 'line')
            .attr('x1', 0)
            .attr('y1', yScale(medianAvgPrice))
            .attr('x2', width - margin - 20)
            .attr('y2', yScale(medianAvgPrice));
        medianLine.append("rect")
            .attr("class", "median")
            .attr("x", width - margin - 20)
            .attr("y", yScale(medianAvgPrice + 1))
            .attr("height", 12)
            .attr("width", 30)
            .attr("fill", "#63c98c");

        medianLine.append("text")
            .attr("x", width - margin - 20)
            .attr("y", yScale(medianAvgPrice + 1))
            .attr("dy", "1em")
            .attr("font-size", "xx-small")
            .attr("text-align", "center")
            .attr("color", "white")
            .text(medianAvgPrice.toFixed(2));
    }

    getMedianAveragePrice(data) {
        return d3.median(data.map((d) => {
            return parseInt(d.high + d.low / 2)
        }));
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
}

export default App;