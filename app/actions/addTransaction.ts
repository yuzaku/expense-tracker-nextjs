'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

interface TransactionData {
  text: string;
  amount: number;
}

interface TransactionResult {
  data?: TransactionData;
  error?: string;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');
  const transactionType = formData.get('transactionType') as 'income' | 'expense';

   // Get logged in user
  const { userId } = auth();

  // Check for user
  if (!userId) {
    return { error: 'User not found' };
  }

  // Check for input values
  if (!textValue || textValue === '' || !amountValue || !transactionType) {
    return { error: 'Text, amount, or transaction type is missing' };
  }

  const text: string = textValue.toString();
  let amount: number = Math.abs(parseFloat(amountValue.toString())); // Ensure amount is positive

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Please enter a valid positive amount' };
  }

  // Convert to negative if it's an expense
  if (transactionType === 'expense') {
    amount = -amount;
  }
  // For income, keep it positive

  try {
    const transactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    });

    revalidatePath('/');
    return { data: transactionData };
  } catch (error) {
    console.error('Add transaction error:', error);
    return { error: 'Transaction not added' };
  }
}

export default addTransaction;