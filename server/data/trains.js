export const TRAINS = [
  {
    trainNumber: "22436",
    trainName: "VANDE BHARAT EXP",
    trainType: "VANDE BHARAT",
    origin: "NDLS",
    destination: "BSB",
    departureTime: "06:00",
    arrivalTime: "14:00",
    duration: "8h 00m",
    distanceKm: 759,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "06:00", halt: "--", day: 1, distance: 0 },
      { code: "CNB", name: "Kanpur Central", arrival: "10:08", departure: "10:10", halt: "2m", day: 1, distance: 440 },
      { code: "PRYJ", name: "Prayagraj Junction", arrival: "12:08", departure: "12:10", halt: "2m", day: 1, distance: 635 },
      { code: "BSB", name: "Varanasi Junction", arrival: "14:00", departure: "--:--", halt: "--", day: 1, distance: 759 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 1750, tatkalFare: 2150, seatsTotal: 78, seatsAvailable: 42, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 3300, tatkalFare: 3850, seatsTotal: 20, seatsAvailable: 8, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12952",
    trainName: "MUMBAI RAJDHANI",
    trainType: "RAJDHANI",
    origin: "NDLS",
    destination: "MMCT",
    departureTime: "16:55",
    arrivalTime: "08:35",
    duration: "15h 40m",
    distanceKm: 1386,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "16:55", halt: "--", day: 1, distance: 0 },
      { code: "KOTA", name: "Kota Junction", arrival: "21:30", departure: "21:40", halt: "10m", day: 1, distance: 465 },
      { code: "BRC", name: "Vadodara Junction", arrival: "03:40", departure: "03:50", halt: "10m", day: 2, distance: 992 },
      { code: "ST", name: "Surat", arrival: "05:13", departure: "05:18", halt: "5m", day: 2, distance: 1122 },
      { code: "MMCT", name: "Mumbai Central", arrival: "08:35", departure: "--:--", halt: "--", day: 2, distance: 1386 }
    ],
    classes: {
      "1A": { name: "AC First Class", baseFare: 4850, tatkalFare: 5500, seatsTotal: 18, seatsAvailable: 4, wlCount: 0, confirmationProbability: 95 },
      "2A": { name: "AC 2 Tier", baseFare: 2950, tatkalFare: 3450, seatsTotal: 48, seatsAvailable: 15, wlCount: 0, confirmationProbability: 98 },
      "3A": { name: "AC 3 Tier", baseFare: 2150, tatkalFare: 2600, seatsTotal: 64, seatsAvailable: 0, wlCount: 4, confirmationProbability: 94 }
    }
  },
  {
    trainNumber: "12302",
    trainName: "HOWRAH RAJDHANI",
    trainType: "RAJDHANI",
    origin: "NDLS",
    destination: "HWH",
    departureTime: "16:50",
    arrivalTime: "09:55",
    duration: "17h 05m",
    distanceKm: 1450,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "16:50", halt: "--", day: 1, distance: 0 },
      { code: "CNB", name: "Kanpur Central", arrival: "21:32", departure: "21:37", halt: "5m", day: 1, distance: 440 },
      { code: "PRYJ", name: "Prayagraj Junction", arrival: "23:43", departure: "23:45", halt: "2m", day: 1, distance: 635 },
      { code: "PNBE", name: "Patna Junction", arrival: "03:50", departure: "04:00", halt: "10m", day: 2, distance: 1000 },
      { code: "HWH", name: "Howrah Junction", arrival: "09:55", departure: "--:--", halt: "--", day: 2, distance: 1450 }
    ],
    classes: {
      "1A": { name: "AC First Class", baseFare: 4950, tatkalFare: 5600, seatsTotal: 18, seatsAvailable: 2, wlCount: 0, confirmationProbability: 90 },
      "2A": { name: "AC 2 Tier", baseFare: 3050, tatkalFare: 3550, seatsTotal: 48, seatsAvailable: 9, wlCount: 0, confirmationProbability: 96 },
      "3A": { name: "AC 3 Tier", baseFare: 2250, tatkalFare: 2700, seatsTotal: 64, seatsAvailable: 28, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12626",
    trainName: "KERALA EXPRESS",
    trainType: "SUPERFAST",
    origin: "NDLS",
    destination: "TVC",
    departureTime: "20:10",
    arrivalTime: "18:00",
    duration: "45h 50m",
    distanceKm: 3026,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "20:10", halt: "--", day: 1, distance: 0 },
      { code: "AGC", name: "Agra Cantt", arrival: "22:20", departure: "22:25", halt: "5m", day: 1, distance: 195 },
      { code: "GWL", name: "Gwalior Junction", arrival: "00:03", departure: "00:05", halt: "2m", day: 2, distance: 313 },
      { code: "BPL", name: "Bhopal Junction", arrival: "05:20", departure: "05:30", halt: "10m", day: 2, distance: 701 },
      { code: "NGP", name: "Nagpur Junction", arrival: "11:45", departure: "11:55", halt: "10m", day: 2, distance: 1091 },
      { code: "CBE", name: "Coimbatore Junction", arrival: "07:12", departure: "07:15", halt: "3m", day: 3, distance: 2520 },
      { code: "ERS", name: "Ernakulam Junction", arrival: "10:30", departure: "10:35", halt: "5m", day: 3, distance: 2728 },
      { code: "TVC", name: "Thiruvananthapuram Central", arrival: "18:00", departure: "--:--", halt: "--", day: 3, distance: 3026 }
    ],
    classes: {
      "2A": { name: "AC 2 Tier", baseFare: 3600, tatkalFare: 4200, seatsTotal: 48, seatsAvailable: 12, wlCount: 0, confirmationProbability: 97 },
      "3A": { name: "AC 3 Tier", baseFare: 2450, tatkalFare: 2950, seatsTotal: 64, seatsAvailable: 31, wlCount: 0, confirmationProbability: 100 },
      "SL": { name: "Sleeper Class", baseFare: 940, tatkalFare: 1150, seatsTotal: 120, seatsAvailable: 0, wlCount: 8, confirmationProbability: 88 }
    }
  },
  {
    trainNumber: "12002",
    trainName: "BHOPAL SHATABDI",
    trainType: "SHATABDI",
    origin: "NDLS",
    destination: "BPL",
    departureTime: "06:00",
    arrivalTime: "14:40",
    duration: "8h 40m",
    distanceKm: 701,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "06:00", halt: "--", day: 1, distance: 0 },
      { code: "AGC", name: "Agra Cantt", arrival: "07:50", departure: "07:55", halt: "5m", day: 1, distance: 195 },
      { code: "GWL", name: "Gwalior Junction", arrival: "09:23", departure: "09:28", halt: "5m", day: 1, distance: 313 },
      { code: "BPL", name: "Bhopal Junction", arrival: "14:40", departure: "--:--", halt: "--", day: 1, distance: 701 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 1490, tatkalFare: 1850, seatsTotal: 78, seatsAvailable: 53, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 2620, tatkalFare: 3050, seatsTotal: 20, seatsAvailable: 11, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "20607",
    trainName: "VANDE BHARAT EXP",
    trainType: "VANDE BHARAT",
    origin: "MAS",
    destination: "SBC",
    departureTime: "05:50",
    arrivalTime: "10:15",
    duration: "4h 25m",
    distanceKm: 359,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    route: [
      { code: "MAS", name: "MGR Chennai Central", arrival: "--:--", departure: "05:50", halt: "--", day: 1, distance: 0 },
      { code: "SBC", name: "KSR Bengaluru City", arrival: "10:15", departure: "--:--", halt: "--", day: 1, distance: 359 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 995, tatkalFare: 1250, seatsTotal: 78, seatsAvailable: 65, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 1885, tatkalFare: 2200, seatsTotal: 20, seatsAvailable: 14, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12566",
    trainName: "BIHAR SAMPARK KRANTI",
    trainType: "SUPERFAST",
    origin: "NDLS",
    destination: "PNBE",
    departureTime: "13:00",
    arrivalTime: "05:20",
    duration: "16h 20m",
    distanceKm: 1000,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "NDLS", name: "New Delhi", arrival: "--:--", departure: "13:00", halt: "--", day: 1, distance: 0 },
      { code: "CNB", name: "Kanpur Central", arrival: "18:10", departure: "18:15", halt: "5m", day: 1, distance: 440 },
      { code: "LKO", name: "Lucknow Charbagh", arrival: "20:00", departure: "20:10", halt: "10m", day: 1, distance: 512 },
      { code: "GKP", name: "Gorakhpur Junction", arrival: "00:55", departure: "01:05", halt: "10m", day: 2, distance: 780 },
      { code: "PNBE", name: "Patna Junction", arrival: "05:20", departure: "--:--", halt: "--", day: 2, distance: 1000 }
    ],
    classes: {
      "3A": { name: "AC 3 Tier", baseFare: 1450, tatkalFare: 1750, seatsTotal: 64, seatsAvailable: 0, wlCount: 12, confirmationProbability: 82 },
      "2A": { name: "AC 2 Tier", baseFare: 2100, tatkalFare: 2450, seatsTotal: 48, seatsAvailable: 7, wlCount: 0, confirmationProbability: 98 },
      "SL": { name: "Sleeper Class", baseFare: 550, tatkalFare: 700, seatsTotal: 120, seatsAvailable: 0, wlCount: 25, confirmationProbability: 64 }
    }
  },
  {
    trainNumber: "20898",
    trainName: "RANCHI - HOWRAH VANDE BHARAT",
    trainType: "VANDE BHARAT",
    origin: "RNC",
    destination: "HWH",
    departureTime: "05:15",
    arrivalTime: "12:20",
    duration: "7h 05m",
    distanceKm: 463,
    daysOfOperation: ["Sun", "Mon", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "RNC", name: "Ranchi Junction", arrival: "--:--", departure: "05:15", halt: "--", day: 1, distance: 0 },
      { code: "MURI", name: "Muri Junction", arrival: "06:13", departure: "06:15", halt: "2m", day: 1, distance: 65 },
      { code: "TATA", name: "Tatanagar Junction", arrival: "07:55", departure: "08:00", halt: "5m", day: 1, distance: 169 },
      { code: "GTS", name: "Ghatsila", arrival: "08:33", departure: "08:35", halt: "2m", day: 1, distance: 205 },
      { code: "HWH", name: "Howrah Junction", arrival: "12:20", departure: "--:--", halt: "--", day: 1, distance: 463 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 1155, tatkalFare: 1425, seatsTotal: 78, seatsAvailable: 38, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 2200, tatkalFare: 2550, seatsTotal: 20, seatsAvailable: 12, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "22350",
    trainName: "RANCHI - PATNA VANDE BHARAT",
    trainType: "VANDE BHARAT",
    origin: "RNC",
    destination: "PNBE",
    departureTime: "16:15",
    arrivalTime: "22:05",
    duration: "5h 50m",
    distanceKm: 385,
    daysOfOperation: ["Sun", "Mon", "Tue", "Thu", "Fri", "Sat"],
    route: [
      { code: "RNC", name: "Ranchi Junction", arrival: "--:--", departure: "16:15", halt: "--", day: 1, distance: 0 },
      { code: "BRKA", name: "Barkakana Junction", arrival: "17:28", departure: "17:30", halt: "2m", day: 1, distance: 73 },
      { code: "HZBN", name: "Hazaribagh Town", arrival: "18:13", departure: "18:15", halt: "2m", day: 1, distance: 130 },
      { code: "KQR", name: "Koderma Junction", arrival: "19:08", departure: "19:10", halt: "2m", day: 1, distance: 210 },
      { code: "GAYA", name: "Gaya Junction", arrival: "20:15", departure: "20:20", halt: "5m", day: 1, distance: 287 },
      { code: "PNBE", name: "Patna Junction", arrival: "22:05", departure: "--:--", halt: "--", day: 1, distance: 385 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 1025, tatkalFare: 1280, seatsTotal: 78, seatsAvailable: 44, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 1930, tatkalFare: 2260, seatsTotal: 20, seatsAvailable: 9, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "20887",
    trainName: "RANCHI - VARANASI VANDE BHARAT",
    trainType: "VANDE BHARAT",
    origin: "RNC",
    destination: "BSB",
    departureTime: "05:10",
    arrivalTime: "13:00",
    duration: "7h 50m",
    distanceKm: 535,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Fri", "Sat"],
    route: [
      { code: "RNC", name: "Ranchi Junction", arrival: "--:--", departure: "05:10", halt: "--", day: 1, distance: 0 },
      { code: "MURI", name: "Muri Junction", arrival: "06:10", departure: "06:12", halt: "2m", day: 1, distance: 65 },
      { code: "BKSC", name: "Bokaro Steel City", arrival: "07:08", departure: "07:10", halt: "2m", day: 1, distance: 118 },
      { code: "GMO", name: "Netaji SC Bose Gomoh", arrival: "07:45", departure: "07:47", halt: "2m", day: 1, distance: 150 },
      { code: "KQR", name: "Koderma Junction", arrival: "08:48", departure: "08:50", halt: "2m", day: 1, distance: 243 },
      { code: "GAYA", name: "Gaya Junction", arrival: "10:00", departure: "10:05", halt: "5m", day: 1, distance: 320 },
      { code: "BSB", name: "Varanasi Junction", arrival: "13:00", departure: "--:--", halt: "--", day: 1, distance: 535 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 1390, tatkalFare: 1680, seatsTotal: 78, seatsAvailable: 51, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 2600, tatkalFare: 2980, seatsTotal: 20, seatsAvailable: 7, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12453",
    trainName: "RANCHI RAJDHANI EXP",
    trainType: "RAJDHANI",
    origin: "RNC",
    destination: "NDLS",
    departureTime: "17:15",
    arrivalTime: "11:10",
    duration: "17h 55m",
    distanceKm: 1341,
    daysOfOperation: ["Sun", "Thu"],
    route: [
      { code: "RNC", name: "Ranchi Junction", arrival: "--:--", departure: "17:15", halt: "--", day: 1, distance: 0 },
      { code: "BRKA", name: "Barkakana Junction", arrival: "18:50", departure: "18:55", halt: "5m", day: 1, distance: 73 },
      { code: "TORI", name: "Tori Junction", arrival: "19:53", departure: "19:55", halt: "2m", day: 1, distance: 156 },
      { code: "DTO", name: "Daltonganj", arrival: "21:05", departure: "21:07", halt: "2m", day: 1, distance: 256 },
      { code: "GHD", name: "Garhwa Road Junction", arrival: "21:50", departure: "21:55", halt: "5m", day: 1, distance: 290 },
      { code: "PRYJ", name: "Prayagraj Junction", arrival: "03:35", departure: "03:37", halt: "2m", day: 2, distance: 708 },
      { code: "CNB", name: "Kanpur Central", arrival: "05:40", departure: "05:45", halt: "5m", day: 2, distance: 902 },
      { code: "NDLS", name: "New Delhi", arrival: "11:10", departure: "--:--", halt: "--", day: 2, distance: 1341 }
    ],
    classes: {
      "1A": { name: "AC First Class", baseFare: 4750, tatkalFare: 5400, seatsTotal: 18, seatsAvailable: 3, wlCount: 0, confirmationProbability: 95 },
      "2A": { name: "AC 2 Tier", baseFare: 2900, tatkalFare: 3400, seatsTotal: 48, seatsAvailable: 14, wlCount: 0, confirmationProbability: 98 },
      "3A": { name: "AC 3 Tier", baseFare: 2100, tatkalFare: 2550, seatsTotal: 64, seatsAvailable: 29, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12020",
    trainName: "RANCHI - HOWRAH SHATABDI",
    trainType: "SHATABDI",
    origin: "RNC",
    destination: "HWH",
    departureTime: "13:45",
    arrivalTime: "21:30",
    duration: "7h 45m",
    distanceKm: 423,
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "RNC", name: "Ranchi Junction", arrival: "--:--", departure: "13:45", halt: "--", day: 1, distance: 0 },
      { code: "MURI", name: "Muri Junction", arrival: "14:50", departure: "14:52", halt: "2m", day: 1, distance: 65 },
      { code: "BKSC", name: "Bokaro Steel City", arrival: "15:55", departure: "16:00", halt: "5m", day: 1, distance: 118 },
      { code: "DHN", name: "Dhanbad Junction", arrival: "17:15", departure: "17:20", halt: "5m", day: 1, distance: 167 },
      { code: "HWH", name: "Howrah Junction", arrival: "21:30", departure: "--:--", halt: "--", day: 1, distance: 423 }
    ],
    classes: {
      "CC": { name: "AC Chair Car", baseFare: 985, tatkalFare: 1230, seatsTotal: 78, seatsAvailable: 49, wlCount: 0, confirmationProbability: 100 },
      "EC": { name: "Executive Chair Car", baseFare: 1850, tatkalFare: 2150, seatsTotal: 20, seatsAvailable: 10, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "12801",
    trainName: "PURUSHOTTAM EXPRESS",
    trainType: "SUPERFAST",
    origin: "TATA",
    destination: "NDLS",
    departureTime: "06:30",
    arrivalTime: "04:00",
    duration: "21h 30m",
    distanceKm: 1332,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "TATA", name: "Tatanagar Junction", arrival: "--:--", departure: "06:30", halt: "--", day: 1, distance: 0 },
      { code: "BKSC", name: "Bokaro Steel City", arrival: "09:40", departure: "09:45", halt: "5m", day: 1, distance: 150 },
      { code: "GMO", name: "Netaji SC Bose Gomoh", arrival: "10:30", departure: "10:35", halt: "5m", day: 1, distance: 182 },
      { code: "PNME", name: "Parasnath", arrival: "10:50", departure: "10:52", halt: "2m", day: 1, distance: 200 },
      { code: "KQR", name: "Koderma Junction", arrival: "11:45", departure: "11:47", halt: "2m", day: 1, distance: 275 },
      { code: "GAYA", name: "Gaya Junction", arrival: "13:40", departure: "13:45", halt: "5m", day: 1, distance: 352 },
      { code: "CNB", name: "Kanpur Central", arrival: "21:55", departure: "22:00", halt: "5m", day: 1, distance: 892 },
      { code: "NDLS", name: "New Delhi", arrival: "04:00", departure: "--:--", halt: "--", day: 2, distance: 1332 }
    ],
    classes: {
      "2A": { name: "AC 2 Tier", baseFare: 2650, tatkalFare: 3100, seatsTotal: 48, seatsAvailable: 11, wlCount: 0, confirmationProbability: 97 },
      "3A": { name: "AC 3 Tier", baseFare: 1850, tatkalFare: 2250, seatsTotal: 64, seatsAvailable: 26, wlCount: 0, confirmationProbability: 100 },
      "SL": { name: "Sleeper Class", baseFare: 680, tatkalFare: 840, seatsTotal: 120, seatsAvailable: 42, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "18616",
    trainName: "KRIYA YOGA EXPRESS",
    trainType: "EXPRESS",
    origin: "HTE",
    destination: "HWH",
    departureTime: "21:40",
    arrivalTime: "06:50",
    duration: "9h 10m",
    distanceKm: 421,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "HTE", name: "Hatia", arrival: "--:--", departure: "21:40", halt: "--", day: 1, distance: 0 },
      { code: "RNC", name: "Ranchi Junction", arrival: "21:55", departure: "22:05", halt: "10m", day: 1, distance: 7 },
      { code: "MURI", name: "Muri Junction", arrival: "23:10", departure: "23:12", halt: "2m", day: 1, distance: 72 },
      { code: "TATA", name: "Tatanagar Junction", arrival: "01:25", departure: "01:30", halt: "5m", day: 2, distance: 176 },
      { code: "GTS", name: "Ghatsila", arrival: "02:08", departure: "02:10", halt: "2m", day: 2, distance: 212 },
      { code: "HWH", name: "Howrah Junction", arrival: "06:50", departure: "--:--", halt: "--", day: 2, distance: 421 }
    ],
    classes: {
      "1A": { name: "AC First Class", baseFare: 2150, tatkalFare: 2500, seatsTotal: 18, seatsAvailable: 4, wlCount: 0, confirmationProbability: 100 },
      "2A": { name: "AC 2 Tier", baseFare: 1350, tatkalFare: 1620, seatsTotal: 48, seatsAvailable: 18, wlCount: 0, confirmationProbability: 100 },
      "3A": { name: "AC 3 Tier", baseFare: 950, tatkalFare: 1180, seatsTotal: 64, seatsAvailable: 35, wlCount: 0, confirmationProbability: 100 },
      "SL": { name: "Sleeper Class", baseFare: 360, tatkalFare: 480, seatsTotal: 120, seatsAvailable: 58, wlCount: 0, confirmationProbability: 100 }
    }
  },
  {
    trainNumber: "13351",
    trainName: "DHANBAD - ALLEPPEY EXP",
    trainType: "EXPRESS",
    origin: "DHN",
    destination: "MAS",
    departureTime: "11:35",
    arrivalTime: "23:15",
    duration: "35h 40m",
    distanceKm: 1888,
    daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    route: [
      { code: "DHN", name: "Dhanbad Junction", arrival: "--:--", departure: "11:35", halt: "--", day: 1, distance: 0 },
      { code: "BKSC", name: "Bokaro Steel City", arrival: "13:00", departure: "13:05", halt: "5m", day: 1, distance: 49 },
      { code: "MURI", name: "Muri Junction", arrival: "14:05", departure: "14:10", halt: "5m", day: 1, distance: 102 },
      { code: "RNC", name: "Ranchi Junction", arrival: "15:15", departure: "15:30", halt: "15m", day: 1, distance: 167 },
      { code: "HTE", name: "Hatia", arrival: "15:45", departure: "15:50", halt: "5m", day: 1, distance: 174 },
      { code: "ROU", name: "Rourkela Junction", arrival: "18:40", departure: "18:50", halt: "10m", day: 1, distance: 341 },
      { code: "VSKP", name: "Visakhapatnam Junction", arrival: "08:10", departure: "08:30", halt: "20m", day: 2, distance: 1106 },
      { code: "MAS", name: "MGR Chennai Central", arrival: "23:15", departure: "--:--", halt: "--", day: 2, distance: 1888 }
    ],
    classes: {
      "2A": { name: "AC 2 Tier", baseFare: 2950, tatkalFare: 3450, seatsTotal: 48, seatsAvailable: 15, wlCount: 0, confirmationProbability: 98 },
      "3A": { name: "AC 3 Tier", baseFare: 2050, tatkalFare: 2480, seatsTotal: 64, seatsAvailable: 29, wlCount: 0, confirmationProbability: 100 },
      "SL": { name: "Sleeper Class", baseFare: 780, tatkalFare: 960, seatsTotal: 120, seatsAvailable: 65, wlCount: 0, confirmationProbability: 100 }
    }
  }
];

// Helper to generate dynamic realistic trains for ANY station-to-station pair
export function generateTrainsForRoute(fromCode, toCode, fromStation, toStation, travelDate) {
  // Check direct trains in predefined database
  const direct = TRAINS.filter(train => {
    const originIdx = train.route.findIndex(s => s.code === fromCode);
    const destIdx = train.route.findIndex(s => s.code === toCode);
    return originIdx !== -1 && destIdx !== -1 && originIdx < destIdx;
  }).map(train => {
    // Clone and adjust seat availability dynamically based on date hash
    const daySeed = (travelDate || "2026-09-27").split("-").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const cloned = JSON.parse(JSON.stringify(train));
    
    // Add Tatkal quota specifics
    for (const clsKey in cloned.classes) {
      const cls = cloned.classes[clsKey];
      // compute Tatkal seats
      cls.tatkalAvailable = Math.max(2, Math.floor(cls.seatsTotal * 0.25) - (daySeed % 7));
      cls.tatkalWl = 0;
    }
    return cloned;
  });

  if (direct.length > 0) {
    return direct;
  }

  // Generate synthetic high-speed and express trains if not in direct schedule
  // This guarantees ANY station pair in India has confirmed and alternate trains!
  const hash = (fromCode + toCode).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const approxDistance = 450 + (hash % 1200);
  const approxSpeedKmph = 75;
  const hours = Math.floor(approxDistance / approxSpeedKmph);
  const mins = (hash % 4) * 15;
  const durationStr = `${hours}h ${mins.toString().padStart(2, '0')}m`;

  const dynamicTrains = [
    {
      trainNumber: `${12000 + (hash % 8000)}`,
      trainName: `${toStation.city.toUpperCase()} SUPERFAST EXP`,
      trainType: "SUPERFAST",
      origin: fromCode,
      destination: toCode,
      departureTime: "07:15",
      arrivalTime: `${(7 + hours) % 24}:${mins.toString().padStart(2, '0')}`,
      duration: durationStr,
      distanceKm: approxDistance,
      daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      route: [
        { code: fromCode, name: fromStation.name, arrival: "--:--", departure: "07:15", halt: "--", day: 1, distance: 0 },
        { code: toCode, name: toStation.name, arrival: `${(7 + hours) % 24}:${mins.toString().padStart(2, '0')}`, departure: "--:--", halt: "--", day: (7 + hours >= 24 ? 2 : 1), distance: approxDistance }
      ],
      classes: {
        "1A": { name: "AC First Class", baseFare: Math.floor(approxDistance * 3.2), tatkalFare: Math.floor(approxDistance * 3.8), seatsTotal: 18, seatsAvailable: 6, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 4, tatkalWl: 0 },
        "2A": { name: "AC 2 Tier", baseFare: Math.floor(approxDistance * 2.1), tatkalFare: Math.floor(approxDistance * 2.5), seatsTotal: 48, seatsAvailable: 24, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 12, tatkalWl: 0 },
        "3A": { name: "AC 3 Tier", baseFare: Math.floor(approxDistance * 1.45), tatkalFare: Math.floor(approxDistance * 1.8), seatsTotal: 64, seatsAvailable: 38, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 16, tatkalWl: 0 },
        "SL": { name: "Sleeper Class", baseFare: Math.max(220, Math.floor(approxDistance * 0.55)), tatkalFare: Math.floor(approxDistance * 0.7), seatsTotal: 120, seatsAvailable: 52, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 30, tatkalWl: 0 }
      }
    },
    {
      trainNumber: `${22000 + (hash % 900)}`,
      trainName: `${fromStation.city.toUpperCase()} - ${toStation.city.toUpperCase()} VANDE BHARAT`,
      trainType: "VANDE BHARAT",
      origin: fromCode,
      destination: toCode,
      departureTime: "15:20",
      arrivalTime: `${(15 + Math.max(3, hours - 3)) % 24}:${mins.toString().padStart(2, '0')}`,
      duration: `${Math.max(3, hours - 3)}h ${mins.toString().padStart(2, '0')}m`,
      distanceKm: approxDistance,
      daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Fri", "Sat"],
      route: [
        { code: fromCode, name: fromStation.name, arrival: "--:--", departure: "15:20", halt: "--", day: 1, distance: 0 },
        { code: toCode, name: toStation.name, arrival: `${(15 + Math.max(3, hours - 3)) % 24}:${mins.toString().padStart(2, '0')}`, departure: "--:--", halt: "--", day: 1, distance: approxDistance }
      ],
      classes: {
        "CC": { name: "AC Chair Car", baseFare: Math.floor(approxDistance * 2.2), tatkalFare: Math.floor(approxDistance * 2.6), seatsTotal: 78, seatsAvailable: 35, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 18, tatkalWl: 0 },
        "EC": { name: "Executive Chair Car", baseFare: Math.floor(approxDistance * 3.8), tatkalFare: Math.floor(approxDistance * 4.4), seatsTotal: 20, seatsAvailable: 8, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 5, tatkalWl: 0 }
      }
    },
    {
      trainNumber: `${13000 + (hash % 5000)}`,
      trainName: `${fromStation.name.split(" ")[0]} EXPRESS`,
      trainType: "EXPRESS",
      origin: fromCode,
      destination: toCode,
      departureTime: "21:45",
      arrivalTime: `${(21 + hours + 2) % 24}:${((mins + 30) % 60).toString().padStart(2, '0')}`,
      duration: `${hours + 2}h ${((mins + 30) % 60).toString().padStart(2, '0')}m`,
      distanceKm: approxDistance,
      daysOfOperation: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      route: [
        { code: fromCode, name: fromStation.name, arrival: "--:--", departure: "21:45", halt: "--", day: 1, distance: 0 },
        { code: toCode, name: toStation.name, arrival: `${(21 + hours + 2) % 24}:${((mins + 30) % 60).toString().padStart(2, '0')}`, departure: "--:--", halt: "--", day: 2, distance: approxDistance }
      ],
      classes: {
        "3A": { name: "AC 3 Tier", baseFare: Math.floor(approxDistance * 1.35), tatkalFare: Math.floor(approxDistance * 1.65), seatsTotal: 64, seatsAvailable: 0, wlCount: 5, confirmationProbability: 92, tatkalAvailable: 10, tatkalWl: 0 },
        "SL": { name: "Sleeper Class", baseFare: Math.max(190, Math.floor(approxDistance * 0.48)), tatkalFare: Math.floor(approxDistance * 0.65), seatsTotal: 120, seatsAvailable: 18, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 22, tatkalWl: 0 },
        "2S": { name: "Second Sitting", baseFare: Math.max(120, Math.floor(approxDistance * 0.28)), tatkalFare: Math.floor(approxDistance * 0.4), seatsTotal: 90, seatsAvailable: 44, wlCount: 0, confirmationProbability: 100, tatkalAvailable: 25, tatkalWl: 0 }
      }
    }
  ];

  return dynamicTrains;
}
