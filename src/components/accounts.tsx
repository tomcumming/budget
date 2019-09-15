import * as React from 'react';
import { Account } from './app';

export type Props = {
    accounts: { [id: number]: Account };
    onAdd: () => void;
};

function Accounts(props: Props) {
    return (
        <div className='accounts'>
            <h1>Accounts</h1>
            {Object.entries(props.accounts).map(([id, account]) => (
                <div className='flex one' key={id}>
                    <a href={`#account/${id}`} className='button'>
                        {account.name} - {account.balance}
                    </a>
                </div>
            ))}
            <div className='flex one'>
                <button className='success' onClick={props.onAdd}>
                    Add
                </button>
            </div>
        </div>
    );
}

export default React.memo(Accounts);
