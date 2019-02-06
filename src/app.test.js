import React from "react";
import axios from "./axios";
import App from "./app";

import ProfilePic from "./profilepic";
import { shallow } from "enzyme";

jest.mock("./axios");

test("Puts retrieved data in state", async () => {
    axios.get.mockResolvedValue({
        data: {
            first: "funky",
            last: "chicken",
            id: 1,
            url: "/default.jpg"
        }
    });
    const wrapper = shallow(<App />, { disableLifecycleMethods: true });

    expect(wrapper.find("ProfilePic").length).toBe(1);
});
