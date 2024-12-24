import React from 'react';
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from './services/AuthContext';

import {
    Header,
    Footer,
    Main
} from '@/components';

import AppRouter from './routes/AppRouter';

function App() {

    return (
        <Provider>
            <AuthProvider>
                <Header />
                <Main>
                    <AppRouter />
                </Main>
                <Footer />
            </AuthProvider>
        </Provider>
    );
}

export default App
