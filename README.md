# A-LUXURY — WhatsApp ordering storefront

React + Vite storefront. No accounts, no Shopify. Customers browse, fill a cart,
and tap **Order via WhatsApp**, which opens a chat with the order already written.
Products are managed by the client in a Google Sheet.

## Run locally

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev
```

With `VITE_SHEET_CSV_URL` left empty, the site shows built-in sample products.

## Environment variables

| Name | What it is |
| --- | --- |
| `VITE_WHATSAPP_NUMBER` | Country code + number, digits only. Example: `14165551234` |
| `VITE_SHEET_CSV_URL` | The Google Sheet's "Publish to web" CSV link |
| `VITE_CURRENCY` | Currency code for prices (default `CAD`) |

On Netlify, add the same three under **Site configuration > Environment variables**,
then trigger a redeploy (Vite bakes these in at build time).

## Set up the product sheet

1. Create a Google Sheet and import `docs/sample-products.csv` (File > Import > Upload),
   or copy its column headers exactly.
2. **File > Share > Publish to web**, choose the product tab and **Comma-separated values (.csv)**, then Publish.
3. Copy the link into `VITE_SHEET_CSV_URL`.

Columns:

| Column | Notes |
| --- | --- |
| `id` | Short unique name used in the page link, e.g. `wool-overcoat`. Blank = made from the name |
| `name` | Required |
| `category` | Type it freely; new categories appear on the site automatically |
| `price` | Required. Number only |
| `compare_at_price` | Optional. Old price, shows a Sale badge when higher than `price` |
| `description` | Optional |
| `images` | Image links separated by `\|`, a space, or a new line. First one is the main image |
| `sizes` | Comma separated, e.g. `S, M, L` |
| `colors` | Comma separated |
| `stock` | Number left. `0` = Out of Stock. Blank = always available |
| `tags` | `featured`, `newArrival`, `bestSeller` (controls the Home page rows) |

Edits in the sheet can take about 5 minutes to appear on the site (Google's cache).

## Product images

A sheet can't hold pictures, only links. Upload photos to Cloudinary (free plan),
copy each image link, and paste it in the `images` column.

## Deploy (Netlify)

`netlify.toml` is included (build: `npm run build`, publish folder: `dist`).
If the site was created for the old CRA version, check the publish directory
is `dist` and not `build`.
