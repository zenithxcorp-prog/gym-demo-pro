import { useState } from 'react';
import {
  LayoutDashboard, Users, CheckCircle2, AlertTriangle, IndianRupee,
  UserPlus, Dumbbell, LogOut, RotateCcw, MessageCircle, Search, Plus, Menu, X,
} from 'lucide-react';

export default function OwnerDashboard({ config, data, onUpdateData, onResetData, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '', phone: '', plan: '3 Months', fee: '2499', paid: true, goal: 'Muscle Gain',
  });
  const [editingDay, setEditingDay] = useState('Monday');
  const [newExercise, setNewExercise] = useState('');

  const { members, leads, trainers, workoutPlan } = data;

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.expiryDaysLeft > 0).length;
  const expiringSoon = members.filter((m) => m.expiryDaysLeft <= 7);
  const todayAttendance = members.filter((m) => m.checkedInToday).length;
  const pendingTotal = members.reduce((sum, m) => sum + (m.pendingAmount || 0), 0);
  const newLeadsCount = leads.filter((l) => l.status === 'New Lead' || l.status === 'Trial Booked').length;
  const absentMembers = members.filter((m) => m.lastVisitDaysAgo >= 7);

  const openWhatsApp = (phone, message) => {
    const cleanPhone = phone.length === 10 ? `91${phone}` : phone;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    const feeNum = parseInt(newMember.fee, 10) || 999;
    const days = newMember.plan === 'Yearly' ? 365 : newMember.plan === '6 Months' ? 180 : newMember.plan === '3 Months' ? 90 : 30;
    const created = {
      id: `MEM-${100 + members.length + 1}`,
      name: newMember.name.trim(),
      phone: newMember.phone.trim(),
      plan: newMember.plan,
      fee: feeNum,
      paid: newMember.paid,
      pendingAmount: newMember.paid ? 0 : feeNum,
      expiryDaysLeft: days,
      expiryDate: 'Next Cycle',
      lastVisitDaysAgo: 0,
      checkedInToday: true,
      monthlyAttendance: 1,
      goal: newMember.goal,
    };
    onUpdateData({ ...data, members: [created, ...members] });
    setShowAddMember(false);
    setNewMember({ name: '', phone: '', plan: '3 Months', fee: '2499', paid: true, goal: 'Muscle Gain' });
  };

  const toggleCheckIn = (id) => {
    const updated = members.map((m) =>
      m.id === id
        ? {
            ...m,
            checkedInToday: !m.checkedInToday,
            lastVisitDaysAgo: !m.checkedInToday ? 0 : m.lastVisitDaysAgo,
            monthlyAttendance: !m.checkedInToday ? m.monthlyAttendance + 1 : Math.max(0, m.monthlyAttendance - 1),
          }
        : m
    );
    onUpdateData({ ...data, members: updated });
  };

  const quickRenew = (id) => {
    const updated = members.map((m) => (m.id === id ? { ...m, expiryDaysLeft: 30, expiryDate: 'Renewed (+30d)' } : m));
    onUpdateData({ ...data, members: updated });
  };

  const markFeePaid = (id) => {
    const updated = members.map((m) => (m.id === id ? { ...m, paid: true, pendingAmount: 0 } : m));
    onUpdateData({ ...data, members: updated });
  };

  const updateLeadStatus = (id, status) => {
    onUpdateData({ ...data, leads: leads.map((l) => (l.id === id ? { ...l, status } : l)) });
  };

  const convertLeadToMember = (lead) => {
    const newMem = {
      id: `MEM-${100 + members.length + 1}`,
      name: lead.name,
      phone: lead.phone,
      plan: 'Monthly',
      fee: parseInt(config.prices.monthly.replace(/,/g, ''), 10) || 999,
      paid: true,
      pendingAmount: 0,
      expiryDaysLeft: 30,
      expiryDate: 'New Join (+30d)',
      lastVisitDaysAgo: 0,
      checkedInToday: true,
      monthlyAttendance: 1,
      goal: lead.goal || 'Fitness',
    };
    const updatedLeads = leads.map((l) => (l.id === lead.id ? { ...l, status: 'Joined' } : l));
    onUpdateData({ ...data, members: [newMem, ...members], leads: updatedLeads });
  };

  const addExerciseToDay = (e) => {
    e.preventDefault();
    if (!newExercise.trim()) return;
    const updated = workoutPlan.map((d) =>
      d.day === editingDay ? { ...d, exercises: [...d.exercises, newExercise.trim()] } : d
    );
    onUpdateData({ ...data, workoutPlan: updated });
    setNewExercise('');
  };

  const removeExercise = (dayName, idx) => {
    const updated = workoutPlan.map((d) =>
      d.day === dayName ? { ...d, exercises: d.exercises.filter((_, i) => i !== idx) } : d
    );
    onUpdateData({ ...data, workoutPlan: updated });
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users, badge: totalMembers },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2, badge: todayAttendance },
    { id: 'expiry', label: 'Expiry Alerts', icon: AlertTriangle, badge: expiringSoon.length },
    { id: 'fees', label: 'Fees & Payments', icon: IndianRupee },
    { id: 'leads', label: 'Leads CRM', icon: UserPlus, badge: newLeadsCount },
    { id: 'workouts', label: 'Trainers & Workouts', icon: Dumbbell },
  ];

  const filteredMembers = members.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  return (
    <div className="flex min-h-screen bg-[#09090B] text-zinc-100">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-black/70 lg:hidden" />}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-800/80 bg-[#0D0D10] transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
          <div>
            <p className="font-display text-lg font-extrabold uppercase tracking-wider text-white">{config.gymName}</p>
            <p className="text-[11px] font-medium text-amber-500">Owner Command Center</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${active ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'}`}
              >
                <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${active ? 'bg-black/20 text-black' : 'bg-zinc-800 text-zinc-300'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-zinc-800/80 p-3">
          <button onClick={onResetData} className="flex w-full items-center gap-2 rounded-xl border border-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white">
            <RotateCcw className="h-3.5 w-3.5" /> Reset Demo Data
          </button>
          <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500 hover:text-white transition">
            <LogOut className="h-3.5 w-3.5" /> Logout to Website
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-800/80 bg-[#09090B]/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="rounded-lg border border-zinc-800 p-2 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button>
            <div>
              <h1 className="text-base font-bold text-white sm:text-lg">Welcome, {config.owner}</h1>
              <p className="text-xs text-zinc-500">{config.city} Branch • Live Management</p>
            </div>
          </div>
          <button onClick={() => { setActiveTab('members'); setShowAddMember(true); }} className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-black hover:bg-amber-400">
            <Plus className="h-4 w-4" /> Add Member
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {[
                  { label: 'Total Members', value: totalMembers, sub: 'Registered' },
                  { label: 'Active Members', value: activeMembers, sub: 'Valid plans' },
                  { label: 'Expiring Soon', value: expiringSoon.length, sub: 'Within 7 days', warn: true },
                  { label: "Today's Attendance", value: todayAttendance, sub: 'Checked in today' },
                  { label: 'Pending Fees', value: `₹${pendingTotal.toLocaleString()}`, sub: 'Dues to collect', warn: pendingTotal > 0 },
                  { label: 'Active Leads', value: newLeadsCount, sub: 'Trial & enquiries' },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-5">
                    <p className="text-xs font-medium text-zinc-400">{kpi.label}</p>
                    <p className={`mt-2 font-display text-3xl font-bold sm:text-4xl ${kpi.warn ? 'text-amber-500' : 'text-white'}`}>{kpi.value}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Expiring Soon</h3>
                    <button onClick={() => setActiveTab('expiry')} className="text-xs text-amber-500 hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {expiringSoon.slice(0, 3).map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#09090B] p-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{m.name}</p>
                          <p className="text-xs text-amber-400">{m.expiryDaysLeft} days left • {m.plan}</p>
                        </div>
                        <button onClick={() => openWhatsApp(m.phone, `Hello ${m.name}! Your ${config.gymName} membership expires in ${m.expiryDaysLeft} days. Renew today!`)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black">
                          <MessageCircle className="h-3.5 w-3.5" /> Remind
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">Recent Free Trial Leads</h3>
                    <button onClick={() => setActiveTab('leads')} className="text-xs text-amber-500 hover:underline">Manage CRM</button>
                  </div>
                  <div className="space-y-3">
                    {leads.slice(0, 3).map((l) => (
                      <div key={l.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#09090B] p-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{l.name}</p>
                          <p className="text-xs text-zinc-400">{l.goal} • {l.slot}</p>
                        </div>
                        <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">{l.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member..." className="w-full rounded-xl border border-zinc-800 bg-[#111114] py-2.5 pl-10 pr-4 text-sm text-white focus:border-amber-500 focus:outline-none" />
                </div>
                <button onClick={() => setShowAddMember(!showAddMember)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black">
                  <Plus className="h-4 w-4" /> {showAddMember ? 'Close' : 'New Member'}
                </button>
              </div>

              {showAddMember && (
                <form onSubmit={handleAddMember} className="grid gap-4 rounded-2xl border border-amber-500/40 bg-[#111114] p-5 sm:grid-cols-3">
                  <input type="text" required placeholder="Full Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} className="rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  <input type="tel" required placeholder="Mobile Number" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} className="rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  <select value={newMember.plan} onChange={(e) => setNewMember({ ...newMember, plan: e.target.value })} className="rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white">
                    <option>Monthly</option><option>3 Months</option><option>6 Months</option><option>Yearly</option>
                  </select>
                  <input type="number" required placeholder="Fee (₹)" value={newMember.fee} onChange={(e) => setNewMember({ ...newMember, fee: e.target.value })} className="rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white" />
                  <select value={newMember.paid ? 'paid' : 'pending'} onChange={(e) => setNewMember({ ...newMember, paid: e.target.value === 'paid' })} className="rounded-xl border border-zinc-800 bg-[#09090B] px-3.5 py-2.5 text-sm text-white">
                    <option value="paid">Fee Paid</option><option value="pending">Fee Pending</option>
                  </select>
                  <button type="submit" className="rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black">Save Member</button>
                </form>
              )}

              <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-[#111114]">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-800 text-xs uppercase text-zinc-400">
                    <tr><th className="px-4 py-3.5">Member</th><th className="px-4 py-3.5">Plan</th><th className="px-4 py-3.5">Expiry</th><th className="px-4 py-3.5">Fee</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredMembers.map((m) => (
                      <tr key={m.id}>
                        <td className="px-4 py-3.5"><p className="font-semibold text-white">{m.name}</p><p className="text-xs text-zinc-500">{m.phone}</p></td>
                        <td className="px-4 py-3.5 text-zinc-300">{m.plan}</td>
                        <td className="px-4 py-3.5 text-xs font-semibold text-amber-400">{m.expiryDaysLeft}d left</td>
                        <td className="px-4 py-3.5">
                          {m.paid ? <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400">Paid</span> : <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-400">Due ₹{m.pendingAmount}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              {absentMembers.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                  <h3 className="text-sm font-bold text-amber-400">Absent 7+ Days Alert ({absentMembers.length})</h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {absentMembers.map((m) => (
                      <div key={m.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#111114] p-3.5">
                        <div><p className="text-sm font-semibold text-white">{m.name}</p><p className="text-xs text-red-400">Last visit: {m.lastVisitDaysAgo}d ago</p></div>
                        <button onClick={() => openWhatsApp(m.phone, `Hi ${m.name}, we missed you at ${config.gymName}! See you back tomorrow!`)} className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400">Follow Up</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                    <div><p className="font-semibold text-white">{m.name}</p><p className="text-xs text-zinc-400">Month: {m.monthlyAttendance} days</p></div>
                    <button onClick={() => toggleCheckIn(m.id)} className={`rounded-xl px-4 py-2 text-xs font-bold ${m.checkedInToday ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500 text-black'}`}>
                      {m.checkedInToday ? 'Checked In ✓' : 'Check In'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expiry' && (
            <div className="grid gap-4 sm:grid-cols-2">
              {expiringSoon.map((m) => (
                <div key={m.id} className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
                  <div className="flex items-start justify-between">
                    <div><h3 className="font-bold text-white">{m.name}</h3><p className="text-xs text-zinc-400">{m.phone} • {m.plan}</p></div>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400">{m.expiryDaysLeft}d Left</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openWhatsApp(m.phone, `Hello ${m.name}! Your ${config.gymName} membership expires in ${m.expiryDaysLeft} days. Renew today!`)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-black">
                      <MessageCircle className="h-4 w-4" /> WhatsApp Reminder
                    </button>
                    <button onClick={() => quickRenew(m.id)} className="rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-200">+30d Renew</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                  <div><p className="font-semibold text-white">{m.name}</p><p className="text-xs text-zinc-400">{m.plan} • ₹{m.fee}</p></div>
                  <div className="flex items-center gap-2.5">
                    {!m.paid ? (
                      <><span className="text-xs font-bold text-red-400">Due ₹{m.pendingAmount}</span><button onClick={() => markFeePaid(m.id)} className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-black">Mark Paid</button></>
                    ) : (
                      <><span className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">Paid ✓</span><button onClick={() => openWhatsApp(m.phone, `Receipt - ${config.gymName}\nMember: ${m.name}\nPlan: ${m.plan}\nPaid: ₹${m.fee}`)} className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300">Receipt</button></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                  <div><p className="font-semibold text-white">{lead.name}</p><p className="text-xs text-zinc-400">{lead.phone} • {lead.goal} • {lead.slot}</p></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select value={lead.status} onChange={(e) => updateLeadStatus(lead.id, e.target.value)} className="rounded-xl border border-zinc-700 bg-[#09090B] px-3 py-2 text-xs font-semibold text-white">
                      <option>New Lead</option><option>Trial Booked</option><option>Trial Completed</option><option>Joined</option><option>Not Joined</option>
                    </select>
                    <button onClick={() => openWhatsApp(lead.phone, `Hi ${lead.name}, thanks for booking your Free Trial at ${config.gymName}!`)} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-400"><MessageCircle className="h-4 w-4" /></button>
                    {lead.status !== 'Joined' && <button onClick={() => convertLeadToMember(lead)} className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-black">Convert</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {trainers.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                    <p className="font-bold text-white">{t.name}</p><p className="text-xs text-amber-400">{t.role}</p><p className="mt-1 text-xs text-zinc-400">{t.clients} clients • {t.exp}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
                <h3 className="font-bold text-white">Live Workout Plan Assigner</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workoutPlan.map((d) => (
                    <button key={d.day} onClick={() => setEditingDay(d.day)} className={`rounded-xl px-3.5 py-2 text-xs font-bold ${editingDay === d.day ? 'bg-amber-500 text-black' : 'border border-zinc-800 bg-[#09090B] text-zinc-400'}`}>{d.day}</button>
                  ))}
                </div>
                {workoutPlan.filter((d) => d.day === editingDay).map((dayObj) => (
                  <div key={dayObj.day} className="mt-4 space-y-2.5">
                    {dayObj.exercises.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-2.5 text-sm">
                        <span>{ex}</span>
                        <button onClick={() => removeExercise(dayObj.day, i)} className="text-xs text-red-400">Remove</button>
                      </div>
                    ))}
                    <form onSubmit={addExerciseToDay} className="flex gap-2 pt-2">
                      <input type="text" value={newExercise} onChange={(e) => setNewExercise(e.target.value)} placeholder="Add new exercise..." className="flex-1 rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-2.5 text-sm text-white" />
                      <button type="submit" className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black">Add</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
