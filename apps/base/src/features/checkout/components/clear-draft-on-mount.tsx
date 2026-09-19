"use client";

import { useEffect } from "react";
import { clearDraftOrganizationCookie } from "../actions";

// The draft cookie is httpOnly, so clearing it can only happen through a
// server action - this fires it once the success page has actually mounted
// in the browser.
export function ClearDraftOnMount() {
  useEffect(() => {
    clearDraftOrganizationCookie();
  }, []);

  return null;
}
