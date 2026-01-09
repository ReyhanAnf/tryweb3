import { hashPassword, timingSafeEqual } from './crypto';
import { storage } from './storage';

const VALID_HASH = "ff9bd855a81ecca21e620c9f80ec8455acde65a3029da25a8e8bd861918a8692";

export const auth = {
  storedHash: "b273bde8a0c9f8de5c1b0088785530e68bd64c9eb06ec6ef22ee02047625e88d",

  async login(password: string): Promise<boolean> {
    const hash = await hashPassword(password);

    if (timingSafeEqual(hash, this.storedHash)) {
      storage.setAuth(true);
      return true;
    }
    return false;
  },

  logout() {
    storage.setAuth(false);
  },

  isAuthenticated(): boolean {
    return storage.checkAuth();
  }
};
