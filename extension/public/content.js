const MESSAGE = 'LINGOMATE_EXTRACT_MESSAGES';

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request?.type === MESSAGE) {
    const texts = [...document.querySelectorAll('p,span,div')]
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .slice(-30);

    sendResponse({ messages: texts });
  }

  if (request?.type === 'LINGOMATE_INJECT') {
    const input = document.querySelector('div[contenteditable="true"], [role="textbox"]');
    if (input) {
      input.focus();
      document.execCommand('insertText', false, request.text ?? '');
      sendResponse({ ok: true });
      return;
    }

    sendResponse({ ok: false });
  }

  return true;
});
