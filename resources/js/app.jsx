import '../css/app.css';
import '../css/theme.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './Components/ErrorBoundary';
import { ThemeProvider } from './Components/ThemeContext';
import Toast from './Components/Toast';

const appName = import.meta.env.VITE_APP_NAME || 'TechStore';

// Wrapper component that provides Inertia context to all children
function InertiaWrapper({ children }) {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </ErrorBoundary>
    );
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Render App first, then Toast is used inside individual pages as needed
        // Toast component should be moved to a layout or individual pages
        root.render(
            <InertiaWrapper>
                <App {...props} />
            </InertiaWrapper>
        );
    },
    progress: {
        color: '#8b5cf6',
    },
});
