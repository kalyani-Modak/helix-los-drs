import React from 'react';
import ReactDOM from 'react-dom/client';
import '@helix-component-library-styles';
import { BrowserRouter } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import App from './App';
import AppConfig from '@shared/config/AppConfig';
import { queryClient, SessionProvider } from '@helix/component-library';
import { ProductProvider } from './utils/ProductProvider';
import { QueryClientProvider } from "@tanstack/react-query";
import { getKeycloakApiPath } from '@shared/config/apiConstants';

const cspNonceMeta = document.querySelector('meta[property="csp-nonce"]');
const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute('nonce');
const emotionCache = createCache({ key: 'mui', nonce: cspNonce || undefined });

class RouterErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[RouterErrorBoundary] Caught:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h2>🚨 Router Error:</h2>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main bootstrap
(async function bootstrap() {
  try {
    await AppConfig.init(); // replaces AppConfig.loadConfig()
    console.log("[main.jsx] ✅ Config loaded");

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <CacheProvider value={emotionCache}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/drs">
          <RouterErrorBoundary>
            <SessionProvider
              getKeycloakApiPath={getKeycloakApiPath}
            >
              <ProductProvider>
                <App />
              </ProductProvider>
            </SessionProvider>
          </RouterErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
      </CacheProvider>
    );

  } catch (err) {
    console.error("[main.jsx]  Failed to load config:", err);
    document.body.innerHTML = `
      <div style="padding: 2rem; color: red; font-family: sans-serif;">
        <h2> Failed to load application config.</h2>
        <pre>${err.message}</pre>
      </div>
    `;
  }
})();
