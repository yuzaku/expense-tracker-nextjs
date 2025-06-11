export function calculateTotal(expenses: { amount: number }[]): number {
  return expenses.reduce((total, item) => total + item.amount, 0);
}
