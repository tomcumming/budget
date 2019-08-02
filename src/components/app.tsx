import * as preact from 'preact';

import Accounts from './accounts';
import AccountEdit from './account';

const localStorageKey = 'app-state';

export type Account = {
    name: string;
    balance: number;
};

export type StoredState = {
    freshId: number;
    accounts: { [id: number]: Account }
};

const initialStoredState: StoredState = {
    freshId: 1,
    accounts: {
        1: {
            name: 'test account',
            balance: 123
        }
    }
};

export type Props = {};

type Screen =
    | { type: 'view-budgets' }
    | { type: 'view-accounts' }
    | { type: 'edit-account', id: number };

type State = {
    storedState: StoredState;
    screen: Screen;
}

function updateStoredState(storedState: StoredState): void {
    window.localStorage.setItem(localStorageKey, JSON.stringify(storedState));
}

export default class App extends preact.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            storedState: window.localStorage.getItem(localStorageKey) === null
                ? initialStoredState
                : JSON.parse(window.localStorage.getItem(localStorageKey) as string),
            screen: { type: 'view-budgets' }
        };
    }

    handleRouteChange = (_e: HashChangeEvent) => {
        const hash = window.location.hash;

        if(/^#budgets$/.test(hash)) {
            this.setState({ screen: { type: 'view-budgets' }});
        } else if(/^#accounts$/.test(hash)) {
            this.setState({ screen: { type: 'view-accounts' }});
        } else if(/^#account\/\d+$/.test(hash)) {
            const match = /^#account\/(\d+)$/.exec(hash) as RegExpExecArray;
            this.setState({ screen: {
                type: 'edit-account',
                id: parseInt(match[1])
            }});
        } else {
            // default
            console.warn('unmatched route', hash);
            this.setState({ screen: { type: 'view-budgets' }});
        }
    }

    onSaveAccount = (account: Account) => {
        if(this.state.screen.type === 'edit-account') {
            const storedState = {
                ...this.state.storedState,
                accounts: {
                    ...this.state.storedState.accounts,
                    [this.state.screen.id]: account
                }
            };
            updateStoredState(storedState);
            this.setState({ storedState });
            window.location.hash = '#accounts';
        } else {
            console.warn('Save account on wrong screen');
        }
    }

    onDeleteAccount = () => {
        if(this.state.screen.type === 'edit-account') {
            const accounts = { ... this.state.storedState.accounts }
            delete accounts[this.state.screen.id];
            const storedState = {
                ...this.state.storedState,
                accounts
            };
            updateStoredState(storedState);
            this.setState({ storedState });
            window.location.hash = '#accounts';
        } else {
            console.warn('Delete account on wrong screen');
        }
    }

    onAddAccount = () => {
        const id = this.state.storedState.freshId;
        this.setState({
            storedState: {
                ...this.state.storedState,
                freshId: id + 1
            }
        });
        window.location.hash = `#account/${id}`;
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.handleRouteChange);
        this.handleRouteChange(undefined as any);
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.handleRouteChange);
    }

    render(): JSX.Element {

        let screen: preact.ComponentChild = null;
        if(this.state.screen.type === 'view-accounts')
            screen = <Accounts
                accounts={this.state.storedState.accounts}
                onAdd={this.onAddAccount}
                />;
        else if(this.state.screen.type === 'edit-account') {
            screen = <AccountEdit
                initialAccount={this.state.storedState.accounts[this.state.screen.id]}
                onSave={this.onSaveAccount}
                onDelete={this.onDeleteAccount}
                />;
        }

        return <div className='app'>
            <Header />
            <div style={ { paddingTop: '3em', width: '90%', margin: 'auto' }}>
                {screen}
            </div>
        </div>;
    }
}

function Header(_props: {}) {
    return <nav className='header'>
        <div className='menu'>
            <a href='#budgets'><span>Budgets</span></a>
            <a href='#accounts'><span>Accounts</span></a>
            <a href='#settings'><span>Settings</span></a>
        </div>
    </nav>;
}
