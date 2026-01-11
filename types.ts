
export enum BikeType {
  CITY = 'Citybike',
  EL = 'El-cykel',
  LAD = 'Ladcykel',
  RACER = 'Racercykel',
  MTB = 'Mountainbike',
  EL_LOEBEHJUL = 'El-Løbehjul',
  SCOOTER = 'Scooter',
  KABINESCOOTER = 'Kabinescooter',
}

export enum BookingMethod {
  DROP_OFF = 'Indlevering i butik',
  PICKUP = 'Hent og Bring (Sjælland)'
}

export type SubscriptionType = 'individual' | 'family';

export interface PlanServiceLimit {
  serviceId: string;
  limit: number; // -1 for unlimited, 0 for not included, >0 for specific amount per month
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
  features: string[];
  type: SubscriptionType;
  maxBikes: number; // 1 for individual, >1 for family
  includesAiMechanic: boolean; // Controls access to AI features
  includedServices: PlanServiceLimit[]; // New generic structure for included services
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  compatibleBikeTypes: BikeType[]; // Array of bike types this service is valid for
  availableInShop?: boolean;    // Is available for drop-off
  availableForPickup?: boolean; // Is available for pickup/delivery

  // Add-on logic
  isMainService?: boolean; // Default true. Shows up in first step.
  isAddOn?: boolean;       // Default false. Shows up in second step.
  parentServiceIds?: string[]; // IDs of services this can be added to
  campaignPrice?: number;      // Optional discounted price when purchased as add-on
}

export interface ServiceEvent {
  id: string;
  date: string;
  type: string;
  notes: string;
}

export interface Bike {
  id: string;
  name: string;
  type: BikeType;
  brand: string;
  image?: string;
  lastServiceDate?: string;
  subscriptionPlanId?: string | null; // Specific plan for this bike
  frameNumber: string;
  bikedeskArticleId?: number;
  bikedeskTitle?: string; // Original title in Bikedesk for updates
  history?: ServiceEvent[];
}

export interface Booking {
  id: string;
  bikeId: string;
  serviceId: string;
  addOnIds?: string[]; // List of selected add-on service IDs
  method: BookingMethod;
  date: string;
  address?: string;
  zipCode?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  notes?: string;
  budgetLimit?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'mobilepay';
  last4?: string; // For cards
  expiry?: string; // MM/YY
  phoneNumber?: string; // For MobilePay
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password?: string; // Only for creation/updates
  familyPlanId?: string | null; // If set, covers all bikes (up to maxBikes of the plan)
  bikedeskId?: number;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  role?: 'admin' | 'user';
  familyInvites?: string[]; // List of invited emails
}

export interface CalendarSettings {
  bufferDays: number;
  blockHolidays: boolean;
  blockWeekdays: number[]; // 0 = Sun, 1 = Mon...
  blockedDates: string[]; // YYYY-MM-DD

  // Capacity limits
  maxBookingsWorkshop: number;  // Max antal værksted bookinger pr. dag
  maxBookingsPickup: number;    // Max antal hent & bring bookinger pr. dag

  // Time control
  timeSelectionWorkshop: boolean;
  timeSelectionPickup: boolean;
  openingHourStart: number;
  openingHourEnd: number;
  lunchStart?: number;
  lunchEnd?: number;
}

export interface DeliverySettings {
  pickupProductId: string; // Product ID for "Hent & Bring" fee
  workshopProductId: string; // Product ID for "Værksted" handling? Maybe not needed/free?
}

export interface BookingSettings {
  visibleGroupIds: number[];
  visibleTemplateIds: number[];
  // Mapping: TemplateID -> Array of allowed BikeTypes. If missing, allowed for all.
  templateVehicleTypes?: Record<number, BikeType[]>;
  calendarSettings?: CalendarSettings;
  deliverySettings?: DeliverySettings;
  pickupTemplateId: number | null; // Keeping for legacy/transition or specific pickup logic
}

export interface TicketTemplate {
  id: number;
  label: string;
  position?: number;
  price?: number;
  description?: string;
  duration?: number;
  groupid: number;
}

export interface TicketTemplateGroup {
  id: number;
  label?: string;
  position?: number;
}

// Booking Forms Module
export type FormType = 'standard' | 'employee' | 'business';

export interface CalendarRuleSet {
  bufferDays: number;
  maxBookingsPerDay: number;
  closedWeekdays: number[]; // 0=Sunday, 1=Monday...
  closedDates: string[]; // ["2024-12-24", ...]
  pickupMessage?: string;
}

export interface BookingFormConfig {
  id: string;
  title: string;
  type: FormType;

  // Modules
  enableWorkshop: boolean;
  enablePickup: boolean;

  // Vehicle types
  allowedVehicleTypes: BikeType[];

  // Individual calendar settings (optional - if not set, uses global defaults)
  calendarSettings?: CalendarSettings;

  // Special flag to identify the CykelPLUS app's internal booking form
  isAppForm?: boolean;

  // Type-specific settings
  businessSettings?: {
    hidePrices: boolean;
    disablePhoneLogin: boolean;
  };
  employeeSettings?: {
    calendarMessage: string;
  };

  // Calendar rules per form
  workshopRules?: CalendarRuleSet;
  pickupRules?: CalendarRuleSet;

  // Service configuration
  allowedTemplateIds?: number[];

  // Tags
  workshopTags?: number[]; // Tags for "Aflevering i butik"
  pickupTags?: number[];   // Tags for "Hent & Bring"

  ignoreGlobalRules?: boolean;
}
