import * as React from 'react';

import { Screen } from '../screen';
import { useRoute } from '../hooks/route';

import Accounts from './accounts';
import AccountEdit from './account';
import Budgets from './budgets';
import EditBudget from './budget';
import Settings from './settings';

const localStorageKey = 'app-state';

export type Account = {
    name: string;
    balance: number;
};

export type Budget = {
    name: string;
    accounts: number[];
    firstDay: string;
    lastDay: string;
    startingBalance: number;
    targetBalance: number;
};

export type StoredState = {
    freshId: number;
    accounts: { [id: number]: Account };
    budgets: { [id: number]: Budget };
};

export const initialStoredState: StoredState = {
    freshId: 1,
    accounts: {},
    budgets: {}
};

export type Props = {};

export default function App(props: Props) {
    const [storedState, _setStoredState] = React.useState(loadStoredState());
    const screenRoute = useRoute();

    function updateStoredState(storedState: StoredState) {
        window.localStorage.setItem(
            localStorageKey,
            JSON.stringify(storedState)
        );
        _setStoredState(storedState);
    }

    const onAddAccount = React.useCallback(
        makeOnAddAccount(storedState, updateStoredState),
        [storedState]
    );

    const onSaveAccount = React.useCallback(
        makeOnSaveAccount(screenRoute, storedState, updateStoredState),
        [screenRoute, storedState]
    );

    const onDeleteAccount = React.useCallback(
        makeOnDeleteAccount(screenRoute, storedState, updateStoredState),
        [screenRoute, storedState]
    );

    const onAddBudget = React.useCallback(
        makeOnAddBudget(storedState, updateStoredState),
        [storedState]
    );

    const onSaveBudget = React.useCallback(
        makeOnSaveBudget(screenRoute, storedState, updateStoredState),
        [screenRoute, storedState]
    );

    const onDeleteBudget = React.useCallback(
        makeOnDeleteBudget(screenRoute, storedState, updateStoredState),
        [screenRoute, storedState]
    );

    const onImportStoredState = React.useCallback(
        (storedState: StoredState) => {
            updateStoredState(storedState);
            window.location.hash = `#accounts`;
        },
        []
    );

    let screen: undefined | JSX.Element;

    if (screenRoute.type === 'view-accounts')
        screen = (
            <Accounts accounts={storedState.accounts} onAdd={onAddAccount} />
        );
    else if (screenRoute.type === 'edit-account') {
        const accountId = screenRoute.id;
        const inUse =
            Object.values(storedState.budgets).filter(b =>
                b.accounts.some(aId => aId === accountId)
            ).length > 0;
        screen = (
            <AccountEdit
                initialAccount={storedState.accounts[accountId]}
                onSave={onSaveAccount}
                onDelete={onDeleteAccount}
                isInUse={inUse}
            />
        );
    } else if (screenRoute.type === 'view-budgets') {
        screen = (
            <Budgets
                budgets={storedState.budgets}
                onAdd={onAddBudget}
                accounts={storedState.accounts}
            />
        );
    } else if (screenRoute.type === 'edit-budget') {
        screen = (
            <EditBudget
                initialBudget={storedState.budgets[screenRoute.id]}
                accounts={storedState.accounts}
                onSave={onSaveBudget}
                onDelete={onDeleteBudget}
            />
        );
    } else if (screenRoute.type === 'settings') {
        screen = (
            <Settings
                storedState={storedState}
                setStoredState={onImportStoredState}
            />
        );
    }

    return (
        <div className='app'>
            <Header />
            <div style={{ paddingTop: '3em', width: '90%', margin: 'auto' }}>
                {screen}
            </div>
        </div>
    );
}

function Header(_props: {}) {
    return (
        <nav className='header'>
            <div className='menu'>
                <a href='#budgets' className='button'>
                    <span>Budgets</span>
                </a>
                <a href='#accounts' className='button'>
                    <span>Accounts</span>
                </a>
                <a href='#settings' className='button'>
                    <span>⚙</span>
                </a>
            </div>
        </nav>
    );
}

function loadStoredState(): StoredState {
    return window.localStorage.getItem(localStorageKey) === null
        ? initialStoredState
        : JSON.parse(window.localStorage.getItem(localStorageKey) as string);
}

function makeOnAddAccount(
    storedState: StoredState,
    setStoredState: (s: StoredState) => void
): () => void {
    return () => {
        const id = storedState.freshId;
        setStoredState({
            ...storedState,
            freshId: id + 1
        });
        window.location.hash = `#account/${id}`;
    };
}

function makeOnSaveAccount(
    screen: Screen,
    oldStoredState: StoredState,
    setStoredState: (s: StoredState) => void
): (account: Account) => void {
    return (account: Account) => {
        if (screen.type === 'edit-account') {
            const storedState = {
                ...oldStoredState,
                accounts: {
                    ...oldStoredState.accounts,
                    [screen.id]: account
                }
            };
            setStoredState(storedState);
            window.location.hash = '#accounts';
        } else {
            console.warn('Save account on wrong screen');
        }
    };
}

function makeOnDeleteAccount(
    screen: Screen,
    oldStoredState: StoredState,
    setStoredState: (s: StoredState) => void
): () => void {
    return () => {
        if (screen.type === 'edit-account') {
            const accounts = { ...oldStoredState.accounts };
            delete accounts[screen.id];
            const storedState = {
                ...oldStoredState,
                accounts
            };
            setStoredState(storedState);
            window.location.hash = '#accounts';
        } else {
            console.warn('Delete account on wrong screen');
        }
    };
}

function makeOnAddBudget(
    oldStoredState: StoredState,
    setStoredState: (s: StoredState) => void
): () => void {
    return () => {
        const id = oldStoredState.freshId;
        setStoredState({
            ...oldStoredState,
            freshId: id + 1
        });
        window.location.hash = `#budget/${id}`;
    };
}

function makeOnSaveBudget(
    screen: Screen,
    oldStoredState: StoredState,
    setStoredState: (s: StoredState) => void
): (budget: Budget) => void {
    return (budget: Budget) => {
        if (screen.type === 'edit-budget') {
            const storedState = {
                ...oldStoredState,
                budgets: {
                    ...oldStoredState.budgets,
                    [screen.id]: budget
                }
            };
            setStoredState(storedState);
            window.location.hash = '#budgets';
        } else {
            console.warn('Save budget on wrong screen');
        }
    };
}

function makeOnDeleteBudget(
    screen: Screen,
    oldStoredState: StoredState,
    setStoredState: (s: StoredState) => void
): () => void {
    return () => {
        if (screen.type === 'edit-budget') {
            const budgets = { ...oldStoredState.budgets };
            delete budgets[screen.id];
            const storedState = {
                ...oldStoredState,
                budgets
            };
            setStoredState(storedState);
            window.location.hash = '#budgets';
        } else {
            console.warn('Delete budget on wrong screen');
        }
    };
}
