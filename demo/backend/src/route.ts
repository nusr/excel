import Koa from 'koa';
import Router from '@koa/router';
import { PrismaClient } from '@prisma/client';
import cors from '@koa/cors';
import path from 'path';
import koaBody from 'koa-body';
import fs from 'fs';

const app = new Koa();
const prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] });
const router = new Router();

app.use(cors());
app.use(koaBody({ multipart: true, json: true }));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = { message: (err as Error).message, stack: (err as Error).stack };
  }
});

router.get('/', (ctx: Koa.Context) => {
  const htmlText: string = `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>preview</title>
</head>
<body>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" accept="image/*">
    <input type="submit" value="upload image">
  </form>
  <div id="image-preview"></div>

  <script>
    document.querySelector('form').addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(this);

      fetch('/upload', {
        method: 'POST',
        body: formData
      })
     .then(response => response.json())
     .then(data => {
          if (data.filePath) {
            const img = document.createElement('img');
            img.src = data.filePath;
            document.getElementById('image-preview').innerHTML = '';
            document.getElementById('image-preview').appendChild(img);
          }
        });
    });
  </script>
</body>
</html>`;
  ctx.type = 'html';
  ctx.body = htmlText;
});

const UPLOAD_DIR = '/uploads/';

router.post('/upload', async (ctx: Koa.Context) => {
  const uploadDir = path.join(__dirname, '..', UPLOAD_DIR);
  const file = ctx.request.files?.file;
  ctx.assert(file, 401, 'file is required');
  const oldFilePath = (file as any).filepath;
  const reader = fs.createReadStream(oldFilePath);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const fileName =
    Date.now() +
    '_' +
    Math.floor(Math.random() * 1e9) +
    '_' +
    (file as any).originalFilename;
  const filePath = path.join(uploadDir, fileName);
  const stream = fs.createWriteStream(filePath);
  return new Promise<void>((resolve, reject) => {
    reader.pipe(stream);

    stream.on('finish', () => {
      ctx.body = {
        filePath: '/upload/' + encodeURIComponent(fileName),
      };
      resolve();
    });

    stream.on('error', (err) => {
      ctx.status = 500;
      ctx.body = { message: err?.message, stack: err?.stack };
      reject(err);
    });
  });
});
router.get('/upload/:fileName', (ctx: Koa.Context) => {
  const fileName = ctx.params.fileName;
  ctx.assert(fileName, 401, 'fileName should be provided');
  const filePath = path.join(
    __dirname,
    '..',
    UPLOAD_DIR + decodeURIComponent(fileName),
  );
  ctx.type = path.extname(filePath);
  ctx.body = fs.createReadStream(filePath);
});

router.post('/document', async (ctx: Koa.Context) => {
  const { id, name } = ctx.request.body;
  ctx.assert(typeof name === 'string', 401, 'name should be a string');
  ctx.assert(id, 401, 'id should be provided');
  const result = await prisma.document.create({
    data: { name, id, create_time: new Date().toISOString() },
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
  const { name, content } = ctx.request.body;
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
  const { room: id, data } = ctx.request.body;
  const content = data?.excel?.content;
  ctx.assert(content, 401, 'content should be provided');
  const realContent = JSON.stringify(content);
  const result = await prisma.document.upsert({
    create: {
      content: realContent,
      id,
      create_time: new Date().toISOString(),
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
