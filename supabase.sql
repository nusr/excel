CREATE TABLE IF NOT EXISTS history (
  id SERIAL PRIMARY KEY,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  doc_id UUID,
  update
    TEXT
);

CREATE TABLE IF NOT EXISTS document (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(20),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);