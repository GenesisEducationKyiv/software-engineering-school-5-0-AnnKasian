import { ErrorDto } from "../../../libs/types/types.js";
import { WeatherDto } from "../types/types.js";

const SwaggerResponse = {
  SUCCESSFUL: {
    status: 200,
    description: "Successful operation - current weather forecast returned.",
    type: WeatherDto,
  },
  FAILED: {
    status: 400,
    description: "Invalid request",
    type: ErrorDto,
  },
  NOT_FOUND: {
    status: 404,
    description: "City not found",
    type: ErrorDto,
  },
};

export { SwaggerResponse };
