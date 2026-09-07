import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { regions } from "@/data/regions";
import { RegionDossier } from "./RegionDossier";

describe("RegionDossier", () => {
  it("renders the selected region and can add it to comparison", () => {
    const onAddToComparison = vi.fn();
    render(
      <RegionDossier
        comparisonCount={0}
        isInComparison={false}
        onAddToComparison={onAddToComparison}
        onSelectRelatedRegion={vi.fn()}
        region={regions[0]}
        regions={regions}
      />,
    );

    expect(screen.getByRole("heading", { name: "Champagne" })).toBeVisible();
    expect(screen.getByText("A short, cool growing season preserves acidity and makes ripeness a careful annual balance.")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Key sub-regions and villages" }).parentElement).toHaveTextContent("Cote des Blancs");
    fireEvent.click(screen.getByRole("button", { name: "Compare this region" }));
    expect(onAddToComparison).toHaveBeenCalledWith("champagne");
  });

  it("has a clear empty state", () => {
    render(<RegionDossier comparisonCount={0} isInComparison={false} onAddToComparison={vi.fn()} onSelectRelatedRegion={vi.fn()} regions={regions} />);

    expect(screen.getByRole("heading", { name: "Select a region" })).toBeVisible();
  });
});