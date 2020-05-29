import * as d3 from 'd3';
import React from "react";

const Graph = (props) => {
    const width = 6000, height = 3000, margin = 50;
    const dateFormat = d3.timeParse("%Y-%m-%d");

    if (props.data !== undefined && props.data.length > 0) {
        const svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        props.data.forEach(function (d) {
            d.date = dateFormat(d.date);
            d.close = +d.close;
        });

        const minPrice = d3.min(props.data.map(function (d) {
                return d.close;
            })),
            maxPrice = d3.max(props.data.map(function (d) {
                return d.close;
            }));

        const xScale = d3.scaleTime()
            .range([margin, width - 100]);

        const yScale = d3.scaleLinear()
            .range([height - 100, margin]);

        const xAxis = d3.axisBottom().scale(xScale)
            .ticks(40);
        const yAxis = d3.axisLeft().scale(yScale)
            .ticks(30);

        xScale.domain(d3.extent(props.data, function (d) {
            return d.date;
        }));
        yScale.domain([minPrice, maxPrice]);

        svg.append("g")
            .attr("transform", "translate(0, " + (height - 100) + ")")
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + margin + ", 0)")
            .call(yAxis);
    }
    return <div></div>;
};

export default Graph;