# ShinraGuard Deployment Configuration for Koyeb

## Prerequisites
- Koyeb account
- GitHub repository with this code
- MongoDB Atlas cluster
- Environment variables configured

## Deployment Steps

### 1. Create MongoDB Atlas Cluster
- Go to https://www.mongodb.com/cloud/atlas
- Create a new cluster
- Get connection string
- Add IP whitelist: 0.0.0.0/0 (for Koyeb)

### 2. Configure Environment Variables on Koyeb
- Go to Koyeb Dashboard
- Create new Service
- Add the following environment variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/shinraguard
JWT_SECRET=your_secret_key_here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.koyeb.app
```

### 3. Deploy Backend Service
```bash
# Via Koyeb CLI
koyeb service create shinraguard-backend \
  --git github.com/YOUR_USERNAME/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd backend && npm install" \
  --run-command "node backend/server.js" \
  --port 5000
```

### 4. Deploy Frontend Service
```bash
# Via Koyeb CLI
koyeb service create shinraguard-frontend \
  --git github.com/YOUR_USERNAME/shinraa \
  --git-branch main \
  --buildpack node \
  --build-command "cd frontend && npm install && npm run build" \
  --run-command "npx serve -s build -l 3000" \
  --port 3000
```

### 5. Configure Custom Domain
- Add custom domain in Koyeb settings
- Update FRONTEND_URL and BACKEND_URL environment variables

## File Structure for Koyeb

```
shinraa/
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── build/  (generated after npm run build)
│   └── src/
├── Procfile  (optional)
└── koyeb.yml  (optional)
```

## Important Notes

1. **Build Process**: Koyeb will automatically detect Node.js projects
2. **Port**: Backend uses port 5000, Frontend uses port 3000
3. **Environment Variables**: Must be set in Koyeb dashboard
4. **Database**: Use MongoDB Atlas for cloud database
5. **CORS**: Configure CORS in backend for frontend domain

## Monitoring

- Check logs in Koyeb dashboard
- Monitor resource usage
- Set up alerts for errors

## Scaling

- Koyeb auto-scales based on demand
- Configure max instances in settings
- Monitor performance metrics

## Security

- Use environment variables for secrets
- Enable HTTPS (automatically by Koyeb)
- Set strong JWT_SECRET
- Use MongoDB Atlas IP whitelist

## Troubleshooting

### Build Failed
- Check Node.js version (18+)
- Verify package.json in root or service directories
- Check package-lock.json validity

### Port Already in Use
- Koyeb automatically assigns available ports
- Update FRONTEND_URL environment variable

### Database Connection Error
- Verify MongoDB Atlas connection string
- Check whitelist IP settings
- Ensure authentication credentials are correct

### CORS Issues
- Update CORS origins in backend server.js
- Add frontend URL to allowed origins
- Check API_URL in frontend .env

## Support

For Koyeb support: https://docs.koyeb.com
For ShinraGuard support: https://discord.gg/hgn7Q8DUGu
