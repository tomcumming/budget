import * as preact from 'preact';

import App from './components/app';

function main() {
    const wrapperElement = document.getElementById('wrapper');

    preact.render(
        <App />,
        wrapperElement as HTMLElement
    );
}

main();
