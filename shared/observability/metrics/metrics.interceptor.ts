import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { ERROR_STATUS_CODES } from "../../libs/enums/enums.js";
import { DURATION } from "./libs/enums/enums.js";
import { RequestType, ResponseType } from "./libs/types/types.js";
import { CustomMetricsService } from "./metrics.service.js";

@Injectable()
class MetricsInterceptor implements NestInterceptor<unknown, unknown> {
  constructor(private readonly metricsService: CustomMetricsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<RequestType>();
    const response = context.switchToHttp().getResponse<ResponseType>();

    const { method } = request;
    const route: string = request.route?.path ?? request.url;

    return next.handle().pipe(
      tap({
        next: (): void => {
          const duration = (Date.now() - startTime) / DURATION.DEFAULT;
          const { statusCode } = response;

          this.metricsService.incrementHttpRequests(method, route, statusCode);
          this.metricsService.observeHttpDuration(method, route, duration);
        },
        error: (): void => {
          const duration = (Date.now() - startTime) / DURATION.DEFAULT;
          const statusCode: number =
            response.statusCode || ERROR_STATUS_CODES.INTERNAL_SERVER_ERROR;

          this.metricsService.incrementHttpRequests(method, route, statusCode);
          this.metricsService.observeHttpDuration(method, route, duration);
          this.metricsService.incrementErrors("http_error", "api");
        },
      })
    );
  }
}

export { MetricsInterceptor };
