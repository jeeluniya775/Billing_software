import { api } from './api';
import { TimeEntry, Timesheet, ProjectTimeStats, AttendanceRecord, TimeSummary } from '@/types/time';

// GET /time/entries
export async function getTimeEntries(filters?: any): Promise<TimeEntry[]> {
  const response = await api.get('/time/entries');
  return response.data;
}

// POST /time/entries
export async function createTimeEntry(entry: Partial<TimeEntry>): Promise<TimeEntry> {
  const response = await api.post('/time/entries', entry);
  return response.data;
}

// GET /time/summary
export async function getSummary(): Promise<TimeSummary> {
  const response = await api.get('/time/summary');
  return response.data;
}

// GET /api/timesheets (Mocked for now)
export async function getTimesheets(employeeId?: string): Promise<Timesheet[]> {
  return [];
}

export async function submitTimesheet(id: string): Promise<Timesheet> {
  return {} as Timesheet;
}

export async function approveTimesheet(id: string, notes?: string): Promise<Timesheet> {
  return {} as Timesheet;
}

// GET /api/projects/time-stats (Mocked for now)
export async function getProjectTimeStats(): Promise<ProjectTimeStats[]> {
  return [];
}

// GET /api/attendance (Mocked for now)
export async function getAttendance(employeeId: string, dateRange?: any): Promise<AttendanceRecord[]> {
  return [];
}
