import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageTracker } from './components/PageTracker';
import { VerifyEmailBanner } from './components/VerifyEmailBanner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { Landing } from './pages/Landing';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Lesson } from './pages/Lesson';
import { Challenges } from './pages/Challenges';
import { ChallengeSolve } from './pages/ChallengeSolve';
import { Leaderboard } from './pages/Leaderboard';
import { Achievements } from './pages/Achievements';
import { TeachCourses } from './pages/TeachCourses';
import { TeachCourseEditor } from './pages/TeachCourseEditor';
import { TeachCourseStudents } from './pages/TeachCourseStudents';
import { TeachLessonEditor } from './pages/TeachLessonEditor';
import { TeachChallenges } from './pages/TeachChallenges';
import { TeachChallengeEditor } from './pages/TeachChallengeEditor';
import { TeachGuide } from './pages/TeachGuide';
import { TeachSubmissions } from './pages/TeachSubmissions';
import { AdminReview } from './pages/AdminReview';
import { AdminChallengeReview } from './pages/AdminChallengeReview';
import { AdminUsers } from './pages/AdminUsers';
import { AdminReviews } from './pages/AdminReviews';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { VerifyEmail } from './pages/VerifyEmail';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { Certificate } from './pages/Certificate';
import { VerifyCertificate } from './pages/VerifyCertificate';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageTracker />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <VerifyEmailBanner />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify/:code" element={<VerifyCertificate />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/lessons/:id" element={<Lesson />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/:id" element={<ChallengeSolve />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/certificates/:id" element={<Certificate />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route element={<RoleRoute roles={['INSTRUCTOR', 'ADMIN']} />}>
                <Route path="/teach" element={<TeachCourses />} />
                <Route path="/teach/courses/:id" element={<TeachCourseEditor />} />
                <Route path="/teach/courses/:id/students" element={<TeachCourseStudents />} />
                <Route path="/teach/lessons/:id" element={<TeachLessonEditor />} />
                <Route path="/teach/challenges" element={<TeachChallenges />} />
                <Route path="/teach/challenges/:id" element={<TeachChallengeEditor />} />
                <Route path="/teach/guide" element={<TeachGuide />} />
                <Route path="/teach/submissions" element={<TeachSubmissions />} />
              </Route>
              <Route element={<RoleRoute roles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminReview />} />
                <Route path="/admin/challenges" element={<AdminChallengeReview />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
              </Route>
              <Route path="*" element={<main className="p-16 text-center text-slate-400">Page not found</main>} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
