import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './Login';

import { useEffect, useState } from 'react';
import Kanban from './Kanban';
import Header from './Components/Molecules/Header/Header';
import { useStoreState } from 'pullstate';
import { AppStore } from './stores/AppStore';

export default function App() {
    const store = useStoreState(AppStore);
    const { user } = store;

    useEffect(() => {
        console.log('user', user);
        onAuthStateChanged(getAuth(), (user) => {
            console.log('onAuthStateChanged', user);
            if (user) {
                const uid = user.uid;
                AppStore.update((s) => {
                    s.user = user;
                });

                console.log('user', user);
            } else {
                AppStore.update((s) => {
                    s.user = null;
                });
            }
        });
    }, []);

    if (!user) return <Login />;
    else
        return (
            <>
                <Header />
                <Kanban />
            </>
        );
}
