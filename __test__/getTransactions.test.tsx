import getTransactions from '@/app/actions/getTransactions';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

// Mock the dependencies
jest.mock('@/lib/db', () => ({
    db: {
        transaction: {
            findMany: jest.fn(),
        },
    },
}));

jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn(),
}));

describe('getTransactions', () => {
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterAll(() => {
        (console.error as jest.Mock).mockRestore();
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return error if user is not authenticated', async () => {
        (auth as jest.Mock).mockReturnValue({ userId: null });

        const result = await getTransactions();
        expect(result).toEqual({ error: 'User not found' });
    });

    it('should return transactions if user is authenticated', async () => {
        const mockTransactions = [
            { id: 1, text: 'Test Transaction', amount: 100, userId: 'user_123', createdAt: new Date() },
        ];

        (auth as jest.Mock).mockReturnValue({ userId: 'user_123' });
        (db.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

        const result = await getTransactions();
        expect(result).toEqual({ transactions: mockTransactions });
        expect(db.transaction.findMany).toHaveBeenCalledWith({
            where: { userId: 'user_123' },
            orderBy: { createdAt: 'desc' },
        });
    });

    it('should handle database errors', async () => {
        (auth as jest.Mock).mockReturnValue({ userId: 'user_123' });
        (db.transaction.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

        const result = await getTransactions();
        expect(result).toEqual({ error: 'Database error' });
    });
});
