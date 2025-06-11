import getUserBalance from '../app/actions/getUserBalance';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

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

describe('getUserBalance', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return error if user is not authenticated', async () => {
    (auth as jest.Mock).mockReturnValue({ userId: null });

    const result = await getUserBalance();

    expect(result).toEqual({ error: 'User not found' });
  });

  it('should return balance if user is authenticated and transactions exist', async () => {
    const mockTransactions = [
      { amount: 100 },
      { amount: -50 },
      { amount: 200 },
    ];

    (auth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (db.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await getUserBalance();

    expect(result).toEqual({ balance: 250 }); // 100 - 50 + 200
  });

  it('should return error if database query fails', async () => {
    (auth as jest.Mock).mockReturnValue({ userId: 'user_123' });
    (db.transaction.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await getUserBalance();

    expect(result).toEqual({ error: 'Database error' });
  });
});
