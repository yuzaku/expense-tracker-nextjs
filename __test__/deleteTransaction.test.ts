import deleteTransaction from '@/app/actions/deleteTransaction';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Mock all the external dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    transaction: {
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Typecast mocks for TypeScript
const mockedAuth = auth as jest.Mock;
const mockedDbTransactionDelete = db.transaction.delete as jest.Mock;
const mockedRevalidatePath = revalidatePath as jest.Mock;

describe('deleteTransaction Server Action', () => {
  // Clear mock history before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test Case 1: Handle unauthenticated users
  it('should return an error if user is not found', async () => {
    // Simulate no user being logged in
    mockedAuth.mockReturnValue({ userId: null });

    const result = await deleteTransaction('trx-123');

    expect(result).toEqual({ error: 'User not found' });
    // Ensure no database operation was attempted
    expect(mockedDbTransactionDelete).not.toHaveBeenCalled();
  });

  // Test Case 2: Handle successful deletion
  it('should delete the transaction and return a success message', async () => {
    const userId = 'user-abc';
    const transactionId = 'trx-123';

    // Simulate a logged-in user
    mockedAuth.mockReturnValue({ userId });
    // Simulate a successful database deletion
    mockedDbTransactionDelete.mockResolvedValue({});

    const result = await deleteTransaction(transactionId);

    // Verify the correct database call was made
    expect(mockedDbTransactionDelete).toHaveBeenCalledWith({
      where: {
        id: transactionId,
        userId,
      },
    });

    // Verify that the cache was revalidated
    expect(mockedRevalidatePath).toHaveBeenCalledWith('/');
    // Verify the success message
    expect(result).toEqual({ message: 'Transaction deleted' });
  });

  // Test Case 3: Handle database errors
  it('should return a database error message if deletion fails', async () => {
    const userId = 'user-abc';
    const transactionId = 'trx-123';

    // Simulate a logged-in user
    mockedAuth.mockReturnValue({ userId });
    // Simulate a database error
    mockedDbTransactionDelete.mockRejectedValue(new Error('DB connection failed'));

    const result = await deleteTransaction(transactionId);

    expect(result).toEqual({ error: 'Database error' });
    // Ensure cache revalidation was NOT called on failure
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });
});
