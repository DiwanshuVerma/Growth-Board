import { useEffect } from "react";

export const useScrollFadeIn = (ref: React.RefObject<HTMLElement | null>) => {
    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                    } else {
                        entry.target.classList.remove("show");
                    }
                });
            },
            { threshold: 0.2 }
        );

        const elements = ref.current.querySelectorAll(".fade-in-up");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [ref]);
}
