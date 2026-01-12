import Koa from 'koa';
import Router from '@koa/router';
import * as db from './db';
import cors from '@koa/cors';
import path from 'path';
import koaBody from 'koa-body';
import fs from 'fs';
import stream from 'stream';

const app = new Koa();
const router = new Router();
const UPLOAD_PREFIX = '/upload/';

app.use(cors());
app.use(koaBody({ multipart: true, json: true }));

// Error handling middleware
export async function errorHandler(
  ctx: Koa.Context,
  next: () => Promise<void>,
) {
  try {
    console.log(`${ctx.method} ${ctx.url}`);
    await next();

    if (ctx.status === 404 && !ctx.body) {
      ctx.status = 404;
      ctx.body = { error: 'Not Found', message: `Path ${ctx.url} not found` };
    }
  } catch (err) {
    const error = err as Error & { status?: number };

    // Check if error has a custom status code
    if (error.status) {
      ctx.status = error.status;
      ctx.body = { error: error.message || 'Error', message: error.message };
    } else if (ctx.status >= 400) {
      ctx.body = { error: 'Bad Request', message: error.message };
    } else {
      ctx.status = 500;
      ctx.body = {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };
    }
  }
}

app.use(errorHandler);

export function assertParam(
  ctx: Koa.Context,
  param: any,
  message: string,
): asserts param {
  if (!param) {
    ctx.throw(400, message);
  }
}

export function assertString(
  ctx: Koa.Context,
  param: any,
  message: string,
): asserts param is string {
  if (typeof param !== 'string') {
    ctx.throw(400, message);
  }
}

export function assertNumber(
  ctx: Koa.Context,
  param: any,
  message: string,
): asserts param is number {
  if (typeof param !== 'number' || isNaN(param)) {
    ctx.throw(400, message);
  }
}

export async function sendFile(ctx: Koa.Context) {
  const fileId = parseInt(ctx.params.fileId, 10);

  // Validate fileId is a valid number before proceeding
  if (isNaN(fileId)) {
    ctx.throw(400, 'fileId should be a valid number');
    return; // Return after throwing to ensure no further execution
  }
  assertNumber(ctx, fileId, 'fileId should be a valid number');

  const result = await db.findFile(fileId);
  if (!result) {
    ctx.throw(404, `File with ID ${fileId} not found`);
    return; // Return after throwing to ensure no further execution
  }

  ctx.response.lastModified = new Date(result.last_modified ?? new Date());
  ctx.response.length = result.size;
  ctx.type = path.extname(result.name);

  switch (ctx.request.method) {
    case 'HEAD':
      ctx.status = ctx.request.fresh ? 304 : 200;
      break;
    case 'GET':
      if (ctx.request.fresh) {
        ctx.status = 304;
      } else {
        const bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(result.content));
        ctx.body = bufferStream;
      }
      break;
  }
}

router.get('/', async (ctx: Koa.Context) => {
  const html = await fs.promises.readFile(
    path.join(__dirname, '../index.html'),
    'utf-8',
  );
  ctx.type = 'html';
  ctx.body = html;
});

router.post('/upload', async (ctx: Koa.Context) => {
  const list = (ctx.request as any).files?.file;
  assertParam(ctx, list, 'No file uploaded');

  const file = Array.isArray(list) ? list[0] : list;

  assertString(ctx, file.originalFilename, 'File name is required');
  assertNumber(ctx, file.size, 'File size must be a number');

  const reader = await fs.promises.readFile(file.filepath);
  const result = await db.createFile({
    name: file.originalFilename ?? '',
    content: reader,
    size: file.size,
    last_modified: file.mtime,
  });

  const { content: _content, ...rest } = result;
  ctx.body = {
    ...rest,
    filePath: UPLOAD_PREFIX + rest.id,
  };
});

router.get(`${UPLOAD_PREFIX}:fileId`, async (ctx: Koa.Context) => {
  await sendFile(ctx);
});
router.head(`${UPLOAD_PREFIX}:fileId`, async (ctx: Koa.Context) => {
  await sendFile(ctx);
});

// POST create document
export const createDocument = async (ctx: Koa.Context) => {
  const { id, name } = (ctx.request as any).body;
  assertString(ctx, id, 'Document ID must be a string');
  assertString(ctx, name, 'Document name must be a string');

  const result = await db.createDocument({ name, id });
  ctx.status = 201;
  ctx.body = result;
};

// DELETE document
export const deleteDocument = async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  assertString(ctx, id, 'Document ID must be a string');

  const result = await db.deleteDocument(id);
  ctx.body = result;
};

// PUT update document
export const updateDocument = async (ctx: Koa.Context) => {
  const { name, content } = (ctx.request as any).body;
  const id = ctx.params.id;

  assertString(ctx, id, 'Document ID must be a string');
  assertParam(ctx, name || content, 'Either name or content must be provided');

  const result = await db.updateDocument(id, { name, content });
  ctx.body = result;
};

// GET document by id
export const findDocument = async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  assertString(ctx, id, 'Document ID must be a string');

  const result = await db.findDocument(id);
  if (!result) {
    ctx.throw(404, `Document with ID ${id} not found`);
  }
  ctx.body = result;
};

// GET all documents
export const listDocuments = async (ctx: Koa.Context) => {
  const orderBy = (ctx.query.orderBy as 'asc' | 'desc') || 'desc';

  if (orderBy !== 'asc' && orderBy !== 'desc') {
    ctx.throw(400, 'orderBy must be either "asc" or "desc"');
  }

  const result = await db.findAllDocuments(orderBy);
  ctx.body = result;
};

// Sync document
export const sync = async (ctx: Koa.Context) => {
  const body = (ctx.request as any).body;
  const { room: id, data } = body;

  const content = data?.excel?.content;

  if (!content) {
    ctx.body = { message: 'content should be provided' };
    return;
  }
  assertString(ctx, id, 'Room ID must be a string');
  const realContent = JSON.stringify(content);
  const result = await db.upsertDocument(id, {
    content: realContent,
    id,
  });

  ctx.body = result;
};

// Route definitions
router.post('/document', createDocument);
router.delete('/document/:id', deleteDocument);
router.put('/document/:id', updateDocument);
router.get('/document/:id', findDocument);
router.get('/documents', listDocuments);
router.post('/sync', sync);

app.use(router.routes()).use(router.allowedMethods());

export default app;
