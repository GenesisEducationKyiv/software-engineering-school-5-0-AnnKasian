import { IsNotEmpty, IsString } from "class-validator";

class WeatherQueryDto {
  @IsString()
  @IsNotEmpty()
  city!: string;
}

export { WeatherQueryDto };
