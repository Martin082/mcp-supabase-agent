# Lumina Agent

A premium Next.js dashboard that enables natural language querying of a Supabase database.

## Features
- **Natural Language to SQL**: Ask questions in plain English and get data back immediately.
- **Dynamic Schema Discovery**: Automatically learns your database structure, including tables and relationships.
- **Premium UI**: Built with Next.js 14, Tailwind CSS, and Shadcn UI.
- **Dark Mode**: Fully supported theme switching.
- **Secure by Design**: Read-only SQL execution via a custom Postgres RPC function.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **AI**: Vercel AI SDK (OpenAI gpt-4o-mini)
- **Database**: Supabase
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React

## Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Martin082/mcp-supabase-agent.git
   cd mcp-supabase-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env.local` file with:
   ```env
   OPENAI_API_KEY=your_key
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Database Setup**:
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   CREATE OR REPLACE FUNCTION exec_sql(query text)
   RETURNS jsonb
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   DECLARE
       result jsonb;
   BEGIN
       EXECUTE format('SELECT jsonb_agg(t) FROM (%s) t', query)
       INTO result;
       RETURN result;
   END;
   $$;

   GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
   GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
   ```

5. **Run the app**:
   ```bash
   npm run dev
   ```

## License
MIT
