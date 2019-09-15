import * as React from 'react';
import { Account, Budget } from './app';
import { startOfDay } from '../date';

export type Props = {
    initialBudget?: Budget;
    accounts: { [id: number]: Account };
    onSave: (budget: Budget) => void;
    onDelete: () => void;
};

export default function EditBudget(props: Props) {
    const [budget, setBudget] = React.useState(
        budgetFromInitial(props.initialBudget)
    );

    React.useEffect(() => setBudget(budgetFromInitial(props.initialBudget)), [
        props.initialBudget
    ]);

    const onToggleAccount = React.useCallback(
        makeOnToggleAccount(props.accounts, budget, setBudget),
        [props.accounts, budget]
    );

    const onNameChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setBudget({
                ...budget,
                name: (e.currentTarget as HTMLInputElement).value
            }),
        [budget]
    );

    const onChangeStartingBalance = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setBudget({
                ...budget,
                startingBalance: parseFloat(
                    (e.currentTarget as HTMLInputElement).value
                )
            }),
        [budget]
    );

    const onChangeTargetBalance = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setBudget({
                ...budget,
                targetBalance: parseFloat(
                    (e.currentTarget as HTMLInputElement).value
                )
            }),
        [budget]
    );

    const onChangeFirstDay = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setBudget({
                ...budget,
                firstDay: (e.currentTarget as HTMLInputElement).value
            }),
        [budget]
    );

    const onChangeLastDay = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setBudget({
                ...budget,
                lastDay: (e.currentTarget as HTMLInputElement).value
            }),
        [budget]
    );

    const onClickSave = React.useCallback(() => {
        const newBudget: Budget = {
            ...budget,
            startingBalance: budget.startingBalance,
            // These should be start of day anyway
            firstDay: new Date(budget.firstDay).toJSON(),
            lastDay: new Date(budget.lastDay).toJSON()
        };
        props.onSave(newBudget);
    }, [props.onSave, budget]);

    const accountToggles = React.useMemo(
        () => makeAccountToggles(props.accounts, budget, onToggleAccount),
        [props.accounts, onToggleAccount, budget]
    );

    const errors = React.useMemo(() => validationMessages(budget), [budget]);

    return (
        <div className='edit-budget'>
            <h1>Edit Budget</h1>
            <fieldset className='flex one'>
                <label>
                    <span>Name</span>
                    <input
                        type='text'
                        placeholder='Name'
                        value={budget.name}
                        onChange={onNameChange}
                    />
                </label>
            </fieldset>
            <h2>Accounts</h2>
            {accountToggles}
            <fieldset className='flex one'>
                <label>
                    <strong>
                        <span>Starting Balance:</span>
                    </strong>
                    <input
                        type='number'
                        placeholder='Target Balance'
                        value={budget.startingBalance}
                        onChange={onChangeStartingBalance}
                    />
                </label>
            </fieldset>
            <fieldset className='flex one'>
                <label>
                    <strong>
                        <span>Target Balance:</span>
                    </strong>
                    <input
                        type='number'
                        placeholder='Target Balance'
                        value={budget.targetBalance}
                        onChange={onChangeTargetBalance}
                    />
                </label>
            </fieldset>
            <fieldset className='flex one'>
                <label>
                    <strong>
                        <span>First Day:</span>
                    </strong>
                    <input
                        type='date'
                        placeholder='First Day'
                        value={jsonDateAsInputValue(budget.firstDay)}
                        onChange={onChangeFirstDay}
                    />
                </label>
            </fieldset>
            <fieldset className='flex one'>
                <label>
                    <strong>
                        <span>Last Day:</span>
                    </strong>
                    <input
                        type='date'
                        placeholder='Last Day'
                        value={jsonDateAsInputValue(budget.lastDay)}
                        onChange={onChangeLastDay}
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
            <div className='flex two'>
                <button
                    className='success'
                    onClick={onClickSave}
                    disabled={errors.length > 0}
                >
                    Save
                </button>
                <button className='error' onClick={props.onDelete}>
                    Delete
                </button>
            </div>
        </div>
    );
}

function makeAccountToggles(
    accounts: Props['accounts'],
    budget: Budget,
    onToggleAccount: (id: string) => void
) {
    return Object.entries(accounts).map(([id, account]) => (
        <div className='flex one' key={id}>
            <label>
                <input
                    type='checkbox'
                    checked={budget.accounts.some(aId => aId.toString() === id)}
                    onChange={() => onToggleAccount(id)}
                />
                <span className='checkable'>{account.name}</span>
            </label>
        </div>
    ));
}

function validationMessages(budget: Budget): string[] {
    let errors = [];

    if (budget.name.length === 0) errors.push('No name set');
    if (budget.accounts.length === 0) errors.push('No accounts selected');
    if (budget.firstDay === '') errors.push('No first day set');
    if (budget.lastDay === '') errors.push('No last day set');
    if (
        budget.firstDay !== '' &&
        budget.lastDay !== '' &&
        new Date(budget.firstDay).getTime() > new Date(budget.lastDay).getTime()
    )
        errors.push('Last day must be after first day');
    if (!Number.isFinite(budget.targetBalance))
        errors.push('Enter a target balance');

    return errors;
}

function budgetFromInitial(initialBudget?: Budget): Budget {
    return initialBudget === undefined
        ? emptyBudget(startOfDay(new Date()))
        : initialBudget;
}

const emptyBudget: (date: Date) => Budget = (date: Date) => ({
    name: '',
    accounts: [],
    firstDay: date.toJSON(),
    lastDay: '',
    startingBalance: 0,
    targetBalance: 0
});

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

function makeOnToggleAccount(
    allAccounts: Props['accounts'],
    oldBudget: Budget,
    setBudget: (b: Budget) => void
) {
    return (id: string) => {
        const numberId = parseInt(id);
        const exists = oldBudget.accounts.some(aId => aId === numberId);
        const accounts = exists
            ? oldBudget.accounts.filter(aId => aId !== numberId)
            : oldBudget.accounts.concat([numberId]);
        setBudget({
            ...oldBudget,
            accounts,
            startingBalance: accounts.reduce(
                (p, c) => p + allAccounts[c].balance,
                0
            )
        });
    };
}
