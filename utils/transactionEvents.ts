const UPDATE_EVENT_NAME = 'transactionsUpdated';

export const TransactionEvents = {
  // Semua fungsi sekarang akan memicu event yang sama
  triggerAdded: () => {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  },
  
  triggerUpdated: () => {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  },

  triggerDeleted: () => {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  },
  
  // Fungsi refresh ini sekarang menjadi lebih sederhana
  triggerRefresh: () => {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  }
};
