import * as d3 from "d3";

export const getFilteredData = (inputData, selectedStock, selectedStartDate, selectedEndDate) => {
    let filteredData = null;
    const dateFormat = d3.timeParse("%Y-%m-%d");
    if (inputData !== undefined && inputData !== null && inputData.length !== 0) {
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
    }
    return filteredData;
};