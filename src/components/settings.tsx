import * as preact from 'preact';

import { StoredState, initialStoredState } from './app';

export type Props = {
    storedState: StoredState;
    setStoredState: (storedState: StoredState) => void;
};

type State = {};

export default class Settings extends preact.Component<Props, State> {
    createDataString = () => {
        const blob = new Blob(
            [JSON.stringify(this.props.storedState, undefined, 2)],
            {
                type: 'application/json'
            }
        );

        return URL.createObjectURL(blob);
    };

    onFileInputChange = (e: Event) => {
        const input: HTMLInputElement = e.currentTarget as HTMLInputElement;
        const file = input.files !== null ? input.files[0] : undefined;
        if (file !== undefined) {
            const fileReader = new FileReader();
            fileReader.onload = e => {
                const json = (e.target as any).result;
                const storedState: StoredState = JSON.parse(json);
                input.value = '';
                this.props.setStoredState(storedState);
            };
            fileReader.readAsText(file);
        }
    };

    onDelete = () => {
        if (confirm('Are you sure'))
            this.props.setStoredState(initialStoredState);
    };

    render() {
        return (
            <div className='settings'>
                <div class='flex one'>
                    <a
                        className='button'
                        href={this.createDataString()}
                        download='budget.json'
                    >
                        Export Data
                    </a>
                    <p>Import Data:</p>
                    <input
                        type='file'
                        accept='.json'
                        onChange={this.onFileInputChange}
                    />
                    <button className='error' onClick={this.onDelete}>
                        Reset Local Data
                    </button>
                </div>
            </div>
        );
    }
}
