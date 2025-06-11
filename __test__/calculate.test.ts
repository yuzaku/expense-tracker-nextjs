import { calculateTotal } from "../lib/calculate";

describe("calculateTotal", () => {
  it("should return correct total amount", () => {
    const dummyData = [
      { amount: 10000 },
      { amount: 25000 },
      { amount: 5000 },
    ];

    const total = calculateTotal(dummyData);
    expect(total).toBe(40000);
  });

  it("should return 0 if array is empty", () => {
    const total = calculateTotal([]);
    expect(total).toBe(0);
  });
});
