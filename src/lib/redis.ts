/**
 * Redis client with graceful fallback to in-memory store.
 * Works without Redis for local dev; production should use a real Redis instance.
 */

let redisClient: any = null;
const memoryStore = new Map<string, { value: string; expiresAt: number }>();

async function getClient() {
    if (redisClient) return redisClient;

    if (process.env.REDIS_URL) {
        try {
            const Redis = (await import("ioredis")).default;
            redisClient = new Redis(process.env.REDIS_URL, {
                maxRetriesPerRequest: 1,
                lazyConnect: true,
                connectTimeout: 3000,
            });
            await redisClient.connect();
            return redisClient;
        } catch {
            console.warn("Redis unavailable, using in-memory fallback");
            redisClient = null;
        }
    }
    return null;
}

/** Memory fallback cleanup */
function cleanupMemory() {
    const now = Date.now();
    for (const [key, entry] of memoryStore) {
        if (entry.expiresAt && entry.expiresAt < now) {
            memoryStore.delete(key);
        }
    }
}

export async function cacheGet(key: string): Promise<string | null> {
    const client = await getClient();
    if (client) {
        return client.get(key);
    }
    cleanupMemory();
    const entry = memoryStore.get(key);
    if (entry && entry.expiresAt > Date.now()) return entry.value;
    memoryStore.delete(key);
    return null;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number): Promise<void> {
    const client = await getClient();
    if (client) {
        await client.set(key, value, "EX", ttlSeconds);
        return;
    }
    memoryStore.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export async function cacheIncr(key: string): Promise<number> {
    const client = await getClient();
    if (client) {
        return client.incr(key);
    }
    cleanupMemory();
    const entry = memoryStore.get(key);
    const current = entry ? parseInt(entry.value, 10) || 0 : 0;
    const next = current + 1;
    if (entry) {
        entry.value = String(next);
    } else {
        memoryStore.set(key, { value: String(next), expiresAt: Date.now() + 900_000 });
    }
    return next;
}

export async function cacheTtl(key: string): Promise<number> {
    const client = await getClient();
    if (client) {
        return client.ttl(key);
    }
    const entry = memoryStore.get(key);
    if (!entry) return -2;
    return Math.max(0, Math.ceil((entry.expiresAt - Date.now()) / 1000));
}
