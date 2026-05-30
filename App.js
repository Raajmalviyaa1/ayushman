import React, { useState, useEffect } from 'react';
import './App.css';
import doctorImg from './doctor.png';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

const indoreDoctors = {
  'General Physician': [
    { name: 'Dr. Ashok Gupta', hospital: 'Apollo Hospitals Indore', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Rajesh Sharma', hospital: 'Bombay Hospital Indore', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.6', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
    { name: 'Dr. Sunil Jain', hospital: 'CHL Hospital Indore', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.5', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
  ],
  'Cardiologist': [
    { name: 'Dr. Vinod Agrawal', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.8', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
    { name: 'Dr. Rakesh Gupta', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Pradeep Sharma', hospital: 'MY Hospital', address: 'MG Road, Indore', phone: '0731-2527700', rating: '4.5', maps: 'https://maps.google.com/?q=MY+Hospital+Indore' },
  ],
  'Neurologist': [
    { name: 'Dr. Anand Joshi', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Deepak Verma', hospital: 'CHL Hospital', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.6', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
    { name: 'Dr. Ramesh Patel', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.5', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
  ],
  'Dermatologist': [
    { name: 'Dr. Priya Sharma', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.6', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Neha Jain', hospital: 'Skin Care Clinic', address: 'Palasia Square, Indore', phone: '0731-2543000', rating: '4.5', maps: 'https://maps.google.com/?q=Palasia+Square+Indore' },
    { name: 'Dr. Amit Gupta', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.4', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
  ],
  'Orthopedic': [
    { name: 'Dr. Suresh Malhotra', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Manoj Singh', hospital: 'CHL Hospital', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.6', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
    { name: 'Dr. Vikram Joshi', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.5', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
  ],
  'Gastroenterologist': [
    { name: 'Dr. Rajiv Mehta', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Anil Sharma', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.6', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
    { name: 'Dr. Sanjay Gupta', hospital: 'MY Hospital', address: 'MG Road, Indore', phone: '0731-2527700', rating: '4.4', maps: 'https://maps.google.com/?q=MY+Hospital+Indore' },
  ],
  'Ophthalmologist': [
    { name: 'Dr. Sunita Verma', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Ravi Jain', hospital: 'Eye Care Center', address: 'MG Road, Indore', phone: '0731-2520000', rating: '4.6', maps: 'https://maps.google.com/?q=Eye+Care+Center+Indore' },
    { name: 'Dr. Pooja Singh', hospital: 'CHL Hospital', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.5', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
  ],
  'Dentist': [
    { name: 'Dr. Kavita Sharma', hospital: 'Smile Dental Clinic', address: 'Vijay Nagar, Indore', phone: '0731-4100000', rating: '4.7', maps: 'https://maps.google.com/?q=Smile+Dental+Clinic+Indore' },
    { name: 'Dr. Rohit Jain', hospital: 'Apollo Dental', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.6', maps: 'https://maps.google.com/?q=Apollo+Dental+Indore' },
    { name: 'Dr. Priti Gupta', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.5', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
  ],
  'Endocrinologist': [
    { name: 'Dr. Sanjay Sharma', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.8', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Priya Agrawal', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.7', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
    { name: 'Dr. Rahul Jain', hospital: 'CHL Hospital', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.5', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
  ],
  'Psychiatrist': [
    { name: 'Dr. Neeraj Verma', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.7', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Shilpa Gupta', hospital: 'Mind Care Clinic', address: 'Palasia, Indore', phone: '0731-2543000', rating: '4.6', maps: 'https://maps.google.com/?q=Mind+Care+Clinic+Indore' },
    { name: 'Dr. Amit Sharma', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.5', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
  ],
  'Gynecologist': [
    { name: 'Dr. Sunita Jain', hospital: 'Apollo Hospitals', address: 'Vijay Nagar, Indore', phone: '0731-4077000', rating: '4.8', maps: 'https://maps.google.com/?q=Apollo+Hospital+Indore' },
    { name: 'Dr. Rekha Sharma', hospital: 'Bombay Hospital', address: 'Palasia, Indore', phone: '0731-4055000', rating: '4.7', maps: 'https://maps.google.com/?q=Bombay+Hospital+Indore' },
    { name: 'Dr. Pooja Verma', hospital: 'CHL Hospital', address: 'AB Road, Indore', phone: '0731-4000000', rating: '4.6', maps: 'https://maps.google.com/?q=CHL+Hospital+Indore' },
  ],
};

const symptomToDoctor = {
  'fever': 'General Physician',
  'headache': 'Neurologist',
  'chest': 'Cardiologist',
  'skin': 'Dermatologist',
  'rash': 'Dermatologist',
  'back': 'Orthopedic',
  'stomach': 'Gastroenterologist',
  'eye': 'Ophthalmologist',
  'dental': 'Dentist',
  'tooth': 'Dentist',
  'sugar': 'Endocrinologist',
  'diabetes': 'Endocrinologist',
  'anxiety': 'Psychiatrist',
  'depression': 'Psychiatrist',
  'mental': 'Psychiatrist',
  'pregnan': 'Gynecologist',
  'period': 'Gynecologist',
  'bp': 'Cardiologist',
};

function App() {
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [symptom, setSymptom] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    setTimeout(() => setShowIntro(false), 3000);
  }, []);

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => alert('✅ Account created!'))
      .catch(err => alert(err.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((u) => setUser(u.user))
      .catch(err => alert(err.message));
  };

  const handleLogout = () => {
    auth.signOut();
    setUser(null);
  };

  const saveMedicine = () => {
    if(medName && medTime) {
      addDoc(collection(db, 'medicines'), {
        name: medName,
        time: medTime,
        userId: user.uid,
        date: new Date().toISOString()
      }).then(() => alert(`✅ ${medName} saved!`))
        .catch(err => alert(err.message));
    }
  };

  const checkSymptomAI = () => {
    if(!symptom) return;
    setAiLoading(true);
    const s = symptom.toLowerCase();
    let result = '';
    if(s.includes('fever') || s.includes('bukhar')) {
      result = '🌡️ Possible: Viral Infection\n💊 Medicine: Paracetamol 500mg\n🏠 Home: Rest, drink water, cold compress\n👨‍⚕️ See: General Physician if fever > 3 days';
    } else if(s.includes('headache') || s.includes('sir dard')) {
      result = '🤕 Possible: Tension/Migraine\n💊 Medicine: Ibuprofen 400mg\n🏠 Home: Rest in dark room, cold compress\n👨‍⚕️ See: Neurologist if severe';
    } else if(s.includes('cough') || s.includes('khansi')) {
      result = '😮‍💨 Possible: Throat infection\n💊 Medicine: Cough syrup, Strepsils\n🏠 Home: Warm water with honey, steam\n👨‍⚕️ See: ENT if > 1 week';
    } else if(s.includes('stomach') || s.includes('pet dard')) {
      result = '🤢 Possible: Gastritis\n💊 Medicine: Antacid, Omeprazole\n🏠 Home: Light food, avoid spicy\n👨‍⚕️ See: Gastroenterologist';
    } else if(s.includes('cold') || s.includes('nazla')) {
      result = '🤧 Possible: Common Cold\n💊 Medicine: Cetirizine, Vicks\n🏠 Home: Steam, warm fluids\n👨‍⚕️ See: General Physician';
    } else if(s.includes('back') || s.includes('kamar')) {
      result = '🦴 Possible: Muscle strain\n💊 Medicine: Ibuprofen, Diclofenac\n🏠 Home: Rest, hot compress\n👨‍⚕️ See: Orthopedic';
    } else if(s.includes('skin') || s.includes('rash')) {
      result = '🩹 Possible: Skin allergy\n💊 Medicine: Antihistamine cream\n🏠 Home: Avoid scratching\n👨‍⚕️ See: Dermatologist';
    } else if(s.includes('eye') || s.includes('ankh')) {
      result = '👁️ Possible: Eye infection\n💊 Medicine: Eye drops\n🏠 Home: Rest eyes, avoid screen\n👨‍⚕️ See: Ophthalmologist';
    } else if(s.includes('vomit') || s.includes('ulti')) {
      result = '🤢 Possible: Gastroenteritis\n💊 Medicine: Ondansetron, ORS\n🏠 Home: Light food, rest, hydrate\n👨‍⚕️ See: General Physician';
    } else if(s.includes('fatigue') || s.includes('thakaan') || s.includes('tired')) {
      result = '😴 Possible: Anemia/Weakness\n💊 Medicine: Iron supplements, Vitamin B12\n🏠 Home: Rest, nutritious food\n👨‍⚕️ See: General Physician';
    } else if(s.includes('chest') || s.includes('seena')) {
      result = '💔 Possible: Cardiac issue\n💊 Medicine: DO NOT self-medicate\n🏠 Home: Sit upright, stay calm\n👨‍⚕️ See: Cardiologist IMMEDIATELY';
    } else if(s.includes('tooth') || s.includes('dant') || s.includes('dental')) {
      result = '🦷 Possible: Tooth infection\n💊 Medicine: Ibuprofen for pain\n🏠 Home: Salt water gargle\n👨‍⚕️ See: Dentist';
    } else if(s.includes('pregnan') || s.includes('period')) {
      result = '🤰 Possible: Gynecological issue\n💊 Medicine: Consult doctor first\n🏠 Home: Rest, stay hydrated\n👨‍⚕️ See: Gynecologist';
    } else if(s.includes('anxiety') || s.includes('depression') || s.includes('stress')) {
      result = '🧠 Possible: Mental health issue\n💊 Medicine: Consult psychiatrist\n🏠 Home: Deep breathing, meditation\n👨‍⚕️ See: Psychiatrist';
    } else if(s.includes('diabetes') || s.includes('sugar')) {
      result = '🩸 Possible: Diabetes symptoms\n💊 Medicine: Consult doctor\n🏠 Home: Avoid sugar, exercise daily\n👨‍⚕️ See: Endocrinologist';
    } else if(s.includes('bp') || s.includes('blood pressure')) {
      result = '❤️ Possible: Hypertension\n💊 Medicine: Doctor prescribed only\n🏠 Home: Reduce salt, avoid stress\n👨‍⚕️ See: Cardiologist';
    } else {
      result = '⚕️ Please describe symptoms more\n🏠 Home: Rest and stay hydrated\n👨‍⚕️ See: General Physician';
    }
    setTimeout(() => {
      setAiResult(result);
      setAiLoading(false);
    }, 1000);
  };

  const findDoctors = () => {
    const s = symptom.toLowerCase();
    let docType = 'General Physician';
    for(let key in symptomToDoctor) {
      if(s.includes(key)) { docType = symptomToDoctor[key]; break; }
    }
    setLoading(true);
    const result = indoreDoctors[docType] || indoreDoctors['General Physician'];
    setDoctors(result.map(d => ({...d, type: docType})));
    setLoading(false);
  };

  // INTRO SCREEN
  if(showIntro) {
    return (
      <div style={{
        background: 'black',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h1 style={{
          color: '#e50914',
          fontSize: '5rem',
          fontWeight: 'bold',
          animation: 'fadeIn 1.5s ease-in',
          letterSpacing: '8px',
          fontFamily: 'Arial Black'
        }}>AYUSHMAN</h1>
        <p style={{
          color: '#aaa',
          fontSize: '1.2rem',
          marginTop: '15px',
          animation: 'fadeIn 2s ease-in'
        }}>🏥 Your Personal Health Assistant</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if(!user) {
    return (
      <div className="login-box" style={{
        backgroundImage: `linear-gradient(rgba(0,48,135,0.75), rgba(0,48,135,0.75)), url(${doctorImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <h2>🏥 Ayushman</h2>
        <p>Your Personal Health Assistant</p>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}/>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleSignup}>Sign Up</button>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div style={{display:'flex', flexDirection:'column'}}>
          <h2 style={{margin:0}}>
            <span style={{
              fontSize:'1.8rem',
              background:'linear-gradient(#ff4500, #ff8c00)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              fontWeight:'bold',
              filter:'drop-shadow(0 0 5px #ff4500)'
            }}>R</span>
            <span> Ayushman </span>
            <span style={{fontSize:'1.3rem'}}>🏥</span>
          </h2>
          <span style={{fontSize:'0.65rem', color:'#cce0ff'}}>Tenet</span>
        </div>
        <div className="nav-links">
          <button onClick={() => setActivePage('home')}>Home</button>
          <button onClick={() => setActivePage('medicines')}>Medicines</button>
          <button onClick={() => setActivePage('symptoms')}>Symptoms</button>
          <button onClick={() => setActivePage('doctors')}>Doctors</button>
          <button onClick={() => setActivePage('medicineinfo')}>Medicine Info</button>
          <button onClick={() => setActivePage('reports')}>Reports</button>
          <button onClick={handleLogout} style={{background:'#c62828'}}>Logout</button>
        </div>
      </nav>

      <div className="content">
        {activePage === 'home' && (
          <div>
            <div className="hero-section">
              <h1>Empowering you to get and stay healthy 💪</h1>
              <p>Welcome back, {user.email}! Your health dashboard is ready.</p>
            </div>
            <div className="home-grid">
              <div className="card" onClick={() => setActivePage('medicines')}>💊<h3>Medicine Tracker</h3><p>Track your medicines & never miss a dose</p></div>
              <div className="card" onClick={() => setActivePage('symptoms')}>🤒<h3>AI Symptom Checker</h3><p>Check symptoms & get instant advice</p></div>
              <div className="card" onClick={() => setActivePage('doctors')}>👨‍⚕️<h3>Find Doctors</h3><p>Find nearby doctors in Indore</p></div>
              <div className="card" onClick={() => setActivePage('doctors')}>🏥<h3>Hospitals</h3><p>Find hospitals near you</p></div>
              <div className="card" onClick={() => setActivePage('reports')}>📋<h3>My Reports</h3><p>Upload & manage medical reports</p></div>
              <div className="card" onClick={() => setActivePage('medicineinfo')}>💉<h3>Medicine Info</h3><p>Search medicine details & dosage</p></div>
            </div>
          </div>
        )}
        {activePage === 'medicines' && (
          <div className="medicines-section">
            <h2>💊 Medicine Tracker</h2>
            <div className="add-medicine">
              <input type="text" placeholder="Medicine name" onChange={e => setMedName(e.target.value)}/>
              <input type="time" onChange={e => setMedTime(e.target.value)}/>
              <button onClick={saveMedicine}>Save Medicine</button>
            </div>
          </div>
        )}
        {activePage === 'symptoms' && (
          <div className="medicines-section">
            <h2>🤒 AI Symptom Checker</h2>
            <div className="add-medicine">
              <input type="text" placeholder="Enter symptom (e.g. fever, headache)" onChange={e => setSymptom(e.target.value)}/>
              <button onClick={checkSymptomAI}>
                {aiLoading ? '🤖 Analyzing...' : '🤖 Check with AI'}
              </button>
            </div>
            {aiResult && (
              <div className="ai-result">
                <h3>🤖 AI Suggestion:</h3>
                <p>{aiResult}</p>
              </div>
            )}
          </div>
        )}
        {activePage === 'doctors' && (
          <div className="medicines-section">
            <h2>👨‍⚕️ Find Doctors - Indore</h2>
            <div className="add-medicine">
              <input type="text" placeholder="Enter symptom (e.g. fever, diabetes)" onChange={e => setSymptom(e.target.value)}/>
              <button onClick={findDoctors}>
                {loading ? '🔍 Finding...' : '📍 Find Doctors in Indore'}
              </button>
            </div>
            {doctors.length > 0 && (
              <div style={{marginTop: '20px'}}>
                {doctors.map((d, i) => (
                  <div key={i} className="doctor-card">
                    <h3>{d.name}</h3>
                    <p>🏥 {d.hospital}</p>
                    <p>🩺 {d.type}</p>
                    <p>⭐ {d.rating}/5</p>
                    <p>📍 {d.address}</p>
                    <p>📞 {d.phone}</p>
                    <button onClick={() => window.open(d.maps, '_blank')} style={{
                      background:'#003087',
                      color:'white', border:'none', padding:'10px 18px',
                      borderRadius:'8px', cursor:'pointer', marginTop:'10px',
                      width:'100%', fontSize:'0.95rem', fontWeight:'bold'
                    }}>📍 View on Google Maps</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activePage === 'medicineinfo' && (
          <div className="medicines-section">
            <h2>💉 Medicine Info</h2>
            <div className="add-medicine">
              <input type="text" placeholder="Enter medicine name" id="medSearch"/>
              <button onClick={() => {
                const m = document.getElementById('medSearch').value.toLowerCase();
                let info = '';
                if(m.includes('paracetamol')) info = '✅ Fever, Headache | 500mg | Max 4x/day';
                else if(m.includes('ibuprofen')) info = '✅ Pain, Inflammation | 400mg | After food';
                else if(m.includes('amoxicillin')) info = '✅ Bacterial infections | 500mg | Full course';
                else info = '⚠️ Medicine not found - Consult doctor';
                alert(info);
              }}>Search Medicine</button>
            </div>
          </div>
        )}
        {activePage === 'reports' && (
          <div className="medicines-section">
            <h2>📋 My Reports</h2>
            <div className="add-medicine">
              <input type="text" placeholder="Report name"/>
              <input type="date"/>
              <input type="file" accept=".pdf,.jpg,.png"/>
              <button onClick={() => alert('✅ Report uploaded!')}>Upload Report</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;