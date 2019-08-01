export type State = {
    screen: Screen;
    storedState: StoredState;
};

export type StoredState = {
    accounts: { [name: string]: number };
};

export type Screen = BudgetScreen | AccountsScreen;

export type BudgetScreen = {
    type: 'budget';
};

export type AccountsScreen = {
    type: 'accounts';
};
