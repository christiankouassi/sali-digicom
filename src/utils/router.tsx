import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

export type AppRoute =
  | { type: 'home' }
  | { type: 'questionnaire-web' }
  | { type: 'questionnaire-community' }
  | { type: 'questionnaire-branding' }
  | { type: 'projects-gallery' }
  | { type: 'project-case-study'; slug: string };

export function parseRoute(pathname: string): AppRoute {
  // Normalize pathname: remove trailing slash except for root
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (cleanPath === '' || cleanPath === '/') {
    return { type: 'home' };
  }
  if (cleanPath === '/creation-de-site-web') {
    return { type: 'questionnaire-web' };
  }
  if (cleanPath === '/community-management') {
    return { type: 'questionnaire-community' };
  }
  if (cleanPath === '/identite-visuelle') {
    return { type: 'questionnaire-branding' };
  }
  if (cleanPath === '/projets' || cleanPath === '/realisations') {
    return { type: 'projects-gallery' };
  }
  if (cleanPath.startsWith('/projet/')) {
    const slug = cleanPath.slice('/projet/'.length);
    return { type: 'project-case-study', slug };
  }
  // Fallback to home
  return { type: 'home' };
}

interface RouterContextValue {
  route: AppRoute;
  pathname: string;
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}

export interface RouterProviderProps {
  children: React.ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const [route, setRoute] = useState<AppRoute>(() => parseRoute(pathname));

  useEffect(() => {
    const handlePopState = () => {
      const current = window.location.pathname;
      setPathname(current);
      setRoute(parseRoute(current));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string, options?: { replace?: boolean; scroll?: boolean }) => {
    if (typeof window === 'undefined') return;

    if (options?.replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }

    setPathname(path);
    setRoute(parseRoute(path));

    if (options?.scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ route, pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: React.ReactNode;
  target?: string;
}

export function Link({ to, replace, onClick, children, ...props }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      (!props.target || props.target === '_self')
    ) {
      e.preventDefault();
      onClick?.(e);
      navigate(to, { replace });
    } else {
      onClick?.(e);
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
