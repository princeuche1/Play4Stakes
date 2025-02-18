<<<<<<< HEAD
# Word Puzzle Betting Game

A real-time multiplayer word puzzle game with token betting system where players compete to solve puzzles and win tokens.

## Game Overview

### How to Play
1. Create an account with a unique username
2. Each new user starts with 1000 tokens
3. Create a challenge or join an existing one
4. Bet tokens on your performance
5. Race to find the target numbers faster than your opponent
6. Winner takes 95% of the total pot

### Game Types
1. **Five Numbers Game**
   - Find 5 specific numbers in a grid of 50
   - Numbers are randomly placed
   - Fastest player wins
   - Both players must complete the puzzle

## Database Structure (Supabase)

### Tables

#### users
- `id` (uuid) - Primary key
- `username` (text) - Unique username
- `tokens` (integer) - User's token balance
- `created_at` (timestamp) - Creation timestamp
- `last_login` (timestamp) - Last login timestamp

#### challenges
- `id` (uuid) - Primary key
- `host_id` (uuid) - Foreign key to users.id
- `game_type` (text) - Game identifier
- `stake` (integer) - Token stake amount
- `status` (text) - Game status (waiting/active/completed)
- `created_at` (timestamp) - Creation timestamp
- `expires_at` (timestamp) - Challenge expiration time

#### challenge_players
- `challenge_id` (uuid) - Foreign key to challenges.id
- `user_id` (uuid) - Foreign key to users.id
- `role` (text) - Player role (host/challenger)
- `time` (decimal) - Player's completion time
- `joined_at` (timestamp) - Join timestamp

#### game_results
- `id` (uuid) - Primary key
- `challenge_id` (uuid) - Foreign key to challenges.id
- `winner_id` (uuid) - Foreign key to users.id
- `host_time` (decimal) - Host's completion time
- `challenger_time` (decimal) - Challenger's completion time
- `completed_at` (timestamp) - Completion timestamp

### Indexes
- `users_username_key` - Unique index on username
- `idx_challenges_host_id` - Index on host_id
- `idx_challenges_status_created` - Compound index on status and created_at
- `idx_game_results_challenge` - Index on challenge_id

### RLS Policies

#### Users
- SELECT: Public read access
- INSERT: Public insert access
- UPDATE: Only own records

#### Challenges
- SELECT: Public read access
- INSERT: Public insert access
- UPDATE: Only by host

#### Challenge Players
- SELECT: Public read access
- INSERT: Public insert access
- UPDATE: Only own records

#### Game Results
- SELECT: Public read access
- INSERT: Public insert access

### Realtime Enabled Tables
- challenges
- challenge_players
- game_results

## Development Setup

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Git

### Initial Setup
1. Clone the repository:
```bash
git clone [repository-url]
cd word-puzzle-game
```

2. Create a new branch for your changes:
```bash
git checkout -b feature/your-feature-name
```

3. Install dependencies:
```bash
npm install
```

4. Create Supabase project:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Fill in project details
   - Save the URL and keys for environment variables

5. Set up environment variables:
```bash
cp .env.example .env.local
```

6. Update `.env.local` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

7. Run database migrations:
   - Go to Supabase SQL Editor
   - Create new query
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Run the query

8. Enable realtime:
   - Go to Database → Replication
   - Enable realtime for:
     - challenges
     - challenge_players
     - game_results

9. Run the development server:
```bash
npm run dev
```

### Development Workflow
1. Create new branch for features:
```bash
git checkout -b feature/feature-name
```

2. Run tests:
```bash
npm run test
```

3. Format code:
```bash
npm run format
```

4. Lint code:
```bash
npm run lint
```

## Deployment

### Supabase Setup
1. Create new Supabase project:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Click "New Project"
   - Note down project URL and keys

2. Run database migrations:
   - Go to SQL Editor
   - Run contents of `supabase/migrations/001_initial_schema.sql`

3. Enable realtime:
   - Database → Replication
   - Enable for required tables

4. Set up RLS policies:
   - Database → Authentication
   - Verify policies are active

### Vercel Deployment
1. Push code to GitHub

2. Connect to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Import project from GitHub
   - Select repository

3. Configure environment variables:
   - Add all variables from `.env.local`
   - Ensure keys match production Supabase project

4. Deploy:
   - Vercel will auto-deploy on push to main
   - Monitor build logs for errors

### Manual Deployment
1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Troubleshooting

### Common Issues
1. **Database Connection Errors**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are correct

2. **Realtime Not Working**
   - Verify tables have realtime enabled
   - Check WebSocket connection
   - Monitor browser console

3. **Game State Issues**
   - Clear browser cache
   - Check challenge status in database
   - Verify player permissions

### Development Tips
1. Use Supabase Dashboard to:
   - Monitor realtime connections
   - Check database queries
   - View RLS policy effects

2. Debug Tools:
   - Browser DevTools for frontend
   - Supabase logs for backend
   - Next.js debugging

## API Documentation

### Database Schema
Detailed table relationships and constraints in `supabase/migrations/001_initial_schema.sql`

### API Endpoints
1. **Users**
   - POST `/api/users` - Create user
   - GET `/api/users/:id` - Get user details

2. **Challenges**
   - POST `/api/challenges` - Create challenge
   - GET `/api/challenges/:id` - Get challenge
   - PUT `/api/challenges/:id/join` - Join challenge

3. **Game Results**
   - POST `/api/challenges/:id/finish` - Submit results
   - GET `/api/challenges/:id/results` - Get results

## Contributing
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
[Your License Here]

## Features
- Real-time multiplayer gameplay
- Token betting system
- Multiple game types
- Automatic winner determination
- Token distribution

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# Pitt-games
>>>>>>> 58fd837561d9d1b05c60c6a36d1bf9d09ef764e0
