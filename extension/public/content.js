function selectorsForHost(hostname) {
  if (hostname.includes('whatsapp')) {
    return { messages: ['div._amk4'], input: 'div[contenteditable="true"]' };
  }
  if (hostname === 'x.com' || hostname.includes('twitter')) {
    return { messages: ['[data-testid="messageEntry"]'], input: '[role="textbox"]' };
  }
  if (hostname.includes('discord')) {
    return { messages: ['[aria-label*="Message"]'], input: '[role="textbox"]' };
  }
  if (hostname.includes('telegram')) {
    return { messages: ['.message .text-content', '.message'], input: '[contenteditable="true"]' };
  }

  return { messages: ['p', 'span'], input: '[role="textbox"], div[contenteditable="true"]' };
}

function extractMessages() {
  const selectors = selectorsForHost(window.location.hostname);
  const seen = new Set();
  const all = [];

  selectors.messages.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      const text = node.textContent?.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        all.push(text);
      }
    });
  });

  return all.slice(-30);
}

function injectText(text) {
  const selectors = selectorsForHost(window.location.hostname);
  const input = document.querySelector(selectors.input);
  if (!input) return false;

  input.focus();
  document.execCommand('insertText', false, text ?? '');
  return true;
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request?.type === 'LINGOMATE_EXTRACT_MESSAGES') {
    sendResponse({ messages: extractMessages() });
    return true;
  }

  if (request?.type === 'LINGOMATE_INJECT') {
    sendResponse({ ok: injectText(request.text) });
    return true;
  }

  return false;
});
