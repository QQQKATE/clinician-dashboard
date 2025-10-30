import React, { useMemo, useState, useEffect } from "react";

// Clinician Dashboard – Step 2 & 3
// Adds: Schedule Drawer (edit/delete + weekly RRULE), and Reusable Pathways (mini)
// Still dependency-light, runs with Tailwind only.

/********************** Utils ************************/ 
function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  d.setHours(0,0,0,0);
  return d;
}
function addDays(date, days){ const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function fmtDateTime(dt){ const d=new Date(dt); return d.toLocaleString(); }
function iso(d){ return new Date(d).toISOString(); }
function id(){ return Math.random().toString(36).slice(2,10); }

/********************** Seeds ************************/ 
const cohorts = [{ id: "cohort_ortho_preop", name: "Ortho Pre‑Op" }];
const patients = [
  { id: "p1", name: "Alice Jones" },
  { id: "p2", name: "Ben Smith" },
  { id: "p3", name: "Chen Li" },
];

const seedTemplates = () => ([
  { id: "tmpl_fast_std", type: "module", title: "Pre‑op Fasting (Standard)", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Stop eating 6 hours before surgery. You may drink clear water up to 2 hours prior." }
    ], status: "draft", version: 1 },
  { id: "tmpl_fast_easy", type: "module", title: "Pre‑op Fasting (Easy‑Read)", literacy: "easy", language: "en", blocks: [
      { kind: "text", content: "No food 6 hours before surgery. Clear water is ok until 2 hours before." }
    ], status: "draft", version: 1 },
  { id: "tmpl_wound", type: "module", title: "Post‑op Wound Care", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Keep dressing dry for 48 hours. Watch for redness, swelling, fever." }
    ], status: "approved", version: 1 },
  { id: "tmpl_pain", type: "module", title: "Pain Medication Schedule", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Take paracetamol every 6–8 hours as prescribed. Avoid exceeding daily dose." }
    ], status: "approved", version: 1 },
  { id: "tmpl_consent", type: "consent", title: "Pre‑op Consent (General)", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Please review and acknowledge the consent information prior to surgery." }
    ], status: "draft", version: 1 },
  { id: "tmpl_appt", type: "reminder", title: "Appointment Reminder", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Your appointment is coming up. Please arrive 10 minutes early." }
    ], status: "approved", version: 1 },
  { id: "tmpl_mob", type: "module", title: "Mobility Guide", literacy: "easy", language: "en", blocks: [
      { kind: "text", content: "Start walking short distances at home. Increase a little each day." }
    ], status: "approved", version: 1 },
  { id: "tmpl_quiz_fast", type: "quiz", title: "Quiz: Fasting Rules", literacy: "standard", language: "en", blocks: [
      { kind: "quiz", items: [
          { q: "Until when can you drink clear water?", options: ["2 hours before", "6 hours before"], correct: 0 },
          { q: "How many hours before surgery should you stop eating?", options: ["2", "6"], correct: 1 }
        ]}
    ], status: "approved", version: 1 }
]);

/********************** UI bits ************************/ 
const Tile = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-1">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-semibold">{value}</div>
  </div>
);
const Ribbon = ({ text }) => (<div className="text-xs text-gray-500">{text}</div>);

/********************** Main ************************/ 
export default function ClinicianDashboard() {
  // NOTE: For simplicity we keep the function-state pattern used earlier.
  const [templates, setTemplates] = useState(seedTemplates);
  const [query, setQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [weekAnchor, setWeekAnchor] = useState(startOfWeek(new Date()));
  const [schedules, setSchedules] = useState([]); // {id, templateId, targetType, targetId, date, rrule}
  const [deliveries, setDeliveries] = useState([]); // {id, scheduleId, status, ts, score}
  const [audit, setAudit] = useState([]); // {id, entity, entityId, action, actor, ts, diff}
  const [target, setTarget] = useState({ type: "cohort", id: cohorts[0].id });
  const [actor] = useState("Michael");
  const [preview, setPreview] = useState(null); // {template}
  const [drawer, setDrawer] = useState(null); // {mode:'edit', schedule}
  const [pathwayOpen, setPathwayOpen] = useState(false);
  const [pathway, setPathway] = useState({ name: "Ortho Pre‑Op (mini)", steps: [
    { id: id(), templateId: "tmpl_fast_easy", offset: -7 },
    { id: id(), templateId: "tmpl_consent", offset: -2 },
    { id: id(), templateId: "tmpl_wound", offset: 3 },
  ]});
  const [pathwayRefDate, setPathwayRefDate] = useState(() => new Date().toISOString().slice(0,10));

  useEffect(() => { logAudit("system", "dashboard", "init", actor, { note: "seed" }); }, []);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i)), [weekAnchor]);
  const filteredTemplates = useMemo(() => templates().filter(t => (t.title.toLowerCase().includes(query.toLowerCase()) || t.type.includes(query.toLowerCase()))), [templates, query]);

  function logAudit(entity, entityId, action, actor, diff) { setAudit(a => [{ id: id(), entity, entityId, action, actor, ts: new Date().toISOString(), diff }, ...a]); }

  function onDragStartTemplate(ev, templateId){ ev.dataTransfer.setData("text/plain", templateId); }
  function onDropDay(ev, date){
    const templateId = ev.dataTransfer.getData("text/plain"); if(!templateId) return;
    createSchedule({ templateId, date, targetType: target.type, targetId: target.id, rrule: "" });
  }

  function createSchedule({ templateId, date, targetType, targetId, rrule }){
    const sched = { id: id(), templateId, targetType, targetId, date: iso(date), rrule: rrule || "" };
    setSchedules(list => [...list, sched]);
    logAudit("schedule", sched.id, "create", actor, { templateId, date: sched.date, rrule: sched.rrule });
  }

  function simulateDeliveries(){
    const start = weekAnchor; const end = addDays(weekAnchor, 7);
    const withinWeek = schedules.filter(s => new Date(s.date) >= start && new Date(s.date) < end);
    const events = withinWeek.flatMap(s => {
      const sent = { id: id(), scheduleId: s.id, status: "sent", ts: new Date(s.date).toISOString() };
      const opened = { id: id(), scheduleId: s.id, status: "opened", ts: new Date(s.date).toISOString() };
      const completed = { id: id(), scheduleId: s.id, status: "completed", ts: new Date(s.date).toISOString(), score: Math.round(70 + Math.random()*30) };
      return [sent, opened, completed];
    });
    setDeliveries(prev => [...events, ...prev]);
    logAudit("delivery", "batch", "simulate", actor, { count: events.length });
  }

  const analytics = useMemo(() => {
    const ids = new Set(schedules.map(s => s.id));
    const sent = deliveries.filter(d => d.status === "sent" && ids.has(d.scheduleId)).length;
    const opened = deliveries.filter(d => d.status === "opened" && ids.has(d.scheduleId)).length;
    const completed = deliveries.filter(d => d.status === "completed" && ids.has(d.scheduleId));
    const avgScore = completed.length ? Math.round(completed.reduce((a,c)=>a+(c.score||0),0)/completed.length) : 0;
    return { sent, opened, completed: completed.length, avgScore };
  }, [deliveries, schedules]);

  function selectTemplate(id){ setSelectedTemplateId(id); }
  const selectedTemplate = useMemo(() => templates().find(t => t.id === selectedTemplateId) || null, [templates, selectedTemplateId]);

  function updateTemplate(partial){ setTemplates(prev => () => prev().map(t => t.id === selectedTemplateId ? { ...t, ...partial } : t)); logAudit("template", selectedTemplateId, "update", actor, partial); }
  function submitForReview(){ if(!selectedTemplate) return; updateTemplate({ status: "in_review" }); }
  function approveTemplate(){ if(!selectedTemplate) return; updateTemplate({ status: "approved" }); }
  function publishTemplate(){ if(!selectedTemplate) return; updateTemplate({ status: "published", version: (selectedTemplate.version||1) + 1 }); }
  function rollbackTemplate(){ if(!selectedTemplate) return; if((selectedTemplate.version||1) > 1){ updateTemplate({ version: selectedTemplate.version - 1, status: "approved" }); } }

  /*************** Schedule Drawer (Step 2) ***************/
  function openDrawer(s){ setDrawer({ mode: 'edit', schedule: { ...s } }); }
  function closeDrawer(){ setDrawer(null); }
  function saveDrawer(){
    if(!drawer) return;
    setSchedules(list => list.map(s => s.id === drawer.schedule.id ? { ...drawer.schedule } : s));
    logAudit("schedule", drawer.schedule.id, "update", actor, { ...drawer.schedule });
    closeDrawer();
  }
  function deleteSchedule(idToDel){ setSchedules(list => list.filter(s => s.id !== idToDel)); logAudit("schedule", idToDel, "delete", actor, {}); closeDrawer(); }

  /*************** Pathways (Step 3) ***************/
  function addPathwayStep(){ setPathway(p => ({ ...p, steps: [...p.steps, { id: id(), templateId: templates()[0]?.id || '', offset: 0 }] })); }
  function updatePathwayStep(stepId, changes){ setPathway(p => ({ ...p, steps: p.steps.map(s => s.id===stepId?{...s, ...changes}:s) })); }
  function removePathwayStep(stepId){ setPathway(p => ({ ...p, steps: p.steps.filter(s => s.id!==stepId) })); }
  function applyPathway(){
    const ref = new Date(pathwayRefDate + 'T09:00:00');
    pathway.steps.forEach(st => {
      const t = templates().find(tt => tt.id === st.templateId);
      if(!t) return;
      const date = addDays(ref, st.offset);
      createSchedule({ templateId: st.templateId, date, targetType: target.type, targetId: target.id, rrule: "" });
    });
    logAudit("pathway", pathway.name, "apply", actor, { steps: pathway.steps.length, target });
    setPathwayOpen(false);
  }

  /*************** Subcomponents ***************/
  function TemplateCard({ t }){
    return (
      <div draggable onDragStart={(e)=>onDragStartTemplate(e,t.id)} onClick={()=>selectTemplate(t.id)} className={`rounded-xl border p-3 bg-white hover:shadow cursor-grab ${selectedTemplateId===t.id?"ring-2 ring-indigo-500":""}`}>
        <div className="flex items-center justify-between">
          <div className="font-medium">{t.title}</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{t.type}</span>
        </div>
        <div className="mt-1 text-xs text-gray-600">{t.language.toUpperCase()} · {t.literacy}</div>
        <div className="mt-2 text-xs"><span className="px-1.5 py-0.5 rounded bg-gray-50 border">{t.status}</span> <span className="ml-2 text-gray-500">v{t.version||1}</span></div>
      </div>
    );
  }

  function DayColumn({ date }){
    const daySchedules = schedules.filter(s => new Date(s.date).toDateString() === new Date(date).toDateString());
    return (
      <div className="flex-1 min-h-[240px] bg-white rounded-xl border" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropDay(e,date)}>
        <div className="px-3 py-2 border-b text-sm font-medium flex items-center justify-between">
          <div>{date.toLocaleDateString(undefined,{ weekday:"short", month:"short", day:"numeric"})}</div>
          <div className="text-xs text-gray-500">Drop template here</div>
        </div>
        <div className="p-2 flex flex-col gap-2">
          {daySchedules.map(s => {
            const t = templates().find(x=>x.id===s.templateId);
            return (
              <button key={s.id} onClick={()=>openDrawer(s)} className="text-left p-2 rounded-lg bg-indigo-50 border border-indigo-100 hover:bg-indigo-100">
                <div className="text-sm font-medium">{t?.title || s.templateId}</div>
                <div className="text-xs text-gray-600">Target: {s.targetType}:{s.targetId}</div>
                {s.rrule && <div className="text-xs text-indigo-700 mt-0.5">RRULE: {s.rrule}</div>}
              </button>
            )
          })}
        </div>
      </div>
    );
  }

  function PreviewPane(){
    if(!preview) return null;
    const t = preview.template;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={()=>setPreview(null)}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4" onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Patient Preview – {t.title}</div>
            <button className="text-sm px-3 py-1 rounded bg-gray-100" onClick={()=>setPreview(null)}>Close</button>
          </div>
          <div className="mt-3 text-sm text-gray-600">Language: {t.language.toUpperCase()} · Literacy: {t.literacy}</div>
          <div className="mt-3 space-y-3">
            {t.blocks.map((b, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50">
                {b.kind === "text" && <p className="text-base">{b.content}</p>}
                {b.kind === "quiz" && (
                  <div>
                    <div className="font-medium mb-2">Quiz</div>
                    {b.items?.map((q, qi) => (
                      <div key={qi} className="mb-2">
                        <div className="text-sm font-medium">{q.q}</div>
                        <ul className="list-disc ml-5 text-sm">
                          {q.options.map((opt, oi)=>(<li key={oi}>{opt}</li>))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function ScheduleDrawer(){
    if(!drawer) return null;
    const s = drawer.schedule;
    const tpl = templates().find(t => t.id===s.templateId);
    return (
      <div className="fixed inset-0 bg-black/40 flex items-end md:items-center md:justify-center" onClick={closeDrawer}>
        <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl p-4" onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-semibold">Edit Schedule</div>
            <button className="text-sm px-3 py-1 rounded bg-gray-100" onClick={closeDrawer}>Close</button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600">Template</div>
              <div className="text-sm font-medium">{tpl?.title}</div>
            </div>
            <div>
              <label className="text-xs text-gray-600">Date/Time</label>
              <input type="datetime-local" className="w-full px-3 py-2 rounded-xl border" value={new Date(s.date).toISOString().slice(0,16)} onChange={e=>setDrawer(d=>({...d, schedule:{...d.schedule, date: new Date(e.target.value).toISOString()}}))} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-600">Target Type</label>
                <select className="w-full px-3 py-2 rounded-xl border" value={s.targetType} onChange={e=>setDrawer(d=>({...d, schedule:{...d.schedule, targetType:e.target.value}}))}>
                  <option value="cohort">Cohort</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Target</label>
                <select className="w-full px-3 py-2 rounded-xl border" value={s.targetId} onChange={e=>setDrawer(d=>({...d, schedule:{...d.schedule, targetId:e.target.value}}))}>
                  {s.targetType==='cohort' ? (
                    cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  ) : (
                    patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                  )}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="weekly" type="checkbox" className="h-4 w-4" checked={!!s.rrule} onChange={e=>{
                const checked = e.target.checked;
                setDrawer(d=>({...d, schedule:{...d.schedule, rrule: checked?"FREQ=WEEKLY;COUNT=4":""}}));
              }} />
              <label htmlFor="weekly" className="text-sm">Repeat weekly (4 occurrences)</label>
            </div>
            {s.rrule && (
              <div className="text-xs text-indigo-700">RRULE: {s.rrule}</div>
            )}

            <div className="flex items-center justify-between mt-2">
              <button className="px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200" onClick={()=>deleteSchedule(s.id)}>Delete</button>
              <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={saveDrawer}>Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PathwayModal(){
    if(!pathwayOpen) return null;
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center" onClick={()=>setPathwayOpen(false)}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-4" onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Pathway Builder</div>
            <button className="text-sm px-3 py-1 rounded bg-gray-100" onClick={()=>setPathwayOpen(false)}>Close</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-600">Name</label>
              <input className="w-full px-3 py-2 rounded-xl border mb-2" value={pathway.name} onChange={e=>setPathway(p=>({...p, name:e.target.value}))} />

              <div className="text-xs text-gray-600 mb-1">Steps (Template + Offset days from reference date)</div>
              <div className="space-y-2">
                {pathway.steps.map(st => (
                  <div key={st.id} className="p-2 bg-gray-50 rounded-xl border">
                    <div className="grid grid-cols-8 gap-2 items-center">
                      <div className="col-span-6">
                        <select className="w-full px-2 py-2 rounded-xl border" value={st.templateId} onChange={e=>updatePathwayStep(st.id,{ templateId: e.target.value })}>
                          {templates().map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <span className="text-xs text-gray-600">Offset</span>
                        <input type="number" className="w-full px-2 py-1 rounded-xl border" value={st.offset} onChange={e=>updatePathwayStep(st.id,{ offset: parseInt(e.target.value||'0',10) })} />
                      </div>
                    </div>
                    <div className="mt-2 text-right">
                      <button className="text-xs px-2 py-1 rounded bg-red-50 border border-red-200 text-red-700" onClick={()=>removePathwayStep(st.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2"><button className="px-3 py-2 rounded-xl bg-white border" onClick={addPathwayStep}>Add Step</button></div>
            </div>

            <div className="md:col-span-1">
              <label className="text-xs text-gray-600">Reference Date (e.g., surgery date)</label>
              <input type="date" className="w-full px-3 py-2 rounded-xl border mb-2" value={pathwayRefDate} onChange={e=>setPathwayRefDate(e.target.value)} />

              <label className="text-xs text-gray-600">Apply To</label>
              <select className="w-full px-3 py-2 rounded-xl border mb-2" value={`${target.type}:${target.id}`} onChange={(e)=>{
                const [type,id] = e.target.value.split(":"); setTarget({ type, id });
              }}>
                <option value={`cohort:${cohorts[0].id}`}>Cohort: {cohorts[0].name}</option>
                {patients.map(p => <option key={p.id} value={`patient:${p.id}`}>Patient: {p.name}</option>)}
              </select>

              <button className="w-full px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={applyPathway}>Apply Pathway</button>
              <div className="text-xs text-gray-500 mt-2">Applying will create scheduled items relative to the reference date.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*************** Render ***************/
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">Clinician Dashboard</div>
            <div className="text-sm text-gray-600">Templates · Calendar · Analytics · <span className="font-semibold">Step 2 & 3</span></div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setPathwayOpen(true)}>Pathway Builder</button>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={simulateDeliveries}>Simulate Deliveries</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(addDays(weekAnchor,-7))}>Prev Week</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(startOfWeek(new Date()))}>This Week</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(addDays(weekAnchor,7))}>Next Week</button>
          </div>
        </div>

        {/* Analytics Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <Tile label="Sent" value={analytics.sent} />
          <Tile label="Opened" value={analytics.opened} />
          <Tile label="Completed" value={analytics.completed} />
          <Tile label="Avg Quiz Score" value={`${analytics.avgScore || 0}%`} />
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Template Library */}
          <div className="col-span-12 md:col-span-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Template Library</div>
              <span className="text-xs text-gray-500">Drag to calendar</span>
            </div>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by title/type…" className="w-full mb-2 px-3 py-2 rounded-xl border bg-white" />
            <div className="flex flex-col gap-2">
              {filteredTemplates.map(t => <TemplateCard key={t.id} t={t} />)}
            </div>
          </div>

          {/* Center: Calendar */}
          <div className="col-span-12 md:col-span-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Week of {weekAnchor.toLocaleDateString()}</div>
              <div className="text-xs text-gray-600 flex items-center gap-2">
                <label>Target</label>
                <select className="px-2 py-1 rounded border bg-white" value={`${target.type}:${target.id}`} onChange={(e)=>{
                  const [type,id] = e.target.value.split(":"); setTarget({ type, id });
                }}>
                  <option value={`cohort:${cohorts[0].id}`}>Cohort: {cohorts[0].name}</option>
                  {patients.map(p => <option key={p.id} value={`patient:${p.id}`}>Patient: {p.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d, i) => <DayColumn key={i} date={d} />)}
            </div>
          </div>

          {/* Right: Details Drawer / Editor */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-2xl border p-3">
              <div className="text-sm font-semibold mb-2">Details</div>
              {selectedTemplate ? (
                <div>
                  <div className="text-base font-medium">{selectedTemplate.title}</div>
                  <div className="text-xs text-gray-600 mb-2">{selectedTemplate.type} · {selectedTemplate.language.toUpperCase()} · {selectedTemplate.literacy}</div>
                  <Ribbon text={`Status: ${selectedTemplate.status} · v${selectedTemplate.version || 1}`} />
                  <div className="mt-3 space-y-2">
                    <label className="text-xs text-gray-600">Title</label>
                    <input className="w-full px-3 py-2 rounded-xl border" value={selectedTemplate.title} onChange={e=>updateTemplate({ title: e.target.value })} />
                    <label className="text-xs text-gray-600">First Text Block</label>
                    <textarea className="w-full px-3 py-2 rounded-xl border" value={(selectedTemplate.blocks[0]?.content)||""} onChange={e=>{
                      const blocks = [...selectedTemplate.blocks];
                      if(blocks[0]) blocks[0] = { ...blocks[0], content: e.target.value }; else blocks.push({kind:"text", content:e.target.value});
                      updateTemplate({ blocks });
                    }} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="px-3 py-1.5 rounded-xl bg-gray-100" onClick={()=>setPreview({ template: selectedTemplate })}>Preview</button>
                    <button className="px-3 py-1.5 rounded-xl bg-amber-100" onClick={submitForReview}>Submit for Review</button>
                    <button className="px-3 py-1.5 rounded-xl bg-emerald-100" onClick={approveTemplate}>Reviewer Approve</button>
                    <button className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white" onClick={publishTemplate}>Publish (ver++)</button>
                    <button className="px-3 py-1.5 rounded-xl bg-white border" onClick={rollbackTemplate}>Rollback</button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Select a template to view and edit details.</div>
              )}

              <div className="mt-4 border-t pt-3">
                <div className="text-xs font-semibold mb-1">Recent Audit</div>
                <div className="max-h-40 overflow-auto space-y-1">
                  {audit.slice(0,6).map(a => (
                    <div key={a.id} className="text-xs text-gray-600">
                      <span className="font-medium">{a.action}</span> → {a.entity} ({a.entityId}) · {fmtDateTime(a.ts)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewPane />
      <ScheduleDrawer />
      <PathwayModal />
    </div>
  );
}
