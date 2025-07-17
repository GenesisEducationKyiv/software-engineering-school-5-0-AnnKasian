import axios from "axios";
import { type MailHogMessage, type MailHogResponse } from "./types/types.js";

class MailHogClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8025") {
    this.baseUrl = baseUrl;
  }

  async getMessages(): Promise<MailHogMessage[]> {
    const response = await axios.get<MailHogResponse>(
      `${this.baseUrl}/api/v2/messages`
    );

    return response.data.items || [];
  }

  async clearMessages(): Promise<void> {
    await axios.delete(`${this.baseUrl}/api/v1/messages`);
  }

  async waitForMessage(
    email: string,
    timeout: number
  ): Promise<MailHogMessage> {
    const startTime = Date.now();
    const checkInterval = 300;

    while (Date.now() - startTime < timeout) {
      const messages = await this.getMessages();

      const message = messages.find((msg) =>
        msg.To?.some(
          (to) =>
            `${to.Mailbox}@${to.Domain}`.toLowerCase() === email.toLowerCase()
        )
      );

      if (message) {
        return message;
      }

      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    }

    throw new Error(`No message found for ${email} within ${timeout}ms`);
  }
}

export { MailHogClient };
