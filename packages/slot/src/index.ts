import { getServices, getSlots, getSlot, createBooking } from "./api";
import { createApiClient, type ApiClient, type Slot } from "./client";

class SlotClient {
  private readonly token: string;
  private readonly client: ApiClient;

  constructor(basalf_token: string) {
    this.token = basalf_token;
    this.client = createApiClient(basalf_token);
  }

  async getServices() {
    return await getServices(this.client, this.token);
  }

  async getSlots(startDate: string, endDate: string, serviceId?: string) {
    return await getSlots(this.client, this.token, startDate, endDate, serviceId || "all");
  }

  async getSlot(slotId: string): Promise<Slot | null> {
    return await getSlot(this.client, this.token, slotId);
  }

  async createBooking(booking: {
    serviceId: string;
    slotId?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    additionalInfo?: string;
    startDate: string;
    endDate: string;
    numberOfPerson: number;
  }) {
    return await createBooking(this.client, this.token, booking);
  }
}

export default SlotClient;

export type { Service, Slot, Booking } from "./client";
