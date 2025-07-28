import { type Frequency } from "../enums/enums.js";

class Subscription {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly city: string,
    public readonly frequency: Frequency,
    public readonly token: string,
    public readonly confirmed: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  public confirm(): Subscription {
    return new Subscription(
      this.id,
      this.email,
      this.city,
      this.frequency,
      this.token,
      true,
      this.createdAt,
      new Date()
    );
  }

  public isConfirmed(): boolean {
    return this.confirmed;
  }
}

export { Subscription };
