import * as preact from 'preact';

import { State } from '../logic/state';
import { Action } from '../logic/actions';

export type Props = {
    state: State;
    dispatcher: (action: Action) => void;
};

export default class App extends preact.Component<Props, unknown> {
    render(): JSX.Element {
        return <div>
            <h1>Hello</h1>
            <p>World some changes</p>
        </div>;
    }
}
