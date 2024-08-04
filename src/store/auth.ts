import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface IUserPrefs {
  reputation: number;
}

export interface IAuthState {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<IUserPrefs> | null;
  hydrated: boolean;

  setHydrated: () => void;
  verifySession: () => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout: () => void;
  createAccount: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
}

// create a store with the above types
export const useAuthStore = create<IAuthState>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      async verifySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email, password) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );

          const [user, { jwt }] = await Promise.all([
            account.get<IUserPrefs>(),
            account.createJWT(),
          ]);

          if (!user.prefs.reputation)
            await account.updatePrefs<IUserPrefs>({ reputation: 0 });

          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log(error);
        }
      },

      async createAccount(name, email, password) {
        try {
          await account.create(ID.unique(), name, email, password);

          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);
