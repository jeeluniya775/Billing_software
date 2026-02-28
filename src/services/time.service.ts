import { TimeEntry, Timesheet, ProjectTimeStats, AttendanceRecord, TimeSummary } from '@/types/time';
import { MOCK_TIME_ENTRIES, MOCK_TIMESHEETS, MOCK_PROJECT_STATS, MOCK_ATTENDANCE, MOCK_TIME_SUMMARY } from '@/lib/mock-time';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/time-entries
export async function getTimeEntries(filters?: any): Promise<TimeEntry[]> {
  await delay();
  let entries = [...MOCK_TIME_ENTRIES];
  // Simple filter simulation
  if (filters?.employeeId) entries = entries.filter(e => e.employeeId === filters.employeeId);
  return entries;
}

// POST /api/time-entries
export async function createTimeEntry(entry: Partial<TimeEntry>): Promise<TimeEntry> {
  await delay(800);
  const newEntry: TimeEntry = {
    ...MOCK_TIME_ENTRIES[0],
    ...entry,
    id: `TIME-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    status: 'Completed',
  } as TimeEntry;
  console.log('API POST /api/time-entries', newEntry);
  return newEntry;
}

// GET /api/timesheets
export async function getTimesheets(employeeId?: string): Promise<Timesheet[]> {
  await delay();
  if (employeeId) return MOCK_TIMESHEETS.filter(t => t.employeeId === employeeId);
  return MOCK_TIMESHEETS;
}

// POST /api/timesheets/submit
export async function submitTimesheet(id: string): Promise<Timesheet> {
  await delay(1000);
  const ts = MOCK_TIMESHEETS.find(t => t.id === id) || MOCK_TIMESHEETS[0];
  return { ...ts, status: 'Submitted', submittedAt: new Date().toISOString() };
}

// PUT /api/timesheets/:id/approve
export async function approveTimesheet(id: string, notes?: string): Promise<Timesheet> {
  await delay(800);
  const ts = MOCK_TIMESHEETS.find(t => t.id === id) || MOCK_TIMESHEETS[0];
  return { ...ts, status: 'Approved', approvedAt: new Date().toISOString(), approvedBy: 'Admin User' };
}

// GET /api/time/analytics
export async function getSummary(): Promise<TimeSummary> {
  await delay();
  return MOCK_TIME_SUMMARY;
}

// GET /api/projects/time-stats
export async function getProjectTimeStats(): Promise<ProjectTimeStats[]> {
  await delay();
  return MOCK_PROJECT_STATS;
}

// GET /api/attendance
export async function getAttendance(employeeId: string, dateRange?: any): Promise<AttendanceRecord[]> {
  await delay();
  return MOCK_ATTENDANCE;
}
