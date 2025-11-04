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

// Education/Literacy Level Options
const LITERACY_LEVELS = {
  basic: { label: "Basic Education", description: "Elementary level, requires simple and clear language", icon: "🔤" },
  elementary: { label: "Elementary Education", description: "Middle school level, can understand basic medical terms", icon: "📚" },
  standard: { label: "Standard Education", description: "High school/college level, standard medical communication", icon: "📖" },
  advanced: { label: "Higher Education", description: "Undergraduate and above, can accept detailed medical information", icon: "🎓" },
  professional: { label: "Professional Background", description: "Medical-related profession, can use professional terminology", icon: "👨‍⚕️" }
};

const seedTemplates = () => ([
  { id: "tmpl_fast_basic", type: "module", title: "Pre-op Fasting (Basic)", literacy: "basic", language: "en", blocks: [
      { kind: "text", content: "Do not eat anything 6 hours before surgery. You can drink a little water 2 hours before surgery." }
    ], status: "approved", version: 1 },
  { id: "tmpl_fast_std", type: "module", title: "Pre‑op Fasting (Standard)", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Stop eating 6 hours before surgery. You may drink clear water up to 2 hours prior." }
    ], status: "draft", version: 1 },
  { id: "tmpl_fast_advanced", type: "module", title: "Pre‑operative Fasting Protocol", literacy: "advanced", language: "en", blocks: [
      { kind: "text", content: "Implement NPO (nil per os) protocol 6 hours pre-operatively for solid foods. Clear fluids permitted until 2 hours before anesthesia induction to minimize aspiration risk." }
    ], status: "approved", version: 1 },
  { id: "tmpl_wound_basic", type: "module", title: "Wound Care (Simple)", literacy: "basic", language: "en", blocks: [
      { kind: "text", content: "Keep the wound dry for 2 days. If the wound becomes red, swollen, or you have fever, contact the doctor immediately." }
    ], status: "approved", version: 1 },
  { id: "tmpl_wound", type: "module", title: "Post‑op Wound Care", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Keep dressing dry for 48 hours. Watch for signs of infection: redness, swelling, fever." }
    ], status: "approved", version: 1 },
  { id: "tmpl_wound_professional", type: "module", title: "Post-operative Wound Management", literacy: "professional", language: "en", blocks: [
      { kind: "text", content: "Maintain sterile dressing integrity for 48h post-op. Monitor for erythema, edema, pyrexia indicating potential surgical site infection (SSI). Report any signs consistent with cellulitis or abscess formation." }
    ], status: "approved", version: 1 },
  { id: "tmpl_pain_elementary", type: "module", title: "Pain Medication Guide", literacy: "elementary", language: "en", blocks: [
      { kind: "text", content: "Take pain medication every 6-8 hours as prescribed by the doctor. Do not exceed the prescribed daily amount." }
    ], status: "approved", version: 1 },
  { id: "tmpl_pain", type: "module", title: "Pain Medication Schedule", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Take paracetamol every 6–8 hours as prescribed. Avoid exceeding daily dose limits." }
    ], status: "approved", version: 1 },
  { id: "tmpl_consent", type: "consent", title: "Pre‑op Consent (General)", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Please review and acknowledge the informed consent documentation prior to surgery." }
    ], status: "draft", version: 1 },
  { id: "tmpl_appt", type: "reminder", title: "Appointment Reminder", literacy: "standard", language: "en", blocks: [
      { kind: "text", content: "Your appointment is scheduled. Please arrive 10 minutes early for check-in." }
    ], status: "approved", version: 1 },
  { id: "tmpl_mob_basic", type: "module", title: "Activity Guide (Simple)", literacy: "basic", language: "en", blocks: [
      { kind: "text", content: "Walk slowly at home. Walk a little bit more each day than the previous day." }
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
  console.log('ClinicianDashboard initializing...');
  
  // Safe initialization
  const [templates, setTemplates] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [weekAnchor, setWeekAnchor] = useState(() => startOfWeek(new Date()));
  const [schedules, setSchedules] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [audit, setAudit] = useState([]);
  const [target, setTarget] = useState({ type: "cohort", id: cohorts[0]?.id || "cohort_ortho_preop" });
  const [actor] = useState("Michael");
  const [preview, setPreview] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [pathwayOpen, setPathwayOpen] = useState(false);
  const [emailNotificationOpen, setEmailNotificationOpen] = useState(false);
  const [pathway, setPathway] = useState({ name: "Ortho Pre‑Op (mini)", steps: [] });
  const [notifications, setNotifications] = useState([]);
  const [pathwayRefDate, setPathwayRefDate] = useState(() => new Date().toISOString().slice(0,10));

  // Initialize data
  useEffect(() => {
    try {
      console.log('Setting up initial data...');
      const initialTemplates = seedTemplates();
      setTemplates(initialTemplates);
      
      // Set initial pathway steps
      setPathway(prev => ({
        ...prev,
        steps: [
          { id: id(), templateId: "tmpl_fast_easy", offset: -7 },
          { id: id(), templateId: "tmpl_consent", offset: -2 },
          { id: id(), templateId: "tmpl_wound", offset: 3 },
        ]
      }));
      
      console.log('Initial data setup complete');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, []);

  useEffect(() => { 
    if (templates.length > 0) {
      logAudit("system", "dashboard", "init", actor, { note: "seed" }); 
    }
  }, [templates, actor]);

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekAnchor, i)), [weekAnchor]);
  const filteredTemplates = useMemo(() => templates.filter(t => (t.title.toLowerCase().includes(query.toLowerCase()) || t.type.includes(query.toLowerCase()))), [templates, query]);

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
    
    // Create delivery events
    const events = withinWeek.flatMap(s => {
      const sent = { id: id(), scheduleId: s.id, status: "sent", ts: new Date(s.date).toISOString() };
      const opened = { id: id(), scheduleId: s.id, status: "opened", ts: new Date(s.date).toISOString() };
      const completed = { id: id(), scheduleId: s.id, status: "completed", ts: new Date(s.date).toISOString(), score: Math.round(70 + Math.random()*30) };
      return [sent, opened, completed];
    });
    
    setDeliveries(prev => [...events, ...prev]);
    logAudit("delivery", "batch", "simulate", actor, { count: events.length });
    
    // Show success message with delivery details
    const scheduleDetails = withinWeek.map(s => {
      const template = templates.find(t => t.id === s.templateId);
      const targetName = s.targetType === 'patient' ? 
        patients.find(p => p.id === s.targetId)?.name || 'Unknown Patient' :
        cohorts.find(c => c.id === s.targetId)?.name || 'Unknown Cohort';
      
      return `📋 ${template?.title || 'Unknown Template'} → ${targetName}`;
    });
    
    setTimeout(() => {
      alert(`🚀 Template delivery completed!\n\nSuccessfully sent ${withinWeek.length} templates:\n\n${scheduleDetails.join('\n')}\n\n💡 Patients can view received messages in "Patient View"`);
    }, 500);
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
  const selectedTemplate = useMemo(() => templates.find(t => t.id === selectedTemplateId) || null, [templates, selectedTemplateId]);

  function updateTemplate(partial){ setTemplates(prev => prev.map(t => t.id === selectedTemplateId ? { ...t, ...partial } : t)); logAudit("template", selectedTemplateId, "update", actor, partial); }
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
  function addPathwayStep(){ 
    setPathway(p => ({ 
      ...p, 
      steps: [...p.steps, { 
        id: id(), 
        name: `Step ${p.steps.length + 1}`, 
        templateId: templates[0]?.id || '', 
        offset: p.steps.length, 
        condition: null,
        timing: ''
      }] 
    })); 
  }
  function updatePathwayStep(stepId, changes){ setPathway(p => ({ ...p, steps: p.steps.map(s => s.id===stepId?{...s, ...changes}:s) })); }
  function removePathwayStep(stepId){ setPathway(p => ({ ...p, steps: p.steps.filter(s => s.id!==stepId) })); }

  /*************** Email Notifications ***************/
  function sendEmailNotification(type, recipients, templateId, message) {
    const notification = {
      id: id(),
      type: type, // 'reminder', 'update', 'alert', 'custom'
      recipients: recipients, // array of patient IDs or email addresses
      templateId: templateId,
      message: message,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };
    setNotifications(prev => [notification, ...prev]);
    logAudit("notification", notification.id, "send", actor, { type, recipients: recipients.length, templateId });
    
    // Simulate successful send feedback
    setTimeout(() => {
      alert(`✅ Email notification sent successfully!\n\nType: ${type}\nRecipients: ${recipients.length}\nMessage: ${message.substring(0, 50)}...`);
    }, 500);
  }
  function applyPathway(){
    const ref = new Date(pathwayRefDate + 'T09:00:00');
    pathway.steps.forEach(st => {
      const t = templates.find(tt => tt.id === st.templateId);
      if(!t) return;
      const date = addDays(ref, st.offset);
      createSchedule({ templateId: st.templateId, date, targetType: target.type, targetId: target.id, rrule: "" });
    });
    logAudit("pathway", pathway.name, "apply", actor, { steps: pathway.steps.length, target });
    setPathwayOpen(false);
  }

  /*************** Subcomponents ***************/
  function TemplateCard({ t }){
    const sendImmediately = (e) => {
      e.stopPropagation();
      const targetName = target.type === 'patient' ? 
        patients.find(p => p.id === target.id)?.name || 'Unknown Patient' :
        cohorts.find(c => c.id === target.id)?.name || 'Unknown Cohort';
      
      // Create immediate schedule for today
      const today = new Date();
      createSchedule({ 
        templateId: t.id, 
        date: today, 
        targetType: target.type, 
        targetId: target.id, 
        rrule: "" 
      });
      
      // Simulate immediate delivery
      const immediateEvent = { 
        id: id(), 
        scheduleId: 'immediate', 
        status: "sent", 
        ts: today.toISOString() 
      };
      setDeliveries(prev => [immediateEvent, ...prev]);
      
      alert(`📨 Template sent immediately!\n\n📋 ${t.title}\n👤 Sent to: ${targetName}\n🕐 Send time: ${today.toLocaleString()}\n\n💡 Patients can view received messages in "Patient View"`);
    };

    return (
      <div draggable onDragStart={(e)=>onDragStartTemplate(e,t.id)} onClick={()=>selectTemplate(t.id)} className={`rounded-xl border p-3 bg-white hover:shadow cursor-grab ${selectedTemplateId===t.id?"ring-2 ring-indigo-500":""}`}>
        <div className="flex items-center justify-between">
          <div className="font-medium">{t.title}</div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{t.type}</span>
        </div>
        <div className="mt-1 text-xs text-gray-600">{LITERACY_LEVELS[t.literacy]?.icon || '📖'} {t.language.toUpperCase()} · {t.literacy}</div>
        <div className="mt-2 text-xs flex items-center justify-between">
          <div>
            <span className="px-1.5 py-0.5 rounded bg-gray-50 border">{t.status}</span> 
            <span className="ml-2 text-gray-500">v{t.version||1}</span>
          </div>
          <button
            onClick={sendImmediately}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
            title="Send immediately to current selected target"
          >
            📤 Send Now
          </button>
        </div>
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
            const t = templates.find(x=>x.id===s.templateId);
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
    const tpl = templates.find(t => t.id===s.templateId);
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

  function EmailNotificationModal(){
    const [notificationType, setNotificationType] = useState('reminder');
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [customMessage, setCustomMessage] = useState('');
    const [emailSubject, setEmailSubject] = useState('');

    if(!emailNotificationOpen) return null;

    const handleSendNotification = () => {
      if (!selectedRecipients.length) {
        alert('Please select at least one recipient');
        return;
      }
      if (!customMessage.trim()) {
        alert('Please enter a message');
        return;
      }

      sendEmailNotification(notificationType, selectedRecipients, selectedTemplate, customMessage);
      setEmailNotificationOpen(false);
      // Reset form
      setSelectedRecipients([]);
      setCustomMessage('');
      setEmailSubject('');
      setSelectedTemplate('');
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={()=>setEmailNotificationOpen(false)}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold">📧 Email Notifications</h3>
              <p className="text-sm text-gray-600">Send notifications to patients or staff</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600" onClick={()=>setEmailNotificationOpen(false)}>✕</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Notification Setup */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select 
                  value={notificationType} 
                  onChange={(e) => setNotificationType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-green-500"
                >
                  <option value="reminder">📅 Appointment Reminder</option>
                  <option value="update">📋 Treatment Update</option>
                  <option value="alert">🚨 Important Alert</option>
                  <option value="followup">🔄 Follow-up Request</option>
                  <option value="custom">✉️ Custom Message</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="border rounded-xl p-3 max-h-32 overflow-y-auto">
                  {patients.map(patient => (
                    <label key={patient.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(patient.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRecipients(prev => [...prev, patient.id]);
                          } else {
                            setSelectedRecipients(prev => prev.filter(id => id !== patient.id));
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm">{patient.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => setSelectedRecipients(patients.map(p => p.id))}
                    className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded"
                  >
                    Select All
                  </button>
                  <button 
                    onClick={() => setSelectedRecipients([])}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Related Template (Optional)</label>
                <select 
                  value={selectedTemplate} 
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a template...</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column - Message Composition */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  rows="8"
                  className="w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Templates:</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setCustomMessage("Your appointment is scheduled for tomorrow at [TIME]. Please arrive 15 minutes early.")}
                    className="block w-full text-left text-xs px-2 py-1 bg-white rounded hover:bg-blue-100"
                  >
                    Appointment Reminder
                  </button>
                  <button
                    onClick={() => setCustomMessage("Please remember to follow your post-operative care instructions. Contact us if you have any concerns.")}
                    className="block w-full text-left text-xs px-2 py-1 bg-white rounded hover:bg-blue-100"
                  >
                    Post-Op Care Reminder
                  </button>
                  <button
                    onClick={() => setCustomMessage("Your test results are ready for review. Please schedule a follow-up appointment.")}
                    className="block w-full text-left text-xs px-2 py-1 bg-white rounded hover:bg-blue-100"
                  >
                    Test Results Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Recipients selected: <span className="font-medium">{selectedRecipients.length}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setEmailNotificationOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendNotification}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                📧 Send Notification
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PathwayModal(){
    const [activeTab, setActiveTab] = useState('builder'); // builder, preview, library
    const [pathwayLibrary, setPathwayLibrary] = useState([
      {
        id: 'pw_ortho_knee',
        name: 'Knee Replacement Standard Pathway',
        category: 'orthopedic',
        description: 'Standard treatment pathway for total knee replacement surgery, including pre-operative preparation, post-operative rehabilitation and complete process',
        duration: '6 weeks',
        steps: [
          { id: 's1', name: 'Pre-op Fasting Guidance', templateId: 'tmpl_fast_std', offset: -1, condition: null, timing: '1 day before surgery' },
          { id: 's2', name: 'Surgery Day Preparation', templateId: 'tmpl_consent', offset: 0, condition: null, timing: 'Day of surgery' },
          { id: 's3', name: 'Post-op Wound Care', templateId: 'tmpl_wound', offset: 1, condition: null, timing: 'Post-op day 1' },
          { id: 's4', name: 'Pain Management', templateId: 'tmpl_pain', offset: 1, condition: null, timing: 'Starting post-op day 1' },
          { id: 's5', name: 'Early Mobility Guidance', templateId: 'tmpl_mob_basic', offset: 2, condition: { type: 'patient_status', value: 'stable' }, timing: 'Post-op day 2' },
          { id: 's6', name: '1-week Follow-up Reminder', templateId: 'tmpl_appt', offset: 7, condition: null, timing: '1 week post-op' }
        ]
      },
      {
        id: 'pw_general_surgery',
        name: 'General Surgery Pathway',
        category: 'surgery',
        description: 'Standard care process applicable to most elective surgeries',
        duration: '2 weeks',
        steps: [
          { id: 'g1', name: 'Pre-op Education', templateId: 'tmpl_fast_std', offset: -3, condition: null, timing: '3 days before surgery' },
          { id: 'g2', name: 'Pre-op Fasting', templateId: 'tmpl_fast_basic', offset: -1, condition: null, timing: '1 day before surgery' },
          { id: 'g3', name: 'Post-op Care', templateId: 'tmpl_wound_basic', offset: 1, condition: null, timing: 'Post-op day 1' },
          { id: 'g4', name: 'Discharge Instructions', templateId: 'tmpl_appt', offset: 3, condition: { type: 'recovery_status', value: 'good' }, timing: 'Post-op day 3' }
        ]
      }
    ]);

    if(!pathwayOpen) return null;

    const handleLoadPathway = (libraryPathway) => {
      setPathway({
        name: libraryPathway.name,
        steps: libraryPathway.steps.map(step => ({...step, id: id()}))
      });
      setActiveTab('builder');
    };

    const savePathwayToLibrary = () => {
      const newPathway = {
        id: id(),
        name: pathway.name || 'New Treatment Pathway',
        category: 'custom',
        description: 'User-defined treatment pathway',
        duration: `${Math.max(...pathway.steps.map(s => s.offset)) + 1} days`,
        steps: pathway.steps
      };
      setPathwayLibrary(prev => [newPathway, ...prev]);
      alert('Treatment pathway saved to pathway library!');
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setPathwayOpen(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden" onClick={(e)=>e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">🏥 Smart Treatment Pathway Builder</h2>
              <p className="text-sm text-gray-600 mt-1">Build standardized, personalized patient treatment processes</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 text-2xl" onClick={()=>setPathwayOpen(false)}>×</button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b bg-gray-50">
            <div className="flex">
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'builder' ? 'border-b-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('builder')}
              >
                🔧 Pathway Builder
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'preview' ? 'border-b-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('preview')}
              >
                👁️ Preview Timeline
              </button>
              <button 
                className={`px-6 py-3 font-medium text-sm ${activeTab === 'library' ? 'border-b-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('library')}
              >
                📚 Pathway Template Library
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Builder Tab */}
            {activeTab === 'builder' && (
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: Pathway Configuration */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pathway Name *</label>
                      <input 
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500" 
                        value={pathway.name} 
                        onChange={e=>setPathway(p=>({...p, name:e.target.value}))}
                        placeholder="e.g., Knee Replacement Standard Pathway"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Treatment Steps</h3>
                        <button 
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                          onClick={addPathwayStep}
                        >
                          + Add Step
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {pathway.steps.map((step, index) => (
                          <div key={step.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-indigo-400">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <input 
                                    className="font-medium text-gray-900 bg-transparent border-none outline-none"
                                    placeholder="Step Name"
                                    value={step.name || ''}
                                    onChange={e=>updatePathwayStep(step.id, { name: e.target.value })}
                                  />
                                  <div className="text-xs text-gray-500">
                                    {step.offset === 0 ? 'Execute on same day' : 
                                     step.offset > 0 ? `${step.offset} days after baseline date` : 
                                     `${Math.abs(step.offset)} days before baseline date`}
                                  </div>
                                </div>
                              </div>
                              <button 
                                className="text-red-500 hover:text-red-700 p-1"
                                onClick={()=>removePathwayStep(step.id)}
                              >
                                🗑️
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Associated Template</label>
                                <select 
                                  className="w-full px-3 py-2 rounded-lg border text-sm" 
                                  value={step.templateId || ''} 
                                  onChange={e=>updatePathwayStep(step.id,{ templateId: e.target.value })}
                                >
                                  <option value="">Select template...</option>
                                  {templates.map(t => (
                                    <option key={t.id} value={t.id}>
                                      {LITERACY_LEVELS[t.literacy]?.icon} {t.title} ({t.literacy})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Time Offset (days)</label>
                                <input 
                                  type="number" 
                                  className="w-full px-3 py-2 rounded-lg border text-sm" 
                                  value={step.offset || 0} 
                                  onChange={e=>updatePathwayStep(step.id,{ offset: parseInt(e.target.value||'0',10) })}
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Execution Condition</label>
                                <select 
                                  className="w-full px-3 py-2 rounded-lg border text-sm"
                                  value={step.condition?.type || 'none'}
                                  onChange={e => {
                                    const conditionType = e.target.value;
                                    if (conditionType === 'none') {
                                      updatePathwayStep(step.id, { condition: null });
                                    } else {
                                      updatePathwayStep(step.id, { condition: { type: conditionType, value: 'stable' } });
                                    }
                                  }}
                                >
                                  <option value="none">No condition</option>
                                  <option value="patient_status">Patient status</option>
                                  <option value="recovery_status">Recovery status</option>
                                  <option value="lab_result">Lab result</option>
                                </select>
                              </div>
                            </div>

                            {step.condition && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                                <div className="text-xs text-yellow-800">
                                  ⚠️ Conditional execution: Execute when {step.condition.type === 'patient_status' ? 'patient status' : 
                                                 step.condition.type === 'recovery_status' ? 'recovery status' : 'lab result'} 
                                  is "{step.condition.value}"
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Settings & Actions */}
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Pathway Configuration</h4>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Baseline Date (e.g., Surgery Date)</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 rounded-lg border text-sm" 
                            value={pathwayRefDate} 
                            onChange={e=>setPathwayRefDate(e.target.value)} 
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Application Target</label>
                          <select 
                            className="w-full px-3 py-2 rounded-lg border text-sm" 
                            value={`${target.type}:${target.id}`} 
                            onChange={(e)=>{
                              const [type,id] = e.target.value.split(":"); 
                              setTarget({ type, id });
                            }}
                          >
                            <option value={`cohort:${cohorts[0].id}`}>Patient cohort: {cohorts[0].name}</option>
                            {patients.map(p => (
                              <option key={p.id} value={`patient:${p.id}`}>Individual patient: {p.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Pathway Statistics</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total steps:</span>
                          <span className="font-medium">{pathway.steps.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pathway span:</span>
                          <span className="font-medium">
                            {pathway.steps.length > 0 ? 
                              `${Math.min(...pathway.steps.map(s => s.offset))} ~ ${Math.max(...pathway.steps.map(s => s.offset))} days` : 
                              '0 days'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conditional steps:</span>
                          <span className="font-medium">{pathway.steps.filter(s => s.condition).length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                        onClick={applyPathway}
                      >
                        🚀 Apply Treatment Pathway
                      </button>
                      <button 
                        className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        onClick={savePathwayToLibrary}
                      >
                        💾 Save to Pathway Library
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && (
              <div className="p-6">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-xl font-semibold mb-6">📅 Treatment Pathway Timeline Preview</h3>
                  
                  {pathwayRefDate ? (
                    <div className="space-y-4">
                      {pathway.steps
                        .sort((a, b) => a.offset - b.offset)
                        .map((step, index) => {
                          const stepDate = new Date(pathwayRefDate);
                          stepDate.setDate(stepDate.getDate() + step.offset);
                          const template = templates.find(t => t.id === step.templateId);
                          
                          return (
                            <div key={step.id} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                                {index < pathway.steps.length - 1 && (
                                  <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>
                                )}
                              </div>
                              
                              <div className="flex-1 bg-white rounded-lg border p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{step.name || 'Unnamed Step'}</h4>
                                    <div className="text-sm text-gray-600">
                                      📅 {stepDate.toLocaleDateString()} 
                                      {step.offset === 0 && ' (Baseline Date)'}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium text-indigo-600">
                                      Day {step.offset >= 0 ? '+' : ''}{step.offset}
                                    </div>
                                  </div>
                                </div>
                                
                                {template && (
                                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span>{LITERACY_LEVELS[template.literacy]?.icon}</span>
                                      <span className="font-medium text-sm">{template.title}</span>
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {template.literacy}
                                      </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {template.blocks?.[0]?.content || 'Template content preview...'}
                                    </div>
                                  </div>
                                )}
                                
                                {step.condition && (
                                  <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                    ⚠️ Conditional execution: {step.condition.type} = {step.condition.value}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">📅</div>
                      <p>Please set the baseline date in the builder first to view timeline preview</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Library Tab */}
            {activeTab === 'library' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">📚 Treatment Pathway Template Library</h3>
                  <p className="text-gray-600">Select predefined treatment pathway templates or manage custom pathways</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pathwayLibrary.map(libPathway => (
                    <div key={libPathway.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{libPathway.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {libPathway.category}
                            </span>
                            <span className="text-xs text-gray-500">⏱️ {libPathway.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">{libPathway.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-medium text-gray-700">Includes Steps ({libPathway.steps.length}):</div>
                        <div className="space-y-1">
                          {libPathway.steps.slice(0, 3).map(step => (
                            <div key={step.id} className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                                {step.offset >= 0 ? '+' : ''}{step.offset}
                              </div>
                              <span>{step.name}</span>
                            </div>
                          ))}
                          {libPathway.steps.length > 3 && (
                            <div className="text-xs text-gray-500 ml-6">
                              ... and {libPathway.steps.length - 3} more steps
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                        onClick={() => handleLoadPathway(libPathway)}
                      >
                        📥 Load This Pathway
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <button className="px-3 py-2 rounded-xl bg-green-600 text-white" onClick={() => setEmailNotificationOpen(true)}>📧 Email Notifications</button>
            <button className="px-3 py-2 rounded-xl bg-indigo-600 text-white" onClick={simulateDeliveries}>Simulate Deliveries</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(addDays(weekAnchor,-7))}>Prev Week</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(startOfWeek(new Date()))}>This Week</button>
            <button className="px-3 py-2 rounded-xl bg-white border" onClick={()=>setWeekAnchor(addDays(weekAnchor,7))}>Next Week</button>
          </div>
        </div>

        {/* Patient Delivery Status Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Patient Template Delivery Verification</h3>
              <p className="text-sm text-blue-700 mb-2">
                Use the following methods to send templates to patients, then verify delivery in "Patient View":
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">📤 Send Immediately</div>
                  <div className="text-blue-600">Click "Send Now" button on template cards</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">📅 Scheduled Send</div>
                  <div className="text-blue-600">Drag templates to calendar, then click "Simulate Deliveries"</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="font-medium text-blue-900 mb-1">🔄 Care Pathway</div>
                  <div className="text-blue-600">Use Pathway Builder to create complete treatment flows</div>
                </div>
              </div>
            </div>
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
      <EmailNotificationModal />
    </div>
  );
}
