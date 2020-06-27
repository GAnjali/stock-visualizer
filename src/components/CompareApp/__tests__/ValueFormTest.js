import {shallow} from "enzyme";
import React from "react";
import ValueForm from "../ValueForm";

describe("ValueFormTests", () => {
    it("Should render without crashing", () => {
        shallow(<ValueForm/>);
    });

    it('should match the ValueForm snapshot', function () {
        const valueFormComponent = shallow(<ValueForm/>);
        expect(valueFormComponent).toMatchSnapshot();
    });
});