import React from 'react';
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from './services/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

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
