import {shallow} from "enzyme";
import React from "react";
import DatePicker from "../DatePicker";

describe("DatePickerTests", () => {
    it("Should render without crashing", () => {
        shallow(<DatePicker/>);
    });

    it('should match the DatePicker snapshot', function () {
        const dashboardComponent = shallow(<DatePicker/>);
        expect(dashboardComponent).toMatchSnapshot();
    });
});