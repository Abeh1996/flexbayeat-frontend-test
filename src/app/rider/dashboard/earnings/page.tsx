// src/app/rider/dashboard/earnings/page.tsx
'use client';
import React, { useState } from 'react';
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Banknote,
} from 'lucide-react';
import { useRiderProfileQuery } from '@/features/Rider/hooks/useRiderProfileQuery';
import {
  useEarningsSummaryQuery,
  useEarningsHistoryQuery,
  usePayoutsQuery,
} from '@/features/Rider/hooks/useRiderEarningsQuery';
import { useRiderMutation } from '@/features/Rider/hooks/useRiderMutation';
import { formatXAF } from '@/features/Rider/utils/format';
import {
  RiderBreadcrumbs,
  RiderPageHeader,
  RiderStatTile,
  RiderBadge,
  RiderBtn,
  RiderModal,
  RiderCardSkeleton,
  RiderSkeleton,
} from '@/features/Rider/components/RiderUI';

const PAYOUT_BADGE = {
  PENDING: { label: 'Pending', variant: 'warning' as const },
  PROCESSING: { label: 'Processing', variant: 'info' as const },
  COMPLETED: { label: 'Completed', variant: 'success' as const },
  FAILED: { label: 'Failed', variant: 'danger' as const },
};

const EARNINGS_BADGE = {
  PENDING: { label: 'Pending', variant: 'warning' as const },
  SETTLED: { label: 'Settled', variant: 'success' as const },
  CANCELLED: { label: 'Cancelled', variant: 'danger' as const },
};

function payoutBadge(status: string | undefined) {
  return status
    ? PAYOUT_BADGE[status as keyof typeof PAYOUT_BADGE] ?? { label: status, variant: 'default' as const }
    : { label: '—', variant: 'default' as const };
}

function earningsBadge(status: string | undefined) {
  return status
    ? EARNINGS_BADGE[status as keyof typeof EARNINGS_BADGE] ?? { label: status, variant: 'default' as const }
    : { label: '—', variant: 'default' as const };
}

export default function EarningsPage() {
  const { riderProfile } = useRiderProfileQuery();
  const { data: summary, isLoading: loadingSummary } = useEarningsSummaryQuery();
  const { data: earningsHistory, isLoading: loadingHistory } = useEarningsHistoryQuery();
  const { data: payouts, isLoading: loadingPayouts } = usePayoutsQuery();
  const [payoutModal, setPayoutModal] = useState(false);

  const walletBalance = riderProfile?.wallet?.balance
    ? formatXAF(riderProfile.wallet.balance)
    : '—';

  const isLoading = loadingSummary || loadingHistory || loadingPayouts;

  return (
    <div>
      <RiderBreadcrumbs
        crumbs={[
          { label: 'Dashboard', href: '/rider/dashboard' },
          { label: 'Earnings' },
        ]}
      />
      <RiderPageHeader
        title="Earnings"
        description="Your delivery income and payout history"
        actions={
          <RiderBtn variant="primary" icon={Wallet} onClick={() => setPayoutModal(true)}>
            Request Payout
          </RiderBtn>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {isLoading ? (
          <>
            <RiderCardSkeleton />
            <RiderCardSkeleton />
            <RiderCardSkeleton />
            <RiderCardSkeleton />
          </>
        ) : (
          <>
            <RiderStatTile
              label="Total Earned"
              value={summary?.totalEarned ? formatXAF(summary.totalEarned) : walletBalance}
              icon={TrendingUp}
            />
            <RiderStatTile
              label="Wallet Balance"
              value={walletBalance}
              icon={Wallet}
            />
            <RiderStatTile
              label="Pending"
              value={summary?.totalPending ? formatXAF(summary.totalPending) : '—'}
              icon={Clock}
            />
            <RiderStatTile
              label="Paid Out"
              value={summary?.totalPaidOut ? formatXAF(summary.totalPaidOut) : '—'}
              icon={Banknote}
            />
          </>
        )}
      </div>

      {/* Period breakdown */}
      {summary && (summary.daily || summary.weekly || summary.monthly) && (
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {summary.daily && (
            <div className="bg-white border border-zinc-200/70 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Today
              </p>
              <p className="text-base font-semibold text-zinc-900 mt-1">
                {formatXAF(summary.daily.amount ?? 0)}
              </p>
              {summary.daily.count != null && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {summary.daily.count} delivery{summary.daily.count !== 1 ? 'ies' : 'y'}
                </p>
              )}
            </div>
          )}
          {summary.weekly && (
            <div className="bg-white border border-zinc-200/70 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                This Week
              </p>
              <p className="text-base font-semibold text-zinc-900 mt-1">
                {formatXAF(summary.weekly.amount ?? 0)}
              </p>
              {summary.weekly.count != null && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {summary.weekly.count} delivery{summary.weekly.count !== 1 ? 'ies' : 'y'}
                </p>
              )}
            </div>
          )}
          {summary.monthly && (
            <div className="bg-white border border-zinc-200/70 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                This Month
              </p>
              <p className="text-base font-semibold text-zinc-900 mt-1">
                {formatXAF(summary.monthly.amount ?? 0)}
              </p>
              {summary.monthly.count != null && (
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {summary.monthly.count} delivery{summary.monthly.count !== 1 ? 'ies' : 'y'}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Earnings history */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Recent Earnings
          </h2>
        </div>

        {loadingHistory ? (
          <div className="space-y-1.5">
            <RiderCardSkeleton />
            <RiderCardSkeleton />
            <RiderCardSkeleton />
          </div>
        ) : !earningsHistory || earningsHistory.length === 0 ? (
          <div className="bg-white border border-zinc-200/70 px-5 py-8 text-center">
            <DollarSign size={22} className="mx-auto text-zinc-300" />
            <p className="text-sm font-medium text-zinc-600 mt-2">No earnings yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Complete deliveries to see your earnings here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {earningsHistory.map((entry) => {
              const badge = earningsBadge(entry.status);
              return (
                <div
                  key={entry.id ?? Math.random()}
                  className="bg-white border border-zinc-200/70 px-4 py-2.5 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800">
                      {entry.description ?? entry.type ?? 'Delivery'}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {entry.createdAt
                        ? new Date(entry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RiderBadge variant={badge.variant}>{badge.label}</RiderBadge>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        entry.type === 'WITHDRAWAL'
                          ? 'text-red-500'
                          : 'text-emerald-600'
                      }`}
                    >
                      {entry.type === 'WITHDRAWAL' ? '-' : '+'}
                      {entry.amount ? formatXAF(entry.amount) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Payouts */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Payout History
          </h2>
        </div>

        {loadingPayouts ? (
          <div className="space-y-1.5">
            <RiderCardSkeleton />
          </div>
        ) : !payouts || payouts.length === 0 ? (
          <div className="bg-white border border-zinc-200/70 px-5 py-8 text-center">
            <Banknote size={22} className="mx-auto text-zinc-300" />
            <p className="text-sm font-medium text-zinc-600 mt-2">No payouts yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Request a payout when you&apos;ve accumulated earnings
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {payouts.map((p) => {
              const badge = payoutBadge(p.status);
              return (
                <div
                  key={p.id ?? Math.random()}
                  className="bg-white border border-zinc-200/70 px-4 py-2.5 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-800">
                      {p.reference ?? `Payout #${(p.id ?? '').slice(-6).toUpperCase() || '—'}`}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {p.requestedAt
                        ? new Date(p.requestedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : '—'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <RiderBadge variant={badge.variant}>{badge.label}</RiderBadge>
                    <span className="text-sm font-semibold text-zinc-800 tabular-nums">
                      {p.amount ? formatXAF(p.amount) : '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Payout request modal */}
      <PayoutRequestModal open={payoutModal} onClose={() => setPayoutModal(false)} />
    </div>
  );
}

function PayoutRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { requestPayout, isRequestingPayout } = useRiderMutation();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;
    requestPayout(
      { amount: num, note: note.trim() || undefined },
      { onSuccess: onClose },
    );
  };

  return (
    <RiderModal open={open} onClose={onClose} title="Request Payout" width="sm">
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
            Amount (XAF)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">
              CFA
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full pl-12 pr-3 py-2.5 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 placeholder:text-zinc-300"
              min={0}
              autoFocus
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 block">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Withdrawal request"
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-[2px] focus:outline-none focus:border-amber-500 transition-colors text-zinc-800 placeholder:text-zinc-400"
          />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <RiderBtn
            variant="primary"
            icon={Wallet}
            onClick={handleSubmit}
            loading={isRequestingPayout}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-1 justify-center"
          >
            Submit Request
          </RiderBtn>
          <RiderBtn variant="ghost" onClick={onClose}>
            Cancel
          </RiderBtn>
        </div>
      </div>
    </RiderModal>
  );
}