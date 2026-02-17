export interface DashboardSummary {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  pausedCount: number;
  cancelledCount: number;
  urgentCount: number;
  highPriorityCount: number;
  dueSoonCount: number;
  overdueCount: number;
}

export interface RecentWorkOrder {
  id: number;
  workOrderNo: string;
  productName: string;
  companyName: string;
  status: string;
  priority: string;
  dueDate: string;
  progress: number;
}

export interface StatusStat {
  status: string;
  label: string;
  count: number;
}
