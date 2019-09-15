import * as React from 'react';

import { StoredState, initialStoredState } from './app';

export type Props = {
    storedState: StoredState;
    setStoredState: (storedState: StoredState) => void;
};

function Settings(props: Props) {
    const onFileInputChange = React.useCallback(
        (e: React.FormEvent) => {
            const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
            const file = input.files !== null ? input.files[0] : undefined;
            if (file !== undefined) {
                const fileReader = new FileReader();
                fileReader.onload = e => {
                    const json = (e.target as any).result;
                    const storedState: StoredState = JSON.parse(json);
                    input.value = '';
                    props.setStoredState(storedState);
                };
                fileReader.readAsText(file);
            }
        },
        [props.setStoredState]
    );

    const onDelete = React.useCallback(() => {
        if (confirm('Are you sure')) props.setStoredState(initialStoredState);
    }, [props.setStoredState]);

    const dataString = React.useMemo(
        () => createDataString(props.storedState),
        [props.storedState]
    );

    return (
        <div className='settings'>
            <div className='flex one'>
                <a className='button' href={dataString} download='budget.json'>
                    Export Data
                </a>
                <p>Import Data:</p>
                <input
                    type='file'
                    accept='.json'
                    onChange={onFileInputChange}
                />
                <button className='error' onClick={onDelete}>
                    Reset Local Data
                </button>
            </div>
        </div>
    );
}

export default React.memo(Settings);

function createDataString(storedState: StoredState) {
    const blob = new Blob([JSON.stringify(storedState, undefined, 2)], {
        type: 'application/json'
    });

    return URL.createObjectURL(blob);
}
