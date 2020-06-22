import * as d3 from "d3";
import moment from "moment";

const width = 1200, height = 450, margin = 30;

const createGraph = (mfStocksData, nonMfStocksData, startDate, endDate) => {
    removeSVGIfPresent();
    const svg = createSVG();
    const [xScale, yScale] = createScales(startDate, endDate, mfStocksData, nonMfStocksData);
    createAxes(svg, [xScale, yScale]);
    createChart(svg, mfStocksData, [xScale, yScale], true);
    createChart(svg, nonMfStocksData, [xScale, yScale], false);
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

const getMinPercentage = (mfStocksData, nonMfStocksData) => {
    return d3.min([d3.min(Array.from(mfStocksData.keys()).map((date) => {
        return mfStocksData.get(date);
    })), d3.min(Array.from(nonMfStocksData.keys()).map((date) => {
        return nonMfStocksData.get(date);
    }))]);
};

const getMaxPercentage = (mfStocksData, nonMfStocksData) => {
    return d3.max(
        [d3.max(Array.from(mfStocksData.keys()).map((date) => {
            return mfStocksData.get(date);
        })), d3.max(Array.from(nonMfStocksData.keys()).map((date) => {
            return nonMfStocksData.get(date);
        }))])
};

const createScales = (startDate, endDate, mfStocksData, nonMfStocksData) => {
    const xScale = d3.scaleTime()
        .range([0, width - 60]);
    const yScale = d3.scaleLinear()
        .range([height - 50, 0]);
    const minOffsetDate = getOffsetDates(startDate, endDate);
    const minPercentage = getMinPercentage(mfStocksData, nonMfStocksData);
    const maxPercentage = getMaxPercentage(mfStocksData, nonMfStocksData);
    const offsetMinPercentage = minPercentage - (maxPercentage - minPercentage) / 7;
    const offsetMaxPercentage = maxPercentage + (maxPercentage - minPercentage) / 7;
    xScale.domain([minOffsetDate, endDate]);
    yScale.domain([offsetMinPercentage, offsetMaxPercentage]);

    return [xScale, yScale];
};

const getOffsetDates = (startDate, endDate) => {
    const offset = 3;
    let minOffsetDate = d3.timeDay.offset(startDate, -offset);
    const dateDiff = endDate - startDate;
    if (dateDiff % 30000000000 <= 1) {
        minOffsetDate = d3.timeMonth.offset(startDate, -offset);
    } else if (dateDiff > 2000000000) {
        minOffsetDate = d3.timeDay.offset(startDate, -offset);
    }
    return minOffsetDate;
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

const createChart = (svg, stocksData, scales, isMf) => {
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
    const className = isMf ? "mf-stock" : "non-mf-stock";
    svg.append("path")
        .data([filteredStocks])
        .attr("class", className)
        .attr("d", lineFunc);
};

export default createGraph;