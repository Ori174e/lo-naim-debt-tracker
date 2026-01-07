# 🚀 Lo Naim Debt Tracker - Deployment Guide

This guide covers how to deploy the full stack application: **Backend to Railway** and **Frontend to Vercel**.

---

## 📋 Prerequisites

1.  **GitHub Account**: Your code must be pushed to a GitHub repository.
2.  **Railway Account** (Free tier available): For backend & database.
3.  **Vercel Account** (Free tier available): For frontend hosting.

---

## 🛠️ Step 1: Deploy Backend (Railway)

We will deploy the Backend first because we need its URL for the Frontend.

1.  **Login to [Railway.app](https://railway.app/)**.
2.  Click **New Project** -> **Provision PostgreSQL**.
    *   This sets up your database automatically.
3.  Click **New** (again) -> **GitHub Repo**.
    *   Select your `lo-naim-debt-tracker` repository.
    *   **IMPORTANT**: Click **Add Variables** or **Settings** before deploying if possible, or wait for the build to fail first (normal).
4.  **Configure Service**:
    *   Go to **Settings** -> **Root Directory**: Set to `/backend`.
    *   Go to **Variables**: Add the following:
        *   `PORT`: `3000`
        *   `JWT_SECRET`: (Generate a random string, e.g., using `openssl rand -hex 32`)
        *   `DATABASE_URL`: (Railway provides this in the PostgreSQL service. Copy it from there).
        *   `CORS_ORIGIN`: (Leave empty for now, we will update this after Frontend deploy).
5.  **Build & Deploy**: Railway will detect the `Dockerfile` and build your app.
    *   Once green, go to **Settings** -> **Networking** -> **Generate Domain**.
    *   **Copy this URL** (e.g., `https://backend-production.up.railway.app`).

---

## 🎨 Step 2: Deploy Frontend (Vercel)

1.  **Login to [Vercel.com](https://vercel.com/)**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    *   `VITE_API_URL`: Paste the Railway Backend URL you copied (e.g., `https://backend-production.up.railway.app/api`).
    *   *Note: Ensure you add `/api` at the end if your backend routes are prefixed with it (they usually are).*
6.  Click **Deploy**.
7.  Once complete, Vercel will give you a domain (e.g., `lo-naim-tracker.vercel.app`).

---

## 🔗 Step 3: Connect Frontend to Backend

Now that the Frontend is live, we need to tell the Backend to accept requests from it (CORS).

1.  Go back to **Railway**.
2.  Select your Backend service.
3.  Go to **Variables**.
4.  Add/Update `CORS_ORIGIN`:
    *   Value: Your Vercel URL (e.g., `https://lo-naim-tracker.vercel.app`).
    *   *Note: Remove any trailing slashes.*
5.  Railway will automatically redeploy.

---

## ✅ Step 4: Verification

1.  Open your Vercel URL.
2.  Create a user account.
3.  Create a debt.
4.  If everything works, you are **LIVE**! 🚀
