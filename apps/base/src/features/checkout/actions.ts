"use server";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getLocale, redirect } from "@repo/i18n";
import { env } from "@repo/config";
import { BasePublic, StripePublic } from "@repo/apis";
import { searchMapboxAddress } from "@/features/organization/mapbox";
import type { AddressSuggestion } from "@/features/organization/mapbox";

const DRAFT_ORG_COOKIE = "checkout_draft_organization";
// Mirrors base-user-mgt-bff's DRAFT_TTL_SECONDS - the draft org itself
// expires backend-side on the same schedule, so the cookie shouldn't outlive
// it.
const DRAFT_TTL_SECONDS = 10 * 24 * 60 * 60;

const DEFAULT_PLAN_ID = "book" as const;

type DraftOrganization = { organizationId: string; name: string };
type SignedDraftOrganization = DraftOrganization & { sig: string };

// httpOnly keeps browser JS from reading/writing the cookie, but the value
// itself is plain JSON - anyone with devtools access to their own browser
// (or a raw request) can still edit it. Without a signature, an edited
// organizationId or name would be trusted as-is: organizationId feeds
// straight into opening a Stripe Checkout Session, and name is rendered
// on the payment page. The HMAC covers both fields together so tampering
// with either fails verification instead of being trusted.
//
// Derived from NEXTAUTH_SECRET rather than using it directly - rotating the
// auth secret (e.g. incident response) shouldn't also silently invalidate
// every in-flight checkout draft; a scoped subkey decouples the two.
function draftOrgSecret(): Buffer {
  return createHmac("sha256", env.auth.secret()).update("checkout-draft-organization").digest();
}

// organizationId comes from generateDisplayId (alphanumeric, no separators),
// so it can't collide with the ":" join against an attacker-chosen name.
function signDraftOrganization(organizationId: string, name: string): string {
  return createHmac("sha256", draftOrgSecret()).update(`${organizationId}:${name}`).digest("hex");
}

function hasValidSignature(organizationId: string, name: string, sig: string): boolean {
  const expected = Buffer.from(signDraftOrganization(organizationId, name), "hex");
  const given = Buffer.from(sig, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function getDraftOrganization(): Promise<DraftOrganization | null> {
  const store = await cookies();
  const raw = store.get(DRAFT_ORG_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SignedDraftOrganization>;
    if (
      !parsed.organizationId ||
      !parsed.name ||
      !parsed.sig ||
      !hasValidSignature(parsed.organizationId, parsed.name, parsed.sig)
    ) {
      return null;
    }
    return { organizationId: parsed.organizationId, name: parsed.name };
  } catch {
    return null;
  }
}

// Public, unauthenticated - no isAdmin gate like organization/actions.ts's
// searchAddress, this runs before the user has any session. The
// MIN_QUERY_LENGTH floor is enforced inside searchMapboxAddress itself
// (not just the client debounce), since this action can be called directly.
export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  return searchMapboxAddress(query);
}

export async function createDraftOrganization(input: {
  name: string;
  timezone: string;
  language?: string;
  email?: string;
  currency?: string;
  isOnBookWebsite?: boolean;
  address?: BasePublic.Address;
}): Promise<{ success: false; error: string } | void> {
  const existing = await getDraftOrganization();
  if (existing) {
    // Already have a draft for this browser - don't let a stale form
    // re-submit create a second org, just send them on to payment.
    const locale = await getLocale();
    redirect({ href: "/checkout/payment", locale });
  }

  const organization = await BasePublic.createDraftOrganization(input);
  if (!organization) {
    return { success: false, error: "Failed to create organization" };
  }

  const store = await cookies();
  store.set(
    DRAFT_ORG_COOKIE,
    JSON.stringify({
      organizationId: organization.organizationId,
      name: organization.name,
      sig: signDraftOrganization(organization.organizationId, organization.name),
    } satisfies SignedDraftOrganization),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: DRAFT_TTL_SECONDS,
    },
  );

  const locale = await getLocale();
  redirect({ href: "/checkout/payment", locale });
}

// "Go back to organization creation" on the payment step - the public API
// has no draft-org update endpoint, so there's no way to edit it in place.
// Abandoning it and starting over is the only option; the orphaned draft
// still expires on its own via the backend TTL.
export async function abandonDraftOrganization() {
  const store = await cookies();
  store.delete(DRAFT_ORG_COOKIE);
  const locale = await getLocale();
  redirect({ href: "/checkout", locale });
}

// Fired once the success page mounts - by then the draft has paid (the
// webhook will flip it to a real org shortly), so nothing should ever send
// this browser back through the draft flow again. Left uncleared, a later
// visit to /checkout would bounce to /checkout/payment and 403 there since
// the org already has a subscription.
export async function clearDraftOrganizationCookie() {
  const store = await cookies();
  store.delete(DRAFT_ORG_COOKIE);
}

export async function createSignupCheckoutSession(): Promise<
  { clientSecret: string } | { error: string }
> {
  const draft = await getDraftOrganization();
  if (!draft) {
    return { error: "No draft organization for this session" };
  }

  const result = await StripePublic.createSignupCheckoutSession(
    draft.organizationId,
    DEFAULT_PLAN_ID,
  );
  if (!result) {
    return { error: "Failed to start checkout" };
  }
  if ("error" in result) {
    return { error: result.error };
  }
  if (!result.clientSecret) {
    return { error: "Failed to start checkout" };
  }
  return { clientSecret: result.clientSecret };
}
