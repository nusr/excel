import sqlite3 from 'sqlite3';
import mockModal from '../../../../scripts/model.json';
import mockImage from '../../../../scripts/image.json';

// Document operations
export interface Document {
  id: string;
  name?: string;
  create_time?: string;
  content?: string;
}

// File operations
export interface File {
  id?: number;
  name: string;
  last_modified?: string;
  content: Buffer;
  size: number;
}

// Database connection
const db = new sqlite3.Database('./dev.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    throw err;
  }
  console.log('Connected to SQLite database');
});

// Enable verbose mode for debugging
sqlite3.verbose();

// Promisify database operations
function runAsync(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAsync<T>(sql: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err: Error | null, row: any) => {
      if (err) reject(err);
      else resolve(row as T);
    });
  });
}

function allAsync<T>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err: Error | null, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

// Initialize database schema
export async function initDatabase(): Promise<void> {
  await runAsync(`
    CREATE TABLE IF NOT EXISTS document (
      id TEXT PRIMARY KEY,
      name TEXT,
      create_time TEXT DEFAULT CURRENT_TIMESTAMP,
      content TEXT
    )
  `);

  await runAsync(`
    CREATE TABLE IF NOT EXISTS file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      last_modified TEXT DEFAULT CURRENT_TIMESTAMP,
      content BLOB NOT NULL,
      size INTEGER NOT NULL
    )
  `);

  // Add indexes for better performance
  await runAsync(`CREATE INDEX IF NOT EXISTS idx_document_create_time ON document(create_time)`);
  await runAsync(`CREATE INDEX IF NOT EXISTS idx_file_name ON file(name)`);
  await runAsync(`CREATE INDEX IF NOT EXISTS idx_file_last_modified ON file(last_modified)`);
}

export async function createDocument(data: Document): Promise<Document> {
  await runAsync(
    'INSERT INTO document (id, name, content, create_time) VALUES (?, ?, ?, ?)',
    [
      data.id,
      data.name ?? '',
      data.content ?? '',
      data.create_time ?? new Date().toISOString(),
    ],
  );
  const result = await getAsync<Document>(
    'SELECT * FROM document WHERE id = ?',
    [data.id],
  );
  if (!result) {
    throw new Error('Failed to create document');
  }
  return result;
}

export async function findDocument(id: string): Promise<Document | null> {
  const result = await getAsync<Document>(
    'SELECT * FROM document WHERE id = ?',
    [id],
  );
  return result || null;
}

export async function findAllDocuments(
  orderBy: 'asc' | 'desc' = 'desc',
): Promise<Document[]> {
  const order = orderBy === 'desc' ? 'DESC' : 'ASC';
  return allAsync<Document>(
    `SELECT * FROM document ORDER BY create_time ${order}`,
  );
}

export async function updateDocument(
  id: string,
  data: Pick<Document, 'name' | 'content'>,
): Promise<Document> {
  const updates: string[] = [];
  const params: string[] = [];

  if (data.name !== undefined) {
    updates.push('name = ?');
    params.push(data.name);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    params.push(data.content);
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  params.push(id);
  await runAsync(
    `UPDATE document SET ${updates.join(', ')} WHERE id = ?`,
    params,
  );

  const result = await findDocument(id);
  if (!result) {
    throw new Error('Document not found after update');
  }
  return result;
}

export async function deleteDocument(id: string): Promise<Document> {
  const doc = await findDocument(id);
  if (!doc) {
    throw new Error('Document not found');
  }
  await runAsync('DELETE FROM document WHERE id = ?', [id]);
  return doc;
}

export async function upsertDocument(
  id: string,
  data: Document,
): Promise<Document> {
  const existing = await findDocument(id);
  if (existing) {
    return updateDocument(id, { content: data.content });
  } else {
    return createDocument({ id, content: data.content });
  }
}

export async function createFile(data: File): Promise<File> {
  const result = await runAsync(
    'INSERT INTO file (id, name, content, size, last_modified) VALUES (?, ?, ?, ?, ?)',
    [
      data.id,
      data.name,
      Buffer.from(data.content),
      data.size,
      data.last_modified ?? new Date().toISOString(),
    ],
  );
  const file = await getAsync<File>('SELECT * FROM file WHERE id = ?', [result.lastID]);
  if (!file) {
    throw new Error('Failed to create file');
  }
  return file;
}

export async function findFile(id: number): Promise<File | null> {
  const result = await getAsync<File>('SELECT * FROM file WHERE id = ?', [id]);
  return result || null;
}

// Close database connection
export function closeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Seed data
const documents: Document[] = [
  {
    id: '184858c4-be37-41b5-af82-52689004e605',
    name: 'Template',
    content: JSON.stringify(mockModal),
  },
];

const files: Array<File> = [
  {
    id: 1,
    name: 'icon.jpeg',
    content: Buffer.from(mockImage),
    size: 14643,
  },
];

// Seed database function
export async function seedDatabase() {
  console.log(`Start seeding ...`);
  await initDatabase();

  // Insert documents if not already exists
  for (const doc of documents) {
    try {
      await createDocument(doc);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        console.log(`Document with id ${doc.id} already exists`);
      } else {
        throw error;
      }
    }
  }

  // Insert files if not already exists
  for (const file of files) {
    try {
      await createFile(file);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
        console.log(`File with id ${file.id} already exists`);
      } else {
        throw error;
      }
    }
  }

  console.log(`Seeding finished.`);
}

export { db };
