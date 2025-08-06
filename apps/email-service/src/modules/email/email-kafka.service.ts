import { Injectable } from "@nestjs/common";
import { EmailCommand } from "../../libs/types/types.js";
import { KafkaService } from "../kafka.service.js";

@Injectable()
class EmailKafkaService {
  constructor(private readonly kafkaService: KafkaService) {}

  async publishEmailCommand(
    topic: string,
    command: EmailCommand
  ): Promise<void> {
    await this.kafkaService.publish(topic, command);
  }

  async subscribeToEmailCommands(
    topic: string,
    handler: (command: EmailCommand) => Promise<void>
  ): Promise<void> {
    await this.kafkaService.subscribe(topic, async (message) => {
      const command = message as EmailCommand;
      await handler(command);
    });
  }
}

export { EmailKafkaService };
