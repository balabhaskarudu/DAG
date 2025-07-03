# Production DAG Project



A DAG (Directed Acyclic Graph) with modern web technologies.You can Visualize the workflows with real time data,it is auto layout and data management.

## Features

###  Beautiful UI
- **Modern Design**: Clean, professional interface with soft shadows and rounded corners
- **Responsive Layout**: Seamless experience across desktop, tablet, and mobile devices
- **Smooth Animations**: Delight ful micro-interactions and transitions
- **Accessibility**: Full keyboard navigation and screen reader support

### Core Functionality
- **Node Management**: Add, edit, delete, and duplicate nodes with editable labels
- **Edge Creation**: Drag-and-drop connections with visual feedback
- **Real-time Validation**: Instant cycle detection and graph validation
- **Auto Layout**: Intelligent vertical and horizontal graph arrangements
- **Undo/Redo**: Complete history management with keyboard shortcuts

###  Data Management
- **Live JSON Export**: Real-time graph data visualization
- **Import/Export**: Save and load graphs as JSON files
- **Side Panel**: Collapsible data viewer with copy functionality
- **Validation Feedback**: Comprehensive error and warning reporting

### Developer Experience
- **TypeScript**: Full type safety and IntelliSense support
- **Modern Tooling**: Vite, ESLint, Prettier, and Jest integration
- **Component Architecture**: Modular, reusable React components
- **Testing**: Comprehensive unit tests with high coverage

### Backend API
- **RESTful API**: Complete CRUD operations for graph management
- **MongoDB Integration**: Persistent data storage with validation
- **JSONPlaceholder Integration**: User, post, and comment management
- **Security**: CORS, Helmet, and input validation
- **Caching**: In-memory LRU cache with TTL support

##  Tech Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with excellent IDE support
- **Vite** - Lightning-fast development server and build tool

### Backend Framework
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **TypeScript** - Full-stack type safety

### Graph Visualization
- **React Flow** - Powerful graph visualization library
- **Dagre** - Automatic graph layout algorithms

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **PostCSS** - CSS processing with autoprefixer

### Development Tools
- **ESLint** - Code linting with React and TypeScript rules
- **Prettier** - Consistent code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities

### CI/CD & Deployment
- **GitHub Actions** - Automated testing and deployment
- **Vercel** - Production deployment platform
- **Lighthouse CI** - Performance and accessibility monitoring

##  To  Start this project

### Prerequirements
- Node.js 18+ 
- npm or yarn package manager
- MongoDB 

### Installation



1. **Install frontend dependencies**
      ```bash
      npm install
      ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the backend directory
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. **Start the development servers**
   
   **Backend (Terminal 1):**
   
     ``` cd backend
      npm run dev ```
      
   
**Frontend (Terminal 2):**

   ``` npm run dev ```


5. **Open your browser**
    Frontend: `http://localhost:5173`
    Backend API: `http://localhost:5000`



### Frontend

```npm run dev ```         # Start development server


### Backend
```bash
cd backend
npm run dev          # Start development server 
npm run build        #run it for typeScript to javaScript
npm run start        # Start production server

```

##  Usage Guide

### Creating Your First Graph

1. **Add Nodes**: Click the "Add Node" button to create new nodes
2. **Edit Labels**: Double-click any node to edit its label
3. **Create Connections**: Drag from a node's bottom handle to another node's top handle
4. **Auto Layout**: Use "Vertical" or "Horizontal" buttons to automatically arrange nodes
5. **Validation**: Watch the validation banner for real-time feedback
6. **Save/Load**: Export your graph as JSON or load existing graphs

### API Endpoints

The backend provides comprehensive REST APIs:

#### Graph Management
```bash
GET /api/graphs              # Get all graphs 
GET /api/graphs/:id          # Get specific graph
POST /api/graphs             # Create new graph
PUT /api/graphs/:id          # Update the existing graph
DELETE /api/graphs/:id       # Delete graph
POST /api/graphs/:id/duplicate # Duplicate graph
```

#### JSONPlaceholder Integration
```bash
GET /load                    # Load sample data from JSONPlaceholder
GET /users                   # Get paginated users
GET /users/:userId           # Get user with posts and comments
PUT /users                   # Create new user
DELETE /users/:userId        # Delete specific user
DELETE /users                # Delete all users
```

### Example API Usage

```javascript

const loadResponse = await fetch('http://localhost:5000/load');
const loadResult = await loadResponse.json();

const usersResponse = await fetch('http://localhost:5000/users?page=1&limit=10');
const users = await usersResponse.json();


const userResponse = await fetch('http://localhost:5000/users/1');
const userWithPosts = await userResponse.json();


const graphResponse = await fetch('http://localhost:5000/api/graphs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'My Workflow',
    description: 'A sample workflow',
    nodes: [...],
    edges: [...],
    tags: ['workflow', 'sample'],
    isPublic: false,
  }),
});
```

### Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo last action
- `Ctrl/Cmd + Y` - Redo last action
- `Delete/Backspace` - Delete selected nodes or edges
- `Double-click` - Edit node label

### Data Management

- **Save Graph**: Export your graph as a JSON file
- **Load Graph**: Import a previously saved JSON file
- **View Data**: Toggle the side panel to see live JSON data
- **Copy Data**: Use the copy buttons to copy specific data sections

## 🧪 Testing

The project includes comprehensive test coverage for both frontend and backend:

### Frontend Tests
- **Component Rendering**: Ensures all UI components render correctly
- **User Interactions**: Tests button clicks, node creation, and edge connections
- **Graph Validation**: Validates cycle detection and DAG validation logic
- **Layout Algorithms**: Tests auto-layout functionality
- **Undo/Redo System**: Verifies history management works correctly

### Backend Tests
- **API Endpoints**: Tests all CRUD operations for graphs and users
- **Data Validation**: Ensures proper input validation
- **Error Handling**: Tests error responses and edge cases
- **Database Operations**: Tests MongoDB integration
- **JSONPlaceholder Integration**: Tests external API integration

### Running Tests

```bash
# Frontend tests
npm test
npm run test:coverage
npm run test:watch

# Backend tests
cd backend
npm test
npm run test:watch
```

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
```bash
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env):**
```bash
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb://localhost:27017/dag_editor
DB_NAME=dag_editor
FRONTEND_URL=https://your-frontend-domain.com
JWT_SECRET=your_jwt_secret_key
```

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

##  Performance

The application is optimized for performance with:

- **Code Splitting**: Automatic code splitting with Vite
- **Tree Shaking**: Eliminates unused code from bundles
- **Caching**: In-memory cache with 60-second TTL for user data
- **Optimized Images**: Responsive images with proper sizing
- **Lighthouse Scores**: Monitored performance, accessibility, and SEO

### Performance Targets

- **Performance**: > 80
- **Accessibility**: > 90
- **Best Practices**: > 80
- **SEO**: > 80

## 🔧 Configuration

### MongoDB Setup

1. **Local MongoDB**:
   ```bash
   # Install MongoDB
   brew install mongodb/brew/mongodb-community
   
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

2. **MongoDB Atlas** (Cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create cluster and get connection string
   - Update `MONGO_URI` in `.env`

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

Built with ❤️ using modern web technologies. Perfect for workflow visualization, process mapping, graph-based applications, and data management systems.
