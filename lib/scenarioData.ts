import fraudHealthy from '@/data/scenarios/fraud-healthy.json';
import fraudFailed from '@/data/scenarios/fraud-failed.json';
import notificationsHealthy from '@/data/scenarios/notifications-healthy.json';
import notificationsFailed from '@/data/scenarios/notifications-failed.json';

export type ScenarioType = 'healthy' | 'failed';

export interface TimelineEvent {
  timestamp: string;
  displayTime: string;
  event: string;
  percentage: number;
  status: 'started' | 'success' | 'warning' | 'alert' | 'rollback' | 'recovered' | 'complete';
  metrics?: {
    errorRate?: number;
    latency?: number;
    successRate?: number;
    notificationVolume?: number;
    clientErrors?: number;
    displayLatency?: number;
  };
  alertMessage?: string;
}

export interface LogEntry {
  timestamp: string;
  displayTime: string;
  level: 'success' | 'error' | 'info';
  icon: string;
  message: string;
  errorCode?: string;
  occurrences?: number;
  affectedUsers?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  displayTime: string;
  type: 'info' | 'alert' | 'success' | 'warning';
  read?: boolean;
  duplicate?: boolean;
}

export interface ScenarioData {
  scenario: ScenarioType;
  featureName: string;
  rolloutDate: string;
  timeline: TimelineEvent[];
  logs?: LogEntry[];
  errors?: LogEntry[];
  notifications?: Notification[];
  spamNotifications?: Notification[];
  summary?: {
    totalDuration: string;
    usersAffected: number;
    errorsLogged?: number;
    averageSpamPerUser?: number;
    rollbackTime: string;
    impactContained: string;
  };
}

export function getFraudDetectionScenario(type: ScenarioType): ScenarioData {
  return type === 'failed' ? fraudFailed : fraudHealthy;
}

export function getNotificationCenterScenario(type: ScenarioType): ScenarioData {
  return type === 'failed' ? notificationsFailed : notificationsHealthy;
}

export function getScenarioByFlags(flags: {
  fraudDetectionHealthyRollout?: boolean;
  fraudDetectionFailedRollout?: boolean;
  notificationCenterHealthyRollout?: boolean;
  notificationCenterFailedRollout?: boolean;
}): {
  fraudDetection: { active: boolean; scenario: ScenarioType; data: ScenarioData } | null;
  notificationCenter: { active: boolean; scenario: ScenarioType; data: ScenarioData } | null;
} {
  let fraudDetection = null;
  let notificationCenter = null;

  // determine fraud detection scenario
  if (flags.fraudDetectionFailedRollout) {
    fraudDetection = {
      active: true,
      scenario: 'failed' as ScenarioType,
      data: getFraudDetectionScenario('failed'),
    };
  } else if (flags.fraudDetectionHealthyRollout) {
    fraudDetection = {
      active: true,
      scenario: 'healthy' as ScenarioType,
      data: getFraudDetectionScenario('healthy'),
    };
  }

  // determine notification center scenario
  if (flags.notificationCenterFailedRollout) {
    notificationCenter = {
      active: true,
      scenario: 'failed' as ScenarioType,
      data: getNotificationCenterScenario('failed'),
    };
  } else if (flags.notificationCenterHealthyRollout) {
    notificationCenter = {
      active: true,
      scenario: 'healthy' as ScenarioType,
      data: getNotificationCenterScenario('healthy'),
    };
  }

  return { fraudDetection, notificationCenter };
}

