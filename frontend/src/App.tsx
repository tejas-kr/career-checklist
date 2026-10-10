import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, Circle, Clock3, Github, LogOut, Menu, RefreshCw, ShieldCheck,
  Sparkles, Target, TrendingUp, X
} from "lucide-react";

const API = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

type Task = { key: string; title: string; detail: string; checked: boolean };
type Week = { week: number; title: string; focus: string; tasks: Task[]; completed: number; total: number };
type User = { id: number; github_login: string; name: string | null; avatar_url: string | null };

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed (${response.status})`);
  }
  return response.json();
}

function getGreetingName(user: User) {
  return user.name?.trim().split(/\s+/)[0] || user.github_login;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [activeWeek, setActiveWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const me = await api<User>("/auth/me");
      const data = await api<{ weeks: Week[] }>("/api/weeks");
      setUser(me);
      setWeeks(data.weeks);
    } catch (e) {
      setUser(null);
      setWeeks([]);
      if (e instanceof Error && e.message !== "Please sign in with GitHub.") setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const totals = useMemo(() => {
    const completed = weeks.reduce((sum, week) => sum + week.completed, 0);
    const total = weeks.reduce((sum, week) => sum + week.total, 0);
    const finishedWeeks = weeks.filter(w => w.total > 0 && w.completed === w.total).length;
    return { completed, total, finishedWeeks, percent: total ? Math.round(completed / total * 100) : 0 };
  }, [weeks]);

  const currentWeek = weeks.find(w => w.week === activeWeek) || weeks[0];

  async function toggleTask(weekNumber: number, taskKey: string, checked: boolean) {
    setError("");
    setSaving(taskKey);
    setWeeks(previous => previous.map(week => week.week !== weekNumber ? week : {
      ...week,
      tasks: week.tasks.map(task => task.key === taskKey ? { ...task, checked } : task),
      completed: week.tasks.filter(task => task.key === taskKey ? checked : task.checked).length,
    }));
    try {
      await api(`/api/progress/${encodeURIComponent(taskKey)}`, {
        method: "PATCH",
        body: JSON.stringify({ checked }),
      });
    } catch (e) {
      setWeeks(previous => previous.map(week => week.week !== weekNumber ? week : {
        ...week,
        tasks: week.tasks.map(task => task.key === taskKey ? { ...task, checked: !checked } : task),
        completed: week.tasks.filter(task => task.key === taskKey ? !checked : task.checked).length,
      }));
      setError(e instanceof Error ? e.message : "Could not save progress.");
    } finally {
      setSaving(null);
    }
  }

  async function logout() {
    try { await api("/auth/logout", { method: "POST" }); } finally {
      setUser(null);
      setWeeks([]);
    }
  }

  if (loading) {
    return <main className="loading-screen"><div className="brand-mark"><Target size={22} /></div><div className="loader" /><p>Getting your workspace ready…</p></main>;
  }

  if (!user) {
    return (
      <main className="login-layout">
        <section className="login-hero">
          <div className="brand"><div className="brand-mark"><Target size={22} /></div><span>Career<span className="brand-light">Compass</span></span></div>
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={14} /> YOUR NEXT CHAPTER, WITH A PLAN</div>
            <h1>Small steps.<br /><em>Serious</em> progress.</h1>
            <p>A focused 16-week plan to sharpen your coding, design better systems, and move toward the product engineering role you want.</p>
            <div className="hero-stats">
              <div><strong>16</strong><span>weeks of focus</span></div>
              <div><strong>4</strong><span>growth phases</span></div>
              <div><strong>1</strong><span>step at a time</span></div>
            </div>
          </div>
          <div className="hero-footer"><span>BUILT FOR CONSISTENCY, NOT CRAMMING</span><span>01 — 16</span></div>
        </section>
        <section className="login-side">
          <div className="login-top-note"><ShieldCheck size={16} /> Your progress, saved privately</div>
          <div className="login-card">
            <div className="login-icon"><Github size={26} /></div>
            <div className="eyebrow">WELCOME TO YOUR WORKSPACE</div>
            <h2>Make your next move<br />a deliberate one.</h2>
            <p>Sign in with GitHub to save your weekly checklist and pick up exactly where you left off.</p>
            <a className="github-button" href={`${API}/auth/github`}><Github size={19} /> Continue with GitHub <ArrowRight size={17} /></a>
            {error && <div className="error-message">{error}</div>}
            <div className="privacy-note"><ShieldCheck size={15} /><span>We only use GitHub to identify your account. No repository access is requested.</span></div>
          </div>
          <div className="login-bottom">A little progress each week adds up.</div>
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand sidebar-brand"><div className="brand-mark"><Target size={21} /></div><span>Career<span className="brand-light">Compass</span></span><button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={18}/></button></div>
        <div className="side-label">YOUR ROADMAP</div>
        <button className={`overview-link ${activeWeek === 0 ? "active" : ""}`} onClick={() => { setActiveWeek(0); setMobileMenu(false); }}><TrendingUp size={17}/><span>Overview</span></button>
        <div className="side-label weeks-label">16-WEEK PLAN <span>{totals.finishedWeeks}/16</span></div>
        <nav className="week-nav">
          {weeks.map(week => {
            const complete = week.completed === week.total;
            return <button key={week.week} className={`week-link ${activeWeek === week.week ? "active" : ""}`} onClick={() => { setActiveWeek(week.week); setMobileMenu(false); }}>
              <span className={`week-number ${complete ? "week-complete" : ""}`}>{complete ? <Check size={13}/> : String(week.week).padStart(2, "0")}</span>
              <span className="week-name">{week.title}</span>
              <span className="week-count">{week.completed}/{week.total}</span>
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-progress"><div className="mini-progress-top"><span>OVERALL PROGRESS</span><strong>{totals.percent}%</strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${totals.percent}%` }} /></div><p>{totals.completed} of {totals.total} actions completed</p></div>
          <div className="user-profile"><img src={user.avatar_url || `https://github.com/${user.github_login}.png`} alt="" /><div className="user-meta"><strong>{getGreetingName(user)}</strong><span>@{user.github_login}</span></div><button className="icon-button logout-button" onClick={() => void logout()} aria-label="Sign out" title="Sign out"><LogOut size={16}/></button></div>
        </div>
      </aside>

      {mobileMenu && <button className="mobile-scrim" onClick={() => setMobileMenu(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left"><button className="icon-button mobile-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={20}/></button><span className="breadcrumb">Workspace <ChevronRight size={14}/> <strong>{activeWeek === 0 ? "Overview" : `Week ${String(activeWeek).padStart(2, "0")}`}</strong></span></div>
          <div className="topbar-right"><span className="save-status"><span className="status-dot"/>{saving ? "Saving progress…" : "Progress auto-saved"}</span><div className="avatar-small"><img src={user.avatar_url || `https://github.com/${user.github_login}.png`} alt="" /></div></div>
        </header>

        {error && <div className="error-banner"><span>{error}</span><button className="icon-button" onClick={() => setError("")} aria-label="Dismiss error"><X size={16}/></button></div>}

        {activeWeek === 0 ? (
          <div className="page-wrap">
            <div className="page-heading"><div><div className="eyebrow">YOUR CAREER, INTENTIONALLY</div><h1>Good to see you, {getGreetingName(user)}.</h1><p>Build the skills. Show the impact. Make the move.</p></div><div className="date-chip"><Clock3 size={15}/> YOUR 16-WEEK JOURNEY</div></div>
            <section className="overview-hero">
              <div className="overview-hero-copy"><div className="eyebrow light-eyebrow"><Sparkles size={14}/> THE BIG PICTURE</div><h2>Become the engineer<br/>you want to <em>be hired as.</em></h2><p>One focused plan for coding fluency, system design, and real engineering ownership.</p><button className="light-button" onClick={() => setActiveWeek(1)}>Start this week's work <ArrowRight size={16}/></button></div>
              <div className="hero-ring" style={{ "--progress": `${totals.percent}%` } as React.CSSProperties}><div className="hero-ring-inner"><strong>{totals.percent}<small>%</small></strong><span>COMPLETED</span></div></div>
              <div className="hero-decoration decor-one"/><div className="hero-decoration decor-two"/>
            </section>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon green"><CheckCircle2 size={19}/></div><span className="stat-label">ACTIONS COMPLETED</span><strong>{totals.completed}<small> / {totals.total}</small></strong><div className="stat-foot">Every action counts</div></div>
              <div className="stat-card"><div className="stat-icon blue"><Target size={19}/></div><span className="stat-label">WEEKS FINISHED</span><strong>{totals.finishedWeeks}<small> / 16</small></strong><div className="stat-foot">One week at a time</div></div>
              <div className="stat-card"><div className="stat-icon amber"><TrendingUp size={19}/></div><span className="stat-label">OVERALL PROGRESS</span><strong>{totals.percent}<small>%</small></strong><div className="stat-foot">Keep your momentum</div></div>
            </div>
            <section className="overview-lower">
              <div className="section-heading"><div><span className="eyebrow">THE ROAD AHEAD</span><h3>Your four phases</h3></div><button className="text-button" onClick={() => setActiveWeek(1)}>View plan <ArrowRight size={15}/></button></div>
              <div className="phase-grid">
                {[
                  {num:"01",range:"WEEKS 01–04",title:"Build your base",desc:"DSA fundamentals and core backend concepts",tone:"mint"},
                  {num:"02",range:"WEEKS 05–08",title:"Recognize patterns",desc:"Trees, graphs and interview problem-solving",tone:"blue"},
                  {num:"03",range:"WEEKS 09–12",title:"Think in systems",desc:"Architecture, reliability and engineering depth",tone:"peach"},
                  {num:"04",range:"WEEKS 13–16",title:"Make your move",desc:"Mocks, résumé, applications and reflection",tone:"lilac"},
                ].map(phase => <button className="phase-card" key={phase.num} onClick={() => setActiveWeek(Number(phase.range.slice(6,8)))}><div className={`phase-num ${phase.tone}`}>{phase.num}</div><span className="phase-range">{phase.range}</span><h4>{phase.title}</h4><p>{phase.desc}</p><ArrowDownRight className="phase-arrow" size={17}/></button>)}
              </div>
              <div className="next-action"><div className="next-action-icon"><Target size={20}/></div><div className="next-action-copy"><span className="eyebrow">YOUR NEXT STEP</span><strong>{weeks.find(w => w.completed < w.total)?.title || "All weeks complete — review your next cycle"}</strong><p>{weeks.find(w => w.completed < w.total)?.focus || "Review your progress and set your next goal."}</p></div><button className="circle-arrow" onClick={() => setActiveWeek(weeks.find(w => w.completed < w.total)?.week || 16)} aria-label="Go to next week"><ArrowRight size={19}/></button></div>
            </section>
          </div>
        ) : currentWeek && (
          <div className="page-wrap week-page">
            <div className="week-kicker"><span>THE ROADMAP</span><span className="kicker-line"/><span>WEEK {String(currentWeek.week).padStart(2,"0")} OF 16</span></div>
            <div className="week-title-row"><div><div className="eyebrow">PHASE {Math.ceil(currentWeek.week / 4)} · {["BUILD YOUR BASE","RECOGNIZE PATTERNS","THINK IN SYSTEMS","MAKE YOUR MOVE"][Math.ceil(currentWeek.week / 4)-1]}</div><h1>{currentWeek.title}<span className="title-period">.</span></h1><p>{currentWeek.focus}</p></div><div className="week-progress-card"><div className="week-progress-number">{currentWeek.completed}<span>/{currentWeek.total}</span></div><div className="week-progress-caption">ACTIONS DONE</div><div className="progress-track"><div className="progress-fill" style={{width:`${currentWeek.total ? currentWeek.completed/currentWeek.total*100 : 0}%`}}/></div></div></div>
            <div className="week-callout"><div className="callout-icon"><Target size={19}/></div><div><strong>Keep it focused.</strong><p>Work through these actions at a steady pace. Check each one off when you've actually completed it—not just when you've read about it.</p></div></div>
            <section className="checklist-section">
              <div className="checklist-heading"><div><span className="eyebrow">YOUR ACTION PLAN</span><h2>This week's checklist</h2></div><span className="task-count">{currentWeek.completed} OF {currentWeek.total} COMPLETE</span></div>
              <div className="task-list">
                {currentWeek.tasks.map((task, index) => <label className={`task-row ${task.checked ? "task-done" : ""}`} key={task.key}>
                  <input type="checkbox" checked={task.checked} onChange={e => void toggleTask(currentWeek.week, task.key, e.target.checked)} />
                  <span className="custom-check">{task.checked && <Check size={15}/>}</span>
                  <span className="task-index">{String(index+1).padStart(2,"0")}</span>
                  <span className="task-copy"><strong>{task.title}</strong><span>{task.detail}</span></span>
                  <span className={`task-state ${task.checked ? "state-done" : ""}`}>{task.checked ? "DONE" : saving === task.key ? "SAVING" : "TO DO"}</span>
                </label>)}
              </div>
              {currentWeek.completed === currentWeek.total && <div className="week-complete-banner"><CheckCircle2 size={20}/><div><strong>Week complete. Nice work.</strong><p>Take a moment to reflect on what you learned before moving on.</p></div></div>}
            </section>
            <div className="week-navigation"><button className="previous-week" disabled={currentWeek.week === 1} onClick={() => setActiveWeek(Math.max(1,currentWeek.week-1))}><ChevronLeft size={17}/> Previous week</button><div className="week-dots">{weeks.map(w => <button key={w.week} aria-label={`Go to week ${w.week}`} title={`Week ${w.week}`} className={`${w.week === currentWeek.week ? "dot-active" : ""} ${w.completed === w.total ? "dot-done" : ""}`} onClick={() => setActiveWeek(w.week)}/>)}</div><button className="next-week" onClick={() => setActiveWeek(Math.min(16,currentWeek.week+1))} disabled={currentWeek.week === 16}>Next week <ChevronRight size={17}/></button></div>
          </div>
        )}
        <footer className="page-footer"><span>CAREER COMPASS <span className="footer-dot">·</span> BUILT ONE WEEK AT A TIME</span><span><span className="status-dot"/> YOUR PROGRESS IS SAVED TO YOUR ACCOUNT</span></footer>
      </main>
    </div>
  );
}
