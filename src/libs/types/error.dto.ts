import { ApiProperty } from "@nestjs/swagger";

class ErrorDto {
  @ApiProperty({ description: "Errror message" })
  public message!: string;

  @ApiProperty({ description: "Error status code" })
  public statusCode!: number;
}

export { ErrorDto };
