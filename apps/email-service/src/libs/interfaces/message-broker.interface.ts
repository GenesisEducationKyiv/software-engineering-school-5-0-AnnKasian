interface IMessageBroker {
  publish(topic: string, message: unknown): Promise<void>;
  subscribe(
    topic: string,
    handler: (message: unknown) => Promise<void>
  ): Promise<void>;
}

export { type IMessageBroker };
