import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "../data/persistent_db.json");

// Ensure directory exists
const dbDir = path.dirname(DB_FILE);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export class PersistentStorage {
  constructor() {
    this.filePath = DB_FILE;
    this.data = this.loadFromDisk();

    if (!fs.existsSync(this.filePath)) {
      this.saveToDisk();
      console.log(`[STORAGE] Initialized new persistent database on disk at ${this.filePath}`);
    }

    // Register shutdown hooks to guarantee flush on exit/restart
    process.on("SIGINT", () => this.handleShutdown("SIGINT"));
    process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
  }

  loadFromDisk() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        console.log(`[STORAGE] Restored persistent railway database from ${this.filePath} (${Object.keys(parsed.pnrs || {}).length} bookings, ${Object.keys(parsed.users || {}).length} users)`);
        return parsed;
      }
    } catch (err) {
      console.warn("[STORAGE] Could not read existing DB, initializing fresh store:", err.message);
    }

    return this.getInitialSchema();
  }

  getInitialSchema() {
    const defaultUser = {
      id: "USR-IRCTC-10492",
      username: "kunal_rail",
      password: "password123",
      mpin: "1234",
      fullName: "Kunal Sharma",
      firstName: "Kunal",
      lastName: "Sharma",
      email: "kunal.sharma@railnex.in",
      mobile: "9876543210",
      gender: "Male",
      dob: "1996-08-15",
      occupation: "Professional",
      maritalStatus: "Unmarried",
      aadhaarNumber: "481928374910",
      aadhaarMasked: "XXXX-XXXX-4910",
      kycStatus: "VERIFIED",
      monthlyBookingLimit: 24,
      monthlyBookingsUsed: 2,
      address: "Station Road, Morabadi",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834001",
      securityQuestion: "What was your first school name?",
      registeredAt: "2026-01-10T10:00:00.000Z",
      masterPassengers: [
        {
          id: "MP-1",
          name: "Kunal Sharma",
          age: 28,
          gender: "Male",
          berthPreference: "LB",
          food: "VEG",
          aadhaar: "481928374910",
          seniorCitizen: false
        },
        {
          id: "MP-2",
          name: "Sunita Sharma",
          age: 62,
          gender: "Female",
          berthPreference: "LB",
          food: "VEG",
          aadhaar: "582910394821",
          seniorCitizen: true
        },
        {
          id: "MP-3",
          name: "Amit Sharma",
          age: 31,
          gender: "Male",
          berthPreference: "SL",
          food: "NON_VEG",
          aadhaar: "791823940192",
          seniorCitizen: false
        }
      ]
    };

    const initialBooking = {
      pnr: "2458910243",
      trainNumber: "20898",
      trainName: "VANDE BHARAT EXP",
      from: { code: "RNC", name: "Ranchi Jn", city: "Ranchi" },
      to: { code: "HWH", name: "Howrah Jn", city: "Kolkata" },
      date: new Date().toISOString().split("T")[0],
      travelClass: "CC",
      quota: "GENERAL",
      bookedAt: new Date(Date.now() - 3600000).toISOString(),
      prsDigitalSignature: "CRIS-SIG-984129-SECURE-SHA256",
      chartStatus: "CHART PREPARED (Berths Confirmed)",
      status: "CONFIRMED",
      fare: { totalFare: 1285 },
      tteVerification: {
        isInspected: false,
        inspectedBy: null,
        inspectedAt: null,
        hhtDevice: "HHT-SER-4819 (Ranchi Division)",
        checkedPassengers: 0,
        totalPassengers: 1,
        allBoarded: false
      },
      passengers: [
        {
          id: 1,
          name: "KUNAL SHARMA",
          age: "28",
          gender: "Male",
          berthPreference: "Window (W)",
          coach: "C2",
          seatNumber: 42,
          allocatedBerth: "Window (W)",
          bookingStatus: "CNF",
          currentStatus: "CNF / C2 / 42",
          attendanceStatus: "UNCHECKED",
          aadhaarMasked: "XXXX-XXXX-4910",
          securityToken: "SEC-9148B-VALID",
          tteCheckedAt: null,
          tteRemark: null
        }
      ]
    };

    return {
      users: {
        "kunal_rail": defaultUser,
        "9876543210": defaultUser,
        "kunal.sharma@railnex.in": defaultUser
      },
      pnrs: {
        "2458910243": initialBooking
      },
      berthSwaps: [
        {
          id: "SWAP-101",
          pnr: "2458910243",
          trainNumber: "20898",
          passengerName: "Kunal Sharma",
          passengerId: 1,
          currentCoach: "C2",
          currentSeat: 42,
          currentBerthType: "Window (W)",
          desiredBerthType: "Lower Berth (LB) or Aisle",
          reason: "Traveling with elderly parent, prefer Lower Berth or aisle access.",
          status: "OPEN", // OPEN | ACCEPTED | COMPLETED
          acceptedBy: null,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        }
      ],
      systemMetrics: {
        activeUsers: 8420,
        agentBotsBlocked: 1429,
        tatkalQueueProcessed: 3840,
        instantConfirmationRate: "98.4%",
        serverLatencyMs: 14,
        fairnessRating: "99.9%"
      },
      lastSavedAt: new Date().toISOString()
    };
  }

  saveToDisk() {
    try {
      this.data.lastSavedAt = new Date().toISOString();
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("[STORAGE] Failed to write database to disk:", err);
      return false;
    }
  }

  handleShutdown(signal) {
    console.log(`[STORAGE] Received ${signal}. Flushing database safely to disk before server shutdown...`);
    this.saveToDisk();
    console.log(`[STORAGE] Database successfully synced to disk. Exiting cleanly.`);
    process.exit(0);
  }
}

export const persistentStorage = new PersistentStorage();
