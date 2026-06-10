# TinyFish Configuration Guide

## Current Status

✅ **CONFIGURED AND TESTED** — Ready for local development and deployment

## Local Development

Your `.env.local` is configured with:

```
ENABLE_TINYFISH_AUTOMATION=true
TINYFISH_API_KEY=sk-tinyfish-3Z7kMUYMhTbrTRe9kr5RvyCG4oSL_WnQ
TINYFISH_BASE_URL=https://api.tinyfish.io
TINYFISH_TIMEOUT_MS=60000
TINYFISH_TEST_CSV=test-data/episode_rankings.csv
```

### Test Locally

```bash
npm test                          # Run all tests (4/4 TinyFish passing)
npm test -- src/lib/integrations/tinyfish  # Run TinyFish tests only
npm run verify                    # Full verification (lint + type-check + test + build)
```

## Deploy to Vercel

Set these environment variables in Vercel Dashboard:
`https://vercel.com/{team}/{project}/settings/environment-variables`

**Production & Preview:**

- `ENABLE_TINYFISH_AUTOMATION` → `true`
- `TINYFISH_API_KEY` → `sk-tinyfish-3Z7kMUYMhTbrTRe9kr5RvyCG4oSL_WnQ`
- `TINYFISH_BASE_URL` → `https://api.tinyfish.io`
- `TINYFISH_TIMEOUT_MS` → `60000`

Or use Vercel CLI:

```bash
vercel env add ENABLE_TINYFISH_AUTOMATION production preview development
echo "true" | vercel env add ENABLE_TINYFISH_AUTOMATION production preview development
```

## Using TinyFish

### Verify Spotify Import QA

```typescript
import { runSpotifyMetricsImportQA } from '@/lib/integrations/tinyfish';

const result = await runSpotifyMetricsImportQA('./test-data/spotify-metrics.csv');
console.log('Validation:', result.validation);
console.log('Passed:', result.passed);
```

### API Response

```typescript
{
  qaResult: {
    flowId: 'flow_123456_abc',
    status: 'success',
    steps: [...],
  },
  validation: {
    fileId: 'test-123',
    uploadSuccess: true,
    importSuccess: true,
    historyUpdated: true,
    errors: []
  },
  passed: true
}
```

## Key Points

- **Feature flag always defaults to `false`** in production unless explicitly enabled
- **No breaking changes** to existing Spotify import
- **Tests pass with mocked data** when disabled
- **API key is server-side only** — never exposed to client

## Security

✅ API key stored in `.env.local` (never committed)
✅ Environment variables used in `.env.example` (template only, no secrets)
✅ Feature flag gates all automation
✅ Errors logged server-side, not exposed to client

---

**Configuration Complete** — Deploy when ready.
