import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { isAccessTokenValid, checkRefreshToken } from '@/services/TokenUtil'
import { assignAuth } from '@/services/AuthUtil'

const useAuthStore = create(
  persist(
    (set, get) => ({
      email: null,
      isLoggedIn: false,
      auth: null,
      loginType: null,

      updateAuthState: async () => {
        const token = localStorage.getItem('access');
        let authState = {
          email: null,
          isLoggedIn: false,
          auth: null,
          loginType: null,
        };

        if (token && isAccessTokenValid(token)) {
          authState = assignAuth(true, token);
        } else {
          await checkRefreshToken();
          const refreshedToken = localStorage.getItem('access');
          if (refreshedToken && isAccessTokenValid(refreshedToken)) {
            authState = assignAuth(true, refreshedToken);
          }
        }

        const currentState = get();
        if (currentState.isLoggedIn !== authState.isLoggedIn) {
          set(authState);
        }
      },

      handleLogin: async () => {
        await get().updateAuthState();
      },

      handleLogout: () => {
        localStorage.removeItem('access');
        set({
          email: null,
          isLoggedIn: false,
          auth: null,
          loginType: null,
        });
      },
    }),
    {
      name: 'login_auth',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;