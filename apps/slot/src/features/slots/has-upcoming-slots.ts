import { Slot } from "@repo/apis";
import { addYears } from "date-fns";

// A year out is plenty to tell "nothing configured yet" apart from "just
// hasn't gotten to next quarter's availability" - past slots don't count,
// only whether a customer could book something starting now.
export async function hasUpcomingSlots(idToken: string): Promise<boolean> {
  const now = new Date();
  const slots = await Slot.getSlots(idToken, now.toISOString(), addYears(now, 1).toISOString());
  return (slots?.length ?? 0) > 0;
}
