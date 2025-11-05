import { useEffect, useState } from 'react';

const GlobalLoader = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const onLoading = (e) => {
            const next = e?.detail?.count ?? 0;
            setCount(next);
        };
        window.addEventListener('global-axios-loading', onLoading);
        return () => window.removeEventListener('global-axios-loading', onLoading);
    }, []);

    if (count <= 0) return null;

    return (
        <div className="global-loader-overlay">
            <div className="global-loader-spinner" />
        </div>
    );
};

export default GlobalLoader;


