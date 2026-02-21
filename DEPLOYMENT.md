# Deploying SnapSave for Free 24/7

To host your hobby project for free and keep it running 24/7, I recommend using **Render.com** or **Koyeb.com**. Both support Docker, which is the most reliable way to run video downloaders.

## 🚀 Option A: Render.com (Easiest)
1. Push your code to a **GitHub** repository.
2. Sign up at [Render.com](https://render.com/).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Render will detect the `Dockerfile`.
   - **Environment**: Docker
   - **Plan**: Free
6. Click **Deploy Web Service**.

> [!NOTE]
> Render's free tier "spins down" after 15 minutes of inactivity. The first person to visit the site after a while will wait about 30-60 seconds for it to start up again.

## 🚀 Option B: Koyeb.com (Fastest)
1. Push your code to **GitHub**.
2. Sign up at [Koyeb.com](https://www.koyeb.com/).
3. Create a new **App**.
4. Choose **GitHub** as the source.
5. Select your repository.
6. Choose the **Nano** instance (Free tier).
7. Deploy.

## ⚠️ Important Configuration
In your hosting dashboard, ensure you set these environment variables if you ever want to change them (not required by default):
- `NODE_ENV`: production
- `PORT`: 3000

## 📂 Handling Downloads
Since these free tiers have "ephemeral" storage:
- Files are saved to `tmp-downloads/`.
- If the server restarts or sleeps, existing downloads will be wiped.
- This is perfect for your app since you already have a 30-minute cleanup timer!

---
**Your app is now ready for the world! 🌍**
