import { type EmailCommand } from "../types/types.js";

interface IMessageBroker {
  publish(queue: string, message: EmailCommand): Promise<void>;
  subscribe(
    queue: string,
    handler: (message: EmailCommand) => Promise<void>
  ): Promise<void>;
}

export { type IMessageBroker };
