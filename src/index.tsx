import * as preact from 'preact';

import App from './components/app';
import { State } from './logic/state';

function main() {
    const wrapperElement = document.getElementById('wrapper');
    if (wrapperElement === null)
        throw new Error('Could not find #wrapper');

    const initialState: State = {
        screen: {
            type: 'budget'
        },
        storedState: {
            accounts: {}
        }
    };

    preact.render(
        <App
            state={initialState}
            dispatcher={action => console.log('dispatcher', action)}
        />,
        wrapperElement
    );
}

main();
