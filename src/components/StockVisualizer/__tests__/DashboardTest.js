import React from "react";
import {shallow} from "enzyme";
import Dashboard from "../Dashboard";

describe("Dashboard", () => {

    it("Should render without crashing", () => {
        shallow(<Dashboard />);
    });

    it('should match the Home snapshot', function () {
        const dashboardComponent = shallow(<Dashboard />);
        expect(dashboardComponent).toMatchSnapshot();
    });
});
