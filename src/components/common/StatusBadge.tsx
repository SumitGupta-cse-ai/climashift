import React from 'react';
import { OperationalStatus } from '@/types';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, Clock, ShieldAlert, AlertOctagon, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: OperationalStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const { t } = useApp();

  const configs: Record<OperationalStatus, {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }> = {
    continue: {
      label: t?.statusContinue || 'CONTINUE',
      icon: CheckCircle2,
      className: 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC] dark:bg-[#064E3B] dark:text-[#4ADE80] dark:border-[#047857] font-bold shadow-xs',
    },
    reschedule: {
      label: t?.statusReschedule || 'RESCHEDULE',
      icon: Clock,
      className: 'bg-[#FEF9C3] text-[#854D0E] border-[#FDE047] dark:bg-[#422006] dark:text-[#FACC15] dark:border-[#A16207] font-bold shadow-xs',
    },
    protect: {
      label: t?.statusProtect || 'PROTECT',
      icon: ShieldAlert,
      className: 'bg-[#EFF6FF] text-[#1E40AF] border-[#93C5FD] dark:bg-[#1E3A8A] dark:text-[#93C5FD] dark:border-[#3B82F6] font-bold shadow-xs',
    },
    restricted: {
      label: t?.statusRestricted || 'RESTRICTED',
      icon: AlertOctagon,
      className: 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5] dark:bg-[#451A1A] dark:text-[#F87171] dark:border-[#991B1B] font-bold shadow-xs',
    },
    manual_review: {
      label: t?.statusManualReview || 'MANUAL REVIEW',
      icon: HelpCircle,
      className: 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE] dark:bg-[#3B0764] dark:text-[#D8B4FE] dark:border-[#7E22CE] font-bold shadow-xs',
    }
  };

  const config = configs[status] || configs.manual_review;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-semibold rounded',
    md: 'text-xs px-2.5 py-0.5 gap-1.5 font-medium rounded-md',
    lg: 'text-xs px-3 py-1 gap-2 font-semibold rounded-md'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span 
      className={`inline-flex items-center border select-none leading-none tracking-tight ${sizeClasses} ${config.className}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && <IconComponent className={`${iconSizes} shrink-0 stroke-[2]`} />}
      <span>{config.label}</span>
    </span>
  );
}
