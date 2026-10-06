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
    bgLight: string;
    textLight: string;
    borderLight: string;
    bgDark: string;
    textDark: string;
    borderDark: string;
  }> = {
    continue: {
      label: t?.statusContinue || 'CONTINUE',
      icon: CheckCircle2,
      bgLight: 'bg-emerald-50',
      textLight: 'text-emerald-800',
      borderLight: 'border-emerald-300',
      bgDark: 'dark:bg-emerald-950/50',
      textDark: 'dark:text-emerald-300',
      borderDark: 'dark:border-emerald-800'
    },
    reschedule: {
      label: t?.statusReschedule || 'RESCHEDULE',
      icon: Clock,
      bgLight: 'bg-amber-50',
      textLight: 'text-amber-800',
      borderLight: 'border-amber-300',
      bgDark: 'dark:bg-amber-950/50',
      textDark: 'dark:text-amber-300',
      borderDark: 'dark:border-amber-800'
    },
    protect: {
      label: t?.statusProtect || 'PROTECT',
      icon: ShieldAlert,
      bgLight: 'bg-orange-50',
      textLight: 'text-orange-800',
      borderLight: 'border-orange-300',
      bgDark: 'dark:bg-orange-950/50',
      textDark: 'dark:text-orange-300',
      borderDark: 'dark:border-orange-800'
    },
    restricted: {
      label: t?.statusRestricted || 'RESTRICTED',
      icon: AlertOctagon,
      bgLight: 'bg-rose-50',
      textLight: 'text-rose-800',
      borderLight: 'border-rose-300',
      bgDark: 'dark:bg-rose-950/50',
      textDark: 'dark:text-rose-300',
      borderDark: 'dark:border-rose-800'
    },
    manual_review: {
      label: t?.statusManualReview || 'MANUAL REVIEW',
      icon: HelpCircle,
      bgLight: 'bg-purple-50',
      textLight: 'text-purple-800',
      borderLight: 'border-purple-300',
      bgDark: 'dark:bg-purple-950/50',
      textDark: 'dark:text-purple-300',
      borderDark: 'dark:border-purple-800'
    }
  };

  const config = configs[status] || configs.manual_review;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-3 py-1 gap-1.5 font-bold tracking-wide',
    lg: 'text-sm px-4 py-1.5 gap-2 font-bold tracking-wider'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <span 
      className={`inline-flex items-center rounded-full border shadow-xs transition-colors select-none ${sizeClasses} ${config.bgLight} ${config.textLight} ${config.borderLight} ${config.bgDark} ${config.textDark} ${config.borderDark}`}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showIcon && <IconComponent className={`${iconSizes} shrink-0 stroke-[2.5]`} />}
      <span>{config.label}</span>
    </span>
  );
}
