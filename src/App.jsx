import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ParticleBackground from './components/ParticleBackground.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import Upskill from './pages/Upskill.jsx'
import CareerJobs from './pages/CareerJobs.jsx'
import CourseFinderWizard from './pages/CourseFinderWizard.jsx'
import DemoRegistrationWizard from './pages/DemoRegistrationWizard.jsx'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'
import About from './pages/About.jsx'
import Career from './pages/Career.jsx'
import JobPulse from './pages/JobPulse.jsx'

function App() {
  return (
    <div className="app-shell">
      <ParticleBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
            <Route path="/career" element={<Career />} />
           <Route path="/about" element={<About />} />
            <Route path="/career-finder" element={<CourseFinderWizard />} />
             <Route path="/OpportunityNexus" element={<JobPulse />} />
          <Route path="/demo-registration" element={<DemoRegistrationWizard />} />
          <Route path="/courses/:courseName" element={<CourseDetails />} />
          <Route path="/career-jobs" element={<CareerJobs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App