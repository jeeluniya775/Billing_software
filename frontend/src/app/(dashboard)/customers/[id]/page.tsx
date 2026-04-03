'use client';

import { useMemo } from 'react';
import { notFound } from 'next/navigation';
import { MOCK_CUSTOMERS } from '@/lib/mock-customers';
import { CustomerTag, LedgerTransaction } from '@/types/customer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Mail, Phone, Globe, MapPin, ShieldAlert, ChevronLeft, Download, FileText, File, Wallet } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/tables/DataTable';

const getTagColor = (tag: CustomerTag) => {
  switch (tag) {
    case 'VIP': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
    case 'High Risk': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
    case 'Wholesale': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    case 'Retail': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = useMemo(() => MOCK_CUSTOMERS.find(c => c.id === params.id), [params.id]);

  if (!customer) {
    return notFound();
  }

  const overLimit = customer.currentBalance > customer.creditLimit;

  // Ledger Table Columns
  const ledgerColumns = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'type', header: 'Type', cell: ({ row }: { row: import('@tanstack/react-table').Row<LedgerTransaction> }) => (
      <span className={`px-2 py-1 rounded-md text-[11px] font-medium ${
        row.original.type === 'Invoice' ? 'bg-blue-50 text-blue-700' :
        row.original.type === 'Payment' ? 'bg-emerald-50 text-emerald-700' :
        'bg-gray-50 text-gray-700'
      }`}>
        {row.original.type}
      </span>
    )},
    { accessorKey: 'reference', header: 'Reference' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'debit', header: () => <div className="text-right">Debit</div>, cell: ({ row }: { row: import('@tanstack/react-table').Row<LedgerTransaction> }) => <div className="text-right">{row.original.debit > 0 ? formatCurrency(row.original.debit, customer.currency) : '-'}</div> },
    { accessorKey: 'credit', header: () => <div className="text-right">Credit</div>, cell: ({ row }: { row: import('@tanstack/react-table').Row<LedgerTransaction> }) => <div className="text-right">{row.original.credit > 0 ? formatCurrency(row.original.credit, customer.currency) : '-'}</div> },
    { accessorKey: 'balance', header: () => <div className="text-right">Balance</div>, cell: ({ row }: { row: import('@tanstack/react-table').Row<LedgerTransaction> }) => <div className="text-right font-medium">{formatCurrency(row.original.balance, customer.currency)}</div> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{customer.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
              customer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' 
              : customer.status === 'Blocked' ? 'bg-red-100 text-red-800'
              : customer.status === 'On Hold' ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-100 text-gray-800'
            }`}>
              {customer.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">{customer.company} • {customer.id}</p>
        </div>
      </div>

      {overLimit && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl p-4 flex items-start gap-4">
          <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900 dark:text-red-400">Credit Limit Exceeded</h4>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              This customer&apos;s current balance ({formatCurrency(customer.currentBalance, customer.currency)}) exceeds their credit limit of {formatCurrency(customer.creditLimit, customer.currency)}. 
              {customer.status !== 'Blocked' && " Consider placing their account on hold."}
            </p>
          </div>
          <Button variant="outline" className="ml-auto bg-white dark:bg-neutral-900 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400">
            Review Account
          </Button>
        </div>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-transparent border-b border-neutral-200 dark:border-neutral-800 w-full justify-start rounded-none h-auto p-0 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 rounded-none border-b-2 border-transparent px-6 py-3">Overview</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 rounded-none border-b-2 border-transparent px-6 py-3">Financial Control</TabsTrigger>
          <TabsTrigger value="ledger" className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 rounded-none border-b-2 border-transparent px-6 py-3">Smart Ledger</TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-600 rounded-none border-b-2 border-transparent px-6 py-3">Documents ({customer.documents?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{customer.company}</span>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${customer.email}`} className="text-sm hover:text-emerald-600 transition-colors">{customer.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  {customer.website && (
                    <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                      <Globe className="h-4 w-4 shrink-0" />
                      <a href={customer.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:text-blue-500 transition-colors">{customer.website}</a>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {customer.taxNumber && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-neutral-500">Tax Number (GST/EIN)</span>
                      <span className="text-sm font-mono text-neutral-900 dark:text-white">{customer.taxNumber}</span>
                    </div>
                  )}
                  {customer.registrationNumber && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-neutral-500">Company Registration</span>
                      <span className="text-sm font-mono text-neutral-900 dark:text-white">{customer.registrationNumber}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-xs font-medium text-neutral-500">Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {customer.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 border text-[11px] font-medium rounded-md ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Primary Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customer.contacts.map(contact => (
                  <div key={contact.id} className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-neutral-900 dark:text-white">{contact.name}</span>
                      {contact.isPrimary && <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Primary</span>}
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">{contact.role}</p>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                      <p>{contact.email}</p>
                      <p>{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-3 shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg">Addresses</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Billing Address</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {customer.billingAddress.street}<br/>
                      {customer.billingAddress.city}, {customer.billingAddress.state} {customer.billingAddress.zipCode}<br/>
                      {customer.billingAddress.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">Shipping Address</h4>
                    {customer.sameAsBilling ? (
                      <p className="text-sm text-neutral-500 italic">Same as billing address</p>
                    ) : (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {customer.shippingAddress.street}<br/>
                        {customer.shippingAddress.city}, {customer.shippingAddress.state} {customer.shippingAddress.zipCode}<br/>
                        {customer.shippingAddress.country}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm rounded-xl border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Current Balance</h3>
                  <Wallet className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {formatCurrency(customer.currentBalance, customer.currency)}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Credit Limit: {formatCurrency(customer.creditLimit, customer.currency)}
                </p>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${overLimit ? 'bg-red-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${Math.min(100, (customer.currentBalance / customer.creditLimit) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm rounded-xl">
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Payment Terms</h3>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                  {customer.paymentTerms}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  Late Interest: {customer.latePaymentInterestRate}% per month
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm rounded-xl">
               <CardContent className="p-6">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Behavior Score</h3>
                <div className="flex items-end gap-3 mt-2">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {customer.paymentBehaviorScore}
                  </div>
                  <span className="text-sm font-medium text-neutral-500 mb-1">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full mt-3 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${customer.paymentBehaviorScore > 80 ? 'bg-emerald-500' : customer.paymentBehaviorScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                    style={{ width: `${customer.paymentBehaviorScore}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg">Aging Report</CardTitle>
              <CardDescription>Breakdown of outstanding balance by age</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 border border-neutral-100 dark:border-neutral-800 rounded-lg text-center bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">Current</div>
                    <div className="text-lg font-semibold text-neutral-900 dark:text-white">{formatCurrency(customer.aging.current, customer.currency)}</div>
                  </div>
                  <div className="p-4 border border-amber-100 dark:border-amber-900/30 rounded-lg text-center bg-amber-50/50 dark:bg-amber-900/10">
                    <div className="text-xs font-medium text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">1-30 Days</div>
                    <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">{formatCurrency(customer.aging.days30, customer.currency)}</div>
                  </div>
                  <div className="p-4 border border-orange-100 dark:border-orange-900/30 rounded-lg text-center bg-orange-50/50 dark:bg-orange-900/10">
                    <div className="text-xs font-medium text-orange-600 dark:text-orange-500 uppercase tracking-wider mb-1">31-60 Days</div>
                    <div className="text-lg font-semibold text-orange-700 dark:text-orange-400">{formatCurrency(customer.aging.days60, customer.currency)}</div>
                  </div>
                  <div className="p-4 border border-red-100 dark:border-red-900/30 rounded-lg text-center bg-red-50/50 dark:bg-red-900/10">
                    <div className="text-xs font-medium text-red-600 dark:text-red-500 uppercase tracking-wider mb-1">61-90 Days</div>
                    <div className="text-lg font-semibold text-red-700 dark:text-red-400">{formatCurrency(customer.aging.days90, customer.currency)}</div>
                  </div>
                  <div className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg text-center bg-red-100 dark:bg-red-900/20">
                    <div className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">90+ Days</div>
                    <div className="text-lg font-bold text-red-800 dark:text-red-300">{formatCurrency(customer.aging.over90, customer.currency)}</div>
                  </div>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ledger" className="mt-0">
          <Card className="shadow-sm rounded-xl overflow-hidden border-none outline outline-1 outline-neutral-200 dark:outline-neutral-800">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900">
              <div>
                <CardTitle className="text-lg">Smart Ledger</CardTitle>
                <CardDescription>Running balance of all transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2 rounded-lg">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
            {customer.ledger && customer.ledger.length > 0 ? (
              <DataTable columns={ledgerColumns} data={customer.ledger} searchKey="reference" searchPlaceholder="Search by ref or description..." />
            ) : (
              <div className="p-12 text-center text-neutral-500">No ledger transactions found.</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-0">
          <div className="flex justify-end mb-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Upload Document</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.documents && customer.documents.length > 0 ? customer.documents.map(doc => (
              <Card key={doc.id} className="shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex items-center justify-center shrink-0 ${
                    doc.type === 'Contract' ? 'bg-purple-100 text-purple-600' :
                    doc.type === 'Tax Form' ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-white truncate">{doc.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-neutral-400">
                      Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full p-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                <File className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-neutral-900 dark:text-white">No documents uploaded</h3>
                <p className="text-xs text-neutral-500 mt-1">Upload KYC documents, contracts, or tax forms.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
