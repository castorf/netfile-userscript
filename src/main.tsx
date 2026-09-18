import { render } from 'preact';
import { App } from './App';
import './styles.css';

function init() {
  // Prevent running inside modal iframes or popups
  if (window !== window.top) return;

  const existing = document.getElementById('actblue-userscript-root');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'actblue-userscript-root';
  document.body.appendChild(container);

  render(<App />, container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
