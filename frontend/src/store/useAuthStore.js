import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  signup: async (data) => {
  set({ isSigningUp: true }); // start loading
  try {
    const res = await axiosInstance.post("/auth/signup", data); // API call
    set({ authUser: res.data }); // save the logged-in user

    toast.success("Account created successfully!"); // success notification
  } catch (error) {
    toast.error(error?.response?.data?.message || "Signup failed"); // error notification
  } finally {
    set({ isSigningUp: false }); // stop loading
  }
},


  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
