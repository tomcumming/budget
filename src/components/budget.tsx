import * as preact from 'preact';
import { Account, Budget } from './app';

export type Props = {
    initialBudget?: Budget;
    accounts: { [id: number]: Account };
    onSave: (budget: Budget) => void;
    onDelete: () => void;
};

const emptyBudget: (date: Date) => Budget = (date: Date) => ({
    name: '',
    accounts: [],
    firstDay: date.toJSON(),
    lastDay: '',
    startingBalance: 0,
    targetBalance: 0
});

type State = {
    budget: Budget;
};

export default class BudgetEdit extends preact.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            budget:
                props.initialBudget === undefined
                    ? emptyBudget(new Date())
                    : props.initialBudget
        };
    }

    onToggleAccount = (id: string) => {
        const numberId = parseInt(id);
        const exists = this.state.budget.accounts.some(aId => aId === numberId);
        const accounts = exists
            ? this.state.budget.accounts.filter(aId => aId !== numberId)
            : this.state.budget.accounts.concat([numberId]);
        this.setState({
            budget: {
                ...this.state.budget,
                accounts
            }
        });
    };

    startingBalance(): number {
        return this.state.budget.accounts.reduce(
            (p, c) => p + this.props.accounts[c].balance,
            0
        );
    }

    onClickSave = () => {
        const budget: Budget = {
            ...this.state.budget,
            startingBalance: this.startingBalance(),
            lastDay: new Date(this.state.budget.lastDay).toJSON()
        };
        debugger;
        this.props.onSave(budget);
    };

    componentDidUpdate(prevProps: Props) {
        if (this.props.initialBudget !== prevProps.initialBudget) {
            this.setState({
                budget:
                    this.props.initialBudget === undefined
                        ? emptyBudget(new Date())
                        : this.props.initialBudget
            });
        }
    }

    render() {
        return (
            <div className='edit-budget'>
                <h1>Edit Budget</h1>
                <fieldset class='flex one'>
                    <label>
                        <input
                            type='text'
                            placeholder='Name'
                            value={this.state.budget.name}
                            onInput={e =>
                                this.setState({
                                    budget: {
                                        ...this.state.budget,
                                        name: (e.currentTarget as HTMLInputElement)
                                            .value
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                <h2>Accounts</h2>
                {Object.entries(this.props.accounts).map(([id, account]) => (
                    <div className='flex one'>
                        <label>
                            <input
                                type='checkbox'
                                checked={this.state.budget.accounts.some(
                                    aId => aId.toString() === id
                                )}
                                onChange={_ => this.onToggleAccount(id)}
                            />
                            <span className='checkable'>{account.name}</span>
                        </label>
                    </div>
                ))}
                <div class='flex one'>
                    <span>
                        <strong>Starting Balance:</strong>{' '}
                        {this.startingBalance().toFixed(2)}
                    </span>
                </div>
                <fieldset class='flex one'>
                    <label>
                        <strong>
                            <span>Target Balance:</span>
                        </strong>
                        <input
                            type='number'
                            placeholder='Target Balance'
                            value={this.state.budget.targetBalance}
                            onInput={e =>
                                this.setState({
                                    budget: {
                                        ...this.state.budget,
                                        targetBalance: parseFloat(
                                            (e.currentTarget as HTMLInputElement)
                                                .value
                                        )
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                <div class='flex one'>
                    <span>
                        <strong>First day:</strong>{' '}
                        {new Date(
                            this.state.budget.firstDay
                        ).toLocaleDateString()}
                    </span>
                </div>
                <fieldset class='flex one'>
                    <label>
                        <strong>
                            <span>Last Day:</span>
                        </strong>
                        <input
                            type='date'
                            placeholder='Last Day'
                            value={this.state.budget.lastDay}
                            onInput={e =>
                                this.setState({
                                    budget: {
                                        ...this.state.budget,
                                        lastDay: (e.currentTarget as HTMLInputElement)
                                            .value
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                <div class='flex two'>
                    <button className='success' onClick={this.onClickSave}>
                        Save
                    </button>
                    <button className='error' onClick={this.props.onDelete}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
