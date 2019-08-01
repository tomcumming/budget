import { StoredState, State } from "./state";

export type Action = SwitchScreen | SetStored;

export type SwitchScreen = {
    screen: State['screen']['type'];
};

export type SetStored = {
    type: 'set-stored';
    stored: StoredState;
};
