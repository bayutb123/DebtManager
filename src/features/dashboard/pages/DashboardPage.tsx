import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { formatCurrency } from '../../../utils/format';
import LoadingState from '../../../components/shared/LoadingState';
import StatusBadge from '../../../components/shared/StatusBadge';
import { Table, TBody, THead, TH, TD } from '../../../components/ui/table';
import { DashboardService } from '../dashboard.service';

const DashboardPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: DashboardService.getSummary,
  });

  const monthlyData = useMemo(() => {
    if (!data) return [];
    // Single snapshot comparing current totals
    return [
      {
        label: 'Current',
        debt: data.totalDebt,
        receivable: data.totalReceivable,
      },
    ];
  }, [data]);

  if (isLoading || !data) return <LoadingState label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Overview of your balances and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Receivable</CardTitle>
            <CardDescription>Money owed to you</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-emerald-700">
            {formatCurrency(data.totalReceivable)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Debt</CardTitle>
            <CardDescription>Money you owe</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-rose-700">{formatCurrency(data.totalDebt)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
            <CardDescription>Receivable paid - Debt paid</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-slate-900">{formatCurrency(data.netBalance)}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Outstanding</CardTitle>
            <CardDescription>Debt vs receivable outstanding</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-semibold text-rose-700">Debt: {formatCurrency(data.totalDebt)}</p>
            <p className="font-semibold text-emerald-700">
              Receivable: {formatCurrency(data.totalReceivable)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Debt vs Receivable</CardTitle>
            <CardDescription>Visual comparison</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="debt" fill="#ef4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="receivable" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payments trend</CardTitle>
            <CardDescription>Recent payments across items</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.recentTransactions}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#1d4ed8" fill="#cbd5f5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Latest payments recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <tr>
                <TH>Type</TH>
                <TH>Reference</TH>
                <TH>Amount</TH>
                <TH>Date</TH>
                <TH>Note</TH>
              </tr>
            </THead>
            <TBody>
              {data.recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50">
                  <TD>
                    <StatusBadge status={tx.type === 'DEBT' ? 'ACTIVE' : 'PAID'} />
                  </TD>
                  <TD>{tx.referenceId}</TD>
                  <TD>{formatCurrency(tx.amount)}</TD>
                  <TD>{tx.date}</TD>
                  <TD>{tx.note}</TD>
                </tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
