// Firebase Console Script - Run in browser console while logged into Firebase
// Navigate to: https://console.firebase.google.com/project/YOUR_PROJECT/database/data

const appFormConfig = {
    id: "cykelplus-app",
    title: "CykelPLUS App Booking",
    isAppForm: true,
    type: "standard",

    // Modules enabled
    enableWorkshop: true,   // DROP_OFF method
    enablePickup: true,     // PICKUP method

    // All bike types allowed in app
    allowedVehicleTypes: [
        "Citybike",
        "El-cykel",
        "Ladcykel",
        "El-løbehjul"
    ],

    // Calendar settings - migrated from system/bookingSettings/calendarSettings
    // These settings are currently defaults in Booking.tsx (lines 13-22)
    calendarSettings: {
        bufferDays: 1,
        blockHolidays: true,
        blockWeekdays: [0, 6],  // Sunday (0) and Saturday (6) blocked
        blockedDates: [],
        timeSelectionWorkshop: true,   // Kan vælge tidspunkt på værksted
        timeSelectionPickup: false,    // Ingen tidsvalg på hent & bring
        openingHourStart: 8,
        openingHourEnd: 17
    }
};

// Copy this object and paste into Firebase Realtime Database at:
// forms/cykelplus-app
console.log(JSON.stringify(appFormConfig, null, 2));
