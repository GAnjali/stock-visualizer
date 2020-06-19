import * as d3 from "d3";
import moment from "moment";

const width = 1200, height = 450, margin = 30;

const createGraph = (mfStocksData, unSelectedStocksData, startDate, endDate) => {
    endDate = moment().subtract(7, "year").subtract(2, "month");
    removeSVGIfPresent();
    const svg = createSVG();
    const [xScale, yScale] = createScales(startDate, endDate);
    createAxes(svg, [xScale, yScale]);
    createChart(svg, mfStocksData, [xScale, yScale]);
};

const removeSVGIfPresent = () => {
    d3.select("#graph svg").remove();
};

const createSVG = () => {
    return d3.select("#graph")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("padding-top", 40);
};

const createScales = (startDate, endDate) => {
    const xScale = d3.scaleTime()
        .range([0, width - 60]);
    const yScale = d3.scaleLinear()
        .range([height - 50, 0]);
    console.log(startDate);
    xScale.domain([startDate, endDate]);
    yScale.domain([-20, 100]);

    return [xScale, yScale];
};

const createAxes = (svg, scales) => {
    const xAxis = createXAxis(scales[0], -height - 20, 20);
    const yAxis = createYAxis(scales[1], -width, 15);
    appendXAxis(svg, xAxis);
    appendYAxis(svg, yAxis);
};

const createXAxis = (scale, size, ticks) => {
    return d3.axisBottom().scale(scale)
        .tickSizeInner(size)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(ticks);
};

const createYAxis = (scale, size, ticks) => {
    return d3.axisLeft().scale(scale)
        .tickSizeInner(size)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(ticks);
};

const appendXAxis = (svg, xAxis) => {
    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(30, " + (height - 50) + ")")
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
        .attr('x1', 25)
        .attr('y1', -65)
        .attr('x2', width - margin)
        .attr('y2', -65);
};

const appendYAxis = (svg, yAxis) => {
    svg.append("g")
        .attr("class", "yAxis")
        .attr("transform", "translate(" + 55 + ", 0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
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
        .attr('y2', height - 50);
};

const createChart = (svg, stocksData, scales) => {
    const [xScale, yScale] = scales;
    var lineFunc = d3.line()
        .x(function (d) {
            return xScale(d.date);
        })
        .y(function (d) {
            return yScale(d.value);
        });

    var parseTime = d3.timeParse("%Y-%m-%d");
    const filteredStocks = Array.from(stocksData).map((stock) => {
        return {
            date: moment(parseTime(stock[0])),
            value: stock[1]
        };
    });
    svg.append("path")
        .data([filteredStocks])
        .attr("class", "mf-stock")
        .attr("d", lineFunc);
};

export default createGraph;