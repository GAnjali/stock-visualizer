import {shallow} from "enzyme";
import React from "react";
import DateRangeSelector from "../DateRangeSelector";

describe("DateRangeSelectorTests", () => {
    it("Should render without crashing", () => {
        shallow(<DateRangeSelector/>);
    });

    it('should match the DateRangeSelector snapshot', function () {
        const dashboardComponent = shallow(<DateRangeSelector/>);
        expect(dashboardComponent).toMatchSnapshot();
    });
});