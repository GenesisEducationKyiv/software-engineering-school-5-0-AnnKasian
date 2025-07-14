import { firstValueFrom } from "rxjs";
import { Inject } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { EMAIL_INJECTION_TOKENS } from "../../libs/enums/enums.js";
import { WeatherServiceException } from "../../libs/exceptions/exceptions.js";
import { type IWeatherService } from "../../libs/interfaces/interfaces.js";

class EmailWeatherClient {
  constructor(
    @Inject(EMAIL_INJECTION_TOKENS.WEATHER_SERVICE)
    private readonly weatherService: IWeatherService
  ) {}
  async get(city: string) {
    try {
      const res = await firstValueFrom(
        this.weatherService.getWeather({ city })
      );
      console.log(res);
      return res;
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        throw new WeatherServiceException(error.message);
      }

      throw new WeatherServiceException();
    }
  }
}

export { EmailWeatherClient };
