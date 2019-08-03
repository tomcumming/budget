import * as preact from 'preact';
import { Budget } from './app';

export type Props = {
    budgets: { [id: number]: Budget };
    onAdd: () => void;
}

export default (props: Props) => <div className='budgets'>
    <h1>Budgets</h1>
    <div class="flex one">
        {
            Object.entries(props.budgets)
                .map(([id, budget]) => <article class="card">
                <header>
                  <h3>{budget.name}</h3>
                </header>
              </article>)
        }
        <button
            className='success'
            onClick={props.onAdd}
        >Add</button>
    </div>
</div>;
