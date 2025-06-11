import getIncomeExpense from '@/app/actions/getIncomeExpense';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Mock dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    transaction: {
      findMany: jest.fn(),
    },
  },
}));

// Typecast mocks
const mockedAuth = auth as jest.Mock;
const mockedDbTransactionFindMany = db.transaction.findMany as jest.Mock;

describe('getIncomeExpense Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Handle unauthenticated users
  it('should return an error if user is not found', async () => {
    mockedAuth.mockReturnValue({ userId: null });

    const result = await getIncomeExpense();

    expect(result).toEqual({ error: 'User not found' });
  });

  // Test Case 2: Successfully calculate income and expense
  it('should return the correct income and expense for the user', async () => {
    const userId = 'user-xyz';
    // Create mock transaction data
    const mockTransactions = [
      { id: '1', amount: 100.5, userId },
      { id: '2', amount: 50, userId },
      { id: '3', amount: -25, userId },
      { id: '4', amount: -75.5, userId },
    ];

    mockedAuth.mockReturnValue({ userId });
    mockedDbTransactionFindMany.mockResolvedValue(mockTransactions);

    const result = await getIncomeExpense();

    // Verify database was called correctly
    expect(mockedDbTransactionFindMany).toHaveBeenCalledWith({
      where: { userId },
    });

    // Check the calculated values
    expect(result).toEqual({
      income: 150.5, // 100.5 + 50
      expense: 100.5, // |-25 + -75.5|
    });
  });

  // Test Case 3: Handle cases with no transactions
  it('should return 0 for income and expense if there are no transactions', async () => {
    const userId = 'user-xyz';
    mockedAuth.mockReturnValue({ userId });
    // Simulate database returning an empty array
    mockedDbTransactionFindMany.mockResolvedValue([]);

    const result = await getIncomeExpense();

    expect(result).toEqual({ income: 0, expense: 0 });
  });

  // Test Case 4: Handle database errors
  it('should return a database error message if fetching fails', async () => {
    const userId = 'user-xyz';
    mockedAuth.mockReturnValue({ userId });
    mockedDbTransactionFindMany.mockRejectedValue(new Error('Fetch failed'));

    const result = await getIncomeExpense();

    expect(result).toEqual({ error: 'Database error' });
  });
});
