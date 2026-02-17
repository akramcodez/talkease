import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { LingoService } from './lingoService.js';
import type { TranslateRequest } from './types.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const port = Number(process.env.PORT ?? 8787);
const lingo = new LingoService(process.env.LINGO_API_KEY ?? 'demo-key');

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'lingomate-backend' });
});

app.post('/translate', async (req, res) => {
  const body = req.body as Partial<TranslateRequest>;

  if (!body.text || !body.sourceLanguage || !body.targetLanguage || !body.persona || !body.direction) {
    return res.status(400).json({ error: 'Missing required translation fields' });
  }

  const contextWindow = (body.contextWindow ?? []).slice(-20);

  const translated = await lingo.translate({
    text: body.text,
    sourceLanguage: body.sourceLanguage,
    targetLanguage: body.targetLanguage,
    persona: body.persona,
    context: contextWindow.map((m) => `${m.role}:${m.text}`)
  });

  return res.json({
    translated,
    metadata: {
      contextCount: contextWindow.length,
      persona: body.persona,
      direction: body.direction
    }
  });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`LingoMate backend running on http://localhost:${port}`);
});
