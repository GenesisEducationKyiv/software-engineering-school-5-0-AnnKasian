import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

import { Frequency } from "../enums/enums.js";

class SubscriptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "Email address to subscribe" })
  public email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "City for weather updates" })
  public city!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    enum: Frequency,
    description: "Frequency of updates (hourly or daily)",
  })
  public frequency!: Frequency;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: "boolean",
    description: "Whether the subscription is confirmed",
    required: false,
    default: false,
  })
  public confirmed?: boolean;
}

export { SubscriptionDto };
