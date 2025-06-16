export const TransactionEvents = {
  // Trigger ketika transaksi baru ditambahkan
  triggerAdded: () => {
    window.dispatchEvent(new CustomEvent('transactionAdded'));
  },

  // Trigger ketika transaksi diupdate
  triggerUpdated: () => {
    window.dispatchEvent(new CustomEvent('transactionUpdated'));
  },

  // Trigger ketika transaksi dihapus
  triggerDeleted: () => {
    window.dispatchEvent(new CustomEvent('transactionDeleted'));
  },

  // Trigger untuk semua jenis perubahan
  triggerRefresh: () => {
    window.dispatchEvent(new CustomEvent('transactionAdded'));
    window.dispatchEvent(new CustomEvent('transactionUpdated'));
    window.dispatchEvent(new CustomEvent('transactionDeleted'));
  }
};
