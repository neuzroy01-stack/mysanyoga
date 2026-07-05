export type VehicleRate = {
  id: string;
  name: string;
  description: string;
  baseFare: number;
  perKm: number;
  waitingPerHour: number;
  driverAllowance: number;
  colors: string[];
};

export const VEHICLE_RATES: VehicleRate[] = [
 
    {
    id: "None",
    name: "None",
    description: "",
    baseFare: 0,
    perKm: 0,
    waitingPerHour: 0,
    driverAllowance: 0,
    colors: [""],
  },
  {
    id: "Scorpio",
    name: "Scorpio",
    description: "Scorpio class with chauffeur",
    baseFare: 1000,
    perKm: 18,
    waitingPerHour: 100,
    driverAllowance: 350,
    colors: ["White","Black" ],
  },
   {
    id: "Hyundai Creta",
    name: "Hyundai Creta",
    description: "Hyundai Venue for family transfers",
    baseFare: 800,
    perKm: 15,
    waitingPerHour: 100,
    driverAllowance: 350,
    colors: ["White"],
  },
  {
    id: "Bolero",
    name: "Bolero",
    description: "Innova Crysta · Fortuner for family transfers",
    baseFare: 800,
    perKm: 17,
    waitingPerHour: 100,
    driverAllowance: 350,
    colors: ["White", "Black"],
  },
  {
    id: "Maruti Swift Dzire",
    name: "Maruti Swift Dzire",
    description: "Maruti Swift Dzire for family transfers",
    baseFare: 800,
    perKm: 14,
    waitingPerHour: 100,
    driverAllowance: 350,
    colors: ["White"],
  },
    {
    id: "Hyundai Venue",
    name: "Hyundai Venue",
    description: "Hyundai Venue for family transfers",
    baseFare: 800,
    perKm: 15,
    waitingPerHour: 100,
    driverAllowance: 350,
    colors: ["White"],
  },
  {
    id: "Tempo",
    name: "Tempo Traveller",
    description: "12–17 Seater AC, perfect for baraat & guests",
    baseFare: 300,
    perKm: 28,
    waitingPerHour: 50,
    driverAllowance: 200,
    colors: [],
  },
   {
    id: "wedding-car",
    name: "Wedding Car (Decorated)",
    description: "AC sedan with floral decoration, driver included",
    baseFare: 3500,
    perKm: 18,
    waitingPerHour: 300,
    driverAllowance: 500,
    colors: ["White"],
  },
  {
    id: "bus",
    name: "Bus Booking",
    description: "32–55 Seater coach with experienced driver",
    baseFare: 14000,
    perKm: 45,
    waitingPerHour: 1000,
    driverAllowance: 1200,
    colors: ["White", "Silver", "Multi-color Wrap"],
  },
];
export function getVehicleRate(id: string): VehicleRate | undefined {
  return VEHICLE_RATES.find((v) => v.id === id);
}

// Supported service area — destinations we currently serve.
// Matching is case-insensitive substring on either side so users can type
// "Mumbai, Maharashtra" and still match "Mumbai".
export const SERVICE_AREA: string[] = [
  "Mumbai",
  "Pune",
  "Nashik",
  "Nagpur",
  "Aurangabad",
  "Thane",
  "Navi Mumbai",
  "Lonavala",
  "Mahabaleshwar",
  "Shirdi",
  "Surat",
  "Ahmedabad",
  "Vadodara",
  "Rajkot",
  "Indore",
  "Bhopal",
  "Jaipur",
  "Udaipur",
  "Jodhpur",
  "Delhi",
  "Gurgaon",
  "Noida",
  "Chandigarh",
  "Bengaluru",
  "Mysuru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Goa",
];

export function isServiceableDestination(input: string): boolean {
  const q = input.trim().toLowerCase();
  if (!q) return false;
  return SERVICE_AREA.some((city) => {
    const c = city.toLowerCase();
    return q.includes(c) || c.includes(q);
  });
}

export type BookingVehicle = {
  uid: string;
  vehicleId: string;
  quantity: number;
  color: string;
  nightCharge: number;
  tollParking: number;
};

export type FareInput = {
  distanceKm: number;
  waitingHours: number;
  vehicles: BookingVehicle[];
  gstPercent: number;
  discount: number;
};

export type VehicleFareLine = {
  uid: string;
  vehicleId: string;
  name: string;
  quantity: number;
  baseFare: number;
  distanceCharge: number;
  waitingCharge: number;
  driverAllowance: number;
  nightCharge: number;
  tollParking: number;
  perUnit: number;
  total: number;
};

export type FareBreakdown = {
  lines: VehicleFareLine[];
  baseFareTotal: number;
  distanceTotal: number;
  waitingTotal: number;
  driverTotal: number;
  nightTotal: number;
  tollTotal: number;
  subTotal: number;
  gstAmount: number;
  discount: number;
  grandTotal: number;
  totalVehicles: number;
};

export function calculateFare(input: FareInput): FareBreakdown {
  const distance = Math.max(0, input.distanceKm || 0);
  const waiting = Math.max(0, input.waitingHours || 0);

  const lines: VehicleFareLine[] = input.vehicles.map((v) => {
    const rate = getVehicleRate(v.vehicleId);
    const qty = Math.max(1, v.quantity || 1);
    if (!rate) {
      return {
        uid: v.uid,
        vehicleId: v.vehicleId,
        name: "—",
        quantity: qty,
        baseFare: 0,
        distanceCharge: 0,
        waitingCharge: 0,
        driverAllowance: 0,
        nightCharge: 0,
        tollParking: 0,
        perUnit: 0,
        total: 0,
      };
    }
    const distanceCharge = distance * rate.perKm;
    const waitingCharge = waiting * rate.waitingPerHour;
    const perUnit =
      rate.baseFare +
      distanceCharge +
      waitingCharge +
      rate.driverAllowance +
      (v.nightCharge || 0) +
      (v.tollParking || 0);
    return {
      uid: v.uid,
      vehicleId: v.vehicleId,
      name: rate.name,
      quantity: qty,
      baseFare: rate.baseFare,
      distanceCharge,
      waitingCharge,
      driverAllowance: rate.driverAllowance,
      nightCharge: v.nightCharge || 0,
      tollParking: v.tollParking || 0,
      perUnit,
      total: perUnit * qty,
    };
  });

  const sumBy = (fn: (l: VehicleFareLine) => number) =>
    lines.reduce((acc, l) => acc + fn(l) * l.quantity, 0);

  const baseFareTotal = sumBy((l) => l.baseFare);
  const distanceTotal = sumBy((l) => l.distanceCharge);
  const waitingTotal = sumBy((l) => l.waitingCharge);
  const driverTotal = sumBy((l) => l.driverAllowance);
  const nightTotal = sumBy((l) => l.nightCharge);
  const tollTotal = sumBy((l) => l.tollParking);
  const subTotal = lines.reduce((acc, l) => acc + l.total, 0);

  const gstAmount = Math.round((subTotal * (input.gstPercent || 0)) / 100);
  const discount = Math.max(0, input.discount || 0);
  const grandTotal = Math.max(0, subTotal + gstAmount - discount);
  const totalVehicles = lines.reduce((acc, l) => acc + l.quantity, 0);

  return {
    lines,
    baseFareTotal,
    distanceTotal,
    waitingTotal,
    driverTotal,
    nightTotal,
    tollTotal,
    subTotal,
    gstAmount,
    discount,
    grandTotal,
    totalVehicles,
  };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}