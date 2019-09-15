import * as React from 'react';
import * as ReactDom from 'react-dom';

import App from './components/app';

function main() {
    const wrapperElement = document.getElementById('wrapper');

    ReactDom.render(<App />, wrapperElement as HTMLElement);
}

main();
