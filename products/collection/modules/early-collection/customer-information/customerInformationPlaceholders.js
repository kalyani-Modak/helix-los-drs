import { MOCK_LINKED_CUSTOMERS } from "./mockLinkedCustomers.js";

// TODO: Replace with CustomerInformationAPI.fetch... and HAxiosService when API is ready.

/** Set to true to exercise save error toast + handling. */
export const SIMULATE_SAVE_COMM_PREFERENCE_ERROR = false;

/**
 * Placeholder fetch for linked customers + embedded detail payload.
 * @returns {Promise<typeof MOCK_LINKED_CUSTOMERS>}
 */
export function loadCustomerInformationPlaceholder() {
  return Promise.resolve(MOCK_LINKED_CUSTOMERS.map((c) => ({ ...c })));
}

/**
 * Placeholder save for communication preference only.
 * TODO: POST via HAxiosService when Update Communication Preference API is ready.
 * @param {unknown} _payload — intentionally unspecified until backend contract exists
 */
export async function saveCommunicationPreferencePlaceholder(_payload) {
  if (SIMULATE_SAVE_COMM_PREFERENCE_ERROR) {
    throw new Error("SIMULATE_SAVE_COMM_PREFERENCE_ERROR");
  }
  return { success: true };
}
