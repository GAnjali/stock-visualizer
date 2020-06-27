import * as d3 from "d3";
import * as stocksData from "./all_stocks_5yr.csv";

export const readStockData = async () => {
    const data = await d3.csv(stocksData, function (d) {
        return {
            date: d.date,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            Name: d.Name,
        };
    });
    return [data, getStocks(data)];
};

const getStocks = (data) => {
    const stocksNames = new Set();
    data.map(function (d) {
        return stocksNames.add(d.Name);
    });
    return Array.from(stocksNames);
};