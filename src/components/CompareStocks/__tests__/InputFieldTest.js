import {shallow} from "enzyme";
import React from "react";
import InputField from "../InputField";

describe("InputFieldTests", () => {
    it("Should render without crashing", () => {
        shallow(<InputField/>);
    });

    it('should match the InputField snapshot', function () {
        const valueFormComponent = shallow(<InputField/>);
        expect(valueFormComponent).toMatchSnapshot();
    });
});