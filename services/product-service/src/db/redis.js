import net from 'node:net';

import { redisHost, redisPort } from '../config/env.js';

const timeoutMs = 1000;

function encodeCommand(parts) {
  return `*${parts.length}\r\n${parts.map((part) => {
    const value = String(part);
    return `$${Buffer.byteLength(value)}\r\n${value}\r\n`;
  }).join('')}`;
}

function parseResponse(buffer) {
  const text = buffer.toString('utf8');
  const type = text[0];

  if (type === '+') {
    return text.slice(1, text.indexOf('\r\n'));
  }

  if (type === '-') {
    throw new Error(text.slice(1, text.indexOf('\r\n')));
  }

  if (type === '$') {
    const headerEnd = text.indexOf('\r\n');
    const length = Number(text.slice(1, headerEnd));
    if (length === -1) return null;
    return text.slice(headerEnd + 2, headerEnd + 2 + length);
  }

  if (type === ':') {
    return Number(text.slice(1, text.indexOf('\r\n')));
  }

  throw new Error('Unsupported Redis response.');
}

function sendCommand(parts) {
  if (!redisHost) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: redisHost, port: redisPort });
    const chunks = [];

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      socket.write(encodeCommand(parts));
    });

    socket.on('data', (chunk) => {
      chunks.push(chunk);
      socket.end();
    });

    socket.on('timeout', () => {
      socket.destroy(new Error('Redis command timed out.'));
    });

    socket.on('error', reject);

    socket.on('end', () => {
      try {
        resolve(parseResponse(Buffer.concat(chunks)));
      } catch (err) {
        reject(err);
      }
    });
  });
}

export async function pingRedis() {
  return sendCommand(['PING']);
}

export async function getCache(key) {
  return sendCommand(['GET', key]);
}

export async function setCache(key, value, ttlSeconds) {
  return sendCommand(['SETEX', key, ttlSeconds, value]);
}
