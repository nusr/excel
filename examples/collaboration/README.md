# Collaboration Excel Example

## Start

```bash
npm i
npm run start
```

## Environment

Create an `.env` file and modify it as the `.env.example` file

## Supbase

```sql
CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  doc_id UUID,
  update TEXT,
  create_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
);

--  enable real time
CREATE TABLE IF NOT EXISTS document (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(20),
  create_time TIMESTAMP WITH TIME ZONE NULL DEFAULT NOW(),
);
```