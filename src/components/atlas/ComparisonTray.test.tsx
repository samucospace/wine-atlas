import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { regions } from "@/data/regions";
import { ComparisonTray } from "./ComparisonTray";

describe("ComparisonTray", () => {
  it("selects and clears comparison entries", () => {
    const onClear = vi.fn();
    const onSelect = vi.fn();
    render(<ComparisonTray onClear={onClear} onSelect={onSelect} regions={regions.slice(0, 2)} />);

    expect(screen.getByText("Side-by-side regional profile")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Select Champagne" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove Douro from comparison" }));

    expect(onSelect).toHaveBeenCalledWith("champagne");
    expect(onClear).toHaveBeenCalledWith("douro");
    expect(screen.getByText(/Champagne: 30-50 N/)).toBeVisible();
  });
});