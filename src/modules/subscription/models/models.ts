import { type Frequency } from "../enums/enums.js";

class SubscriptionModel {
  public readonly id: string;
  public readonly email: string;
  public readonly city: string;
  public readonly frequency: Frequency;
  public readonly confirmed: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    city: string,
    frequency: Frequency,
    confirmed: boolean = false,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.city = city;
    this.frequency = frequency;
    this.confirmed = confirmed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public confirm(): SubscriptionModel {
    return new SubscriptionModel(
      this.id,
      this.email,
      this.city,
      this.frequency,
      true,
      this.createdAt,
      new Date()
    );
  }

  public isConfirmed(): boolean {
    return this.confirmed;
  }
}

export { SubscriptionModel };
