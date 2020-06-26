import {getFilteredData} from "../StockVisualizerUtil";
import moment from "moment";

describe("StockVisualizerUtil", () => {
    describe("filterData method tests", () => {
        let inputData, selectedStock, selectedStartDate, selectedEndDate;
        beforeEach(() => {
            inputData = [{
                Name: "AAL",
                close: 14.75,
                date: "2013-02-08",
                high: 15.12,
                low: 14.63,
                open: 15.07
            }, {
                Name: "AAL",
                close: 14.06,
                date: "2013-02-11",
                high: 15.01,
                low: 14.26,
                open: 14.89
            }, {
                Name: "AAL",
                close: 14.27,
                date: "2013-02-12",
                high: 14.51,
                low: 14.1,
                open: 14.45
            }];
            selectedStock = "AAPL";
            selectedStartDate = moment().subtract(7, "year").subtract(4, "month");
            selectedEndDate = moment().subtract(7, "year").subtract(3, "month");
        });

        it("should get filtered data undefined if the input data is null", () => {
            inputData = null;
            selectedStock = null;
            selectedStartDate = null;
            selectedEndDate = null;
            const data = getFilteredData(inputData, selectedStock, selectedStartDate, selectedEndDate);
            expect(data).toBe(null);
        });

        it("should not get stocks when selected invalid stock", () => {
            const data = getFilteredData(inputData, selectedStock, selectedStartDate, selectedEndDate);
            expect(data).toStrictEqual([]);
        });

        it("should get stocks when selected valid stock according to input data in the valid given date range", () => {
            selectedStock = "AAL";
            selectedStartDate = moment().subtract(7, "year").subtract(5, "month");
            const data = getFilteredData(inputData, selectedStock, selectedStartDate, selectedEndDate);
            expect(data.length).toEqual(3);
        });

        it("should get stocks when valid stock according to input data and not in range of given dates", () => {
            const data = getFilteredData(inputData, selectedStock, selectedStartDate, selectedEndDate);
            expect(data).toStrictEqual([]);
        });

        it("should get stocks when valid stock according to input data and no start and end dates had given", () => {
            selectedStartDate = null;
            selectedEndDate = null;
            const data = getFilteredData(inputData, selectedStock, selectedStartDate, selectedEndDate);
            expect(data).toStrictEqual([]);
        });
    });
});