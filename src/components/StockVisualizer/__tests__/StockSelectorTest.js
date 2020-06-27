import React from "react";
import {shallow} from "enzyme";
import StockSelector from "../StockSelector";

describe("StockSelector Tests", () => {
    it("Should render without crashing", () => {
        shallow(<StockSelector stocks={[]}/>);
    });

    it('should match the Home snapshot', function () {
        const stockSelectorComponent = shallow(<StockSelector stocks={[]}/>);
        expect(stockSelectorComponent).toMatchSnapshot();
    });
});
