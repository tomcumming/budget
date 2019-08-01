import * as preact from 'preact';

function main() {
    const wrapperElement = document.getElementById('wrapper');
    if(wrapperElement === null)
        throw new Error('Could not find #wrapper');

    preact.render(
        <h1>Hello World</h1>,
        wrapperElement
    );
}

main();
