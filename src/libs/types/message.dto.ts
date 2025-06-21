import { ApiProperty } from "@nestjs/swagger";

class MessageDto {
  @ApiProperty({ description: "Success message" })
  public message!: string;

  @ApiProperty({ description: "Success status code" })
  public statusCode!: number;
}

export { MessageDto };
