import { type CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";
import { CONFIG_KEYS } from "./src/libs/enums/config.enum.js";

const RedisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>(CONFIG_KEYS.REDIS_HOST),
        port: Number.parseInt(
          configService.get<string>(CONFIG_KEYS.REDIS_PORT) as string
        ),
      },
    });

    return {
      store: () => store,
    };
  },
  inject: [ConfigService],
};

export { RedisConfig };
