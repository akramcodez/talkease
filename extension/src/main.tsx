import React from 'react';
import ReactDOM from 'react-dom/client';
import { SidePanel } from './components/SidePanel';
import { useChatStore } from './store/useChatStore';
import { detectPlatform } from './utils/platform';
import './styles.css';

const platform = detectPlatform(window.location.hostname);
useChatStore.getState().setPlatform(platform);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);
