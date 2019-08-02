import * as preact from 'preact';
import { Account } from './app';

export type Props = {
    accounts: { [id: number]: Account };
    onAdd: () => void;
}

export default (props: Props) => {
    console.log(props);
    return <div className="accounts">
        {
            Object.entries(props.accounts).map(([id, account]) => <div class="flex one">
                <a href={`#account/${id}`} className='button'>
                    {account.name} - {account.balance}
                </a>

            </div>)
        }
        <div class="flex one">
            <button
                className='success'
                onClick={props.onAdd}
            >Add</button>
        </div>
    </div>;
}
