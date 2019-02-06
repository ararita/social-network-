import React from "react";
import axios from "./axios";
import { BioEditor } from "./bioeditor";
import { shallow } from "enzyme";
jest.mock("./axios");

// 1. When no bio is passed to it, an "Add" button is rendered.

//ako stavimo x ispred, onda ce u rezultatu biti skipped, tako da znamo koji test je je zavrsen
test('When no bio is passed to it, an "Add" button is rendered', () => {
    const wrapper = shallow(<BioEditor text={null} />);
    expect(wrapper.find("button").contains("Add your bio")).toBe(true);
});

// 2. When a bio is passed to it, an "Edit" button is rendered.
test('When a bio is passed to it, an "Edit" button is rendered', () => {
    const wrapper = shallow(<BioEditor text={!null} />);
    expect(wrapper.find("button").contains("update")).toBe(true);
});

// 3. Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered.

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find("button").simulate("click", {
        preventDefault: () => {}
    });
    expect(wrapper.find("button").contains("save")).toBe(true);
});

test('Clicking either the "Add" or "Edit" button causes a textarea and a "Save" button to be rendered', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find("button").simulate("click", {
        preventDefault: () => {}
    });
    expect(wrapper.contains(<textarea />));
});

// 4. Clicking the "Save" button causes an ajax request. The request should not actually happen during your test. To prevent it from actually happening, you should mock axios.

test('Clicking the "Save" button causes an ajax request', () => {
    const wrapper = shallow(<BioEditor />);
    wrapper.find("button").simulate("click", {
        preventDefault: () => {}
    });
    expect(
        axios.post.mockResolvedValue({
            data: { bio: "" }
        })
    );
});
//
// 5. When the mock request is successful, the function that was passed as a prop to the component gets called.
