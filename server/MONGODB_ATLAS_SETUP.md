# MongoDB Atlas Setup Guide

Follow these steps to set up your free MongoDB Atlas database:

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email or Google account
3. Complete the registration

## Step 2: Create a Free Cluster

1. After logging in, click **"Build a Database"**
2. Select **"M0 FREE"** tier (Shared cluster)
3. Choose a cloud provider (AWS, Google Cloud, or Azure)
4. Select a region closest to you
5. Click **"Create Cluster"** (this takes 3-5 minutes)

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username (e.g., `chatappuser`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT: Copy and save this password!**
7. Set user privileges to **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` to the whitelist
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Choose **"Node.js"** as the driver
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Update Your .env File

1. Open `server/.env` file
2. Replace the `DATABASE_URL` with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Add `/chat-app` before the `?` to specify the database name

**Example:**
```env
DATABASE_URL="mongodb+srv://chatappuser:YourPassword123@cluster0.abc123.mongodb.net/chat-app?retryWrites=true&w=majority"
```

## Step 7: Test the Connection

1. Save the `.env` file
2. Your server should automatically restart (if using nodemon)
3. Check the console for: **"Database connected successfully"**

## Troubleshooting

### Error: "Authentication failed"
- Double-check your username and password
- Make sure there are no special characters that need URL encoding
- If password has special characters, encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`
  - `%` → `%25`

### Error: "Connection timeout"
- Check if your IP is whitelisted in Network Access
- Try allowing access from anywhere (0.0.0.0/0)

### Error: "Invalid connection string"
- Make sure you replaced `<username>` and `<password>`
- Ensure the connection string starts with `mongodb+srv://`
- Check that `/chat-app` is added before the `?`

## Security Notes

⚠️ **For Production:**
- Don't use "Allow Access from Anywhere"
- Whitelist only specific IP addresses
- Use strong passwords
- Never commit `.env` file to version control
- The `.env` file is already in `.gitignore`

## Need Help?

If you encounter any issues, check:
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/
- Connection String Format: https://docs.mongodb.com/manual/reference/connection-string/

