import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ChoosePaths } from './pages/ChoosePaths';
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
import { TeachLessonEditor } from './pages/TeachLessonEditor';
import { TeachChallenges } from './pages/TeachChallenges';
import { TeachChallengeEditor } from './pages/TeachChallengeEditor';
import { TeachGuide } from './pages/TeachGuide';
import { AdminReview } from './pages/AdminReview';
import { AdminChallengeReview } from './pages/AdminChallengeReview';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/paths" element={<ChoosePaths />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lessons/:id" element={<Lesson />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/challenges/:id" element={<ChallengeSolve />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
          </Route>
          <Route element={<RoleRoute roles={['INSTRUCTOR', 'ADMIN']} />}>
            <Route path="/teach" element={<TeachCourses />} />
            <Route path="/teach/courses/:id" element={<TeachCourseEditor />} />
            <Route path="/teach/lessons/:id" element={<TeachLessonEditor />} />
            <Route path="/teach/challenges" element={<TeachChallenges />} />
            <Route path="/teach/challenges/:id" element={<TeachChallengeEditor />} />
            <Route path="/teach/guide" element={<TeachGuide />} />
          </Route>
          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminReview />} />
            <Route path="/admin/challenges" element={<AdminChallengeReview />} />
          </Route>
          <Route path="*" element={<main className="p-16 text-center text-slate-400">Page not found</main>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
