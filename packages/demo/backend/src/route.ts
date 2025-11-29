import Koa from 'koa';
import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import cors from '@koa/cors';
import path from 'path';
import koaBody from 'koa-body';
import fs from 'fs';
import stream from 'stream';

const app = new Koa();
const prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] });
const router = new Router();
const UPLOAD_PREFIX = '/upload/';

app.use(cors());
app.use(koaBody({ multipart: true, json: true }));

app.use(async (ctx, next) => {
  try {
    console.log(ctx.method, ctx.url);
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: (err as Error).message, stack: (err as Error).stack };
  }
});

async function sendFile(ctx: Koa.Context) {
  const fileId = parseInt(ctx.params.fileId, 10);
  ctx.assert(fileId, 401, 'fileId should be provided');
  const result = await prisma.file.findFirst({
    where: { id: fileId },
  });
  if (!result) {
    ctx.throw(404);
  }
  ctx.response.status = 200;
  ctx.response.lastModified = result.last_modified;
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
  ctx.assert(list, 401, 'file is required');
  const file = Array.isArray(list) ? list[0] : list;
  const reader = await fs.promises.readFile(file.filepath);
  const name = file.originalFilename ?? '';
  const { content: _content, ...rest } = await prisma.file.create({
    data: {
      name,
      content: new Uint8Array(reader),
      size: file.size,
      last_modified: file.mtime ?? new Date(),
    },
  });
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

router.post('/document', async (ctx: Koa.Context) => {
  const { id, name } = (ctx.request as any).body;
  ctx.assert(typeof name === 'string', 401, 'name should be a string');
  ctx.assert(id, 401, 'id should be provided');
  const result = await prisma.document.create({
    data: { name, id },
  });
  ctx.body = result;
});

router.delete('/document/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  ctx.assert(id, 401, 'id should be provided');
  const result = await prisma.document.delete({ where: { id } });
  ctx.body = result;
});

router.put('/document/:id', async (ctx: Koa.Context) => {
  const { name, content } = (ctx.request as any).body;
  const id = ctx.params.id;
  ctx.assert(name || content, 401, 'name or content should be provided');
  ctx.assert(id, 401, 'id should be provided');
  const result = await prisma.document.update({
    data: { name, content },
    where: { id },
  });
  ctx.body = result;
});

router.get('/document/:id', async (ctx: Koa.Context) => {
  const id = ctx.params.id;
  ctx.assert(id, 401, 'id should be provided');
  const result = await prisma.document.findFirst({
    where: { id },
  });
  ctx.body = result;
});

router.get('/documents', async (ctx: Koa.Context) => {
  const result = await prisma.document.findMany({
    orderBy: { create_time: 'desc' },
  });
  ctx.body = result;
});

router.post('/sync', async (ctx: Koa.Context) => {
  const { room: id, data } = (ctx.request as any).body;
  const content = data?.excel?.content;
  ctx.assert(content, 401, 'content should be provided');
  const realContent = JSON.stringify(content);
  const result = await prisma.document.upsert({
    create: {
      content: realContent,
      id,
    },
    update: {
      content: realContent,
    },
    where: {
      id,
    },
  });
  ctx.body = result;
});

app.use(router.routes()).use(router.allowedMethods());

export default app;
