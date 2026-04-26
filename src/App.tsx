import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TodayPage } from './pages/TodayPage';
import { JourneyPage } from './pages/JourneyPage';
import { DayPage } from './pages/DayPage';
import { RitualsPage } from './pages/RitualsPage';
import { ReviewPage } from './pages/ReviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { AppShell } from './components/layout/AppShell';

function NotFoundPage() {
  return (
    <AppShell headerTitle="404">
      <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        <p style={{ fontSize: '48px', margin: '0 0 12px' }}>🔍</p>
        <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', margin: '0 0 8px' }}>
          Page Not Found
        </p>
        <p style={{ fontSize: '14px', margin: 0 }}>
          This route doesn't exist in the program.
        </p>
      </div>
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<TodayPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/day/:dayNumber" element={<DayPage />} />
        <Route path="/rituals" element={<RitualsPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
