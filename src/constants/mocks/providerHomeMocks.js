/**
 * Mock data for provider home page APIs.
 * Set USE_MOCK_DATA to false once backend merges the real endpoints.
 */
export const USE_MOCK_DATA = true;

// GET >> ${baseUrl}/b2b/profile-provider/home/card
export const MOCK_HOME_CARD = {
  pendingAskTripsCount: 11,
  currentDayTripsCount: 2,
  earliestNextTripDay: "2026-08-17",
  onHoldAskTripsCount: 2,
};

// GET >> ${baseUrl}/b2b/profile-provider/home/balance
export const MOCK_HOME_BALANCE = {
  totalBalance: 104621.5,
  availableBalance: 103621.5,
  pendingBalance: 0,
};

// GET >> ${baseUrl}/b2b/profile-provider/home
export const MOCK_HOME_DATA = {
  b2bCount: 68,
  b2cCount: 2,
  total: 70,
  scheduledCount: 2,
  monthlyRevenue: [
    { totalCount: 1, totalPrice: 150, year: 2025, month: 8 },
    { totalCount: 5, totalPrice: 750, year: 2025, month: 9 },
    { totalCount: 7, totalPrice: 1200, year: 2025, month: 11 },
    { totalCount: 7, totalPrice: 1050, year: 2025, month: 12 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 1 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 2 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 3 },
    { totalCount: 18, totalPrice: 12750, year: 2026, month: 4 },
    { totalCount: 2, totalPrice: 2, year: 2026, month: 5 },
    { totalCount: 1, totalPrice: 300, year: 2026, month: 6 },
    { totalCount: 22, totalPrice: 81519.5, year: 2026, month: 7 },
    { totalCount: 1, totalPrice: 6000, year: 2026, month: 8 },
  ],
};

// GET >> ${baseUrl}/b2b/profile-provider/ask-trips/all
export const MOCK_ASK_TRIPS = {
  pageInfo: {
    total: 25,
    currentPage: 1,
    perPage: 10,
    hasNextPage: true,
  },
  nodes: [
    {
      _id: "6a610840b62c9a1569ef6943",
      orderId: 1784744000087,
      day: "2026-07-23T00:00:00.000Z",
      availableSeats: 60,
      status: "ON_HOLD",
      askType: "CUSTOM_TRIP",
      name: "test main",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a610626b62c9a1569ef47f7",
      orderId: 1784743461310,
      day: "2026-07-23T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING_COMPANY_APPROVAL",
      askType: "TRIP",
      name: "Provider",
      basePrice: 600,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a6105e8b62c9a1569ef42c0",
      orderId: 1784743399724,
      day: "2026-07-23T00:00:00.000Z",
      availableSeats: 60,
      status: "DONE",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f55d6a0f7d7d69b4cd541",
      orderId: 1784632790138,
      day: "2026-07-23T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING",
      askType: "TRIP",
      name: "Provider",
      basePrice: 600,
      organization: "Asrari school",
      track: {
        _id: "d523b1873b728337c26556bf",
        orderId: "OT-144",
        educationSystem: { _id: "a7425e714109d56ae7a8a99f", name: "Private" },
      },
    },
    {
      _id: "6a5f5518a0f7d7d69b4cb8c1",
      orderId: 1784632599541,
      day: "2026-07-23T00:00:00.000Z",
      availableSeats: 60,
      status: "DONE",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f5178875a87818267d4b4",
      orderId: 1784631671888,
      day: "2026-07-28T00:00:00.000Z",
      availableSeats: 60,
      status: "SCHEDULED",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f4fa87a8870b5bc83170b",
      orderId: 1784631207894,
      day: "2026-07-24T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f4e9a35939260f1195e60",
      orderId: 1784630937361,
      day: "2026-07-28T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f4da4b8b129fd842204a3",
      orderId: 1784630692108,
      day: "2026-07-28T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
    {
      _id: "6a5f4b9dace262805c546dbb",
      orderId: 1784630173057,
      day: "2026-07-28T00:00:00.000Z",
      availableSeats: 60,
      status: "PENDING",
      askType: "CUSTOM_TRIP",
      name: "Provider2",
      basePrice: 500,
      organization: "Orman School in Dammam",
      track: {
        _id: "69d109127913e558d2bc6c2b",
        orderId: "OT-162",
        educationSystem: { _id: "976f5dce29b9af5c134bc8a9", name: "american" },
      },
    },
  ],
};

// GET >> ${baseUrl}/b2b/profile-provider/org-trips/month?month=6&year=2026
export const MOCK_ORG_TRIPS_MONTH = ["2026-06-17", "2026-06-26"];

// GET >> ${baseUrl}/b2b/profile-provider/org-trips/day/2026-06-17
export const MOCK_ORG_TRIPS_DAY = [
  {
    _id: "6a1f051b5811d7ae1ece7324",
    slug: "five-senses-asdsa-st-204",
    orderId: "ST-204",
    day: "2026-06-17T00:00:00.000Z",
    availableSeats: 60,
    bookingQuantity: 0,
    name: "Five Senses",
    thumbnail: {
      web: "https://storage.googleapis.com/guestnabucket/images/1770033823304-766916230.webp",
      app: "https://storage.googleapis.com/guestnabucket/images/1770033825848-368184865.webp",
    },
    cities: [
      { _id: "62e60f7326a23d949dcdccba", name: "Riyadh" },
      { _id: "6b5c4c32d62d7cd01ba5ddec", name: "Dammam" },
    ],
    organization: { _id: "6a0c6056579ed794ec139af6", name: "asdsa" },
    providerBranch: null,
    academicStages: [
      { _id: "ec0596509be6e2fe3ab1cfe4", name: "Secondary" },
    ],
  },
];
