import React, {useEffect } from 'react';
import { Provider } from '@/components/ui/provider'
import useAuthStore from '@/store/AuthStore';
import { useShallow } from 'zustand/react/shallow'

import {
    Header,
    Footer,
    Main
} from '@/components';

import AppRouter from './routes/AppRouter';

function App() {
    const { updateAuthState, isLoggedIn } = useAuthStore(
        useShallow((state) => ({ 
            updateAuthState: state.updateAuthState, 
            isLoggedIn: state.isLoggedIn 
        })),
    )

    useEffect(() => {
        const initializeAuthState = async () => {
            if (!isLoggedIn) {
                await updateAuthState();
            }
        };
    
        initializeAuthState();

        const handleStorageChange = (event) => {
            if (event.key === 'access') {
                updateAuthState();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isLoggedIn, updateAuthState]);


    return (
        <Provider>
            <Header />
            <Main>
                <AppRouter />
            </Main>
            <Footer />
        </Provider>
    );
}

export default App
