# Alpha Aura — Landing Page

Premium static landing page for Alpha Aura transformational experiences.

## Deploy (Vercel)

- Framework: **Other** (static)
- Root directory: leave empty (uses `vercel.json` → `public` output)
- No build command required

## Local preview

```bash
cd public
python -m http.server 3456
```

Open http://localhost:3456

## WhatsApp

All CTAs open WhatsApp: **+972 52-375-4891**  
Edit `public/js/config.js` if the number changes.

## Meta Pixel (Facebook Ads)

Pixel ID: `731067880081984`

| Event | When it fires |
|-------|----------------|
| `PageView` | Every page load |
| `Lead` | Book / Register / 11:11 / session buttons |
| `Contact` | WhatsApp / Message Us clicks |
| `ViewContent` | User scrolls to key sections |
| `ScrollDepth` (custom) | 25%, 50%, 75%, 90% scroll |
| `BookSessionClick` (custom) | Book CTA with section name |
| `WhatsAppClick` (custom) | Any WhatsApp CTA |

Verify in [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events.
