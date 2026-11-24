const STORAGE_KEY = 'ironforge_gym_demo_v1';

export const INITIAL_DATA = {
  members: [
    {
      id: 'MEM-101',
      name: 'Rahul Sharma',
      phone: '9876543210',
      plan: '3 Months',
      fee: 2499,
      paid: true,
      pendingAmount: 0,
      expiryDaysLeft: 3,
      expiryDate: '27 Nov',
      lastVisitDaysAgo: 0,
      checkedInToday: true,
      monthlyAttendance: 21,
      goal: 'Muscle Gain',
    },
    {
      id: 'MEM-102',
      name: 'Amit Verma',
      phone: '9876543211',
      plan: 'Monthly',
      fee: 999,
      paid: false,
      pendingAmount: 999,
      expiryDaysLeft: 5,
      expiryDate: '29 Nov',
      lastVisitDaysAgo: 9,
      checkedInToday: false,
      monthlyAttendance: 11,
      goal: 'Fat Loss',
    },
    {
      id: 'MEM-103',
      name: 'Sonu Kumar',
      phone: '9876543212',
      plan: '6 Months',
      fee: 4499,
      paid: true,
      pendingAmount: 0,
      expiryDaysLeft: 7,
      expiryDate: '01 Dec',
      lastVisitDaysAgo: 1,
      checkedInToday: false,
      monthlyAttendance: 19,
      goal: 'Strength',
    },
    {
      id: 'MEM-104',
      name: 'Priya Singh',
      phone: '9876543213',
      plan: 'Yearly',
      fee: 7999,
      paid: true,
      pendingAmount: 0,
      expiryDaysLeft: 142,
      expiryDate: '15 Apr',
      lastVisitDaysAgo: 0,
      checkedInToday: true,
      monthlyAttendance: 24,
      goal: 'Fitness & Toning',
    },
    {
      id: 'MEM-105',
      name: 'Rohit Raj',
      phone: '9876543214',
      plan: '3 Months',
      fee: 2499,
      paid: false,
      pendingAmount: 1500,
      expiryDaysLeft: 2,
      expiryDate: '26 Nov',
      lastVisitDaysAgo: 12,
      checkedInToday: false,
      monthlyAttendance: 8,
      goal: 'Weight Gain',
    },
    {
      id: 'MEM-106',
      name: 'Karan Thakur',
      phone: '9876543215',
      plan: 'Monthly',
      fee: 999,
      paid: false,
      pendingAmount: 999,
      expiryDaysLeft: 18,
      expiryDate: '12 Dec',
      lastVisitDaysAgo: 2,
      checkedInToday: false,
      monthlyAttendance: 16,
      goal: 'Muscle Gain',
    },
  ],
  leads: [
    {
      id: 'LD-01',
      name: 'Ankit Mishra',
      phone: '9811223344',
      slot: 'Morning (6 AM - 10 AM)',
      date: '25 Nov',
      goal: 'Fat Loss',
      status: 'Trial Booked',
    },
    {
      id: 'LD-02',
      name: 'Sneha Gupta',
      phone: '9822334455',
      slot: 'Evening (5 PM - 9 PM)',
      date: '25 Nov',
      goal: 'Fitness & Toning',
      status: 'New Lead',
    },
    {
      id: 'LD-03',
      name: 'Deepak Yadav',
      phone: '9833445566',
      slot: 'Morning (6 AM - 10 AM)',
      date: '24 Nov',
      goal: 'Muscle Gain',
      status: 'Trial Completed',
    },
  ],
  trainers: [
    {
      id: 'TR-1',
      name: 'Arjun Rathore',
      role: 'Head Strength Coach',
      exp: '8+ Yrs',
      clients: 34,
      specialty: 'Hypertrophy & Powerlifting',
    },
    {
      id: 'TR-2',
      name: 'Meera Nair',
      role: 'Fat Loss & Conditioning',
      exp: '6+ Yrs',
      clients: 28,
      specialty: 'HIIT, Mobility & Nutrition',
    },
    {
      id: 'TR-3',
      name: 'Kabir Khan',
      role: 'Transformation Specialist',
      exp: '5+ Yrs',
      clients: 22,
      specialty: 'Body Recomposition',
    },
  ],
  workoutPlan: [
    { day: 'Monday', focus: 'Chest & Triceps', exercises: ['Bench Press 4x10', 'Incline Dumbbell Press 3x12', 'Cable Fly 3x15', 'Tricep Rope Pushdown 4x12'] },
    { day: 'Tuesday', focus: 'Back & Biceps', exercises: ['Pull-Ups 4xMax', 'Lat Pulldown 4x12', 'Seated Cable Row 3x12', 'Barbell Curl 4x10'] },
    { day: 'Wednesday', focus: 'Legs & Core', exercises: ['Barbell Squats 4x10', 'Leg Press 4x12', 'Romanian Deadlift 3x10', 'Hanging Leg Raises 3x15'] },
    { day: 'Thursday', focus: 'Shoulders & Traps', exercises: ['Overhead Press 4x10', 'Lateral Raises 4x15', 'Face Pulls 3x15', 'Dumbbell Shrugs 4x12'] },
    { day: 'Friday', focus: 'Arms & Conditioning', exercises: ['Incline Dumbbell Curl 3x12', 'Skull Crushers 3x12', 'Hammer Curls 3x12', '15 Min HIIT Sprints'] },
    { day: 'Saturday', focus: 'Full Body / Cardio', exercises: ['Deadlifts 3x8', 'Push-Ups 3x20', 'Plank Hold 3x60s', '20 Min Incline Walk'] },
  ],
};

export function loadGymData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    return JSON.parse(raw);
  } catch {
    return INITIAL_DATA;
  }
}

export function saveGymData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function resetGymData() {
  localStorage.removeItem(STORAGE_KEY);
  return INITIAL_DATA;
}
