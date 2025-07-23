type MailHogAddress = {
  Relays: string | null;
  Mailbox: string;
  Domain: string;
  Params: string;
};

type MailHogContent = {
  Headers: {
    [key: string]: string[];
  };
  Body: string;
  Size: number;
  MIME: {
    Parts: unknown[];
  } | null;
};

type MailHogMessage = {
  ID: string;
  From: MailHogAddress;
  To: MailHogAddress[];
  Content: MailHogContent;
  Created: string;
  MIME: {
    Parts: unknown[];
  } | null;
  Raw: {
    From: string;
    To: string[];
    Data: string;
    Helo: string;
  };
};

type MailHogResponse = {
  total: number;
  count: number;
  start: number;
  items: MailHogMessage[];
};

export { type MailHogMessage, type MailHogResponse };
