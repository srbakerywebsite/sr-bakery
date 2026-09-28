# SR.Bakery website (React + Vite + Firebase)

## 1. Install & run
`npm install` then `npm run dev`. Production build: `npm run build`.

## 2. Configure Firebase
1. Create a Firebase project. Enable **Authentication → Email/Password**, **Firestore**, **Storage**.
2. Project settings → add a Web app → copy config into `.env` (see `.env.example`).
3. Authentication → Users → **Add user**: email `oishe_admin@srbakery.app`, password of your choice (the password is never in the source code).
4. Paste `firestore.rules` into Firestore → Rules, and `storage.rules` into Storage → Rules. (If you change the admin email, change it in the rules and `ADMIN_DOMAIN` in `lib.js`.)
5. Authentication → Settings → Authorized domains: add your Netlify domain.

## 3. Deploy
Push to GitHub → Netlify "Import from Git". Build command `npm run build`, publish `dist`. Add the six `VITE_FIREBASE_*` variables in Netlify → Site settings → Environment variables. `netlify.toml` already handles `/admin` refresh.

## 4. Using the admin (`/admin`)
Log in with username `Oishe_admin` and the password you set in step 3.
- **Add / edit / delete product:** Products → Add Product / Edit / Delete (asks for confirmation). Price, image (upload), sizes (`1 Pound=850`), flavours, availability are all in the form.
- **Change price / image:** Edit the product, change Price or Main image, Save.
- **WhatsApp number, message and popup text:** Contact & Orders.
- **Facebook / TikTok / Instagram / YouTube:** Social Links (empty = hidden).
- **Website text, hero, footer, SEO, brand:** Site Content, Hero, Footer, SEO, Brand tabs.
- First time: Products → "Import demo products" to load the three sample cakes, then edit them.

## Notes
WhatsApp `wa.me` links cannot attach images; the product image URL is added to the message text instead.
