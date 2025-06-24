# Supabase Setup

## Connecting to Local Supabase Instance

To connect to the existing local Supabase instance running on Docker, follow these steps:

1. Ensure Docker is running on your machine.
2. Use the following command to start the Supabase instance:
   ```bash
   docker-compose up -d
   ```
3. Access the Supabase dashboard at `http://localhost:54321`.
4. Use the default credentials to log in:
   - **Email**: `supabase@supabase.io`
   - **Password**: `password`

## Database Schema

### chat_sessions Table

The `chat_sessions` table stores information about each chat session.

```sql
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### chat_messages Table

The `chat_messages` table stores individual messages within a chat session.

```sql
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id),
    sender VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Ensure that the tables are created in the Supabase dashboard or using the SQL editor provided by Supabase. 