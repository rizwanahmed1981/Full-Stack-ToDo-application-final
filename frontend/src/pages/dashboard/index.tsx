import DashboardView from '@/components/Dashboard/DashboardView.minimal';
import { VisualStyleProvider } from '@/components/Dashboard/VisualStyleProvider';

export default function DashboardPage() {
  return (
    <VisualStyleProvider>
      <DashboardView />
    </VisualStyleProvider>
  );
}