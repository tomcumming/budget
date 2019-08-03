import * as preact from 'preact';
import { Account, Budget } from './app';
import { startOfDay } from '../date';

function jsonDateAsInputValue(jsonDate: string) {
    if (jsonDate === '') return '';
    else {
        const date = new Date(jsonDate);

        const pad2 = (n: number) => n.toString().padStart(2, '0');

        return [
            date.getFullYear(),
            pad2(date.getMonth() + 1),
            pad2(date.getDate())
        ].join('-');
    }
}

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
                    ? emptyBudget(startOfDay(new Date()))
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
                accounts,
                startingBalance: accounts.reduce(
                    (p, c) => p + this.props.accounts[c].balance,
                    0
                )
            }
        });
    };

    onClickSave = () => {
        const budget: Budget = {
            ...this.state.budget,
            startingBalance: this.state.budget.startingBalance,
            firstDay: new Date(this.state.budget.firstDay).toJSON(),
            lastDay: new Date(this.state.budget.lastDay).toJSON()
        };
        this.props.onSave(budget);
    };

    validationMessages(): string[] {
        const state = this.state.budget;

        let errors = [];

        if (state.name.length === 0) errors.push('No name set');
        if (state.accounts.length === 0) errors.push('No accounts selected');
        if (state.firstDay === '') errors.push('No first day set');
        if (state.lastDay === '') errors.push('No last day set');
        if (
            state.firstDay !== '' &&
            state.lastDay !== '' &&
            new Date(state.firstDay).getTime() >
                new Date(state.lastDay).getTime()
        )
            errors.push('Last day must be after first day');
        if (!Number.isFinite(state.targetBalance))
            errors.push('Enter a target balance');

        return errors;
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.initialBudget !== prevProps.initialBudget) {
            this.setState({
                budget:
                    this.props.initialBudget === undefined
                        ? emptyBudget(startOfDay(new Date()))
                        : this.props.initialBudget
            });
        }
    }

    render() {
        const errors = this.validationMessages();

        return (
            <div className='edit-budget'>
                <h1>Edit Budget</h1>
                <fieldset class='flex one'>
                    <label>
                        <span>Name</span>
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
                <fieldset class='flex one'>
                    <label>
                        <strong>
                            <span>Starting Balance:</span>
                        </strong>
                        <input
                            type='number'
                            placeholder='Target Balance'
                            value={this.state.budget.startingBalance}
                            onInput={e =>
                                this.setState({
                                    budget: {
                                        ...this.state.budget,
                                        startingBalance: parseFloat(
                                            (e.currentTarget as HTMLInputElement)
                                                .value
                                        )
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
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
                <fieldset class='flex one'>
                    <label>
                        <strong>
                            <span>First Day:</span>
                        </strong>
                        <input
                            type='date'
                            placeholder='First Day'
                            value={jsonDateAsInputValue(
                                this.state.budget.firstDay
                            )}
                            onInput={e =>
                                this.setState({
                                    budget: {
                                        ...this.state.budget,
                                        firstDay: (e.currentTarget as HTMLInputElement)
                                            .value
                                    }
                                })
                            }
                        />
                    </label>
                </fieldset>
                <fieldset class='flex one'>
                    <label>
                        <strong>
                            <span>Last Day:</span>
                        </strong>
                        <input
                            type='date'
                            placeholder='Last Day'
                            value={jsonDateAsInputValue(
                                this.state.budget.lastDay
                            )}
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
                {errors.length > 0 ? (
                    <ul>
                        {errors.map(error => (
                            <li key={error}>{error}</li>
                        ))}
                    </ul>
                ) : (
                    undefined
                )}
                <div class='flex two'>
                    <button
                        className='success'
                        onClick={this.onClickSave}
                        disabled={errors.length > 0}
                    >
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
