import * as preact from 'preact';
import { Account } from './app';

export type Props = {
    initialAccount?: Account;
    onSave: (account: Account) => void;
    onDelete: () => void;
}

type State = {
    account: Account
};

export default class AccountEdit extends preact.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            account: props.initialAccount === undefined
                ? { name: '', balance: 0 }
                : props.initialAccount
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.initialAccount !== prevProps.initialAccount) {
            this.setState({
                account: this.props.initialAccount === undefined
                    ? { name: '', balance: 0 }
                    : this.props.initialAccount
            })
        }
    }

    render() {
        return <div className="edit-account">
            <h1>Edit Account</h1>
            <fieldset class="flex one">
                <label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={this.state.account.name}
                        onInput={e => this.setState({
                            account: {
                                ...this.state.account,
                                name: (e.currentTarget as HTMLInputElement).value
                            }
                        })}
                    />
                </label>
            </fieldset>
            <fieldset class="flex one">
                <label>
                    <input
                        type="number"
                        placeholder="Balance"
                        value={this.state.account.balance}
                        onInput={e => this.setState({
                            account: {
                                ...this.state.account,
                                balance: parseFloat(
                                    (e.currentTarget as HTMLInputElement).value
                                )
                            }
                        })}
                    />
                </label>
            </fieldset>
            <div class="flex two">
                <button
                    className='success'
                    onClick={() => this.props.onSave(this.state.account)}
                >Save</button>
                <button
                    className='error'
                    onClick={this.props.onDelete}
                >Delete</button>
            </div>
        </div>;
    }
}