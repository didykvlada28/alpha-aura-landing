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

**One conversion event for all buttons:** `Lead`  
(Book, Register, Message, WhatsApp — всё одинаково)

| Event | When |
|-------|------|
| `PageView` | Page load |
| `Lead` | Any CTA / WhatsApp click |

In Ads Manager choose **Leads** → optimize for event **Lead**.

Verify: [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events.
