import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the Wine Atlas landmark", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "Wine Atlas" })).toBeVisible();
    expect(screen.getByRole("region", { name: "World atlas" })).toBeVisible();
  });
});