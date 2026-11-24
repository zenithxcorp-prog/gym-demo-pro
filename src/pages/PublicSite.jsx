import { useState } from 'react';
import {
  Dumbbell,
  MapPin,
  Phone,
  MessageCircle,
  Check,
  ArrowRight,
  Clock,
  Shield,
  Users,
  Flame,
  Trophy,
  Menu,
  X,
  LogIn,
  Calculator,
  Star,
} from 'lucide-react';

export default function PublicSite({ config, trainers, onOpenLogin, onAddLead }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('70');
  const [bmiResult, setBmiResult] = useState(null);

  const [trialForm, setTrialForm] = useState({
    name: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    slot: 'Morning (6 AM - 10 AM)',
    goal: 'Muscle Gain',
  });
  const [trialSubmitted, setTrialSubmitted] = useState(false);

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${config.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const calculateBMI = (e) => {
    e.preventDefault();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (!h || !w) return;
    const bmi = (w / (h * h)).toFixed(1);
    let status = 'Normal Weight';
    let recommendedGoal = 'Muscle Gain';
    if (bmi < 18.5) {
      status = 'Underweight';
      recommendedGoal = 'Weight Gain';
    } else if (bmi >= 25) {
      status = 'Overweight';
      recommendedGoal = 'Fat Loss';
    }
    setBmiResult({ bmi, status, recommendedGoal });
  };

  const applyBmiGoalToTrial = () => {
    if (bmiResult) {
      setTrialForm((prev) => ({ ...prev, goal: bmiResult.recommendedGoal }));
    }
    document.getElementById('trial')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!trialForm.name.trim() || !trialForm.phone.trim()) return;
    onAddLead({
      name: trialForm.name.trim(),
      phone: trialForm.phone.trim(),
      date: trialForm.date,
      slot: trialForm.slot,
      goal: trialForm.goal,
    });
    setTrialSubmitted(true);
  };

  const plans = [
    {
      name: 'Monthly',
      price: config.prices.monthly,
      duration: '/ month',
      popular: false,
      features: ['Full Gym Floor Access', 'Cardio & Strength Zone', 'Locker & Shower Access', 'General Trainer Support'],
    },
    {
      name: '3 Months',
      price: config.prices.quarterly,
      duration: '/ 3 months',
      popular: true,
      features: ['Everything in Monthly', 'Personalized Workout Plan', 'Monthly Body Assessment', 'Basic Diet Guidelines'],
    },
    {
      name: '6 Months',
      price: config.prices.halfYearly,
      duration: '/ 6 months',
      popular: false,
      features: ['Everything in 3 Months', '2 Free PT Sessions', 'Custom Nutrition Chart', 'Priority Slot Access'],
    },
    {
      name: 'Yearly',
      price: config.prices.yearly,
      duration: '/ year',
      popular: false,
      features: ['All-Access VIP Pass', '4 Free PT Sessions', 'Quarterly Progress Check', 'Guest Pass (2x / Month)'],
    },
  ];

  const facilities = [
    { icon: Dumbbell, title: 'Imported Strength Gear', desc: 'Heavy-duty racks, calibrated plates, and biomechanical machines for serious lifters.' },
    { icon: Flame, title: 'Dedicated Cardio Deck', desc: 'Commercial treadmills, air bikes, and rowing machines for high-output conditioning.' },
    { icon: Users, title: 'Certified Coaches', desc: 'Experienced trainers on the floor to correct form, guide workouts, and prevent injuries.' },
    { icon: Shield, title: 'Clean & Hygienic Space', desc: 'Sanitized equipment, clean changing rooms, chilled RO water, and full air conditioning.' },
    { icon: Clock, title: 'Flexible Timings', desc: 'Open 5:30 AM to 10:00 PM so students and working professionals never miss a session.' },
    { icon: Trophy, title: 'Result-Driven Culture', desc: 'Structured workout routines and progress tracking built for real transformations.' },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#09090B]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-black">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="block font-display text-xl font-extrabold uppercase tracking-wider text-white leading-none">
                {config.gymName}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                {config.city}
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-zinc-400 md:flex">
            <a href="#facilities" className="hover:text-white transition">Facilities</a>
            <a href="#plans" className="hover:text-white transition">Membership</a>
            <a href="#trainers" className="hover:text-white transition">Trainers</a>
            <a href="#bmi" className="hover:text-white transition">BMI Tool</a>
            <a href="#contact" className="hover:text-white transition">Location</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:border-amber-500 hover:text-amber-400 transition"
            >
              <LogIn className="h-3.5 w-3.5" />
              Portal Login
            </button>
            <a href="#trial" className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-amber-400 transition">
              Free Trial
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button onClick={onOpenLogin} className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-amber-400">
              Login
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="rounded-lg p-2 text-zinc-300 hover:bg-zinc-900">
              {mobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-zinc-800 bg-[#111114] px-4 py-4 md:hidden">
            <div className="flex flex-col space-y-3 text-sm font-medium text-zinc-300">
              <a href="#facilities" onClick={() => setMobileMenu(false)} className="py-1">Facilities</a>
              <a href="#plans" onClick={() => setMobileMenu(false)} className="py-1">Membership Plans</a>
              <a href="#trainers" onClick={() => setMobileMenu(false)} className="py-1">Trainers</a>
              <a href="#bmi" onClick={() => setMobileMenu(false)} className="py-1">BMI Calculator</a>
              <a href="#trial" onClick={() => setMobileMenu(false)} className="rounded-lg bg-amber-500 py-2.5 text-center font-bold text-black">
                Book Free Trial
              </a>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden border-b border-zinc-800/80">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
            alt="Gym interior"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/75 to-[#09090B]/40" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-amber-400">
              <MapPin className="h-3.5 w-3.5" />
              {config.city}&apos;s Premier Training Club
            </div>
            <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
              Transform Your Body. <span className="text-amber-500">Build Real Strength.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              World-class strength machines, certified coaches, and structured workout programs designed to deliver visible results—whether you want fat loss, muscle gain, or peak fitness.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a href="#trial" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition">
                Book 1-Day Free Trial <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#plans" className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-6 py-3.5 text-sm font-semibold text-white hover:border-amber-500 transition">
                View Membership Plans
              </a>
              <button
                onClick={() => openWhatsApp(`Hi ${config.gymName}, I want to know about membership plans and free trial.`)}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black transition"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-8 sm:grid-cols-4">
            {[
              { value: '500+', label: 'Active Members' },
              { value: '40+', label: 'Pro Machines' },
              { value: '4.9 ★', label: 'Google Rating' },
              { value: '5:30 AM', label: 'Daily Opening' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="facilities" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Why Choose Us</p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
            Built For Serious Results
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-zinc-800/80 bg-[#111114] p-6 hover:border-amber-500/40 transition">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="plans" className="border-y border-zinc-800/80 bg-[#0D0D10] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Transparent Pricing</p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl">
                Membership Plans
              </h2>
            </div>
            <p className="text-sm text-zinc-400">No hidden charges. Flexible upgrades anytime.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col justify-between rounded-2xl border p-6 transition ${
                  plan.popular ? 'border-amber-500 bg-[#141418] shadow-xl shadow-amber-500/5' : 'border-zinc-800 bg-[#111114] hover:border-zinc-700'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-5 rounded-full bg-amber-500 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-base font-semibold uppercase tracking-wider text-zinc-300">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-extrabold text-white">₹{plan.price}</span>
                    <span className="text-xs text-zinc-400">{plan.duration}</span>
                  </div>
                  <ul className="mt-6 space-y-3 border-t border-zinc-800/80 pt-5 text-sm text-zinc-300">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openWhatsApp(`Hi ${config.gymName}, I am interested in the ${plan.name} Plan (₹${plan.price}). Please share joining details.`)}
                  className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition ${
                    plan.popular ? 'bg-amber-500 text-black hover:bg-amber-400' : 'border border-zinc-700 bg-zinc-900 text-white hover:border-amber-500 hover:text-amber-400'
                  }`}
                >
                  Join {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bmi" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-8 rounded-3xl border border-zinc-800 bg-[#111114] p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              <Calculator className="h-3.5 w-3.5" /> Free Fitness Check
            </div>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase text-white">Check Your BMI &amp; Goal</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Calculate your BMI and book a free trial session tailored to your exact goal.
            </p>

            <form onSubmit={calculateBMI} className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Height (cm)</label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Weight (kg)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" required />
              </div>
              <button type="submit" className="col-span-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition">
                Calculate My BMI
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#09090B] p-6 sm:p-8">
            {bmiResult ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Your Result</p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-display text-6xl font-extrabold text-amber-500">{bmiResult.bmi}</span>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">{bmiResult.status}</span>
                </div>
                <p className="mt-4 text-sm text-zinc-300">
                  Recommended Program: <strong className="text-amber-400">{bmiResult.recommendedGoal}</strong>
                </p>
                <button onClick={applyBmiGoalToTrial} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500 hover:text-black transition">
                  Book Free Trial for {bmiResult.recommendedGoal} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-8 text-center">
                <Calculator className="h-10 w-10 text-zinc-700" />
                <p className="mt-3 text-sm font-medium text-zinc-400">Enter your height and weight to see your recommendation.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="trainers" className="border-t border-zinc-800/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Expert Coaching</p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white sm:text-5xl">Meet Our Trainers</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {trainers.map((t, idx) => {
              const imgs = [
                'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
              ];
              return (
                <div key={t.id} className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#111114]">
                  <div className="h-64 overflow-hidden bg-zinc-900">
                    <img src={imgs[idx % imgs.length]} alt={t.name} className="h-full w-full object-cover object-top opacity-90 hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{t.name}</h3>
                      <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-400">{t.exp}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-zinc-400">{t.role}</p>
                    <p className="mt-3 text-xs text-zinc-500">{t.specialty}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="trial" className="border-t border-zinc-800/80 bg-[#0D0D10] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-[#111114] p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Experience First</p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white">Book Your Free Trial</h2>
            <p className="mt-2 text-sm text-zinc-400">Try our machines, meet the trainers, and feel the vibe—100% free for 1 day.</p>

            {trialSubmitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
                <p className="text-base font-bold text-emerald-400">Free Trial Request Confirmed!</p>
                <p className="mt-1 text-sm text-zinc-300">
                  Thank you, <strong>{trialForm.name}</strong>. Your request has been added to our gym desk for <strong>{trialForm.date}</strong> ({trialForm.slot}).
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => openWhatsApp(`Hi ${config.gymName}, I booked a Free Trial.\nName: ${trialForm.name}\nDate: ${trialForm.date}\nSlot: ${trialForm.slot}\nGoal: ${trialForm.goal}`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
                  >
                    <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      setTrialSubmitted(false);
                      setTrialForm((p) => ({ ...p, name: '', phone: '' }));
                    }}
                    className="rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTrialSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Full Name</label>
                    <input type="text" required placeholder="e.g. Rahul Kumar" value={trialForm.name} onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Mobile Number</label>
                    <input type="tel" required placeholder="10-digit WhatsApp number" value={trialForm.phone} onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value })} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Preferred Date</label>
                    <input type="date" required value={trialForm.date} onChange={(e) => setTrialForm({ ...trialForm, date: e.target.value })} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">Preferred Batch</label>
                    <select value={trialForm.slot} onChange={(e) => setTrialForm({ ...trialForm, slot: e.target.value })} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none">
                      <option>Morning (6 AM - 10 AM)</option>
                      <option>Evening (5 PM - 9 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Primary Fitness Goal</label>
                  <select value={trialForm.goal} onChange={(e) => setTrialForm({ ...trialForm, goal: e.target.value })} className="w-full rounded-xl border border-zinc-800 bg-[#09090B] px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none">
                    <option>Muscle Gain</option>
                    <option>Fat Loss</option>
                    <option>Weight Gain</option>
                    <option>Fitness &amp; Toning</option>
                    <option>Strength &amp; Stamina</option>
                  </select>
                </div>

                <button type="submit" className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-black hover:bg-amber-400 transition">
                  Confirm Free Trial Slot
                </button>
              </form>
            )}
          </div>

          <div id="contact" className="flex flex-col justify-between space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">Visit The Club</p>
              <h2 className="mt-2 font-display text-4xl font-bold uppercase text-white">{config.gymName}</h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Walk in anytime during club hours for a free gym tour and fitness consultation.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                  <MapPin className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-white">Location</p>
                    <p className="text-xs text-zinc-400">{config.address}, {config.city}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                  <Clock className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-white">Opening Hours</p>
                    <p className="text-xs text-zinc-400">Mon – Sat: 5:30 AM – 10:00 PM | Sun: 6:30 AM – 12:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-[#111114] p-4">
                  <Phone className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-semibold text-white">Direct Desk</p>
                    <p className="text-xs text-zinc-400">+{config.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-[#111114] p-5">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="mt-3 text-sm italic text-zinc-300">
                &ldquo;Best equipment and cleanest gym in {config.city}. The trainers actually pay attention to your form and weekly progress.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold text-zinc-500">— Rahul Sharma, Member since 2025</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {config.gymName}, {config.city}. All rights reserved.</p>
          <button onClick={onOpenLogin} className="text-zinc-400 hover:text-amber-400 transition">
            Owner / Member Portal Login →
          </button>
        </div>
      </footer>

      <button
        onClick={() => openWhatsApp(`Hi ${config.gymName}, I want to enquire about joining the gym.`)}
        className="fixed bottom-5 right-5 z-30 flex items-center justify-center rounded-full bg-emerald-500 p-3.5 text-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition"
        aria-label="WhatsApp Enquiry"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}
