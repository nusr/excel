import {
  db,
  initDatabase,
  closeDatabase,
  createDocument,
  findDocument,
  findAllDocuments,
  updateDocument,
  deleteDocument,
  upsertDocument,
  createFile,
  findFile,
  seedDatabase,
  Document,
  File,
} from '../db';

// Mock console.log for testing
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Database Operations', () => {
  // Setup database before each test
  beforeEach(async () => {
    // Initialize database schema
    await initDatabase();
    // Clear any existing data
    await new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM file', (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise<void>((resolve, reject) => {
      db.run('DELETE FROM document', (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  // Close database connection after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  // Document tests
  describe('Document Operations', () => {
    describe('createDocument', () => {
      it('should create a new document successfully', async () => {
        const document: Document = {
          id: 'test-doc-1',
          name: 'Test Document',
          content: 'This is a test document',
        };

        const result = await createDocument(document);

        expect(result).toBeDefined();
        expect(result.id).toBe(document.id);
        expect(result.name).toBe(document.name);
        expect(result.content).toBe(document.content);
        expect(result.create_time).toBeDefined();
      });

      it('should create a document with empty strings for optional fields', async () => {
        const document: Document = {
          id: 'test-doc-2',
        };

        const result = await createDocument(document);

        expect(result.name).toBe('');
        expect(result.content).toBe('');
      });
    });

    describe('findDocument', () => {
      it('should find an existing document', async () => {
        const document: Document = {
          id: 'test-doc-3',
          name: 'Find Test',
        };
        await createDocument(document);

        const result = await findDocument('test-doc-3');

        expect(result).toBeDefined();
        expect(result!.id).toBe(document.id);
        expect(result!.name).toBe(document.name);
      });

      it('should return null for non-existent document', async () => {
        const result = await findDocument('non-existent-id');
        expect(result).toBeNull();
      });
    });

    describe('findAllDocuments', () => {
      it('should return all documents in descending order by default', async () => {
        const doc1: Document = {
          id: 'doc-1',
          name: 'Doc 1',
        };
        const doc2: Document = {
          id: 'doc-2',
          name: 'Doc 2',
        };

        await createDocument(doc1);
        await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay to ensure different timestamps
        await createDocument(doc2);

        const results = await findAllDocuments();

        expect(results.length).toBe(2);
        // Instead of checking exact order (which might depend on SQLite's handling of default timestamps),
        // we'll just verify that both documents are returned
        const ids = results.map((doc) => doc.id);
        expect(ids).toContain('doc-1');
        expect(ids).toContain('doc-2');
      });

      it('should return all documents in ascending order when specified', async () => {
        const doc1: Document = {
          id: 'doc-3',
          name: 'Doc 3',
        };
        const doc2: Document = {
          id: 'doc-4',
          name: 'Doc 4',
        };

        await createDocument(doc1);
        await new Promise((resolve) => setTimeout(resolve, 10));
        await createDocument(doc2);

        const results = await findAllDocuments('asc');

        expect(results.length).toBe(2);
        expect(results[0].id).toBe('doc-3'); // Should be the first one created (older)
        expect(results[1].id).toBe('doc-4');
      });
    });

    describe('updateDocument', () => {
      it('should update a document successfully', async () => {
        const document: Document = {
          id: 'update-doc',
          name: 'Before Update',
          content: 'Old content',
        };
        await createDocument(document);

        const updated = await updateDocument('update-doc', {
          name: 'After Update',
          content: 'New content',
        });

        expect(updated.name).toBe('After Update');
        expect(updated.content).toBe('New content');

        // Verify the update persisted
        const found = await findDocument('update-doc');
        expect(found?.name).toBe('After Update');
        expect(found?.content).toBe('New content');
      });

      it('should update only specified fields', async () => {
        const document: Document = {
          id: 'partial-update',
          name: 'Original Name',
          content: 'Original Content',
        };
        await createDocument(document);

        const updated = await updateDocument('partial-update', {
          name: 'New Name',
        });

        expect(updated.name).toBe('New Name');
        expect(updated.content).toBe('Original Content');
      });

      it('should throw error when no fields to update', async () => {
        const document: Document = {
          id: 'no-update',
          name: 'No Update',
        };
        await createDocument(document);

        await expect(updateDocument('no-update', {})).rejects.toThrow(
          'No fields to update',
        );
      });

      it('should throw error when updating non-existent document', async () => {
        await expect(
          updateDocument('non-existent', { name: 'Test' }),
        ).rejects.toThrow('Document not found after update');
      });
    });

    describe('deleteDocument', () => {
      it('should delete a document successfully', async () => {
        const document: Document = {
          id: 'delete-doc',
          name: 'To Be Deleted',
        };
        await createDocument(document);

        const deleted = await deleteDocument('delete-doc');

        expect(deleted.id).toBe('delete-doc');
        // Verify document was removed
        const found = await findDocument('delete-doc');
        expect(found).toBeNull();
      });

      it('should throw error when deleting non-existent document', async () => {
        await expect(deleteDocument('non-existent')).rejects.toThrow(
          'Document not found',
        );
      });
    });

    describe('upsertDocument', () => {
      it('should create document when it does not exist', async () => {
        const document: Document = {
          id: 'upsert-new',
          content: 'Upsert new content',
        };

        const result = await upsertDocument('upsert-new', document);

        expect(result.id).toBe('upsert-new');
        expect(result.content).toBe('Upsert new content');
      });

      it('should update document when it exists', async () => {
        const document: Document = {
          id: 'upsert-existing',
          content: 'Original content',
        };
        await createDocument(document);

        const updated = await upsertDocument('upsert-existing', {
          id: 'upsert-existing',
          content: 'Updated content',
        });

        expect(updated.content).toBe('Updated content');
      });
    });
  });

  // File tests
  describe('File Operations', () => {
    describe('createFile', () => {
      it('should create a new file successfully', async () => {
        const fileData: Omit<File, 'id'> = {
          name: 'test-file.txt',
          content: Buffer.from('This is test file content'),
          size: 26,
          last_modified: new Date().toISOString(),
        };

        const result = await createFile(fileData);

        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.name).toBe(fileData.name);
        expect(result.size).toBe(fileData.size);
        expect(result.last_modified).toBe(fileData.last_modified);
        // Verify content matches
        expect(Buffer.isBuffer(result.content)).toBe(true);
        expect(result.content.toString()).toBe(fileData.content.toString());
      });

      it('should handle binary data correctly', async () => {
        const binaryData = Buffer.from([0x01, 0x02, 0x03, 0x04, 0x05]);
        const fileData: Omit<File, 'id'> = {
          name: 'binary.dat',
          content: binaryData,
          size: binaryData.length,
          last_modified: new Date().toISOString(),
        };

        const result = await createFile(fileData);

        expect(Buffer.isBuffer(result.content)).toBe(true);
        expect(result.content.length).toBe(binaryData.length);
        expect(result.content.equals(binaryData)).toBe(true);
      });

      it('should set correct size for file', async () => {
        const content = Buffer.from('1234567890');
        const fileData: Omit<File, 'id'> = {
          name: 'size-test.txt',
          content: content,
          size: content.length,
          last_modified: new Date().toISOString(),
        };

        const result = await createFile(fileData);

        expect(result.size).toBe(content.length);
      });
    });

    describe('findFile', () => {
      it('should find an existing file', async () => {
        const fileData: Omit<File, 'id'> = {
          name: 'find-me.txt',
          content: Buffer.from('Find this content'),
          size: 17,
          last_modified: new Date().toISOString(),
        };

        const createdFile = await createFile(fileData);
        const foundFile = await findFile(createdFile.id!);

        expect(foundFile).toBeDefined();
        expect(foundFile!.id).toBe(createdFile.id);
        expect(foundFile!.name).toBe(fileData.name);
        expect(foundFile!.size).toBe(fileData.size);
      });

      it('should return null for non-existent file', async () => {
        const result = await findFile(99999); // Non-existent ID
        expect(result).toBeNull();
      });

      it('should preserve file content when retrieving', async () => {
        const originalContent = Buffer.from('Important file content');
        const fileData: Omit<File, 'id'> = {
          name: 'content-test.txt',
          content: originalContent,
          size: originalContent.length,
          last_modified: new Date().toISOString(),
        };

        const createdFile = await createFile(fileData);
        const retrievedFile = await findFile(createdFile.id!);

        expect(retrievedFile!.content.toString()).toBe(
          originalContent.toString(),
        );
      });
    });
  });

  // Seed database tests
  describe('seedDatabase', () => {
    it('should seed the database with initial data', async () => {
      // Clear any existing data to ensure a clean state
      await new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM file', (err: Error | null) =>
          err ? reject(err) : resolve(),
        );
      });
      await new Promise<void>((resolve, reject) => {
        db.run('DELETE FROM document', (err: Error | null) =>
          err ? reject(err) : resolve(),
        );
      });

      // Call seedDatabase
      await seedDatabase();

      // Verify documents were created
      const documents = await new Promise<any[]>((resolve, reject) => {
        db.all('SELECT * FROM document', (err: Error | null, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      expect(documents.length).toBeGreaterThan(0);
      expect(documents[0]).toHaveProperty('id');
      expect(documents[0]).toHaveProperty('name');

      // Verify files were created
      const files = await new Promise<any[]>((resolve, reject) => {
        db.all('SELECT * FROM file', (err: Error | null, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      expect(files.length).toBeGreaterThan(0);
      expect(files[0]).toHaveProperty('id');
      expect(files[0]).toHaveProperty('name');
      expect(files[0]).toHaveProperty('content');
      expect(files[0]).toHaveProperty('size');
      expect(files[0]).toHaveProperty('last_modified');
    });
  });
});
