import {
  render,
  screen,
} from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";

import Home from "./Home";

describe("Home Page", () => {

  test(
    "renders hero heading",
    () => {

      render(
        <BrowserRouter>
          <Home />
        </BrowserRouter>
      );

      expect(
        screen.getByText(
          /Organize Your Study Life/i
        )
      ).toBeInTheDocument();
    }
  );
});