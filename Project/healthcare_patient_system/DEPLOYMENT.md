# 🚀 Healthcare Management System - Deployment Guide

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB 4.4+
- Git

## 🏗️ Backend Deployment

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd Project/healthcare_patient_system

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env file with your configuration
nano .env
```

**Environment Variables:**
```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/
DB_NAME=healthcare_db

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Flask Configuration
FLASK_ENV=production
DEBUG=False

# Security Configuration
BCRYPT_LOG_ROUNDS=12

# Rate Limiting
RATELIMIT_DEFAULT=200 per day;50 per hour
```

### 3. Database Setup

```bash
# Start MongoDB (if not running)
mongod

# Seed admin user
python seed_admin_user.py

# Seed dummy patients (optional)
python seed_dummy_patients.py
```

### 4. Production Deployment

#### Option A: Using Gunicorn

```bash
# Install gunicorn
pip install gunicorn

# Run with gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Option B: Using Docker

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

```bash
# Build and run
docker build -t healthcare-backend .
docker run -p 5000:5000 healthcare-backend
```

#### Option C: Cloud Deployment (Heroku/Render)

```bash
# Create Procfile (already included)
web: gunicorn app:app

# Deploy to Heroku
heroku create your-app-name
heroku config:set MONGO_URI=your-mongodb-uri
heroku config:set JWT_SECRET_KEY=your-secret-key
git push heroku main
```

## 🌐 Frontend Deployment

### 1. Environment Setup

```bash
cd Project/healthcare-frontend

# Install dependencies
npm install

# Set environment variables
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

### 2. Development

```bash
# Start development server
npm start
```

### 3. Production Build

```bash
# Build for production
npm run build

# Serve with nginx or any static server
npx serve -s build -l 3000
```

### 4. Cloud Deployment

#### Option A: Netlify

```bash
# Build and deploy
npm run build
# Upload build folder to Netlify
```

#### Option B: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Option C: Docker

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## 🔧 System Configuration

### 1. MongoDB Atlas Setup (Cloud Database)

1. Create MongoDB Atlas account
2. Create new cluster
3. Get connection string
4. Update MONGO_URI in .env

### 2. Security Configuration

```bash
# Generate secure JWT secret
openssl rand -hex 32

# Set secure environment variables
export JWT_SECRET_KEY=$(openssl rand -hex 32)
export BCRYPT_LOG_ROUNDS=12
```

### 3. SSL/HTTPS Setup

```bash
# Using Let's Encrypt
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

```bash
# Check system health
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Logs

```bash
# View application logs
tail -f healthcare_system.log

# View system logs
journalctl -u healthcare-backend -f
```

### 3. Backup

```bash
# Create database backup
mongodump --uri="mongodb://localhost:27017/healthcare_db" --out=backup/

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/healthcare_db" backup/
```

## 🔒 Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT secret key
- [ ] Configure HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set up audit logging
- [ ] Regular security updates
- [ ] Database access controls
- [ ] Environment variable security

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Permission Errors**
   ```bash
   # Fix file permissions
   chmod +x app.py
   chown -R user:user /path/to/app
   ```

### Performance Optimization

1. **Database Indexing**
   ```bash
   # Check existing indexes
   db.patients.getIndexes()
   
   # Create additional indexes if needed
   db.patients.createIndex({"email": 1})
   ```

2. **Caching**
   ```bash
   # Install Redis for caching
   sudo apt-get install redis-server
   pip install redis
   ```

3. **Load Balancing**
   ```bash
   # Using nginx as load balancer
   upstream backend {
       server 127.0.0.1:5000;
       server 127.0.0.1:5001;
   }
   ```

## 📞 Support

For deployment issues:
- Check logs: `tail -f healthcare_system.log`
- Verify environment variables
- Test database connectivity
- Check firewall settings

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Check system health
   - Review audit logs
   - Monitor disk space

2. **Monthly**
   - Update dependencies
   - Review security settings
   - Performance analysis

3. **Quarterly**
   - Full system backup
   - Security audit
   - Performance optimization

---

**Deployment completed successfully! 🎉**

Your Healthcare Management System is now ready for production use.
