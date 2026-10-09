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
      className: 'bg-[#18A66A]/15 text-[#18A66A] border-[#18A66A]/30 dark:bg-[#18A66A]/20 dark:text-[#34D399] dark:border-[#18A66A]/40 font-semibold',
    },
    reschedule: {
      label: t?.statusReschedule || 'RESCHEDULE',
      icon: Clock,
      className: 'bg-[#D99A24]/15 text-[#D99A24] border-[#D99A24]/30 dark:bg-[#D99A24]/20 dark:text-[#FBBF24] dark:border-[#D99A24]/40 font-semibold',
    },
    protect: {
      label: t?.statusProtect || 'PROTECT',
      icon: ShieldAlert,
      className: 'bg-[#2F80ED]/15 text-[#2F80ED] border-[#2F80ED]/30 dark:bg-[#2F80ED]/20 dark:text-[#60A5FA] dark:border-[#2F80ED]/40 font-semibold',
    },
    restricted: {
      label: t?.statusRestricted || 'RESTRICTED',
      icon: AlertOctagon,
      className: 'bg-[#D94A4A]/15 text-[#D94A4A] border-[#D94A4A]/30 dark:bg-[#D94A4A]/20 dark:text-[#F87171] dark:border-[#D94A4A]/40 font-semibold',
    },
    manual_review: {
      label: t?.statusManualReview || 'MANUAL REVIEW',
      icon: HelpCircle,
      className: 'bg-[#6D28D9]/15 text-[#6D28D9] border-[#6D28D9]/30 dark:bg-[#6D28D9]/20 dark:text-[#C084FC] dark:border-[#6D28D9]/40 font-semibold',
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
