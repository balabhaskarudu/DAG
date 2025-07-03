# Production DAG Project

A DAG (Directed Acyclic Graph) with modern web technologies. Visualize workflows with real-time data, auto layout, and data management.

## Features

### UI
- Modern, responsive design
- Smooth animations
- Accessibility support

### Core Functionality
- Node management: add, edit, delete, duplicate
- Edge creation: drag-and-drop connections
- Real-time validation: cycle detection
- Auto layout: vertical/horizontal arrangements
- Undo/redo: history management

### Data Management
- Live JSON export
- Import/export as JSON
- Side panel data viewer
- Validation feedback

### Developer Experience
- TypeScript throughout
- Modern tooling: Vite, ESLint, Prettier, Jest
- Modular React components
- Comprehensive unit tests

### Backend API
- RESTful CRUD for graphs
- MongoDB integration
- JSONPlaceholder integration
- Security: CORS, Helmet, validation
- In-memory LRU cache

## Tech Stack

**Frontend:** React 18, TypeScript, Vite  
**Backend:** Express.js, MongoDB, TypeScript  
**Graph Visualization:** React Flow, Dagre  
**Styling:** Tailwind CSS, Lucide React, PostCSS  
**Dev Tools:** ESLint, Prettier, Jest, React Testing Library  
**CI/CD:** GitHub Actions, Vercel, Lighthouse CI

## Getting Started

**Prerequisites:**  
- Node.js 18+  
- npm or yarn  
- MongoDB  

**Install frontend:**  
```bash
npm install
```

<<<<<<< HEAD
**Install backend:**  
=======
## Deployment

### Frontend Deployment (Vercel)

The frontend is configured for automatic deployment to Vercel:

1. **Push to main branch** - Triggers automatic deployment
2. **Pull requests** - Creates preview deployments
3. **Performance monitoring** - Lighthouse CI runs on each deployment

### Backend Deployment

For production deployment, you can use platforms like:

- **Railway**: Easy Node.js deployment with MongoDB
- **Heroku**: Traditional PaaS with MongoDB Atlas
- **DigitalOcean App Platform**: Modern cloud deployment
- **AWS/GCP/Azure**: Full cloud infrastructure

### Environment Variables

**Frontend (.env):**
>>>>>>> eed2e9fa2b7cbbc610e293abf1c96289aa728a50
```bash
cd backend
npm install
```

**Set up environment variables:**  
```bash
cp .env.example .env
```

**Start servers:**  
Backend:  
```bash
cd backend
npm run dev
```
Frontend:  
```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000

## Usage

- Add nodes, edit labels, create connections
- Auto layout: vertical/horizontal
- Export/import graphs as JSON
- View/copy live JSON data

## API Endpoints

**Graph Management**
```
GET    /api/graphs
GET    /api/graphs/:id
POST   /api/graphs
PUT    /api/graphs/:id
DELETE /api/graphs/:id
POST   /api/graphs/:id/duplicate
```

**JSONPlaceholder Integration**
```
GET    /load
GET    /users
GET    /users/:userId
PUT    /users
DELETE /users/:userId
DELETE /users
```

## Keyboard Shortcuts

- Ctrl/Cmd + Z: Undo
- Ctrl/Cmd + Y: Redo
- Delete/Backspace: Delete selected
- Double-click: Edit node label

## Testing

**Frontend:**  
- Component rendering
- User interactions
- Graph validation
- Layout algorithms
- Undo/redo

**Backend:**  
- API endpoints
- Data validation
- Error handling
- Database ops
- JSONPlaceholder integration

**Run tests:**  
Frontend:  
```bash
npm test
```
Backend:  
```bash
cd backend
npm test
```

## Deployment

**Frontend:** Vercel  
**Backend:** Railway, Heroku, DigitalOcean, AWS/GCP/Azure

**Frontend .env:**  
```
VITE_API_URL=http://localhost:5000/api
```

**Backend .env:**  
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/dag_editor
DB_NAME=dag_editor
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your_jwt_secret_key
```

## MongoDB Setup

Local:  
```bash
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community
```
Atlas: Create cluster, update `MONGO_URI` in `.env`

<<<<<<< HEAD
## Security
=======
##  Performance
>>>>>>> eed2e9fa2b7cbbc610e293abf1c96289aa728a50

- Helmet for security headers
- CORS
- Input validation (Joi)
- Error sanitization

## Contributing

See [Contributing Guide](CONTRIBUTING.md).

1. Fork the repo
2. Create a feature branch
3. Make changes and add tests
4. Ensure all tests pass
5. Commit and push
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE)

## Acknowledgments

- React Flow
- Dagre
- Tailwind CSS
- Lucide
- Express.js
- MongoDB
- JSONPlaceholder

<<<<<<< HEAD
Built with modern web technologies for workflow visualization and data management.
=======
### Environment Configuration

The backend supports multiple environment configurations:

- **Development**: Hot reload, detailed logging, CORS enabled
- **Testing**: In-memory database, minimal logging
- **Production**: Optimized performance, security headers, rate limiting

##  Security Features

- **Helmet**: Security headers for XSS protection
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Joi schema validation for all inputs
- **Error Sanitization**: Safe error messages without sensitive data
- **Rate Limiting Ready**: Infrastructure for API rate limiting

##  Monitoring & Health

- **Health Endpoints**: Basic and detailed system health checks
- **Database Monitoring**: Connection status and response time tracking
- **Error Logging**: Comprehensive error logging with stack traces
- **Performance Metrics**: Memory usage and uptime tracking
- **Cache Statistics**: Monitor cache hit rates and performance






- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions in GitHub Discussions

---

Built with  using modern web technologies. Perfect for workflow visualization, process mapping, graph-based applications, and data management systems.
>>>The end...
