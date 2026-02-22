# Deploying SnapSave for Free 24/7

To host your hobby project for free and keep it running 24/7, I recommend using **Railway.app** or **Koyeb.com**. Both are excellent for Docker-based projects.

## 🚀 Option A: Railway.app (Highly Recommended)
1. Push your code to **GitHub**.
2. Sign up at [Railway.app](https://railway.app/).
3. Click **New Project** > **Deploy from GitHub repo**.
4. Select your repository.
5. Railway will automatically detect the `Dockerfile` and deploy it.
6. Once deployed, go to the **Settings** tab and click **Generate Domain** to get your public URL.

## 🚀 Option B: Koyeb.com (Free Tier)
1. Push your code to **GitHub**.
2. Sign up at [Koyeb.com](https://www.koyeb.com/).
3. Create a new **App**.
4. Choose **GitHub** as the source and select your repository.
5. Choose the **Nano** instance (Free tier).
6. Deploy.

## 🚀 Option C: Render.com
1. Push your code to **GitHub**.
2. Sign up at [Render.com](https://render.com/).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Render will detect the `Dockerfile`.
   - **Environment**: Docker
   - **Plan**: Free
6. Click **Deploy Web Service**.

> [!NOTE]
> Render's free tier "spins down" after 15 minutes of inactivity. Railway and Koyeb often provide better uptime for hobby projects.

## ⚠️ Important Configuration
The application is configured to run on port `3000`. Most platforms will detect this automatically. If asked, ensure:
- `PORT`: 3000
- `NODE_ENV`: production

## 📂 Handling Downloads
Since these free tiers have "ephemeral" storage:
- Files are saved to `tmp-downloads/`.
- If the server restarts or sleeps, existing downloads will be wiped.
- This is perfect for your app since it has a built-in cleanup timer.

---
**Your app is now ready for the world! 🌍**
