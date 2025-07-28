import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Frequency } from "../../../../../shared/libs/enums/enums.js";
import {
  SwaggerBody,
  SwaggerOperation,
  SwaggerParam,
  SwaggerResponse,
} from "../../libs/swagger-docs/swagger-docs.js";
import {
  MessageDto,
  SubscriptionDto,
  SubscribeResponseType,
} from "../../libs/types/types.js";
import { SubscriptionService } from "./subscription.service.js";

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
    return await this.subscriptionService.subscribe(data);
  }

  @Get("/confirm/:token")
  @ApiOperation(SwaggerOperation.CONFIRM)
  @ApiParam(SwaggerParam.TOKEN)
  @ApiResponse(SwaggerResponse.CONFIRMED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async confirm(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.confirm(token);

    return {
      message: SwaggerResponse.CONFIRMED_SUCCESSFULLY.description,
      statusCode: SwaggerResponse.CONFIRMED_SUCCESSFULLY.status,
    };
  }

  @Get("/unsubscribe/:token")
  @ApiOperation(SwaggerOperation.UNSUBSCRIBE)
  @ApiResponse(SwaggerResponse.UNSUBSCRIBED_SUCCESSFULLY)
  @ApiResponse(SwaggerResponse.INVALID_TOKEN)
  @ApiResponse(SwaggerResponse.TOKEN_NOT_FOUND)
  public async unsubscribe(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.unsubscribe(token);

    return {
      message: SwaggerResponse.UNSUBSCRIBED_SUCCESSFULLY.description,
      statusCode: SwaggerResponse.UNSUBSCRIBED_SUCCESSFULLY.status,
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async hourly(): Promise<void> {
    await this.subscriptionService.sendEmails(Frequency.HOURLY);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  public async daily(): Promise<void> {
    await this.subscriptionService.sendEmails(Frequency.DAILY);
  }
}

export { SubscriptionController };
