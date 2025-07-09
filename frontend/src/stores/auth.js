import { create } from "zustand";
import { api } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await api.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
      console.error("error checking auth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
