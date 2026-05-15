
import type { Bike, User, ServiceItem, SubscriptionPlan, PaymentMethod } from "./types.ts";
import { BikeType } from "./types.ts";

export const PICKUP_PRICE = 149;

export const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan_basic',
    name: 'Basis',
    price: 49,
    discountPercentage: 5,
    features: [
      '1x lyntjek hver måned',
      '5% rabat på service',
      'Standard pris på Hent & Bring'
    ],
    type: 'individual',
    maxBikes: 1,
    includesAiMechanic: false,
    includedServices: [
      { serviceId: 's1', limit: 1 } // 1 Lyntjek
    ]
  },
  {
    id: 'plan_plus',
    name: 'Pro',
    price: 89,
    discountPercentage: 15,
    features: [
      'Ubegrænset lyntjek',
      'Fri adgang til AI-Mekaniker',
      '50% rabat på Hent & Bring',
      '15% rabat på service',
      'Spring køen over'
    ],
    type: 'individual',
    maxBikes: 1,
    includesAiMechanic: true,
    includedServices: [
      { serviceId: 's1', limit: -1 } // Unlimited Lyntjek
    ]
  },
  {
    id: 'plan_family',
    name: 'CykelPLUS Familie',
    price: 249,
    discountPercentage: 20,
    features: [
      'Dækker op til 5 cykler',
      'Fri Hent & Bring (Ubegrænset)',
      'Fri adgang til AI-Mekaniker',
      '20% rabat på service',
      'Prioriteret support'
    ],
    type: 'family',
    maxBikes: 5,
    includesAiMechanic: true,
    includedServices: [
      { serviceId: 's1', limit: -1 }
    ]
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 's1',
    name: 'Lyntjek',
    price: 199,
    description: 'Hurtig gennemgang af cyklen, smøring af kæde og dæktryk.',
    compatibleBikeTypes: [BikeType.CITY, BikeType.RACER, BikeType.MTB, BikeType.EL, BikeType.LAD],
    availableInShop: true,
    availableForPickup: true
  },
  {
    id: 's2',
    name: 'Serviceeftersyn (2-hjulet)',
    price: 599,
    description: 'Total adskillelse, rens, smøring og justering af alt.',
    compatibleBikeTypes: [BikeType.CITY, BikeType.RACER, BikeType.MTB, BikeType.EL],
    availableInShop: true,
    availableForPickup: true
  },
  {
    id: 's3',
    name: 'Serviceeftersyn (Ladcykel)',
    price: 799,
    description: 'Komplet service af ladcykel, inkl. justering af styretøj og bremser.',
    compatibleBikeTypes: [BikeType.LAD],
    availableInShop: true,
    availableForPickup: true
  },
  {
    id: 's4',
    name: 'Punktering',
    price: 199,
    description: 'Lapning eller ny slange. Pris varierer efter hjul/motor (Op til 699kr).',
    compatibleBikeTypes: [BikeType.CITY, BikeType.RACER, BikeType.MTB, BikeType.EL, BikeType.LAD],
    availableInShop: true,
    availableForPickup: true
  },
  {
    id: 's5',
    name: 'Reparation',
    price: 340,
    description: 'Startpris for reparationer/timeløn. Reservedele ikke inkluderet.',
    compatibleBikeTypes: [BikeType.CITY, BikeType.RACER, BikeType.MTB, BikeType.EL, BikeType.LAD],
    availableInShop: true,
    availableForPickup: true
  }
];

export const MOCK_USER: User = {
  id: "u1",
  firstName: "Patrick",
  lastName: "Steckmetz",
  email: "pk@b-bikes.dk",
  familyPlanId: null, // No family plan initially
  street: "Akacieparken",
  houseNumber: "10B",
  zipCode: "2680",
  city: "Solrød Strand"
};

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [];

export const INITIAL_BIKES: Bike[] = [
  {
    id: "1",
    name: "Hverdagscyklen",
    brand: "Batavus",
    type: BikeType.CITY,
    lastServiceDate: "2023-11-15",
    image: "https://picsum.photos/400/300?random=1",
    subscriptionPlanId: 'plan_basic',
    frameNumber: "WBA123456K",
    history: [
      { id: "h1", date: "2023-11-15", type: "Lyntjek", notes: "Kæde smurt og dæk pumpet." },
      { id: "h2", date: "2023-05-10", type: "Lille Service", notes: "Nye bremseklodser bag." }
    ]
  },
  {
    id: "2",
    name: "Skovhuggeren",
    brand: "Trek",
    type: BikeType.MTB,
    lastServiceDate: "2023-08-20",
    image: "https://picsum.photos/400/300?random=2",
    subscriptionPlanId: null,
    frameNumber: "WTU987654M",
    history: [
      { id: "h3", date: "2023-08-20", type: "Punktering", notes: "Ny slange baghjul." }
    ]
  },
  {
    id: "3",
    name: "Familiecontaineren",
    brand: "Nihola",
    type: BikeType.LAD,
    lastServiceDate: undefined,
    image: "https://picsum.photos/400/300?random=3",
    subscriptionPlanId: null,
    frameNumber: "NIH445566L",
    history: []
  }
];

// --- HELPER: Danish Holidays ---
// Returns map: { "YYYY-MM-DD": "Holiday Name" }
export const getDanishHolidays = (year: number): Record<string, string> => {
  const holidays: Record<string, string> = {};

  // Fixed Dates
  holidays[`${year}-01-01`] = "Nytårsdag";
  holidays[`${year}-06-05`] = "Grundlovsdag";
  holidays[`${year}-12-24`] = "Juleaften";
  holidays[`${year}-12-25`] = "1. Juledag";
  holidays[`${year}-12-26`] = "2. Juledag";
  holidays[`${year}-12-31`] = "Nytårsaften";

  // Easter Logic (Meeus/Jones/Butcher's algorithm)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);

  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  const easter = new Date(year, month - 1, day);

  // Helper to format (Timezone-agnostic YYYY-MM-DD)
  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const addDays = (d: Date, days: number) => {
    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
  }

  holidays[fmt(addDays(easter, -3))] = "Skærtorsdag";
  holidays[fmt(addDays(easter, -2))] = "Langfredag";
  holidays[fmt(addDays(easter, 0))] = "Påskedag";
  holidays[fmt(addDays(easter, 1))] = "2. Påskedag";
  // Store Bededag abolished in 2024
  holidays[fmt(addDays(easter, 39))] = "Kristi Himmelfart";
  holidays[fmt(addDays(easter, 49))] = "Pinsedag";
  holidays[fmt(addDays(easter, 50))] = "2. Pinsedag";

  return holidays;
};
