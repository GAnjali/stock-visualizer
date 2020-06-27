import {getFilteredStocksData, getNonMfStockNames, readConfigData} from "../CompareAppUtil";
import moment from "moment";

describe("CompareStockUtil Tests", () => {
    describe("getNonMfStockNames method tests", () => {
        let stocksData, mfStockNames;
        beforeEach(() => {
            stocksData = ["AAP", "AAL", "AAPL"];
            mfStockNames = ["AAL"];
        });

        it("should get non mf stocks as null if the input data is null", () => {
            stocksData = null;
            mfStockNames = [];
            const data = getNonMfStockNames(stocksData, mfStockNames);
            expect(data).toBe(null);
        });

        it("should get non mf stocks if the stocks, mf stocks is given", () => {
            const data = getNonMfStockNames(stocksData, mfStockNames);
            expect(data.length).toBe(2);
            expect(data.includes("AAP")).toBe(true);
        });

        it("should get non mf stocks if the stocks is given, mf stocks is given as null", () => {
            mfStockNames = null;
            const data = getNonMfStockNames(stocksData, mfStockNames);
            expect(data.length).toBe(3);
            expect(data.includes("AAL")).toBe(true);
        });
    });

    describe("getFilteredStocksData method tests", () => {
        let stocksData, stocks, selectedDate;
        beforeEach(() => {
            stocksData = [{
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
                Name: "AAP",
                close: 14.27,
                date: "2013-02-08",
                high: 14.51,
                low: 14.1,
                open: 14.45
            }, {
                Name: "AAP",
                close: 14.30,
                date: "2013-02-11",
                high: 14.69,
                low: 14.1,
                open: 14.10
            }];
            stocks = ["AAP"];
            selectedDate = moment().subtract(7, "year").subtract(4, "month");
        });

        it("should get filtered data null if the input data is null", () => {
            stocksData = null;
            selectedDate = null;
            stocks = null;
            const data = getFilteredStocksData(stocks, stocksData, selectedDate);
            expect(data).toBe(null);
        });

        it("should not get filtered stocks when there is empty stocks and stockData", () => {
            stocks = [];
            stocksData = [];
            const data = getFilteredStocksData(stocks, stocksData, selectedDate);
            expect(data).toStrictEqual(new Map());
        });

        it("should get filtered stocks when stocks and stocksData wit valid given date range", () => {
            const data = getFilteredStocksData(stocks, stocksData, selectedDate);
            expect(data.size).toEqual(1);
        });

        it("should get stocks when valid stock according to input data and in range of given dates", () => {
            selectedDate = moment("2013-02-08");
            const data = getFilteredStocksData(stocks, stocksData, selectedDate);
            expect(data.has("AAP")).toBe(true);
            expect(data.get("AAP").has("2013-02-11")).toBe(true);
        });
    });

    describe("readConfigData tests", () => {
        it("should get data when called readConfigData", () => {
            const [mfStockNames, mfStocksPercentages] = readConfigData();
            expect(mfStockNames !== undefined).toBe(true);
            expect(mfStocksPercentages !== undefined).toBe(true);
            expect(mfStockNames.length > 0).toBe(true);
            expect(mfStocksPercentages.length > 0).toBe(true);
        })
    })
});