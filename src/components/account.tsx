import * as React from 'react';
import { Account } from './app';

export type Props = {
    initialAccount?: Account;
    isInUse: boolean;
    onSave: (account: Account) => void;
    onDelete: () => void;
};

export default function AccountEdit(props: Props) {
    const [account, setAccount] = React.useState<Account>(
        accountFromInitialAccount(props.initialAccount)
    );

    React.useEffect(
        () => setAccount(accountFromInitialAccount(props.initialAccount)),
        [props.initialAccount]
    );

    const onSetName = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setAccount({
                ...account,
                name: (e.currentTarget as HTMLInputElement).value
            }),
        [account]
    );

    const onSetBalance = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setAccount({
                ...account,
                balance: parseFloat((e.currentTarget as HTMLInputElement).value)
            }),
        [account]
    );

    const onClickSave = React.useCallback(() => props.onSave(account), [
        props.onSave,
        account
    ]);

    const invalidBalance = !Number.isFinite(account.balance);

    return (
        <div className='edit-account'>
            <h1>Edit Account</h1>
            <fieldset className='flex one'>
                <label>
                    <span>Name</span>
                    <input
                        type='text'
                        placeholder='Name'
                        value={account.name}
                        onChange={onSetName}
                    />
                </label>
            </fieldset>
            <fieldset className='flex one'>
                <label>
                    <span>Balance</span>
                    <input
                        type='number'
                        placeholder='Balance'
                        value={account.balance}
                        onChange={onSetBalance}
                    />
                </label>
            </fieldset>
            {props.isInUse ? (
                <h1>
                    <span className='label warning'>
                        Can't delete; Used by a Budget
                    </span>
                </h1>
            ) : (
                undefined
            )}
            <div className='flex two'>
                <button
                    className='success'
                    onClick={onClickSave}
                    disabled={invalidBalance}
                >
                    Save
                </button>
                <button
                    className='error'
                    onClick={props.onDelete}
                    disabled={props.isInUse}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

function accountFromInitialAccount(initialAccount?: Account): Account {
    return initialAccount === undefined
        ? { name: '', balance: 0 }
        : initialAccount;
}
