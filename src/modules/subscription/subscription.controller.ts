import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { MessageDto } from "../../libs/types/types.js";
import {
  SwaggerBody,
  SwaggerOperation,
  SwaggerParam,
  SwaggerResponse,
} from "./swagger-docs/swagger-docs.js";
import { SubscriptionService } from "./subscription.service.js";
import { SubscriptionDto, SubscribeResponseDto } from "./types/types.js";

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
  public subscribe(
    @Body() data: SubscriptionDto
  ): Promise<SubscribeResponseDto> {
    return this.subscriptionService.subscribe(data);
  }

  @Get("/confirm/:token")
  @ApiOperation(SwaggerOperation.CONFIRM)
  @ApiParam(SwaggerParam.TOKEN)
  @ApiResponse(SwaggerResponse.CONFIRMED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async confirm(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.confirm(token);

    return { message: "Subscription confirmed successfully.", statusCode: 200 };
  }

  @Get("/unsubscribe/:token")
  @ApiOperation(SwaggerOperation.UNSUBSCRIBE)
  @ApiResponse(SwaggerResponse.UNSUBSCRIBED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async unsubscribe(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.unsubscribe(token);

    return {
      message: "Subscription unsubscribed successfully.",
      statusCode: 200,
    };
  }
}

export { SubscriptionController };
