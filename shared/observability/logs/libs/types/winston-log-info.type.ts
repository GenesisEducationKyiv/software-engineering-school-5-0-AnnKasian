import { type TransformableInfo } from "logform";

interface ExtendedTransformableInfo extends TransformableInfo {
  timestamp?: string;
  context?: string;
}

type WinstonLogInfo = ExtendedTransformableInfo;

export { type WinstonLogInfo };
