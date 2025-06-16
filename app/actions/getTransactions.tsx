'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { Transaction } from '@/types/Transaction';

// Menambahkan interface untuk parameter filter agar lebih jelas
interface GetTransactionsParams {
  month?: number;
  year?: number;
}

async function getTransactions({ month, year }: GetTransactionsParams = {}): Promise<{
  transactions?: Transaction[];
  error?: string;
}> {
  const { userId } = auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  let dateFilter: { gte?: Date; lt?: Date; } | undefined = undefined;

  // Membangun filter tanggal secara dinamis
  if (year && year !== 0) {
    if (month && month !== 0) {
      // 1. Filter berdasarkan Bulan dan Tahun spesifik
      dateFilter = {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      };
    } else {
      // 2. Filter hanya berdasarkan Tahun (semua bulan dalam tahun itu)
      dateFilter = {
        gte: new Date(year, 0, 1),   // Awal tahun
        lt: new Date(year + 1, 0, 1), // Awal tahun berikutnya
      };
    }
  }
  // 3. Jika tahun adalah "Semua" (0), tidak ada filter tanggal yang diterapkan (dateFilter tetap undefined)

  try {
    const transactions = await db.transaction.findMany({
      where: {
        userId,
        ...(dateFilter && { createdAt: dateFilter }),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { transactions };
  } catch (error) {
    console.error('Get transactions error:', error);
    return { error: 'Database error' };
  }
}

export default getTransactions;
