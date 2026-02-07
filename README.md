# Portfolio Backend API

Backend API for Vasu Gupta's portfolio website. Built with Node.js, Express, Prisma ORM, and MySQL.

## Architecture

```
server/
├── src/
│   ├── server.js           # Entry point
│   ├── app.js              # Express configuration
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── routes/
│   │   ├── index.js        # Main router
│   │   ├── projectRoutes.js
│   │   ├── contactRoutes.js
│   │   └── healthRoutes.js
│   ├── controllers/
│   │   ├── projectController.js
│   │   ├── contactController.js
│   │   └── healthController.js
│   ├── services/
│   │   ├── projectService.js
│   │   └── contactService.js
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── client.js       # Prisma client singleton
│   ├── middlewares/
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   └── validations/
│       └── contactValidation.js
├── .env.development
├── .env.production
├── render.yaml
└── package.json
```

## Data Flow

```
Route → Controller → Service → Prisma → Database
```

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Prisma**: Database access layer

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/health` | Health check |

## Local Development

### Prerequisites

- Node.js >= 18
- MySQL database (or use TiDB Cloud)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.development .env
   # Edit .env with your database credentials
   ```

3. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

4. **Push schema to database**
   ```bash
   npm run prisma:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Server runs at `http://localhost:3000`

### Seed Data (Optional)

To add initial projects, use Prisma Studio:
```bash
npm run prisma:studio
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 3000 |
| `DATABASE_URL` | MySQL connection string | - |
| `CORS_ORIGIN` | Allowed frontend URLs | http://localhost:5173 |

## Deployment (Render)

1. Push code to GitHub
2. Connect repo to Render
3. Set environment variables in Render dashboard:
   - `NODE_ENV`: production
   - `DATABASE_URL`: Your TiDB Cloud connection string
   - `CORS_ORIGIN`: Your Vercel frontend URL
4. Deploy

The `render.yaml` blueprint is included for automatic configuration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Prisma
- **Database**: MySQL (TiDB Cloud)
- **Validation**: express-validator
- **Deployment**: Render

## License

MIT
