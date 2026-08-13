# EYN Vending — Suggestion Box + QR Codes

A hidden page where customers scan a QR at a machine and tell you what to stock. One page serves every location — each QR just tags the location in the URL.

## How it works

- The page lives at **`/suggest.html`**. It's hidden: not linked anywhere on the site and marked `noindex`, so it's only reachable by its QR code or a direct link.
- Each location gets a QR pointing to the same page with a `?loc=` tag, e.g.
  `https://www.eynvending.com/suggest.html?loc=A+-Roofing-Land-O-Lakes`
- The page reads that tag and shows it ("Suggesting for: A Roofing Land O Lakes") and includes it in every submission — so you always know which machine a suggestion is for.

## One-time setup: where submissions go (about 2 minutes)

The form uses **Web3Forms** — free, unlimited submissions, no account or dashboard. You just need an access key:

1. Go to **web3forms.com**
2. Enter your email (`info@eynvending.com`), click to get an access key
3. Check that inbox and copy the access key they send
4. Open **`suggest.html`**, find this line near the top of the `<form>`:
   ```html
   <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
   ```
   Replace `YOUR_ACCESS_KEY_HERE` with your key, save, and push.

That's it — suggestions now arrive as emails to your inbox, tagged by location.

> **Before you add the key:** the form still works — it falls back to opening a pre-filled email on the customer's phone. But set the key before printing QR codes, because the Web3Forms path is smoother for customers (they never leave the page; they just see a thank-you).

> Prefer a dashboard? **Formspree.io** works the same way — swap the `fetch()` URL in `js/main.js` for your Formspree endpoint. Web3Forms is the simpler default.

## Making QR codes for each location

Open **`qr-generator.html`** in your browser (double-click it, or host it privately — it's marked internal, don't link it publicly).

1. Type a location name (e.g. `A+ Roofing — Land O' Lakes`)
2. It builds the tagged URL and shows the QR instantly
3. **Download PNG** (1000×1000, print-ready) and put it on that machine

Repeat for each site. The naming is up to you — whatever shows up in the readout and your inbox is what you type here.

### Print tips
- Add a line like **"Scan to tell us what to stock"** above the code
- A small table-tent, sticker, or laminated card on the machine works well
- Bigger = more reliable scanning; don't shrink below ~1 inch

## Files added

| File | What it is |
|------|-----------|
| `suggest.html` | The hidden suggestion page |
| `qr-generator.html` | Internal tool to make per-location QR codes |
| `css/style.css` | Suggestion-box styles appended |
| `js/main.js` | Location parsing + form logic appended |

## Deploying

Same as the rest of the site:
```bash
git add .
git commit -m "Add suggestion box + QR generator"
git push
```
GitHub Pages redeploys automatically. Test by visiting
`https://www.eynvending.com/suggest.html?loc=Test-Machine` — you should see "Test Machine" in the readout.
