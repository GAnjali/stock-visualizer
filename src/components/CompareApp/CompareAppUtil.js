import * as d3 from "d3";
import moment from "moment";

export const getNonMfStockNames = (stocks, mfStockNames) => {
    return stocks.filter((stockName) => {
        return !mfStockNames.includes(stockName);
    })
};

export const getFilteredStocksData = (stocksNames, stocksData, selectedDate) => {
    const filteredStocksMap = new Map();
    stocksNames.map((stockName) => {
        filteredStocksMap.set(stockName, getOpenPricesByDay(stockName, stocksData, selectedDate));
    });
    return filteredStocksMap;
};

const getOpenPricesByDay = (stockName, stocksData, selectedDate) => {
    const openPriceByDay = new Map();
    stocksData.map((stock) => {
        if (stock.Name === stockName && getFormattedDate(stock.date) > selectedDate) {
            openPriceByDay.set(stock.date, stock.open);
        }
    });
    return openPriceByDay;
};

const getFormattedDate = (date) => {
    const dateFormat = d3.timeParse("%Y-%m-%d");
    if (typeof date === "string")
        return dateFormat(date);
    return date;
};

export const readConfigData = () => {
    const mfStocks = process.env.REACT_APP_STOCKS_PERCENTAGES.split(",");
    const mfStockNames = [];
    const mfStockPercentages = [];
    mfStocks.map((mfStock) => {
        const stocksValues = mfStock.split(':');
        mfStockNames.push(stocksValues[0].trim());
        mfStockPercentages.push(stocksValues[1].trim());
    });
    return [mfStockNames, mfStockPercentages];
};

export const getPorLPercentagesByDay = (stocksNames, stocksData, startDate, endDate, selectedDate) => {
    const percentagesByDay = new Map();
    let currentDate = Object.assign({}, startDate);
    const boughtPricesForStocks = getBoughtPricesPerStock(stocksData, selectedDate);
    while (moment(currentDate).isBefore(moment(endDate))) {
        percentagesByDay.set(moment(currentDate).format("YYYY-MM-DD"), getPercentage(currentDate, boughtPricesForStocks, stocksNames, stocksData));
        currentDate = getNextDay(currentDate);
    }
    return percentagesByDay;
};

const getBoughtPricesPerStock = (stocksData, selectedDate) => {
    const boughtPricesPerStock = new Map();
    Array.from(stocksData.keys()).map((stockName) => {
        boughtPricesPerStock.set(stockName, getPrice(selectedDate, stocksData.get(stockName)))
    });
    return boughtPricesPerStock;
};

const getPrice = (date, stockData) => {
    let presentDay = date;
    let boughtPrice = null;
    const dateFormat = d3.timeParse("%Y-%m-%d");
    do {
        const nextDay = getNextDay(presentDay).format("YYYY-MM-DD");
        boughtPrice = stockData.get(nextDay);
        presentDay = moment(dateFormat(nextDay));
    } while (boughtPrice === undefined || boughtPrice === "" || boughtPrice === null);
    return boughtPrice;
};

const getNextDay = (date) => {
    const day = Object.assign({}, date);
    return moment(day).add(1, "days");
};

const getPercentage = (date, boughtPrices, stockNames, stocksData) => {
    let percentageSum = 0;
    const formattedDate = moment(date);
    stockNames.map((stock) => {
        const boughtPriceOfStock = boughtPrices.get(stock);
        const openPrice = getPrice(formattedDate, stocksData.get(stock));
        const percentageOfStock = ((openPrice - boughtPriceOfStock) / boughtPriceOfStock) * 100;
        if (isNaN(percentageOfStock))
            return 0;
        percentageSum = percentageSum + percentageOfStock;
    });

    return percentageSum / stockNames.length;
};