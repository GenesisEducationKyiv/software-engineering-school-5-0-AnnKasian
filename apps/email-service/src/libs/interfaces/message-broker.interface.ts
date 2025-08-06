interface IMessageBroker<T = unknown> {
  publish(topic: string, message: unknown): Promise<void>;
  subscribe(
    topic: string,
    handler: (message: T) => Promise<void>
  ): Promise<void>;
}

export { type IMessageBroker };
