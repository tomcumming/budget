import * as React from 'react';
import { Account } from './app';

export type Props = {
    initialAccount?: Account;
    isInUse: boolean;
    onSave: (account: Account) => void;
    onDelete: () => void;
};

type State = {
    account: Account;
};

export default class AccountEdit extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            account:
                props.initialAccount === undefined
                    ? { name: '', balance: 0 }
                    : props.initialAccount
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.initialAccount !== prevProps.initialAccount) {
            this.setState({
                account:
                    this.props.initialAccount === undefined
                        ? { name: '', balance: 0 }
                        : this.props.initialAccount
            });
        }
    }

    render() {
        const invalidBalance = !Number.isFinite(this.state.account.balance);

        return (
            <div className='edit-account'>
                <h1>Edit Account</h1>
                <fieldset className='flex one'>
                    <label>
                        <span>Name</span>
                        <input
                            type='text'
                            placeholder='Name'
                            value={this.state.account.name}
                            onChange={e =>
                                this.setState({
                                    account: {
                                        ...this.state.account,
                                        name: (e.currentTarget as HTMLInputElement)
                                            .value
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                <fieldset className='flex one'>
                    <label>
                        <span>Balance</span>
                        <input
                            type='number'
                            placeholder='Balance'
                            value={this.state.account.balance}
                            onChange={e =>
                                this.setState({
                                    account: {
                                        ...this.state.account,
                                        balance: parseFloat(
                                            (e.currentTarget as HTMLInputElement)
                                                .value
                                        )
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                {this.props.isInUse ? (
                    <h1>
                        <span className='label warning'>
                            Can't delete; Used by a Budget
                        </span>
                    </h1>
                ) : (
                    undefined
                )}
                <div className='flex two'>
                    <button
                        className='success'
                        onClick={() => this.props.onSave(this.state.account)}
                        disabled={invalidBalance}
                    >
                        Save
                    </button>
                    <button
                        className='error'
                        onClick={this.props.onDelete}
                        disabled={this.props.isInUse}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
