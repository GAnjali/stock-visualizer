import * as d3 from "d3";

const width = 1200, height = 350, margin = 30, offset = 5;

const createGraph = (data, startDate, endDate) => {
    removeSVGIfPresent();
    if (data !== undefined && data.length > 0) {
        const formattedData = getFormattedData(data);
        const svg = createSVG();
        const [xScale, yScale] = createScales(formattedData, startDate, endDate);
        createAxes(svg, formattedData, [xScale, yScale]);
        drawRectangles(svg, formattedData, [xScale, yScale]);
        drawMedianLine(svg, formattedData, [xScale, yScale]);
    }
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

function getCopyObject(filterData) {
    return filterData.map(function (d) {
        return Object.assign({}, d);
    });
}

const getFormattedData = (filterData) => {
    const dateFormat = d3.timeParse("%Y-%m-%d");
    const data = getCopyObject(filterData);
    data.forEach(function (d) {
        d.date = dateFormat(d.date);
        d.close = +d.close;
    });
    return data;
};

const getMinPrice = (data) => {
    return d3.min(data.map(function (d) {
        return d.close;
    }));
};

const getMaxPrice = (data) => {
    return d3.max(data.map(function (d) {
        return d.close;
    }));
};

const getOffsetDates = (startDate, endDate) => {
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
};

const createXAxis = (scale, size, ticks) => {
    return d3.axisBottom().scale(scale)
        .tickSizeInner(size)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(ticks);
};

const createYAxis = (scale, size, ticks) => {
    return d3.axisRight().scale(scale)
        .tickSizeInner(size)
        .tickSizeOuter(0)
        .tickPadding(10)
        .ticks(ticks);
};

const createAxes = (svg, data, scales) => {
    const xAxis = createXAxis(scales[0], -height, 15);
    const yAxis = createYAxis(scales[1], -width, 15);
    appendXAxis(svg, xAxis);
    appendYAxis(svg, yAxis);
};

const createScales = (data, startDate, endDate) => {
    const minPrice = getMinPrice(data),
        maxPrice = getMaxPrice(data);
    const [minOffsetDate, maxOffsetDate] = getOffsetDates(startDate, endDate);
    const xScale = d3.scaleTime()
        .range([0, width - 60]);
    const yScale = d3.scaleLinear()
        .range([height - 60, 0]);
    xScale.domain([minOffsetDate, maxOffsetDate]);
    yScale.domain([minPrice - offset, maxPrice + offset]);

    return [xScale, yScale];
};

const appendXAxis = (svg, xAxis) => {
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
};

const appendYAxis = (svg, yAxis) => {
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
};

const getFormattedTime = (date) => {
    if (typeof date === "string")
        return date.getTime();
    else
        return date;
};

const getMax = (number1, number2) => {
    return number1 < number2 ? number2 : number1;
};

const getMin = (number1, number2) => {
    return number1 < number2 ? number1 : number2;
};

const drawRectangles = (svg, data, scales) => {
    const [xScale, yScale] = scales;
    svg.selectAll("rect")
        .data(data)
        .enter().append("svg:rect")
        .attr("x", (d) => {
            return xScale(getFormattedTime(d.date));
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
    drawRectanglesStem(svg, data, scales);
};

const drawRectanglesStem = (svg, data, scales) => {
    const [xScale, yScale] = scales;
    svg.selectAll("line.stem")
        .data(data)
        .enter().append("line")
        .attr("class", "stem")
        .attr("x1", function (d) { return xScale(d["date"]) + 0.15 * (width - 2 * margin) / data.length; })
        .attr("x2", function (d) { return xScale(d["date"]) + 0.15 * (width - 2 * margin) / data.length; })
        .attr("y1", function (d) { return yScale(d["high"]); })
        .attr("y2", function (d) { return yScale(d["low"]); })
        .attr("stroke", function (d) { return d.open > d.close ? "red" : "green"; });
};

const drawMedianLine = (svg, data, scales) => {
    const [xScale, yScale] = scales;
    const medianAvgPrice = getMedianAveragePrice(data);

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
};

const getMedianAveragePrice = (data) => {
    return d3.median(data.map((d) => {
        return parseInt(d.high + d.low / 2)
    }));
};

export default createGraph;