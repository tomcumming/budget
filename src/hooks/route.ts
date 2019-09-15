import * as React from 'react';

import { Screen, screenFromHash } from '../screen';

export function useRoute(): Screen {
    const [hash, setHash] = React.useState(window.location.hash);
    const screen = React.useMemo(() => screenFromHash(hash), [hash]);

    function handleHashChange() {
        setHash(window.location.hash);
    }

    React.useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    });

    return screen;
}
