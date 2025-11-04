import React, { useState } from 'react';
import ClinicianDashboard from "./ClinicianDashboard.jsx";

// Navigation Component
function Navigation({ currentView, onViewChange }) {
  const views = [
    { id: 'dashboard', name: '📊 Dashboard', description: 'Templates + Calendar + Pathways' },
    { id: 'patients', name: '👥 Patients', description: 'Patient Collection & Management' },
    { id: 'templates', name: '📋 Templates', description: 'Template Library & Editor' },
    { id: 'analytics', name: '📈 Analytics', description: 'Reports & Data Analysis' },
    { id: 'patient-portal', name: '📱 Patient View', description: 'Patient Received Messages Portal' }
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Clinician Platform</h1>
            <p className="text-sm text-gray-600">Medical Template & Patient Management System</p>
          </div>
          <nav className="flex space-x-1">
            {views.map(view => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === view.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={view.description}
              >
                {view.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

// Patient Collection Interface
function PatientsView() {
  const [patients, setPatients] = useState([
    { 
      id: 'p1', 
      name: 'Alice Jones', 
      age: 45, 
      condition: 'Orthopedic Surgery', 
      status: 'active', 
      lastVisit: '2025-11-01',
      educationLevel: 'standard',
      phone: '+1 (555) 123-4567',
      email: 'alice.jones@email.com',
      emergencyContact: 'John Jones - +1 (555) 123-4568',
      treatment: {
        pathway: 'Knee Replacement Standard Pathway',
        progress: 75,
        currentStep: 'Post-operative Rehabilitation Phase',
        nextAppointment: '2025-11-08',
        compliance: 'excellent'
      },
      vitals: {
        bloodPressure: '120/80',
        heartRate: '72 bpm',
        temperature: '98.6°F',
        lastUpdated: '2025-11-03'
      },
      communications: [
        { id: 'c1', date: '2025-11-03', type: 'email', content: 'Post-operative rehabilitation guidance sent', status: 'delivered' },
        { id: 'c2', date: '2025-11-02', type: 'sms', content: 'Tomorrow follow-up reminder', status: 'read' },
        { id: 'c3', date: '2025-11-01', type: 'call', content: 'Post-operative follow-up call', status: 'completed' }
      ],
      feedback: [
        { id: 'f1', date: '2025-11-02', rating: 5, comment: 'Recovery is progressing well, guidance is very helpful' },
        { id: 'f2', date: '2025-10-30', rating: 4, comment: 'Pain management is quite effective' }
      ]
    },
    { 
      id: 'p2', 
      name: 'Ben Smith', 
      age: 62, 
      condition: 'Cardiac Procedure', 
      status: 'active', 
      lastVisit: '2025-10-28',
      educationLevel: 'basic',
      phone: '+1 (555) 234-5678',
      email: 'ben.smith@email.com',
      emergencyContact: 'Mary Smith - +1 (555) 234-5679',
      treatment: {
        pathway: 'Cardiac Surgery Standard Pathway',
        progress: 60,
        currentStep: 'Post-operative Monitoring',
        nextAppointment: '2025-11-10',
        compliance: 'good'
      },
      vitals: {
        bloodPressure: '130/85',
        heartRate: '68 bpm',
        temperature: '98.4°F',
        lastUpdated: '2025-11-03'
      },
      communications: [
        { id: 'c4', date: '2025-11-03', type: 'sms', content: 'Medication reminder', status: 'delivered' },
        { id: 'c5', date: '2025-11-01', type: 'email', content: 'Cardiac rehabilitation guidance', status: 'read' }
      ],
      feedback: [
        { id: 'f3', date: '2025-11-01', rating: 4, comment: 'Recovery is smooth, thanks to the medical team' }
      ]
    },
    { 
      id: 'p3', 
      name: 'Chen Li', 
      age: 38, 
      condition: 'General Surgery', 
      status: 'discharged', 
      lastVisit: '2025-10-25',
      educationLevel: 'advanced',
      phone: '+1 (555) 345-6789',
      email: 'chen.li@email.com',
      emergencyContact: 'Wei Li - +1 (555) 345-6790',
      treatment: {
        pathway: 'General Surgery Pathway',
        progress: 100,
        currentStep: 'Treatment completed',
        nextAppointment: '2025-12-01',
        compliance: 'excellent'
      },
      vitals: {
        bloodPressure: '115/75',
        heartRate: '65 bpm',
        temperature: '98.2°F',
        lastUpdated: '2025-10-25'
      },
      communications: [
        { id: 'c6', date: '2025-10-26', type: 'email', content: 'Discharge instructions', status: 'read' }
      ],
      feedback: [
        { id: 'f4', date: '2025-10-25', rating: 5, comment: 'The entire treatment process was very professional, very satisfied' }
      ]
    },
    { 
      id: 'p4', 
      name: 'Diana Ross', 
      age: 55, 
      condition: 'Joint Replacement', 
      status: 'active', 
      lastVisit: '2025-11-02',
      educationLevel: 'standard',
      phone: '+1 (555) 456-7890',
      email: 'diana.ross@email.com',
      emergencyContact: 'Robert Ross - +1 (555) 456-7891',
      treatment: {
        pathway: 'Joint Replacement Rehabilitation Pathway',
        progress: 45,
        currentStep: 'Early Rehabilitation Training',
        nextAppointment: '2025-11-06',
        compliance: 'fair'
      },
      vitals: {
        bloodPressure: '125/82',
        heartRate: '75 bpm',
        temperature: '99.1°F',
        lastUpdated: '2025-11-02'
      },
      communications: [
        { id: 'c7', date: '2025-11-03', type: 'sms', content: 'Rehabilitation training reminder', status: 'delivered' },
        { id: 'c8', date: '2025-11-02', type: 'call', content: 'Pain assessment call', status: 'completed' }
      ],
      feedback: [
        { id: 'f5', date: '2025-11-02', rating: 3, comment: 'Pain is still quite noticeable, hope to get more guidance' }
      ]
    },
    { 
      id: 'p5', 
      name: 'Erik Johnson', 
      age: 29, 
      condition: 'Sports Medicine', 
      status: 'scheduled', 
      lastVisit: '2025-10-30',
      educationLevel: 'advanced',
      phone: '+1 (555) 567-8901',
      email: 'erik.johnson@email.com',
      emergencyContact: 'Lisa Johnson - +1 (555) 567-8902',
      treatment: {
        pathway: 'Exercise Rehabilitation Pathway',
        progress: 20,
        currentStep: 'Pre-operative Preparation',
        nextAppointment: '2025-11-05',
        compliance: 'excellent'
      },
      vitals: {
        bloodPressure: '110/70',
        heartRate: '60 bpm',
        temperature: '98.0°F',
        lastUpdated: '2025-10-30'
      },
      communications: [
        { id: 'c9', date: '2025-11-03', type: 'email', content: 'Pre-operative preparation guidance', status: 'read' }
      ],
      feedback: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({ rating: 5, comment: '' });

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Collection</h2>
        <p className="text-gray-600">Manage and monitor patient information and treatment progress</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="discharged">Discharged</option>
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            + Add Patient
          </button>
        </div>
      </div>

      {/* Patient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <div key={patient.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-lg">{patient.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  {patient.treatment.compliance === 'excellent' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">Age: {patient.age} | 📚 {patient.educationLevel}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                {patient.status === 'active' ? 'Active' : 
                 patient.status === 'scheduled' ? 'Scheduled' : 
                 patient.status === 'discharged' ? 'Discharged' : patient.status}
              </span>
            </div>
            
            {/* Treatment Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Treatment Progress</span>
                <span className="text-xs text-gray-600">{patient.treatment.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    patient.treatment.progress >= 80 ? 'bg-green-500' :
                    patient.treatment.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${patient.treatment.progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1">{patient.treatment.currentStep}</div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Care Pathway:</span>
                <span className="text-sm font-medium">{patient.treatment.pathway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Next Appointment:</span>
                <span className="text-sm">{patient.treatment.nextAppointment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Compliance:</span>
                <span className={`text-sm font-medium ${
                  patient.treatment.compliance === 'excellent' ? 'text-green-600' :
                  patient.treatment.compliance === 'good' ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {patient.treatment.compliance === 'excellent' ? '🟢 Excellent' :
                   patient.treatment.compliance === 'good' ? '🔵 Good' : '🟡 Fair'}
                </span>
              </div>
            </div>

            {/* Communication Status */}
            <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-600">Recent Communication:</div>
              {patient.communications.slice(0, 3).map(comm => (
                <div key={comm.id} className="flex items-center gap-1">
                  <span className="text-lg">
                    {comm.type === 'email' ? '📧' : comm.type === 'sms' ? '💬' : '📞'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${
                    comm.status === 'read' ? 'bg-green-500' :
                    comm.status === 'delivered' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                </div>
              ))}
            </div>

            {/* Patient Feedback Summary */}
            {patient.feedback.length > 0 && (
              <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-900">Patient Feedback:</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={`text-sm ${
                        star <= (patient.feedback[patient.feedback.length - 1]?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'
                      }`}>⭐</span>
                    ))}
                  </div>
                  <span className="text-xs text-blue-600">({patient.feedback.length} items)</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowPatientModal(true);
                  setActiveTab('overview');
                }}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
              >
                👁️ Details
              </button>
              <button 
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowFeedbackModal(true);
                }}
                className="px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
              >
                💬
              </button>
              <button className="flex-1 px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 flex items-center justify-center gap-1">
                📅 Schedule
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">{patients.filter(p => p.status === 'active').length}</div>
          <div className="text-sm text-gray-600">Active Patients</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">{patients.filter(p => p.status === 'scheduled').length}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-gray-600">{patients.filter(p => p.status === 'discharged').length}</div>
          <div className="text-sm text-gray-600">Discharged</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-2xl font-bold text-indigo-600">{patients.length}</div>
          <div className="text-sm text-gray-600">Total Patients</div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-2xl">{selectedPatient.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-gray-600">{selectedPatient.age} years old | {selectedPatient.condition}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPatientModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b bg-gray-50">
              <div className="flex">
                {[
                  { id: 'overview', label: '📊 Overview', icon: '📊' },
                  { id: 'treatment', label: '🏥 Treatment Progress', icon: '🏥' },
                  { id: 'communications', label: '💬 Communication Records', icon: '💬' },
                  { id: 'feedback', label: '⭐ Patient Feedback', icon: '⭐' },
                  { id: 'vitals', label: '💓 Vital Signs', icon: '💓' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    className={`px-6 py-3 font-medium text-sm ${activeTab === tab.id ? 'border-b-2 border-indigo-500 text-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-3">Basic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{selectedPatient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">{selectedPatient.age} years old</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Education Level:</span>
                          <span className="font-medium">{selectedPatient.educationLevel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{selectedPatient.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{selectedPatient.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Emergency Contact:</span>
                          <span className="font-medium">{selectedPatient.emergencyContact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-3">Treatment Status</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                            {selectedPatient.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Treatment Pathway:</span>
                          <span className="font-medium">{selectedPatient.treatment.pathway}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Treatment Progress:</span>
                          <span className="font-medium">{selectedPatient.treatment.progress}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current Stage:</span>
                          <span className="font-medium">{selectedPatient.treatment.currentStep}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Appointment:</span>
                          <span className="font-medium">{selectedPatient.treatment.nextAppointment}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-semibold text-purple-900 mb-3">Latest Vital Signs</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{selectedPatient.vitals.bloodPressure}</div>
                          <div className="text-xs text-gray-600">Blood Pressure</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{selectedPatient.vitals.heartRate}</div>
                          <div className="text-xs text-gray-600">Heart Rate</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">{selectedPatient.vitals.temperature}</div>
                          <div className="text-xs text-gray-600">Temperature</div>
                        </div>
                        <div className="text-center p-3 bg-white rounded-lg">
                          <div className="text-xs font-medium text-gray-600">Last Updated</div>
                          <div className="text-xs text-gray-500">{selectedPatient.vitals.lastUpdated}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-900 mb-3">Compliance Assessment</h3>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                          selectedPatient.treatment.compliance === 'excellent' ? 'bg-green-100 text-green-600' :
                          selectedPatient.treatment.compliance === 'good' ? 'bg-blue-100 text-blue-600' : 
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {selectedPatient.treatment.compliance === 'excellent' ? '🟢' :
                           selectedPatient.treatment.compliance === 'good' ? '🔵' : '🟡'}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {selectedPatient.treatment.compliance === 'excellent' ? 'Excellent' :
                             selectedPatient.treatment.compliance === 'good' ? 'Good' : 'Fair'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {selectedPatient.treatment.compliance === 'excellent' ? 'Patient strictly follows treatment plan' :
                             selectedPatient.treatment.compliance === 'good' ? 'Patient generally follows treatment plan' : 'Need to strengthen patient education'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Treatment Progress Tab */}
              {activeTab === 'treatment' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">🏥 {selectedPatient.treatment.pathway}</h3>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Treatment Progress</span>
                        <span className="text-lg font-bold text-indigo-600">{selectedPatient.treatment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${selectedPatient.treatment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎯</div>
                          <div className="font-semibold text-gray-900">Current Stage</div>
                          <div className="text-sm text-gray-600 mt-1">{selectedPatient.treatment.currentStep}</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">📅</div>
                          <div className="font-semibold text-gray-900">Next Appointment</div>
                          <div className="text-sm text-gray-600 mt-1">{selectedPatient.treatment.nextAppointment}</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {selectedPatient.treatment.compliance === 'excellent' ? '🌟' :
                             selectedPatient.treatment.compliance === 'good' ? '👍' : '⚠️'}
                          </div>
                          <div className="font-semibold text-gray-900">Compliance</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {selectedPatient.treatment.compliance === 'excellent' ? 'Excellent' :
                             selectedPatient.treatment.compliance === 'good' ? 'Good' : 'Needs Improvement'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Timeline Placeholder */}
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">📈 Treatment Timeline</h4>
                    <div className="space-y-4">
                      {[
                        { phase: 'Pre-operative Preparation', status: 'completed', date: '2025-10-20' },
                        { phase: 'Surgical Treatment', status: 'completed', date: '2025-10-25' },
                        { phase: 'Post-operative Recovery', status: 'current', date: '2025-11-03' },
                        { phase: 'Follow-up Assessment', status: 'pending', date: '2025-11-15' }
                      ].map((milestone, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full ${
                            milestone.status === 'completed' ? 'bg-green-500' :
                            milestone.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <div className={`font-medium ${
                              milestone.status === 'current' ? 'text-blue-600' : 'text-gray-900'
                            }`}>
                              {milestone.phase}
                            </div>
                            <div className="text-sm text-gray-600">{milestone.date}</div>
                          </div>
                          <div className={`text-sm px-2 py-1 rounded ${
                            milestone.status === 'completed' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'current' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {milestone.status === 'completed' ? 'Completed' :
                             milestone.status === 'current' ? 'In Progress' : 'Pending'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Communications Tab */}
              {activeTab === 'communications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">💬 Communication Records</h3>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      + New Communication
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedPatient.communications.map(comm => (
                      <div key={comm.id} className="bg-white border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">
                            {comm.type === 'email' ? '📧' : comm.type === 'sms' ? '💬' : '📞'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {comm.type === 'email' ? 'Email' : comm.type === 'sms' ? 'SMS' : 'Phone'}
                              </span>
                              <span className="text-sm text-gray-500">{comm.date}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                comm.status === 'read' ? 'bg-green-100 text-green-700' :
                                comm.status === 'delivered' ? 'bg-blue-100 text-blue-700' : 
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {comm.status === 'read' ? 'Read' :
                                 comm.status === 'delivered' ? 'Delivered' : 'Completed'}
                              </span>
                            </div>
                            <div className="text-gray-700">{comm.content}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">⭐ Patient Feedback</h3>
                    <button 
                      onClick={() => setShowFeedbackModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      + Record Feedback
                    </button>
                  </div>

                  {selectedPatient.feedback.length > 0 ? (
                    <div className="space-y-3">
                      {selectedPatient.feedback.map(feedback => (
                        <div key={feedback.id} className="bg-white border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(star => (
                                <span key={star} className={`text-lg ${
                                  star <= feedback.rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}>⭐</span>
                              ))}
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-500 mb-1">{feedback.date}</div>
                              <div className="text-gray-700">{feedback.comment}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-4">💭</div>
                      <p>No patient feedback records</p>
                    </div>
                  )}
                </div>
              )}

              {/* Vitals Tab */}
              {activeTab === 'vitals' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">💓 Vital Signs Monitoring</h3>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                      + Record Vitals
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🩸</div>
                        <div className="text-2xl font-bold text-purple-600">{selectedPatient.vitals.bloodPressure}</div>
                        <div className="text-sm text-gray-600">Blood Pressure (mmHg)</div>
                        <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Normal Range</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">❤️</div>
                        <div className="text-2xl font-bold text-red-600">{selectedPatient.vitals.heartRate}</div>
                        <div className="text-sm text-gray-600">Heart Rate</div>
                        <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Normal Range</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🌡️</div>
                        <div className="text-2xl font-bold text-orange-600">{selectedPatient.vitals.temperature}</div>
                        <div className="text-sm text-gray-600">Temperature</div>
                        <div className="mt-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Normal Range</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <div className="text-center">
                        <div className="text-4xl mb-2">⏱️</div>
                        <div className="text-sm font-medium text-blue-600">Last Updated</div>
                        <div className="text-xs text-gray-600 mt-1">{selectedPatient.vitals.lastUpdated}</div>
                        <div className="mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Latest Data</div>
                      </div>
                    </div>
                  </div>

                  {/* Vitals Chart Placeholder */}
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">📈 Trend Charts</h4>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="text-4xl mb-4">📊</div>
                        <p>Vital Signs Trend Charts</p>
                        <p className="text-sm">(Chart component placeholder)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">💬 Record Patient Feedback</h3>
                <button 
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satisfaction Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setNewFeedback(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${
                          star <= newFeedback.rating ? 'text-yellow-500' : 'text-gray-300'
                        } hover:text-yellow-400`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Content
                  </label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="Please enter patient feedback content..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (selectedPatient && newFeedback.comment.trim()) {
                        const updatedPatients = patients.map(p => 
                          p.id === selectedPatient.id ? {
                            ...p,
                            feedback: [...p.feedback, {
                              id: `f${Date.now()}`,
                              date: new Date().toISOString().slice(0, 10),
                              rating: newFeedback.rating,
                              comment: newFeedback.comment
                            }]
                          } : p
                        );
                        setPatients(updatedPatients);
                        setSelectedPatient(updatedPatients.find(p => p.id === selectedPatient.id));
                        setShowFeedbackModal(false);
                        setNewFeedback({ rating: 5, comment: '' });
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Templates Collection Interface
function TemplatesView() {
  const [templates, setTemplates] = useState([
    { id: 1, title: 'Pre-op Fasting Instructions', category: 'Surgery', status: 'published', language: 'EN', literacy: 'standard', usage: 245, content: 'Stop eating 6 hours before surgery. You may drink clear water up to 2 hours prior.' },
    { id: 2, title: 'Post-op Wound Care (Basic)', category: 'Surgery', status: 'published', language: 'ZH', literacy: 'basic', usage: 189, content: '保持伤口干燥2天。如果伤口变红、肿胀或发烧，请马上联系医生。' },
    { id: 3, title: 'Advanced Pain Management', category: 'Treatment', status: 'draft', language: 'EN', literacy: 'professional', usage: 67, content: 'Implement multimodal analgesia protocol with acetaminophen q6h PRN, avoiding hepatotoxic thresholds.' },
    { id: 4, title: 'Discharge Instructions (Standard)', category: 'General', status: 'published', language: 'EN', literacy: 'standard', usage: 334, content: 'Please follow all discharge instructions provided by your healthcare team.' },
    { id: 5, title: 'Informed Consent - Surgery', category: 'Legal', status: 'review', language: 'EN', literacy: 'advanced', usage: 123, content: 'Please review the comprehensive informed consent documentation detailing surgical procedures, risks, and alternatives.' },
    { id: 6, title: 'Simple Appointment Reminder', category: 'Communication', status: 'published', language: 'ZH', literacy: 'elementary', usage: 278, content: '明天要看医生。请提前10分钟到医院。' },
    { id: 7, title: 'Mobility Instructions (Easy)', category: 'Treatment', status: 'published', language: 'ZH', literacy: 'basic', usage: 156, content: '在家慢慢走路。每天走得比前一天多一点点。' },
    { id: 8, title: 'Professional Wound Assessment', category: 'Surgery', status: 'published', language: 'EN', literacy: 'professional', usage: 89, content: 'Monitor surgical site for erythema, edema, pyrexia indicating potential SSI. Document wound characteristics q8h.' }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // 文化程度/教育水平选项
  const LITERACY_LEVELS = {
    basic: { label: "Basic Education", description: "Elementary level, requires simple and clear language", icon: "🔤" },
    elementary: { label: "Elementary Education", description: "Middle school level, can understand basic medical terms", icon: "📚" },
    standard: { label: "Standard Education", description: "High school/college level, standard medical communication", icon: "📖" },
    advanced: { label: "Advanced Education", description: "Bachelor's degree or above, can accept detailed medical information", icon: "🎓" },
    professional: { label: "Professional Background", description: "Medical-related professional, can use professional terminology", icon: "👨‍⚕️" }
  };

  // 新模板表单状态
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: 'General',
    language: 'EN',
    literacy: 'standard',
    content: '',
    status: 'draft'
  });

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      alert('Please fill in all required fields (Title and Content)');
      return;
    }
    
    const template = {
      id: Date.now(), // 简单的ID生成
      ...newTemplate,
      usage: 0,
      createdAt: new Date().toISOString()
    };
    
    setTemplates(prev => [template, ...prev]);
    setNewTemplate({ title: '', category: 'General', language: 'EN', content: '', status: 'draft' });
    setShowAddModal(false);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setNewTemplate({
      title: template.title,
      category: template.category,
      language: template.language,
      literacy: template.literacy || 'standard',
      content: template.content,
      status: template.status
    });
    setShowAddModal(true);
  };

  const handleUpdateTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      alert('Please fill in all required fields (Title and Content)');
      return;
    }

    setTemplates(prev => prev.map(template => 
      template.id === editingTemplate.id 
        ? { ...template, ...newTemplate, updatedAt: new Date().toISOString() }
        : template
    ));
    
    setNewTemplate({ title: '', category: 'General', language: 'EN', content: '', status: 'draft' });
    setEditingTemplate(null);
    setShowAddModal(false);
  };

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Library</h2>
        <p className="text-gray-600">Create, manage and deploy medical communication templates</p>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg w-80"
            />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Categories</option>
              <option value="Surgery">Surgery</option>
              <option value="Treatment">Treatment</option>
              <option value="General">General</option>
              <option value="Legal">Legal</option>
              <option value="Communication">Communication</option>
            </select>
          </div>
          <button 
            onClick={() => {
              setEditingTemplate(null);
              setNewTemplate({ title: '', category: 'General', language: 'EN', literacy: 'standard', content: '', status: 'draft' });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + New Template
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Template Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Education Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Language</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Usage</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTemplates.map(template => (
                <tr key={template.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{template.title}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{template.category}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{LITERACY_LEVELS[template.literacy || 'standard']?.icon || '📖'}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {LITERACY_LEVELS[template.literacy || 'standard']?.label || 'Standard Education'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {template.literacy || 'standard'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(template.status)}`}>
                      {template.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{template.language}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium">{template.usage}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTemplate(template)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => alert(`Preview: ${template.title}\n\n${template.content}`)}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => {
                          setTemplates(prev => prev.map(t => 
                            t.id === template.id ? { ...t, status: 'published' } : t
                          ));
                        }}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        Deploy
                      </button>
                      <button 
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑模板模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  {editingTemplate ? 'Edit Template' : 'Create New Template'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter template title..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Surgery">Surgery</option>
                      <option value="Treatment">Treatment</option>
                      <option value="General">General</option>
                      <option value="Legal">Legal</option>
                      <option value="Communication">Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={newTemplate.language}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="EN">English</option>
                      <option value="ES">Spanish</option>
                      <option value="FR">French</option>
                      <option value="DE">German</option>
                      <option value="ZH">Chinese</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Education Level *
                  </label>
                  <select
                    value={newTemplate.literacy}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, literacy: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(LITERACY_LEVELS).map(([key, level]) => (
                      <option key={key} value={key}>
                        {level.icon} {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">💡</span>
                      <div className="text-sm text-blue-700">
                        <div className="font-medium">Selecting appropriate literacy level helps:</div>
                        <ul className="mt-1 space-y-1 text-xs">
                          <li>• Ensure patients can understand medical information</li>
                          <li>• Improve treatment compliance and safety</li>
                          <li>• Reduce misunderstandings in doctor-patient communication</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newTemplate.status}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="review">Under Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Content *
                  </label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter the template content that will be sent to patients..."
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTemplate(null);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingTemplate ? handleUpdateTemplate : handleAddTemplate}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 分析界面
function AnalyticsView() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h2>
        <p className="text-gray-600">Monitor template performance and patient engagement metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-indigo-600 mb-2">1,247</div>
          <div className="text-sm text-gray-600">Templates Sent</div>
          <div className="text-xs text-green-600 mt-1">↗ +12% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-green-600 mb-2">89.3%</div>
          <div className="text-sm text-gray-600">Open Rate</div>
          <div className="text-xs text-green-600 mt-1">↗ +5.2% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-blue-600 mb-2">76.8%</div>
          <div className="text-sm text-gray-600">Completion Rate</div>
          <div className="text-xs text-red-600 mt-1">↘ -2.1% vs last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-3xl font-bold text-purple-600 mb-2">4.2</div>
          <div className="text-sm text-gray-600">Avg Rating</div>
          <div className="text-xs text-green-600 mt-1">↗ +0.3 vs last month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Performance */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Top Performing Templates</h3>
          <div className="space-y-4">
            {[
              { name: 'Pre-op Fasting Instructions', sent: 245, opened: 221, completed: 198, rate: 90.2 },
              { name: 'Discharge Instructions', sent: 334, opened: 289, completed: 245, rate: 84.8 },
              { name: 'Follow-up Reminder', sent: 278, opened: 251, completed: 203, rate: 80.9 },
              { name: 'Post-op Wound Care', sent: 189, opened: 167, completed: 134, rate: 80.2 }
            ].map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-600">{template.sent} sent • {template.opened} opened • {template.completed} completed</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{template.rate}%</div>
                  <div className="text-xs text-gray-500">completion</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Engagement */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Patient Engagement Trends</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border-l-4 border-green-400 bg-green-50">
              <div>
                <div className="font-medium">High Engagement</div>
                <div className="text-sm text-gray-600">Patients with 90%+ completion rate</div>
              </div>
              <div className="text-2xl font-bold text-green-600">67%</div>
            </div>
            <div className="flex justify-between items-center p-3 border-l-4 border-yellow-400 bg-yellow-50">
              <div>
                <div className="font-medium">Medium Engagement</div>
                <div className="text-sm text-gray-600">Patients with 60-89% completion rate</div>
              </div>
              <div className="text-2xl font-bold text-yellow-600">24%</div>
            </div>
            <div className="flex justify-between items-center p-3 border-l-4 border-red-400 bg-red-50">
              <div>
                <div className="font-medium">Low Engagement</div>
                <div className="text-sm text-gray-600">Patients with &lt;60% completion rate</div>
              </div>
              <div className="text-2xl font-bold text-red-600">9%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { time: '2 min ago', action: 'Template "Pre-op Fasting" completed by Alice Jones', type: 'completion' },
            { time: '15 min ago', action: 'New template "Cardiac Recovery" published', type: 'publish' },
            { time: '1 hour ago', action: 'Ben Smith opened "Discharge Instructions"', type: 'open' },
            { time: '2 hours ago', action: 'Template "Pain Management" sent to 12 patients', type: 'send' },
            { time: '3 hours ago', action: 'Chen Li completed "Post-op Wound Care" with 5-star rating', type: 'completion' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'completion' ? 'bg-green-400' :
                activity.type === 'publish' ? 'bg-blue-400' :
                activity.type === 'open' ? 'bg-yellow-400' : 'bg-indigo-400'
              }`}></div>
              <div className="flex-1">
                <div className="text-sm">{activity.action}</div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 患者门户界面 - 模拟患者收到的模板
function PatientPortalView() {
  const [selectedPatientId, setSelectedPatientId] = useState('p1');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // 模拟患者收到的消息数据
  const patientMessages = {
    p1: [
      {
        id: 'm1',
        templateId: 'tmpl_fast_std',
        title: 'Pre‑op Fasting Instructions',
        content: 'Stop eating 6 hours before surgery. You may drink clear water up to 2 hours prior.',
        sentDate: '2025-11-03',
        sentTime: '09:00',
        status: 'read',
        type: 'instruction',
        priority: 'high',
        sender: 'Dr. Smith',
        educationLevel: 'standard'
      },
      {
        id: 'm2',
        templateId: 'tmpl_wound',
        title: 'Post‑op Wound Care',
        content: 'Keep dressing dry for 48 hours. Watch for signs of infection: redness, swelling, fever.',
        sentDate: '2025-11-02',
        sentTime: '14:30',
        status: 'read',
        type: 'care',
        priority: 'medium',
        sender: 'Dr. Smith',
        educationLevel: 'standard'
      },
      {
        id: 'm3',
        templateId: 'tmpl_pain',
        title: 'Pain Medication Schedule',
        content: 'Take paracetamol every 6–8 hours as prescribed. Avoid exceeding daily dose limits.',
        sentDate: '2025-11-01',
        sentTime: '16:15',
        status: 'read',
        type: 'medication',
        priority: 'high',
        sender: 'Nurse Johnson',
        educationLevel: 'standard'
      },
      {
        id: 'm4',
        templateId: 'tmpl_appt',
        title: 'Appointment Reminder',
        content: 'Your follow-up appointment is scheduled for tomorrow at 10:00 AM. Please arrive 15 minutes early.',
        sentDate: '2025-11-04',
        sentTime: '08:00',
        status: 'unread',
        type: 'reminder',
        priority: 'high',
        sender: 'Reception',
        educationLevel: 'standard'
      }
    ],
    p2: [
      {
        id: 'm5',
        templateId: 'tmpl_fast_basic',
        title: 'Pre-operative Fasting Instructions',
        content: '手术前6小时不能吃东西。手术前2小时可以喝一点水。',
        sentDate: '2025-11-03',
        sentTime: '10:30',
        status: 'read',
        type: 'instruction',
        priority: 'high',
        sender: '张医生',
        educationLevel: 'basic'
      },
      {
        id: 'm6',
        templateId: 'tmpl_wound_basic',
        title: 'Wound Care (Simple Version)',
        content: '保持伤口干燥2天。如果伤口变红、肿胀或发烧，请马上联系医生。',
        sentDate: '2025-11-02',
        sentTime: '11:45',
        status: 'read',
        type: 'care',
        priority: 'medium',
        sender: '李护士',
        educationLevel: 'basic'
      }
    ],
    p3: [
      {
        id: 'm7',
        templateId: 'tmpl_wound_professional',
        title: 'Post-operative Wound Management',
        content: 'Maintain sterile dressing integrity for 48h post-op. Monitor for erythema, edema, pyrexia indicating potential surgical site infection (SSI).',
        sentDate: '2025-10-26',
        sentTime: '15:20',
        status: 'read',
        type: 'care',
        priority: 'medium',
        sender: 'Dr. Anderson',
        educationLevel: 'professional'
      }
    ]
  };

  const patients = [
    { id: 'p1', name: 'Alice Jones', educationLevel: 'standard' },
    { id: 'p2', name: 'Ben Smith', educationLevel: 'basic' },
    { id: 'p3', name: 'Chen Li', educationLevel: 'professional' }
  ];

  const currentPatient = patients.find(p => p.id === selectedPatientId);
  const messages = patientMessages[selectedPatientId] || [];

  const getMessageTypeIcon = (type) => {
    switch(type) {
      case 'instruction': return '📋';
      case 'care': return '🏥';
      case 'medication': return '💊';
      case 'reminder': return '⏰';
      default: return '📨';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const markAsRead = (messageId) => {
    // In a real application, this would update message status to backend
    console.log(`Message ${messageId} marked as read`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📱 Patient Portal - Message Inbox</h2>
        <p className="text-gray-600">Simulate patients receiving template messages from doctors</p>
      </div>

      {/* Patient Selector */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Switch Patient View:</label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} (Education Level: {patient.educationLevel})
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-600">
            📨 Messages Received: <span className="font-semibold">{messages.length}</span>
          </div>
          <div className="text-sm text-gray-600">
            🔴 Unread: <span className="font-semibold text-red-600">{messages.filter(m => m.status === 'unread').length}</span>
          </div>
        </div>
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 gap-4">
        {messages.length > 0 ? messages.map(message => (
          <div 
            key={message.id} 
            className={`bg-white rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              message.status === 'unread' ? 'border-l-4 border-l-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => {
              setSelectedMessage(message);
              setShowMessageModal(true);
              if (message.status === 'unread') {
                markAsRead(message.id);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-3xl">{getMessageTypeIcon(message.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{message.title}</h3>
                    {message.status === 'unread' && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">New</span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority === 'high' ? '🔴 Important' : 
                       message.priority === 'medium' ? '🟡 Normal' : '🟢 Low'}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3 line-clamp-2">{message.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>👨‍⚕️</span>
                      <span>Sender: {message.sender}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📅</span>
                      <span>{message.sentDate} {message.sentTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📚</span>
                      <span>Level: {message.educationLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm px-2 py-1 rounded ${
                  message.status === 'read' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {message.status === 'read' ? '✅ Read' : '📩 Unread'}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold mb-2">No Messages</h3>
            <p>This patient has not received any medical template messages yet</p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getMessageTypeIcon(selectedMessage.type)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMessage.title}</h3>
                    <p className="text-gray-600">From {selectedMessage.sender}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Sent Time:</span>
                      <span className="ml-2 font-medium">{selectedMessage.sentDate} {selectedMessage.sentTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Message Type:</span>
                      <span className="ml-2 font-medium">{selectedMessage.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Education Level:</span>
                      <span className="ml-2 font-medium">{selectedMessage.educationLevel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">📄 Message Content</h4>
                  <div className="bg-white border rounded-lg p-4">
                    <p className="text-gray-800 leading-relaxed">{selectedMessage.content}</p>
                  </div>
                </div>

                {/* Simulated Patient Actions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">💬 Patient Actions</h4>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => alert('Patient has confirmed receipt and understanding of this message')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      ✅ Confirmed
                    </button>
                    <button 
                      onClick={() => alert('Patient marked this message as needing more explanation')}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                      ❓ Need Help
                    </button>
                    <button 
                      onClick={() => alert('Patient requested to speak with doctor')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      📞 Contact Doctor
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch(currentView) {
      case 'patients':
        return <PatientsView />;
      case 'templates':
        return <TemplatesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'patient-portal':
        return <PatientPortalView />;
      case 'dashboard':
      default:
        return <ClinicianDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderView()}
    </div>
  );
}
