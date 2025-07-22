import path from "path";
import { firstValueFrom } from "rxjs";
import request from "supertest";
import {
  ClientProxyFactory,
  Transport,
  type ClientGrpc,
} from "@nestjs/microservices";
import { GRPC_SERVICES, TIMEOUT } from "../../../../shared/libs/enums/enums.js";
import { type IWeatherService } from "../../src/libs/interfaces/interfaces.js";

describe("E2E Benchmark Tests", () => {
  const httpUrl = "http://localhost:7064";
  let weatherService: IWeatherService;
  let grpcClient: ClientGrpc;

  beforeAll(() => {
    grpcClient = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: "weather",
        protoPath: path.join(process.cwd(), "shared/proto/weather.proto"),
        url: "localhost:7063",
      },
    }) as ClientGrpc;

    weatherService = grpcClient.getService<IWeatherService>(
      GRPC_SERVICES.WEATHER_SERVICE
    );
  });

  describe("/Get weather by GRPC", () => {
    it(
      "should get weather by GRPC",
      async () => {
        await testDurationBased(async () => {
          const response = await firstValueFrom(
            weatherService.getWeather({ city: "Kyiv" })
          );
          expect(response).not.toBeNull();
        }, "GRPC");
      },
      TIMEOUT.DEFAULT_TIMEOUT
    );
  });

  describe("/Get weather by HTTP", () => {
    it(
      "should get weather by HTTP",
      async () => {
        await testDurationBased(async () => {
          const response = await request(httpUrl)
            .get("/weather?city=Kyiv")
            .expect(200);
          expect(response).not.toBeNull();
        }, "HTTP");
      },
      TIMEOUT.DEFAULT_TIMEOUT
    );
  });
});

describe("E2E Benchmark Amount Tests", () => {
  const httpUrl = "http://localhost:7064";
  const amount = 10000;
  let weatherService: IWeatherService;
  let grpcClient: ClientGrpc;

  beforeAll(() => {
    grpcClient = ClientProxyFactory.create({
      transport: Transport.GRPC,
      options: {
        package: "weather",
        protoPath: path.join(process.cwd(), "shared/proto/weather.proto"),
        url: "localhost:7063",
      },
    }) as ClientGrpc;

    weatherService = grpcClient.getService<IWeatherService>("WeatherService");
  });

  describe("/Get weather by GRPC", () => {
    it(
      "should get weather by GRPC",
      async () => {
        await testVolumeBased(
          async () => {
            const response = await firstValueFrom(
              weatherService.getWeather({ city: "Kyiv" })
            );
            expect(response).not.toBeNull();
          },
          amount,
          "GRPC"
        );
      },
      TIMEOUT.TEST_VOLUME_TIMEOUT
    );
  });

  describe("/Get weather by HTTP", () => {
    it(
      "should get weather by HTTP",
      async () => {
        await testVolumeBased(
          async () => {
            const response = await request(httpUrl)
              .get("/weather?city=Kyiv")
              .expect(200);
            expect(response).not.toBeNull();
          },
          amount,
          "HTTP"
        );
      },
      TIMEOUT.TEST_VOLUME_TIMEOUT
    );
  });
});

const testDurationBased = async (
  handle: () => Promise<void>,
  communicationType: string
) => {
  const now = Date.now();
  const durations: number[] = [];

  while (Date.now() - now < 1000) {
    const start = Date.now();

    await handle();

    const end = Date.now();
    durations.push(end - start);
  }

  const total = durations.length;
  const average = durations.reduce((a, b) => a + b, 0) / durations.length;
  console.log(`Total: ${total}, Average: ${average}ns, ${communicationType}`);
};

const testVolumeBased = async (
  handle: () => Promise<void>,
  amount: number,
  communicationType: string
) => {
  const start = Date.now();

  for (let i = 0; i < amount; i++) {
    await handle();
  }

  const end = Date.now();
  const duration = end - start;

  console.log(
    `Amount: ${amount}, Duration: ${duration}ms, ${communicationType}`
  );
};
