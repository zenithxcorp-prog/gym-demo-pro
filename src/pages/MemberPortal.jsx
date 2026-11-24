import { useState } from 'react';
import {
  Dumbbell,
  Calendar,
  CheckCircle2,
  Circle,
  MessageCircle,
  LogOut,
  Flame,
  Utensils,
} from 'lucide-react';

export default function MemberPortal({ config, member, workoutPlan, onLogout }) {
  const [selectedDay, setSelectedDay] = useState(workoutPlan[0]?.day || 'Monday');
  const [completed, setCompleted] = useState({});

  const toggleExercise = (key) => {
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentDayPlan = workoutPlan.find((d) => d.day === selectedDay) || workoutPlan[0];
  const attendancePercent = Math.min(100, Math.round((member.monthlyAttendance / 26) * 100));

  const openWhatsApp = (msg) => {
    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const dietPlan = [
    { meal: 'Pre-Workout (6:00 AM)', items: '1 Banana + Black Coffee / Soaked Almonds' },
    { meal: 'Breakfast (8:30 AM)', items: '4 Egg Whites / Paneer Bhurji + 2 Roti / Oats + Milk' },
    { meal: 'Lunch (1:30 PM)', items: 'Rice / 3 Roti + Dal + 50g Soya Chunks / Chicken + Salad' },
    { meal: 'Evening Snack (5:00 PM)', items: 'Roasted Chana / Sattu Shake + Peanuts' },
    { meal: 'Dinner (8:30 PM)', items: '2 Roti + Sabzi + Curd / Light Protein Meal' },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] pb-16 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-black">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-base font-bold uppercase tracking-wider text-white leading-none">
                {config.gymName}
              </p>
              <p className="text-[10px] font-medium text-amber-500">Member Portal</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 pt-6">
        <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">
                Active Member • {member.id}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold uppercase text-white">
                {member.name}
              </h1>
              <p className="text-xs text-zinc-400">
                Plan: {member.plan} • Goal: {member.goal}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-right">
              <p className="text-[11px] font-medium text-amber-300">Membership Expiry</p>
              <p className="font-display text-2xl font-bold text-amber-500">
                {member.expiryDaysLeft} Days Left
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                This Month&apos;s Attendance
              </span>
              <span className="font-bold text-white">{member.monthlyAttendance} / 26 Days ({attendancePercent}%)</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${attendancePercent}%` }}
              />
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() =>
                openWhatsApp(
                  `Hi ${config.gymName}, I am ${member.name} (${member.id}). I want to renew my ${member.plan} membership.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition"
            >
              <MessageCircle className="h-4 w-4" />
              Renew Membership
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-6">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-2xl font-bold uppercase text-white">
              My Weekly Workout Plan
            </h2>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Assigned by your coach. Tap exercises to mark completed.
          </p>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {workoutPlan.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  selectedDay === d.day
                    ? 'bg-amber-500 text-black'
                    : 'border border-zinc-800 bg-[#09090B] text-zinc-400 hover:text-white'
                }`}
              >
                {d.day.slice(0, 3)}
              </button>
            ))}
          </div>

          {currentDayPlan && (
            <div className="mt-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {currentDayPlan.day} — {currentDayPlan.focus}
              </p>
              {currentDayPlan.exercises.map((ex, i) => {
                const key = `${currentDayPlan.day}-${i}`;
                const done = !!completed[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleExercise(key)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition ${
                      done
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 line-through'
                        : 'border-zinc-800 bg-[#09090B] text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-zinc-600" />
                    )}
                    <span>{ex}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-6">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-amber-500" />
            <h2 className="font-display text-2xl font-bold uppercase text-white">
              Daily Indian Diet Plan
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {dietPlan.map((d) => (
              <div key={d.meal} className="rounded-xl border border-zinc-800 bg-[#09090B] p-3.5">
                <p className="text-xs font-bold text-amber-400">{d.meal}</p>
                <p className="mt-1 text-sm text-zinc-300">{d.items}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
