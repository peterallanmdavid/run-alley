# Supabase Setup for Run-Alley

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Create Database Tables

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL schema from `supabase-schema.sql`

## 4. Configure Row Level Security (RLS)

The schema includes RLS policies that allow public read/write access. For production, you may want to implement proper authentication.

## 5. Test the Application

1. Start the development server: `npm run dev`
2. Test creating groups, adding members, and creating events
3. Verify that data is being stored in Supabase

## 6. Deploy to Vercel

1. Add your environment variables to Vercel
2. Deploy your application
3. The application will now use Supabase instead of file storage

## Database Schema

### Groups Table
- `id` (UUID, Primary Key)
- `name` (TEXT, Required)
- `description` (TEXT)
- `created_at` (TIMESTAMP)

### Members Table
- `id` (UUID, Primary Key)
- `group_id` (UUID, Foreign Key to groups)
- `name` (TEXT, Required)
- `age` (TEXT, Required)
- `gender` (TEXT, Required)
- `created_at` (TIMESTAMP)

### Events Table
- `id` (UUID, Primary Key)
- `group_id` (UUID, Foreign Key to groups)
- `name` (TEXT, Required)
- `location` (TEXT, Required)
- `time` (TIMESTAMP, Required)
- `distance` (TEXT, Required)
- `pace_groups` (TEXT[], Required)
- `created_at` (TIMESTAMP)

## Benefits of Supabase

- ✅ **Production Ready**: Works on Vercel and other serverless platforms
- ✅ **Real-time**: Can add real-time features later
- ✅ **Scalable**: Handles concurrent users efficiently
- ✅ **Secure**: Built-in Row Level Security
- ✅ **Backup**: Automatic backups and point-in-time recovery 