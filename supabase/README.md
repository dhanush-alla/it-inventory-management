# Supabase Setup Instructions

This document explains how to set up the Supabase database and authentication for this application.

## Prerequisites

1. A Supabase account and project
2. Supabase CLI installed (optional, for local development)

## Setting Up Authentication

The application uses Supabase Auth for authentication and user management. The migration file `migrations/20240811001234_create_auth_schema.sql` sets up:

1. A `profiles` table linked to Supabase Auth users
2. Row-level security policies
3. Triggers to create profiles automatically on user signup
4. A function for admins to create profiles with specific roles

## Applying Migrations

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/20240811001234_create_auth_schema.sql`
4. Click "Run" to execute the SQL

### Option 2: Using Supabase CLI (for local development)

If you're using the Supabase CLI for local development:

```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db push
```

## Setting Up Auth Configuration

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Settings
3. Under "Site URL", add your application's URL (e.g., http://localhost:5173 for local development)
4. Configure email templates and other authentication settings as needed

## User Roles

The application supports three user roles:

- `MANAGER`: Full access to all features
- `TECHNICIAN`: Can manage assets and perform maintenance
- `EMPLOYEE`: Basic access to view assets assigned to them

Roles are stored in the `profiles` table and linked to Supabase Auth users. 