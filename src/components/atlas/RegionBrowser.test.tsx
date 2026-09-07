import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { regions } from "@/data/regions";
import { RegionBrowser } from "./RegionBrowser";

describe("RegionBrowser", () => {
  it("filters by search and selects the matching region", () => {
    const onSelect = vi.fn();
    render(<RegionBrowser onSelect={onSelect} regions={regions} />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Malbec" } });

    expect(screen.getByText("1 region")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Mendoza/ }));
    expect(onSelect).toHaveBeenCalledWith("mendoza");
  });

  it("explains and resets an empty filter result", () => {
    render(<RegionBrowser onSelect={vi.fn()} regions={regions} />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Not a region" } });
    expect(screen.getByText("No regions match these filters.")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Reset filters/ }));
    expect(screen.getByText("6 regions")).toBeVisible();
  });
});