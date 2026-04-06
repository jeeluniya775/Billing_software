import { AccountingWorkspace } from '@/components/accounting/AccountingWorkspace';

interface AccountingTabPageProps {
  params: { tab: string };
}

export default function AccountingTabPage({ params }: AccountingTabPageProps) {
  const { tab } = params;
  return <AccountingWorkspace tabSlug={tab} />;
}
