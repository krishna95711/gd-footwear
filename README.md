# 👟 GD Footwear - Premium Footwear E-commerce Website

A gorgeous, highly optimized, mobile-responsive footwear e-commerce website designed to showcase sneakers, running shoes, boots, and formal shoes. It runs **100% free** and requires **zero customer login**, enabling frictionless browsing, shopping cart addition, and instant **WhatsApp Checkouts**!

It features a secure **Admin Dashboard** to upload footwear images directly, specify sizes/colors/prices, and manage the catalog.

---

## ⚡ Key Features

- **Frictionless Shopping**: Customers do not need to sign up or log in. They can immediately add products to their shopping cart.
- **Instant WhatsApp Checkout**: The checkout system compiles a detailed, styled receipt with selected shoe models, quantities, EU sizes, and colors, then forwards it straight to your WhatsApp business line.
- **Admin Catalog Manager**: A password-protected panel `/admin` to list, publish, update, and delete footwear items.
- **Cloud Image Uploads**: Upload shoe images directly from your computer. Supports auto-saving to Cloud storage.
- **Sandbox Fallback (Zero Config!)**: Out of the box, if no database is configured, the application automatically runs in a secure sandbox mode using your browser's `localStorage` for database storage and converts uploaded images to base64, letting you test and use the site instantly!
- **1-Click Free Hosting**: Fully optimized for **Vercel** serverless environments.

---

## 🛠️ Quick Start (Local Development)

1. **Clone the repository** (or navigate to the project directory)
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Open the browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🔐 Administrator Access

To manage the catalog, visit `/admin` and sign in.

- **Default Local Password**: `admin123`
- To customize your secure password, set the `ADMIN_PASSWORD` environment variable (see below).

---

## ☁️ Production Deployment on Vercel & Supabase (100% Free)

To host your store live on **Vercel** with a shared cloud database and permanent image hosting, follow these simple steps using **Supabase** (completely free tier).

### Step 1: Create a free Supabase Project
1. Register at [supabase.com](https://supabase.com).
2. Create a new project named e.g., `gd-footwear`.

### Step 2: Create the Products Table
1. In your Supabase project, go to the **SQL Editor** &gt; **New Query**.
2. Paste and run the following script:
   ```sql
   -- Create products table
   create table products (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     description text not null,
     price numeric(10,2) not null,
     image_url text not null,
     category text not null,
     sizes integer[] not null default '{}',
     colors text[] not null default '{}',
     is_featured boolean not null default false,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable row level security (RLS)
   alter table products enable row level security;
   create policy "Allow public read access" on products for select using (true);
   create policy "Allow admin write access" on products for all using (true);
   ```

### Step 3: Set up Storage for Product Images
1. In the Supabase sidebar, click on **Storage**.
2. Click **New Bucket**. Name it exactly: `product-images`.
3. Set the bucket to **Public** so product images are visible to clients.
4. Click Save.

### Step 4: Deploy to Vercel
1. Upload your code to GitHub.
2. Link your GitHub repository to Vercel at [vercel.com](https://vercel.com).
3. In your **Vercel Project Settings &gt; Environment Variables**, add the following three keys:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL (found in Supabase Settings &gt; API).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase API Public Anon Key (found in Supabase Settings &gt; API).
   - `ADMIN_PASSWORD`: Your secret administrator password (e.g. `MySuperSecret123`).
   - `JWT_SECRET`: Any random security string (e.g. `some_random_secret_32_characters_long`).
4. Click **Deploy**!

Once deployed, the website will automatically connect to your live PostgreSQL database and support direct multi-device image uploads!

---

## 📦 Built With

- **Next.js 14** (App Router, Server Actions, Route Handlers)
- **React 18**
- **Tailwind CSS** (for fully responsive design on mobile and desktop)
- **TypeScript** (fully type-safe codebase)
- **Supabase JS Client** (PostgreSQL + CDN Cloud Object Storage)
- **Lucide React** (beautiful, lightweight iconography)
- **Jose JWT** (highly secure admin sessions)
