import * as d3 from 'd3';
import React, {Component} from "react";

class Graph extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            startDate: this.props.startDate,
            endDate: this.props.endDate
        }
    }

    componentDidMount() {
        this.createGraph();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.startDate !== prevProps.startDate || this.state.startDate !== prevState.startDate || this.props.endDate !== prevProps.endDate || this.state.endDate !== prevState.endDate || this.props.stockName !== prevProps.stockName) {
            d3.select("svg").remove();
            this.createGraph();
        }
    }

    createGraph = () => {
        const width = 1300, height = 500, margin = 30;
        const dateFormat = d3.timeParse("%Y-%m-%d");

        if (this.props.data !== undefined && this.props.data.length > 0) {
            const svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height);
            const data = this.props.data.map(function (d) {
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

            const xScale = d3.scaleTime()
                .range([margin, width - 100]);

            const yScale = d3.scaleLinear()
                .range([height - 100, margin]);

            const xAxis = d3.axisBottom().scale(xScale)
                .ticks(15);
            const yAxis = d3.axisRight().scale(yScale)
                .ticks(20);

            xScale.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            yScale.domain([minPrice, maxPrice]);

            svg.append("g")
                .attr("transform", "translate(0, " + (height - 100) + ")")
                .call(xAxis);

            svg.append("g")
                .attr("transform", "translate(" + (width - 100) + ", 0)")
                .call(yAxis);

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
                    return 0.5 * (width - 2 * margin) / data.length;
                })
                .attr("fill", (d) => {
                    return d.open > d.close ? "red" : "green";
                });
        }
    };

    render() {
        return <div></div>
    }
}

export default Graph;