import { useEffect, useState } from "react";

export function useIsDarkTheme() {
    const [isDark, setIsDark] = useState(() =>
        document.body.classList.contains("dark-theme")
    );

    useEffect(() => {
        const observer = new MutationObserver(() => {
        setIsDark(document.body.classList.contains("dark-theme"));
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}