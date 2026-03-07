import { Redis } from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

const noop = {
  async get(_key: string): Promise<string | null> {
    return null;
  },
  async set(_key: string, _value: string, ..._args: (string | number)[]): Promise<void> {},
  async del(_key: string): Promise<void> {},
  async exists(_key: string): Promise<number> {
    return 0;
  },
};

function safeRedis(client: Redis): typeof noop {
  return {
    async get(key: string) {
      try {
        return await client.get(key);
      } catch (e) {
        console.warn("[redis] get failed:", e instanceof Error ? e.message : e);
        return null;
      }
    },
    async set(key: string, value: string, ...args: (string | number)[]) {
      try {
        await (client.set as unknown as (key: string, value: string, ...args: (string | number)[]) => Promise<"OK">)(key, value, ...args);
      } catch (e) {
        console.warn("[redis] set failed:", e instanceof Error ? e.message : e);
      }
    },
    async del(key: string) {
      try {
        await client.del(key);
      } catch (e) {
        console.warn("[redis] del failed:", e instanceof Error ? e.message : e);
      }
    },
    async exists(key: string) {
      try {
        return await client.exists(key);
      } catch (e) {
        console.warn("[redis] exists failed:", e instanceof Error ? e.message : e);
        return 0;
      }
    },
  };
}

const rawClient: Redis | null = REDIS_URL ? new Redis(REDIS_URL) : null;

export const redis = rawClient ? safeRedis(rawClient) : noop;
