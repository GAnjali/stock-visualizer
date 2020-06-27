import {getNonMfStockNames} from "../CompareAppUtil";

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
    })
});