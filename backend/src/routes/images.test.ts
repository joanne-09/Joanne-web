import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import test from 'node:test';
import express from 'express';
import cloudinary from '../cloudinary';
import imagesRouter from './images';

const startTestServer = () => {
  const app = express();
  app.use('/api/images', imagesRouter);
  const server = app.listen(0);

  return {
    server,
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
  };
};

test('GET /api/images/random fetches images from every travel folder, including folders without year prefixes', async () => {
  const folders = [
    { name: '2019-Paris' },
    { name: '2023-Busan' },
    { name: '2024-Tokyo' },
    { name: '2025-Italy' },
    { name: '2025-Okinawa' },
    { name: '2026-Tokyo' },
    { name: 'Sun Moon Lake' },
    { name: 'Tainan' },
    { name: 'Yilan' },
  ];

  (cloudinary.api as any).sub_folders = async () => ({ folders });
  (cloudinary as any).search = {
    expression(expression: string) {
      const folderName = expression.match(/^folder:Joanne-web\/(.+)\/$/)?.[1];

      return {
        max_results() {
          return {
            async execute() {
              return {
                resources: [
                  {
                    public_id: `${folderName}/cover`,
                    secure_url: `https://res.cloudinary.com/demo/image/upload/v123/Joanne-web/${folderName}/cover.jpg`,
                    width: 1200,
                    height: 800,
                  },
                ],
              };
            },
          };
        },
      };
    },
  };

  const { server, url } = startTestServer();

  try {
    const response = await fetch(`${url}/api/images/random`);
    const data = await response.json() as {
      images: Array<{
        folder: string;
        originalUrl: string;
        thumbnailUrl: string;
        url: string;
      }>;
    };

    assert.equal(response.status, 200);
    assert.match(response.headers.get('cache-control') || '', /s-maxage=3600/);
    assert.deepEqual(
      data.images.map((image) => image.folder),
      folders.map((folder) => folder.name),
    );
    assert.match(data.images[0].originalUrl, /\/upload\/v123\/Joanne-web\//);
    assert.match(data.images[0].url, /\/upload\/f_auto,q_auto:eco,c_limit,w_1600,dpr_auto\/v123\/Joanne-web\//);
    assert.match(data.images[0].thumbnailUrl, /\/upload\/f_auto,q_auto:eco,c_fill,g_auto,w_720,h_480,dpr_auto\/v123\/Joanne-web\//);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('GET /api/images returns optimized cached URLs for a specific travel folder', async () => {
  (cloudinary as any).search = {
    expression(expression: string) {
      assert.equal(expression, 'folder:Joanne-web/Tainan/');

      return {
        max_results() {
          return {
            async execute() {
              return {
                resources: [
                  {
                    public_id: 'Joanne-web/Tainan/night-market',
                    secure_url: 'https://res.cloudinary.com/demo/image/upload/v456/Joanne-web/Tainan/night-market.jpg',
                    width: 1800,
                    height: 1200,
                  },
                ],
                next_cursor: 'next-page',
              };
            },
          };
        },
      };
    },
  };

  const { server, url } = startTestServer();

  try {
    const response = await fetch(`${url}/api/images?folder=Tainan`);
    const data = await response.json() as {
      images: Array<{
        originalUrl: string;
        thumbnailUrl: string;
        url: string;
      }>;
      next_cursor?: string;
    };

    assert.equal(response.status, 200);
    assert.equal(data.next_cursor, 'next-page');
    assert.match(response.headers.get('cache-control') || '', /s-maxage=3600/);
    assert.equal(data.images[0].originalUrl, 'https://res.cloudinary.com/demo/image/upload/v456/Joanne-web/Tainan/night-market.jpg');
    assert.match(data.images[0].url, /\/upload\/f_auto,q_auto:eco,c_limit,w_1600,dpr_auto\/v456\/Joanne-web\/Tainan\/night-market\.jpg$/);
    assert.match(data.images[0].thumbnailUrl, /\/upload\/f_auto,q_auto:eco,c_fill,g_auto,w_720,h_480,dpr_auto\/v456\/Joanne-web\/Tainan\/night-market\.jpg$/);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
