import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

class WeatherDto {
  @IsInt()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: "Current temperature",
  })
  public temperature?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    type: Number,
    required: false,
    description: "Current humidity percentage",
  })
  public humidity?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: "Weather description",
  })
  public description?: string;
}

export { WeatherDto };
