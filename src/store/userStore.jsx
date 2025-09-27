// src/store/UserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { database } from "../config/firebaseConfig";
import {
    ref,
    get as dbGet,
    set as dbSet,
    update as dbUpdate,
    remove as dbRemove,
    onValue,
} from "firebase/database";

const normalizeShares = (sharesObj = {}) =>
    Object.entries(sharesObj).flatMap(([shareId, shareData]) =>
        (shareData.files || []).map((file, index) => ({
            id: `${shareId}-${index}`,
            shareId,
            fileIndex: index,
            createdAt: shareData.createdAt ?? Date.now(),
            expiresAt: shareData.expiresAt ?? null,
            ...file,
        })),
    );

const useUserStore = create(
    persist(
        (set, get) => ({
            isLoggedIn: false,
            data: [],
            user: null,
            hasFetched: false,

            setUser: (userData) => {
                set({ user: userData, isLoggedIn: true });
                get().startListeningToShares();
            },

            clearUser: () =>
                set({
                    user: null,
                    isLoggedIn: false,
                    data: [],
                    hasFetched: false,
                }),

            clearData: () => set({ data: [], hasFetched: false }),

            // Fetch shares only once (for initial loading)
            fetchSharesOnce: async () => {
                const state = get();
                if (!state.isLoggedIn) return;
                if (state.hasFetched || (state.data && state.data.length > 0))
                    return;

                try {
                    const snapshot = await dbGet(ref(database, "shares"));
                    if (snapshot.exists()) {
                        const filesArray = normalizeShares(snapshot.val());
                        set({ data: filesArray, hasFetched: true });
                    } else {
                        set({ data: [], hasFetched: true });
                    }
                } catch (err) {
                    console.error("UserStore.fetchSharesOnce error:", err);
                    throw err;
                }
            },

            // Real-time listener to sync the data on updates or deletes
            startListeningToShares: () => {
                const shareRef = ref(database, "shares");

                onValue(shareRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const filesArray = normalizeShares(snapshot.val());
                        set({ data: filesArray });
                    } else {
                        set({ data: [] });
                    }
                });
            },

            // Force-refresh after CRUD operations
            refreshShares: async () => {
                if (!get().isLoggedIn) return []; // ✅ skip if not logged in
                try {
                    const snapshot = await dbGet(ref(database, "shares"));
                    const filesArray = snapshot.exists()
                        ? normalizeShares(snapshot.val())
                        : [];
                    set({ data: filesArray, hasFetched: true });
                    return filesArray;
                } catch (err) {
                    console.error("UserStore.refreshShares error:", err);
                    throw err;
                }
            },

            // CRUD operations for shares

            createShare: async (newShareData) => {
                const state = get();
                if (!state.isLoggedIn) return;

                try {
                    const newShareRef = ref(
                        database,
                        "shares/" + new Date().getTime(),
                    ); // Create a unique key for the share
                    await dbSet(newShareRef, newShareData);
                } catch (err) {
                    console.error("UserStore.createShare error:", err);
                    throw err;
                }
            },

            updateShare: async (shareId, updatedData) => {
                const state = get();
                if (!state.isLoggedIn) return;

                try {
                    const shareRef = ref(database, `shares/${shareId}`);
                    await dbUpdate(shareRef, updatedData);
                } catch (err) {
                    console.error("UserStore.updateShare error:", err);
                    throw err;
                }
            },

            deleteShare: async (shareId) => {
                const state = get();
                if (!state.isLoggedIn) return;

                try {
                    const shareRef = ref(database, `shares/${shareId}`);
                    await dbRemove(shareRef); // This will delete the share
                } catch (err) {
                    console.error("UserStore.deleteShare error:", err);
                    throw err;
                }
            },
        }),
        { name: "User-data" },
    ),
);

export default useUserStore;
