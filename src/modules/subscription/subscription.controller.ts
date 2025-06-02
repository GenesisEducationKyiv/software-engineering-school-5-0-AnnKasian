import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { ErrorDto, MessageDto } from "../../libs/types/types.js";
import { SubscriptionService } from "./subscription.service.js";
import { SubscriptionDto, SubscribeResponseDto } from "./types/types.js";

@ApiTags("subscription")
@Controller()
class SubscriptionController {
  public constructor(
    private readonly subscriptionService: SubscriptionService
  ) {}

  @Post("/subscribe")
  @ApiOperation({
    summary: "Subscribe to weather updates",
    description:
      "Subscribe an email to receive weather updates for a specific city with chosen frequency.",
  })
  @ApiBody({
    type: SubscriptionDto,
    examples: {
      example: {
        value: {
          email: "example@example.com",
          city: "Kyiv",
          frequency: "hourly",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Subscription successful. Confirmation email sent.",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input.",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: "Email already subscribed.",
    type: ErrorDto,
  })
  public subscribe(
    @Body() data: SubscriptionDto
  ): Promise<SubscribeResponseDto> {
    return this.subscriptionService.subscribe(data);
  }

  @Get("/confirm/:token")
  @ApiOperation({
    summary: "Confirm email subscription",
    description:
      "Confirms a subscription using the token sent in the confirmation email.",
  })
  @ApiParam({
    name: "token",
    type: "string",
    description: "Confirmation token",
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: "Subscription confirmed successfully.",
    type: MessageDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid token.",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Token not found.",
    type: ErrorDto,
  })
  public async confirm(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.confirm(token);

    return { message: "Subscription confirmed successfully.", statusCode: 200 };
  }

  @Get("/unsubscribe/:token")
  @ApiOperation({
    summary: "Unsubscribe from weather updates",
    description:
      "Unsubscribes an email from weather updates using the token sent in emails.",
  })
  @ApiResponse({
    status: 200,
    description: "Unsubscribed successfully.",
    type: MessageDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid token.",
    type: ErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: "Token not found.",
    type: ErrorDto,
  })
  public async unsubscribe(@Param("token") token: string): Promise<MessageDto> {
    await this.subscriptionService.unsubscribe(token);

    return {
      message: "Subscription unsubscribed successfully.",
      statusCode: 200,
    };
  }
}

export { SubscriptionController };
