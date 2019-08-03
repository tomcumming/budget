import * as preact from 'preact';
import { startOfDay, dayMs } from '../date';
import { Budget } from './app';

export type Props = {
    budgets: { [id: number]: Budget };
    hasAccounts: boolean;
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
                    />
                ))}
                {props.hasAccounts ? (
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
    budget
}: preact.Attributes & { budgetId: number; budget: Budget }) {
    const firstDate = new Date(budget.firstDay);
    const lastDate = new Date(budget.lastDay);

    const startOfToday = startOfDay(new Date());
    const lengthDays = Math.round(
        (dayMs + lastDate.getTime() - firstDate.getTime()) / dayMs
    );
    const currentDays =
        Math.round((firstDate.getTime() - startOfToday.getTime()) / dayMs) + 1;
    const daysLeft = lengthDays - currentDays;

    const totalBudget = budget.startingBalance - budget.targetBalance;
    const initialPerDayBudget = totalBudget / lengthDays;

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
                        <td></td>
                    </tr>
                    <tr>
                        <td>Per Day</td>
                        <td>({initialPerDayBudget})</td>
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
