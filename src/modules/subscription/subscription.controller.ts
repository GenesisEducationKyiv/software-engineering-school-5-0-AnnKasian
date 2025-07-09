import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { httpErrorHandler } from "../../libs/helpers/helpers.js";
import { MessageDto } from "../../libs/types/types.js";
import { SubscriptionService } from "./subscription.service.js";
import {
  SwaggerBody,
  SwaggerOperation,
  SwaggerParam,
  SwaggerResponse,
} from "./swagger-docs/swagger-docs.js";
import { SubscriptionDto, SubscribeResponseType } from "./types/types.js";

@ApiTags("subscription")
@Controller()
class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Post("/subscribe")
  @ApiOperation(SwaggerOperation.SUBSCRIBE)
  @ApiBody(SwaggerBody.SUBSCRIBE)
  @ApiResponse(SwaggerResponse.SUBSCRIPTION_SUCCESSFUL)
  @ApiResponse(SwaggerResponse.SUBSCRIPTION_FAILED)
  @ApiResponse(SwaggerResponse.SUBSCRIPTION_ALREADY_EXISTS)
  public async subscribe(
    @Body() data: SubscriptionDto
  ): Promise<SubscribeResponseType> {
    try {
      return await this.subscriptionService.subscribe(data);
    } catch (error: unknown) {
      return httpErrorHandler(error);
    }
  }

  @Get("/confirm/:token")
  @ApiOperation(SwaggerOperation.CONFIRM)
  @ApiParam(SwaggerParam.TOKEN)
  @ApiResponse(SwaggerResponse.CONFIRMED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async confirm(@Param("token") token: string): Promise<MessageDto> {
    try {
      await this.subscriptionService.confirm(token);

      return {
        message: "Subscription confirmed successfully.",
        statusCode: 200,
      };
    } catch (error: unknown) {
      return httpErrorHandler(error);
    }
  }

  @Get("/unsubscribe/:token")
  @ApiOperation(SwaggerOperation.UNSUBSCRIBE)
  @ApiResponse(SwaggerResponse.UNSUBSCRIBED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async unsubscribe(@Param("token") token: string): Promise<MessageDto> {
    try {
      await this.subscriptionService.unsubscribe(token);

      return {
        message: "Subscription unsubscribed successfully.",
        statusCode: 200,
      };
    } catch (error: unknown) {
      return httpErrorHandler(error);
    }
  }
}

export { SubscriptionController };
