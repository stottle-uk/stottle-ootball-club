import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';
import { StateProvider } from './app/ootball/state/ootball.state';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __CONFIG__?: Record<string, any>;
  }
}

const defaultState = ('__CONFIG__' in window && window.__CONFIG__) || {};

const docRoot = document.getElementById('root') as HTMLElement;
if (Object.keys(defaultState).length) {
  ReactDOM.hydrateRoot(
    docRoot,
    <StrictMode>
      <StateProvider defaultState={defaultState}>
        <App />
      </StateProvider>
    </StrictMode>
  );
} else {
  ReactDOM.createRoot(docRoot).render(
    <StrictMode>
      <StateProvider defaultState={defaultState}>
        <App />
      </StateProvider>
    </StrictMode>
  );
}
