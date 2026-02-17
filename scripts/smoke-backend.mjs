const base = process.env.LINGOMATE_BACKEND_URL ?? 'http://localhost:8787';

async function run() {
  const health = await fetch(`${base}/health`);
  if (!health.ok) throw new Error(`health failed: ${health.status}`);

  const payload = {
    text: 'bhai thoda jaldi deploy karna pls',
    sourceLanguage: 'Hindi',
    targetLanguage: 'English',
    persona: 'professional',
    direction: 'outbound',
    contextWindow: [{ id: '1', role: 'peer', text: 'Need this in 2 hours', timestamp: Date.now() }]
  };

  const translated = await fetch(`${base}/translate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!translated.ok) throw new Error(`translate failed: ${translated.status}`);
  const body = await translated.json();
  if (!body.translated) throw new Error('missing translated field');

  console.log('smoke ok', body.metadata);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
