export type Screen =
    | { type: 'view-budgets' }
    | { type: 'edit-budget'; id: number }
    | { type: 'view-accounts' }
    | { type: 'edit-account'; id: number }
    | { type: 'settings' };

export function hashFromScreen(screen: Screen): string {
    if(screen.type === 'view-budgets')
        return '#budgets';
    else if(screen.type === 'edit-budget')
        return `#budget/${screen.id}`;
    else if(screen.type === 'view-accounts')
        return '#accounts';
    else if(screen.type === 'edit-account')
        return `#account/${screen.id}`;
    else if(screen.type === 'settings')
        return '#settings';
    else
        throw new Error('Invalid screen');
}

export function screenFromHash(hash: string): Screen {
    if (/^#budgets$/.test(hash)) {
        return { type: 'view-budgets' };
    } else if (/^#budget\/\d+$/.test(hash)) {
        const match = /^#budget\/(\d+)$/.exec(hash) as RegExpExecArray;
        return {
            type: 'edit-budget',
            id: parseInt(match[1])
        };
    } else if (/^#accounts$/.test(hash)) {
        return { type: 'view-accounts' };
    } else if (/^#account\/\d+$/.test(hash)) {
        const match = /^#account\/(\d+)$/.exec(hash) as RegExpExecArray;
        return {
            type: 'edit-account',
            id: parseInt(match[1])
        };
    } else if (/^#settings$/.test(hash)) {
        return {
            type: 'settings'
        };
    } else {
        // default
        console.warn('unmatched route', hash);
        return { type: 'view-budgets' };
    }
}
