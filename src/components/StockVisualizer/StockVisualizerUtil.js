import * as d3 from "d3";
import * as stocksData from "../../data/all_stocks_5yr.csv";

const getStocks = (data) => {
    const stocksNames = new Set();
    data.map(function (d) {
        return stocksNames.add(d.Name);
    });
    return Array.from(stocksNames);
};

export const getFilteredData = (inputData, selectedStock, selectedStartDate, selectedEndDate) => {
    let filteredData;
    const dateFormat = d3.timeParse("%Y-%m-%d");
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