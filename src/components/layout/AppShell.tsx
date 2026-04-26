import { ReactNode } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PageContainer } from './PageContainer';

interface AppShellProps {
  headerTitle: string;
  headerSubtitle?: string;
  children: ReactNode;
}

export function AppShell({ headerTitle, headerSubtitle, children }: AppShellProps) {
  return (
    <div style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Header title={headerTitle} subtitle={headerSubtitle} />
      <PageContainer>{children}</PageContainer>
      <BottomNav />
    </div>
  );
}
