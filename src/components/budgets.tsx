import * as preact from 'preact';
import { startOfDay, dayMs } from '../date';
import { Budget, Account } from './app';

export type Props = {
    budgets: { [id: number]: Budget };
    accounts: { [id: number]: Account };
    onAdd: () => void;
};

export default (props: Props) => {
    const budgets = Object.entries(props.budgets);
    budgets.sort(
        (a, b) =>
            new Date(a[1].lastDay).getTime() - new Date(b[1].lastDay).getTime()
    );

    // TODO expired

    return (
        <div className='budgets'>
            <h1>Budgets</h1>
            <div class='flex one'>
                {Object.entries(props.budgets).map(([id, budget]) => (
                    <BudgetInfo
                        key={id}
                        budgetId={parseInt(id)}
                        budget={budget}
                        accounts={props.accounts}
                    />
                ))}
                {Object.keys(props.accounts).length > 0 ? (
                    <button className='success' onClick={props.onAdd}>
                        Add
                    </button>
                ) : (
                    <h1>
                        <span class='label warning'>
                            You need to setup some accounts first
                        </span>
                    </h1>
                )}
            </div>
        </div>
    );
};

function BudgetInfo({
    budgetId,
    budget,
    accounts
}: preact.Attributes & {
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
        <article class='card'>
            <header>
                <h3>{budget.name}</h3>
            </header>
            <table class='primary'>
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
                                {currentTotal}
                            </strong>{' '}
                            ({targetTotal})
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
