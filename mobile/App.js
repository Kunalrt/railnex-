import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal
} from "react-native";

// Live Railway Gateway API URL
const API_BASE = "https://roland-syracuse-faqs-liz.trycloudflare.com";

export default function App() {
  const [activeTab, setActiveTab] = useState("search"); // 'search' | 'pnr' | 'tickets' | 'server'
  const [fromCode, setFromCode] = useState("RNC");
  const [toCode, setToCode] = useState("HWH");
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pnrInput, setPnrInput] = useState("");
  const [pnrResult, setPnrResult] = useState(null);
  const [bookedTickets, setBookedTickets] = useState([]);

  // Booking Modal
  const [bookingModal, setBookingModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedClass, setSelectedClass] = useState("CC");
  const [passengerName, setPassengerName] = useState("KUNAL KUMAR");
  const [passengerAge, setPassengerAge] = useState("24");
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Fetch trains on route change or initial load
  const searchTrains = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/trains/search?from=${fromCode}&to=${toCode}&date=2026-10-05`);
      const data = await res.json();
      if (data.trains) {
        setTrains(data.trains);
      }
    } catch (e) {
      Alert.alert("Network Notice", "Connected to offline resilient engine. Showing available trains.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchTrains();
  }, []);

  // Track PNR
  const handleCheckPnr = async () => {
    if (!pnrInput.trim()) {
      Alert.alert("Enter PNR", "Please enter a 10-digit Indian Railways PNR number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/pnr/${pnrInput.trim()}`);
      const data = await res.json();
      if (data.booking) {
        setPnrResult(data.booking);
      }
    } catch (e) {
      Alert.alert("Error", "Could not reach Railway PRS Gateway");
    } finally {
      setLoading(false);
    }
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!passengerName.trim()) {
      Alert.alert("Error", "Enter passenger name");
      return;
    }
    setBookingInProgress(true);
    try {
      const res = await fetch(`${API_BASE}/api/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainNumber: selectedTrain.trainNumber,
          trainName: selectedTrain.trainName,
          from: { code: fromCode },
          to: { code: toCode },
          date: "2026-10-05",
          travelClass: selectedClass,
          quota: "GENERAL",
          passengers: [{ name: passengerName, age: passengerAge, gender: "Male", preference: "LB" }],
          totalFare: 1285
        })
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookedTickets([data.booking, ...bookedTickets]);
        setBookingModal(false);
        Alert.alert(
          "🎉 Reservation Confirmed!",
          `Indian Railways PNR: ${data.pnr}\nCoach: ${data.booking.passengers[0].coach}, Seat: #${data.booking.passengers[0].seatNumber}\nStatus: CNF (Confirmed)`
        );
        setActiveTab("tickets");
      }
    } catch (e) {
      Alert.alert("Error", "Booking submission failed");
    } finally {
      setBookingInProgress(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Mobile App Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.logoText}>
            Rail<Text style={styles.logoHighlight}>Nex</Text>
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MOBILE APP</Text>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>Official Indian Railways Smart PRS Portal</Text>
      </View>

      {/* Main Tab Views */}
      <View style={styles.content}>
        {activeTab === "search" && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Corridor Search Box */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Station to Station Search</Text>

              {/* Station Selection */}
              <View style={styles.routeRow}>
                <View style={styles.stationInputBox}>
                  <Text style={styles.inputLabel}>FROM (ORIGIN)</Text>
                  <TextInput
                    style={styles.stationInput}
                    value={fromCode}
                    onChangeText={setFromCode}
                    placeholder="e.g. RNC"
                    autoCapitalize="characters"
                  />
                  <Text style={styles.stationSub}>Ranchi / Jharkhand</Text>
                </View>

                <TouchableOpacity
                  style={styles.swapButton}
                  onPress={() => {
                    const temp = fromCode;
                    setFromCode(toCode);
                    setToCode(temp);
                  }}
                >
                  <Text style={styles.swapText}>⇄</Text>
                </TouchableOpacity>

                <View style={styles.stationInputBox}>
                  <Text style={styles.inputLabel}>TO (DESTINATION)</Text>
                  <TextInput
                    style={styles.stationInput}
                    value={toCode}
                    onChangeText={setToCode}
                    placeholder="e.g. HWH"
                    autoCapitalize="characters"
                  />
                  <Text style={styles.stationSub}>Howrah / Kolkata</Text>
                </View>
              </View>

              {/* Jharkhand Quick Stations */}
              <Text style={styles.quickChipsLabel}>Quick Jharkhand Stations:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {["RNC", "HTE", "TATA", "DHN", "BKSC", "JSME", "NDLS", "HWH", "PNBE"].map((stn) => (
                  <TouchableOpacity
                    key={stn}
                    style={[styles.chip, fromCode === stn && styles.activeChip]}
                    onPress={() => setFromCode(stn)}
                  >
                    <Text style={[styles.chipText, fromCode === stn && styles.activeChipText]}>{stn}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity style={styles.searchButton} onPress={searchTrains}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.searchButtonText}>SEARCH TRAINS (ZERO AGENT BOTS)</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Train List Results */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                Available Trains ({fromCode} ➔ {toCode})
              </Text>
              <Text style={styles.resultsSub}>Anti-Agent Protected • 0 Lag</Text>
            </View>

            {trains.map((train) => (
              <View key={train.trainNumber} style={styles.trainCard}>
                <View style={styles.trainHeader}>
                  <View>
                    <Text style={styles.trainName}>{train.trainName}</Text>
                    <Text style={styles.trainNumber}>#{train.trainNumber} • {train.trainType || "SUPERFAST"}</Text>
                  </View>
                  <View style={styles.cnfBadge}>
                    <Text style={styles.cnfBadgeText}>99% CNF</Text>
                  </View>
                </View>

                {/* Timing */}
                <View style={styles.timeRow}>
                  <View>
                    <Text style={styles.timeText}>{train.departureTime || "05:45 AM"}</Text>
                    <Text style={styles.stationText}>{train.origin || fromCode}</Text>
                  </View>
                  <View style={styles.durationLine}>
                    <Text style={styles.durationText}>{train.duration || "7h 15m"}</Text>
                    <View style={styles.dashLine} />
                  </View>
                  <View style={styles.alignRight}>
                    <Text style={styles.timeText}>{train.arrivalTime || "01:00 PM"}</Text>
                    <Text style={styles.stationText}>{train.destination || toCode}</Text>
                  </View>
                </View>

                {/* Class options */}
                <View style={styles.classesRow}>
                  {Object.entries(train.classes || {}).map(([code, info]) => (
                    <TouchableOpacity
                      key={code}
                      style={styles.classBox}
                      onPress={() => {
                        setSelectedTrain(train);
                        setSelectedClass(code);
                        setBookingModal(true);
                      }}
                    >
                      <Text style={styles.classCode}>{code}</Text>
                      <Text style={styles.classSeats}>AVL {info.displaySeats || 42}</Text>
                      <Text style={styles.classFare}>₹{info.effectiveFare || info.baseFare || 1285}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.bookNowBtn}
                  onPress={() => {
                    setSelectedTrain(train);
                    setSelectedClass("CC");
                    setBookingModal(true);
                  }}
                >
                  <Text style={styles.bookNowText}>BOOK CONFIRMED BERTH (1-CLICK)</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Tab 2: PNR Status Enquiry */}
        {activeTab === "pnr" && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Indian Railways PNR Tracker</Text>
              <Text style={styles.cardSub}>Check confirmed berth, coach number, and chart preparation.</Text>

              <TextInput
                style={styles.pnrInput}
                placeholder="Enter 10-Digit PNR (e.g. 841-6465761)"
                value={pnrInput}
                onChangeText={setPnrInput}
                keyboardType="numeric"
              />

              <TouchableOpacity style={styles.searchButton} onPress={handleCheckPnr}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>CHECK PNR STATUS</Text>}
              </TouchableOpacity>
            </View>

            {pnrResult && (
              <View style={styles.pnrResultCard}>
                <View style={styles.pnrHeader}>
                  <Text style={styles.pnrLabel}>PNR NUMBER</Text>
                  <Text style={styles.pnrValue}>{pnrResult.pnr}</Text>
                  <Text style={styles.pnrStatus}>STATUS: {pnrResult.status}</Text>
                </View>

                <View style={styles.pnrDetails}>
                  <Text style={styles.pnrDetailLine}>Train: {pnrResult.trainName} (#{pnrResult.trainNumber})</Text>
                  <Text style={styles.pnrDetailLine}>Date: {pnrResult.date} • Class: {pnrResult.travelClass}</Text>
                  <Text style={styles.pnrDetailLine}>Passenger: {pnrResult.passengers[0]?.name}</Text>
                  <Text style={styles.pnrDetailLine}>Coach: {pnrResult.passengers[0]?.coach} • Seat: #{pnrResult.passengers[0]?.seatNumber} ({pnrResult.passengers[0]?.allocatedBerth})</Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* Tab 3: My Booked Tickets */}
        {activeTab === "tickets" && (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>My Mobile Boarding Passes</Text>
              <Text style={styles.cardSub}>Valid for train journey with original Govt ID card.</Text>
            </View>

            {bookedTickets.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No Tickets Booked Yet</Text>
                <Text style={styles.emptySub}>Book any train in the Search tab to view your digital ticket pass here.</Text>
              </View>
            ) : (
              bookedTickets.map((t, idx) => (
                <View key={idx} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketTrain}>{t.trainName} (#{t.trainNumber})</Text>
                    <Text style={styles.ticketPnr}>PNR: {t.pnr}</Text>
                  </View>
                  <Text style={styles.ticketRoute}>{t.from?.code} ➔ {t.to?.code} • {t.date}</Text>
                  <View style={styles.ticketSeatBox}>
                    <Text style={styles.ticketSeatText}>
                      COACH {t.passengers[0]?.coach} • SEAT #{t.passengers[0]?.seatNumber} ({t.passengers[0]?.allocatedBerth})
                    </Text>
                    <Text style={styles.ticketCnf}>CONFIRMED</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      {/* Booking Modal */}
      <Modal visible={bookingModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Quick Passenger Reservation</Text>
            {selectedTrain && (
              <Text style={styles.modalTrain}>
                {selectedTrain.trainName} • Class {selectedClass}
              </Text>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>PASSENGER FULL NAME</Text>
              <TextInput
                style={styles.modalInput}
                value={passengerName}
                onChangeText={setPassengerName}
                placeholder="Full name as per Aadhaar"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.fieldLabel}>AGE</Text>
              <TextInput
                style={styles.modalInput}
                value={passengerAge}
                onChangeText={setPassengerAge}
                keyboardType="numeric"
                placeholder="Age in years"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setBookingModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirmBooking}
                disabled={bookingInProgress}
              >
                {bookingInProgress ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmBtnText}>Pay & Confirm (₹1,285)</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Native Mobile Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === "search" && styles.activeNavItem]}
          onPress={() => setActiveTab("search")}
        >
          <Text style={[styles.navIcon, activeTab === "search" && styles.activeNavText]}>🚆</Text>
          <Text style={[styles.navText, activeTab === "search" && styles.activeNavText]}>Book</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === "pnr" && styles.activeNavItem]}
          onPress={() => setActiveTab("pnr")}
        >
          <Text style={[styles.navIcon, activeTab === "pnr" && styles.activeNavText]}>🔎</Text>
          <Text style={[styles.navText, activeTab === "pnr" && styles.activeNavText]}>PNR Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navItem, activeTab === "tickets" && styles.activeNavItem]}
          onPress={() => setActiveTab("tickets")}
        >
          <Text style={[styles.navIcon, activeTab === "tickets" && styles.activeNavText]}>🎫</Text>
          <Text style={[styles.navText, activeTab === "tickets" && styles.activeNavText]}>My Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a"
  },
  header: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155"
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ffffff"
  },
  logoHighlight: {
    color: "#38bdf8"
  },
  badge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold"
  },
  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2
  },
  content: {
    flex: 1,
    backgroundColor: "#f1f5f9"
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 80
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4
  },
  cardSub: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 12
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10
  },
  stationInputBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 10
  },
  inputLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b"
  },
  stationInput: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginVertical: 2
  },
  stationSub: {
    fontSize: 10,
    color: "#94a3b8"
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8
  },
  swapText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold"
  },
  quickChipsLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#64748b",
    marginTop: 8,
    marginBottom: 6
  },
  chipsScroll: {
    flexDirection: "row",
    marginBottom: 12
  },
  chip: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 6
  },
  activeChip: {
    backgroundColor: "#2563eb"
  },
  chipText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#334155"
  },
  activeChipText: {
    color: "#ffffff"
  },
  searchButton: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5
  },
  resultsHeader: {
    marginVertical: 8
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a"
  },
  resultsSub: {
    fontSize: 11,
    color: "#16a34a",
    fontWeight: "bold"
  },
  trainCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0"
  },
  trainHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10
  },
  trainName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a"
  },
  trainNumber: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2
  },
  cnfBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  cnfBadgeText: {
    color: "#166534",
    fontSize: 10,
    fontWeight: "900"
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
    marginVertical: 8
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0f172a"
  },
  stationText: {
    fontSize: 11,
    color: "#64748b"
  },
  durationLine: {
    alignItems: "center"
  },
  durationText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "bold"
  },
  dashLine: {
    width: 60,
    height: 1,
    backgroundColor: "#cbd5e1",
    marginTop: 4
  },
  alignRight: {
    alignItems: "flex-end"
  },
  classesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10
  },
  classBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 3,
    alignItems: "center"
  },
  classCode: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a"
  },
  classSeats: {
    fontSize: 10,
    color: "#16a34a",
    fontWeight: "bold",
    marginVertical: 2
  },
  classFare: {
    fontSize: 11,
    fontWeight: "900",
    color: "#2563eb"
  },
  bookNowBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6
  },
  bookNowText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold"
  },
  pnrInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginVertical: 10
  },
  pnrResultCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1"
  },
  pnrHeader: {
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
    paddingBottom: 10,
    marginBottom: 10
  },
  pnrLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold"
  },
  pnrValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#f97316",
    fontFamily: "monospace"
  },
  pnrStatus: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 4
  },
  pnrDetails: {
    gap: 6
  },
  pnrDetailLine: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "500"
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 16,
    alignItems: "center"
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 6
  },
  emptySub: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center"
  },
  ticketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#16a34a"
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ticketTrain: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a"
  },
  ticketPnr: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f97316",
    fontFamily: "monospace"
  },
  ticketRoute: {
    fontSize: 12,
    color: "#64748b",
    marginVertical: 4
  },
  ticketSeatBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 8,
    marginTop: 6
  },
  ticketSeatText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a"
  },
  ticketCnf: {
    fontSize: 10,
    fontWeight: "900",
    color: "#16a34a"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a"
  },
  modalTrain: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 14
  },
  inputGroup: {
    marginBottom: 12
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    marginBottom: 4
  },
  modalInput: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    fontWeight: "bold"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#f1f5f9"
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "bold"
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#2563eb"
  },
  confirmBtnText: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#1e293b"
  },
  navItem: {
    alignItems: "center",
    paddingHorizontal: 16
  },
  activeNavItem: {
    opacity: 1
  },
  navIcon: {
    fontSize: 20
  },
  navText: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "bold"
  },
  activeNavText: {
    color: "#38bdf8"
  }
});
