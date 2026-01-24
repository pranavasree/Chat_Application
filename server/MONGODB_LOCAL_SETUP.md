# MongoDB Local Setup with Compass

This guide will help you install MongoDB locally and connect using MongoDB Compass.

## Step 1: Install MongoDB Community Server

### Windows Installation:

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0 or higher)
     - Platform: Windows
     - Package: MSI
   - Click **Download**

2. **Run the installer**:
   - Double-click the downloaded `.msi` file
   - Choose **"Complete"** installation
   - **Important**: Check **"Install MongoDB as a Service"**
   - **Important**: Check **"Install MongoDB Compass"** (GUI tool)
   - Click **Install**

3. **Verify installation**:
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name MongoDB
   
   # Should show: Status = Running
   ```

## Step 2: Start MongoDB Service

MongoDB should start automatically if installed as a service. If not:

```powershell
# Start MongoDB service
net start MongoDB

# Check status
Get-Service -Name MongoDB

# Stop MongoDB (if needed)
net stop MongoDB
```

## Step 3: Install MongoDB Compass (if not installed)

If you didn't install Compass with MongoDB:

1. Download from: https://www.mongodb.com/try/download/compass
2. Install and open MongoDB Compass

## Step 4: Connect with MongoDB Compass

1. **Open MongoDB Compass**
2. **Connection string** should be pre-filled:
   ```
   mongodb://localhost:27017
   ```
3. Click **"Connect"**
4. You should see the MongoDB interface with default databases

## Step 5: Create Your Database

1. In Compass, click **"Create Database"**
2. Database Name: `chat-app`
3. Collection Name: `users` (or any name)
4. Click **"Create Database"**

## Step 6: Update Your .env File

Update your `server/.env` file to use local MongoDB:

```env
PORT=8747
JWT_KEY="@#$%^&*()00000093-234093224834787897"
ORIGIN="http://localhost:5174"
DATABASE_URL="mongodb://localhost:27017/chat-app"
```

## Step 7: Test the Connection

1. Save the `.env` file
2. Restart your Node.js server
3. You should see: **"✅ Database connected successfully"**

## Verify in Compass

1. In MongoDB Compass, refresh the databases
2. You should see `chat-app` database
3. As your app creates collections, they'll appear here

## Useful MongoDB Commands

### PowerShell Commands:

```powershell
# Check if MongoDB is running
Get-Service -Name MongoDB

# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Restart MongoDB
net stop MongoDB
net start MongoDB

# Check MongoDB process
Get-Process mongod
```

### MongoDB Shell (mongosh):

```bash
# Connect to MongoDB
mongosh

# Show all databases
show dbs

# Use your database
use chat-app

# Show collections
show collections

# Exit
exit
```

## Troubleshooting

### MongoDB service won't start:

1. **Check if port 27017 is in use**:
   ```powershell
   netstat -ano | findstr :27017
   ```

2. **Check MongoDB logs**:
   - Location: `C:\Program Files\MongoDB\Server\7.0\log\mongod.log`

3. **Restart the service**:
   ```powershell
   net stop MongoDB
   net start MongoDB
   ```

### Can't connect from Node.js:

1. Make sure MongoDB service is running
2. Check `.env` file has correct connection string
3. Verify no firewall blocking port 27017

### Compass won't connect:

1. Make sure MongoDB service is running
2. Try connection string: `mongodb://127.0.0.1:27017`
3. Check if localhost resolves correctly

## Data Location

MongoDB stores data in:
- **Windows**: `C:\Program Files\MongoDB\Server\7.0\data\`

## Uninstall (if needed)

1. Stop MongoDB service
2. Uninstall from Windows Settings > Apps
3. Delete data folder if you want to remove all data

## MongoDB Compass Features

- **Visual query builder**: Build queries without writing code
- **Schema analysis**: See your data structure
- **Index management**: Create and manage indexes
- **Import/Export**: Import JSON, CSV data
- **Aggregation pipeline builder**: Visual pipeline creation

## Next Steps

Once connected:
1. Your Node.js app will automatically create collections
2. Use Compass to view and manage your data
3. Create indexes for better performance
4. Monitor queries and performance

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- Compass Documentation: https://docs.mongodb.com/compass/
- Community Forums: https://www.mongodb.com/community/forums/

