chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url || info.status !== 'complete') return;
  const supported = ['web.whatsapp.com', 'x.com', 'discord.com', 'web.telegram.org'];
  const host = new URL(tab.url).hostname;

  if (supported.includes(host)) {
    await chrome.sidePanel.setOptions({ tabId, path: 'index.html', enabled: true });
  }
});
