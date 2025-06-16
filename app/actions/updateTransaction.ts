'use server';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

// Define the structure for the data we expect for an update
interface UpdateTransactionData {
  text?: string;
  amount?: number;
  createdAt?: Date; // ADDED: Add createdAt field
}

// Define the structure for the function's return value
interface TransactionResult {
  data?: UpdateTransactionData;
  error?: string;
  message?: string;
}

// The server action to update a transaction
async function updateTransaction(
  transactionId: string,
  transactionData: UpdateTransactionData
): Promise<TransactionResult> {
  const { userId } = auth();

  if (!userId) {
    return { error: 'User not found' };
  }

  // UPDATED: Destructure createdAt
  const { text, amount, createdAt } = transactionData;

  // UPDATED: Check if we have at least one field to update
  if (!text && amount === undefined && !createdAt) {
    return { error: 'Nothing to update. Please provide new data.' };
  }

  const transactionToUpdate = await db.transaction.findUnique({
    where: { id: transactionId, userId },
  });

  if (!transactionToUpdate) {
    return { error: 'Transaction not found or you do not have permission to edit it.' };
  }

  // Prepare the data for the update
  const dataToUpdate: UpdateTransactionData = {};
  if (text) {
    dataToUpdate.text = text;
  }
  // ADDED: Add createdAt to the update payload if it exists
  if (createdAt) {
      dataToUpdate.createdAt = createdAt;
  }
  if (amount !== undefined) {
    if (isNaN(amount) || amount <= 0) {
        return { error: 'Please enter a valid positive amount.' };
    }
    dataToUpdate.amount = transactionToUpdate.amount < 0 ? -Math.abs(amount) : Math.abs(amount);
  }

  try {
    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId, userId },
      data: dataToUpdate,
    });

    revalidatePath('/');
    return { message: 'Transaction updated successfully', data: updatedTransaction };
  } catch (error) {
    console.error('Update transaction error:', error);
    return { error: 'An error occurred while updating the transaction.' };
  }
}

export default updateTransaction;