/**
 * Kita pindah fungsi `addTransaction` ke import dinamis agar bisa dipengaruhi oleh `jest.doMock`
 */
const createAddTransaction = async (mockUserId: string | null = "mock-user-id") => {
  jest.resetModules(); // 🔄 Reset cache

  // Mock ulang auth sebelum import
  jest.doMock("@clerk/nextjs/server", () => ({
    auth: () => ({ userId: mockUserId }),
  }));

  const mod = await import("@/app/actions/addTransaction");
  return mod.default;
};

// Mock DB
jest.mock("@/lib/db", () => ({
  db: {
    transaction: {
      create: jest.fn().mockResolvedValue({
        text: "Makan siang",
        amount: -25000,
        userId: "mock-user-id",
      }),
    },
  },
}));

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("addTransaction", () => {
  it("should return transaction data when input is valid", async () => {
    const addTransaction = await createAddTransaction(); // 🟢 userId OK
    const formData = new FormData();
    formData.append("text", "Makan siang");
    formData.append("amount", "-25000");

    const result = await addTransaction(formData);

    expect(result.data).toEqual({
      text: "Makan siang",
      amount: -25000,
      userId: "mock-user-id",
    });
    expect(result.error).toBeUndefined();
  });

  it("should return error when user not authenticated", async () => {
    const addTransaction = await createAddTransaction(null); // 🔴 userId null
    const formData = new FormData();
    formData.append("text", "Belanja");
    formData.append("amount", "-10000");

    const result = await addTransaction(formData);

    expect(result.error).toBe("User not found");
  });

  it("should return error when input missing", async () => {
    const addTransaction = await createAddTransaction();
    const formData = new FormData();
    formData.append("amount", "-25000");

    const result = await addTransaction(formData);
    expect(result.error).toBe("Text or amount is missing");
  });
});
