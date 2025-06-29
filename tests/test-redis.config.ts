import { type CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

const TestRedisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async () => {
    const host = process.env.TEST_REDIS_HOST || "localhost";
    const portStr = process.env.TEST_REDIS_PORT || "6379";
    const port = parseInt(portStr, 10);

    const store = await redisStore({
      socket: {
        host,
        port,
      },
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

export { TestRedisConfig };
