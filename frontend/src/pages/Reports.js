import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Download,
  BarChart3,
  FileText,
  Users,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const [statsRes, workloadRes] = await Promise.all([
        axios.get(`${API}/stats/overview`),
        axios.get(`${API}/stats/officer-workload`)
      ]);
      setStats(statsRes.data);
      setWorkload(workloadRes.data);
    } catch (error) {
      toast.error('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate.toISOString());
      if (endDate) params.append('end_date', endDate.toISOString());

      const response = await axios.get(`${API}/stats/export-csv?${params.toString()}`);
      
      // Create blob and download
      const blob = new Blob([response.data.csv_data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Export downloaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const getCaseTypeLabel = (type) => {
    const labels = {
      fly_tipping: 'Fly Tipping',
      abandoned_vehicle: 'Abandoned Vehicle',
      littering: 'Littering',
      dog_fouling: 'Dog Fouling',
      pspo_dog_control: 'PSPO Dog Control'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="reports-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B0C0C]">Reports</h1>
          <p className="text-[#505A5F] mt-1">
            Case statistics and data exports
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-sm flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#005EA5]" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[#0B0C0C]">
                  {stats?.total_cases || 0}
                </p>
                <p className="text-xs text-[#505A5F]">Total Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-sm flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[#0B0C0C]">
                  {stats?.open_cases || 0}
                </p>
                <p className="text-xs text-[#505A5F]">Open Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-sm flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[#0B0C0C]">
                  {stats?.closed_cases || 0}
                </p>
                <p className="text-xs text-[#505A5F]">Closed Cases</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-sm flex items-center justify-center">
                <Users className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-[#0B0C0C]">
                  {stats?.unassigned_cases || 0}
                </p>
                <p className="text-xs text-[#505A5F]">Unassigned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cases by Type */}
      <Card className="border">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Cases by Type</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case Type</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(stats?.cases_by_type || {}).map(([type, count]) => {
                const percentage = stats?.total_cases > 0 
                  ? ((count / stats.total_cases) * 100).toFixed(1)
                  : 0;
                return (
                  <TableRow key={type}>
                    <TableCell className="font-medium">{getCaseTypeLabel(type)}</TableCell>
                    <TableCell className="text-right font-mono">{count}</TableCell>
                    <TableCell className="text-right text-[#505A5F]">{percentage}%</TableCell>
                  </TableRow>
                );
              })}
              {Object.keys(stats?.cases_by_type || {}).length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-[#505A5F] py-8">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Officer Workload */}
      <Card className="border">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Officer Workload</CardTitle>
          <CardDescription>Cases assigned to each team member</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Officer</TableHead>
                <TableHead className="text-right">Total Assigned</TableHead>
                <TableHead className="text-right">Open</TableHead>
                <TableHead className="text-right">Closed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workload.map((officer) => (
                <TableRow key={officer._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#F3F2F1] rounded-full flex items-center justify-center">
                        <span className="text-xs">
                          {officer.assigned_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {officer.assigned_name || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{officer.total}</TableCell>
                  <TableCell className="text-right font-mono text-amber-600">{officer.open}</TableCell>
                  <TableCell className="text-right font-mono text-green-600">{officer.closed}</TableCell>
                </TableRow>
              ))}
              {workload.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-[#505A5F] py-8">
                    No workload data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card className="border">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Export Data</CardTitle>
          <CardDescription>Download case data as CSV for reporting and audits</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="space-y-2">
              <Label className="text-xs text-[#505A5F]">Start Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start" data-testid="start-date-picker">
                    <Calendar className="w-4 h-4 mr-2" />
                    {startDate ? format(startDate, 'dd/MM/yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[#505A5F]">End Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start" data-testid="end-date-picker">
                    <Calendar className="w-4 h-4 mr-2" />
                    {endDate ? format(endDate, 'dd/MM/yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              onClick={handleExportCSV}
              className="bg-[#005EA5] hover:bg-[#004F8C]"
              disabled={exporting}
              data-testid="export-csv-btn"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-[#505A5F] mt-4">
            Leave dates empty to export all cases. CSV exports include: reference number, case type, status, description, assigned officer, and dates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
