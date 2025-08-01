import { type EmailCommand } from "../types/types.js";

interface IMessageBroker {
  publish(topic: string, message: EmailCommand): Promise<void>;
  subscribe(
    topic: string,
    handler: (message: EmailCommand) => Promise<void>
  ): Promise<void>;
}

export { type IMessageBroker };
