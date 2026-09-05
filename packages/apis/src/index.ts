export * from "./base-user-mgt-bff";
export {
  getOrganizationsByEmail,
  getOrganizations,
  createOrganization,
  updateOrganization,
} from "./base-user-mgt-bff/api";
export {
  getPages,
  getPage,
  createPage,
  updatePage,
  deletePage,
  updateLocales,
  getLocales,
  getToken as getCMSToken,
} from "./cms-mgt-bff/api";
export type {
  Page,
  AllPages,
  Website as CmsWebsite,
  Locales,
  PageSeo,
  Block,
} from "./cms-mgt-bff";
export {
  ISO_639_1_CODES,
  ISO_639_1_CODES_WITH_FLAGS,
} from "./cms-mgt-bff/locales";

export {
  getWebsite,
  getUploadUrl,
  getDomainAvailability,
  changeDomain,
  deleteDeployment,
} from "./host-mgt-bff/api";

export type {
  UploadUrl,
  Website,
} from "./host-mgt-bff";

export {
  getSlots,
  getSlot,
  createSlot,
  createSlots,
  updateSlot,
  deleteSlot,
  deleteSlots,
  getSlotToken,
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  rescheduleBooking,
  getServices,
  createService,
  updateService,
  deleteService,
  getServiceProviders,
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  getCalendarSubscription,
} from "./slot-mgt-bff/api";
export type {
  Slot,
  SlotRepeatInterval,
  Booking,
  Service,
  ServiceProvider,
} from "./slot-mgt-bff";

export * as Book from "./book-mgt-bff";