import { defineStore } from 'pinia';

let nextId = 1;

export const useToastsStore = defineStore('toasts', {
  state: () => ({
    items: []
  }),

  actions: {
    show(message, { type = 'info', timeout = 3500 } = {}) {
      const id = nextId++;
      this.items.push({ id, message, type });
      if (timeout) {
        setTimeout(() => this.dismiss(id), timeout);
      }
    },

    dismiss(id) {
      this.items = this.items.filter((t) => t.id !== id);
    }
  }
});
