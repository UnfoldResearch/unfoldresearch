import { useEffect } from "react";

/**
 * Makes `#section` links scroll to their section without writing the hash
 * into the URL. Scrolling stays smooth via the html scroll-behavior, and the
 * sections' scroll margins still clear the sticky header. Modified clicks
 * (new tab, new window) are left to the browser.
 */
export function useInPageLinks() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      const target = link && document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
