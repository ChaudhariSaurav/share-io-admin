import { create } from "zustand";
import { persist } from "zustand/middleware";

const UserStore = create(
    persist(
        (set) => ({
            isLoggedIn: false,
            data: [],
            user: null,
            setUser: (userData) => set({ user: userData, isLoggedIn: true }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "User-data",
            localStorage: () => localStorage,
        },
    ),
);

export default UserStore;
