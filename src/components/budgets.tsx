import * as React from 'react';
import { startOfDay, dayMs } from '../date';
import { Budget, Account } from './app';

export type Props = {
    budgets: { [id: number]: Budget };
    accounts: { [id: number]: Account };
    onAdd: () => void;
};

function Budgets(props: Props) {
    const budgets = Object.entries(props.budgets);
    budgets.sort(
        (a, b) =>
            new Date(a[1].lastDay).getTime() - new Date(b[1].lastDay).getTime()
    );

    const expired = budgets.filter(
        ([_id, budget]) =>
            new Date(budget.lastDay).getTime() + dayMs < new Date().getTime()
    );

    const pending = budgets.filter(
        ([_id, budget]) =>
            new Date(budget.firstDay).getTime() > new Date().getTime()
    );

    // Quadratic
    const active = budgets.filter(
        b => expired.every(b2 => b !== b2) && pending.every(b2 => b !== b2)
    );

    return (
        <div className='budgets'>
            <h1>Budgets</h1>
            <div className='flex one'>
                {active.map(([id, budget]) => (
                    <BudgetInfo
                        key={id}
                        budgetId={parseInt(id)}
                        budget={budget}
                        accounts={props.accounts}
                    />
                ))}
                {pending.length === 0 ? (
                    undefined
                ) : (
                    <Inactive label='Pending' budgets={pending} />
                )}
                {expired.length === 0 ? (
                    undefined
                ) : (
                    <Inactive label='Expired' budgets={expired} />
                )}
                {Object.keys(props.accounts).length > 0 ? (
                    <button className='success' onClick={props.onAdd}>
                        Add
                    </button>
                ) : (
                    <h1>
                        <span className='label warning'>
                            You need to setup some accounts first
                        </span>
                    </h1>
                )}
            </div>
        </div>
    );
}

export default React.memo(Budgets);

function BudgetInfo({
    budgetId,
    budget,
    accounts
}: React.Attributes & {
    budgetId: number;
    budget: Budget;
    accounts: { [id: number]: Account };
}) {
    const budgetAccounts = budget.accounts.map(id => accounts[id]);
    const currentTotal =
        budgetAccounts.reduce((p, c) => p + c.balance, 0) -
        budget.targetBalance;

    const firstDate = new Date(budget.firstDay);
    const lastDate = new Date(budget.lastDay);

    const startOfToday = startOfDay(new Date());
    const lengthDays = Math.round(
        (dayMs + lastDate.getTime() - firstDate.getTime()) / dayMs
    );
    const currentDays =
        Math.round((startOfToday.getTime() - firstDate.getTime()) / dayMs) + 1;
    const daysLeft = lengthDays - currentDays;

    const totalBudget = budget.startingBalance - budget.targetBalance;
    const initialPerDayBudget = totalBudget / lengthDays;
    const currentPerDayBudget = currentTotal / daysLeft;

    const remainingToday =
        currentTotal - (totalBudget - initialPerDayBudget * currentDays);

    const targetTotal =
        budget.startingBalance -
        budget.targetBalance -
        initialPerDayBudget * currentDays;

    const numberStyleClass =
        initialPerDayBudget <= currentPerDayBudget ? 'positive' : 'negative';

    return (
        <article className='card'>
            <header>
                <h3>{budget.name}</h3>
            </header>
            <table className='primary'>
                <tbody>
                    <tr>
                        <td>Last Day</td>
                        <td>{lastDate.toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Progress</td>
                        <td>
                            {currentDays} / {lengthDays} days
                        </td>
                    </tr>
                    <tr>
                        <td>Remaining Today</td>
                        <td>
                            <strong className={numberStyleClass}>
                                {remainingToday.toFixed()}
                            </strong>
                        </td>
                    </tr>
                    <tr>
                        <td>Per Day</td>
                        <td>
                            <strong className={numberStyleClass}>
                                {currentPerDayBudget.toFixed(2)}
                            </strong>{' '}
                            ({initialPerDayBudget.toFixed(2)})
                        </td>
                    </tr>
                    <tr>
                        <td>Remaining</td>
                        <td>
                            <strong className={numberStyleClass}>
                                {currentTotal.toFixed(2)}
                            </strong>{' '}
                            ({targetTotal.toFixed(2)})
                        </td>
                    </tr>
                </tbody>
            </table>
            <footer>
                <a className='button' href={`#budget/${budgetId}`}>
                    Edit
                </a>
            </footer>
        </article>
    );
}

function Inactive({
    budgets,
    label
}: {
    budgets: [string, Budget][];
    label: string;
}) {
    return (
        <div className='inactive'>
            <h3>{label}:</h3>
            {budgets.map(([id, budget]) => (
                <article className='card' key={id}>
                    <header>
                        <h3>{budget.name}</h3>
                    </header>
                    <tbody>
                        <tr>
                            <td>First Day</td>
                            <td>
                                {new Date(budget.firstDay).toLocaleDateString()}
                            </td>
                        </tr>
                        <tr>
                            <td>Last Day</td>
                            <td>
                                {new Date(budget.lastDay).toLocaleDateString()}
                            </td>
                        </tr>
                    </tbody>
                    <footer>
                        <a className='button' href={`#budget/${id}`}>
                            Edit
                        </a>
                    </footer>
                </article>
            ))}
        </div>
    );
}
