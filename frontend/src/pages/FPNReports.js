import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  PoundSterling,
  Calendar,
  FileText,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FPNReports = () => {
  const [stats, setStats] = useState(null);
  const [outstanding, setOutstanding] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: ''
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);
      
      const [statsRes, outstandingRes] = await Promise.all([
        axios.get(`${API}/stats/fpn?${params.toString()}`),
        axios.get(`${API}/stats/fpn/outstanding`)
      ]);
      
      setStats(statsRes.data);
      setOutstanding(outstandingRes.data);
    } catch (error) {
      toast.error('Failed to fetch FPN statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExportCSV = async () => {
    try {
      const response = await axios.get(`${API}/stats/fpn/export-csv`);
      const blob = new Blob([response.data.csv_data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.data.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('FPN data exported successfully');
    } catch (error) {
      toast.error('Failed to export FPN data');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '£0.00';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const getCaseTypeLabel = (type) => {
    const labels = {
      fly_tipping: 'Fly Tipping',
      fly_tipping_private: 'Fly Tipping (Private)',
      fly_tipping_organised: 'Fly Tipping (Organised)',
      abandoned_vehicle: 'Abandoned Vehicle',
      nuisance_vehicle: 'Nuisance Vehicle',
      littering: 'Littering',
      dog_fouling: 'Dog Fouling',
      pspo_dog_control: 'PSPO Dog Control'
    };
    return labels[type] || type?.replace(/_/g, ' ');
  };

  const getUrgencyBadge = (days) => {
    if (days === null || days === undefined) return null;
    if (days > 28) {
      return <Badge className="bg-red-100 text-red-800">Overdue ({days} days)</Badge>;
    } else if (days > 14) {
      return <Badge className="bg-amber-100 text-amber-800">{days} days</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">{days} days</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="fpn-reports-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B0C0C]">FPN Reports</h1>
          <p className="text-[#505A5F] mt-1">
            Fixed Penalty Notice statistics and tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} data-testid="refresh-btn">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleExportCSV}
            className="bg-[#005EA5] hover:bg-[#004F8C]"
            data-testid="export-fpn-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="border">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-[#505A5F]">From Date</Label>
              <Input
                type="date"
                value={dateRange.start_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                className="w-40"
                data-testid="start-date-filter"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[#505A5F]">To Date</Label>
              <Input
                type="date"
                value={dateRange.end_date}
                onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                className="w-40"
                data-testid="end-date-filter"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setDateRange({ start_date: '', end_date: '' })}
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#505A5F]">Total FPNs Issued</p>
                <p className="text-2xl font-bold text-[#0B0C0C]">{stats?.summary?.total_fpns || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#505A5F]">Paid FPNs</p>
                <p className="text-2xl font-bold text-green-600">{stats?.summary?.paid_fpns || 0}</p>
                <p className="text-xs text-[#505A5F]">{formatCurrency(stats?.summary?.total_collected)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-[#505A5F]">Outstanding</p>
                <p className="text-2xl font-bold text-amber-600">{stats?.summary?.outstanding_fpns || 0}</p>
                <p className="text-xs text-[#505A5F]">{formatCurrency(stats?.summary?.total_outstanding)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-[#505A5F]">Payment Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats?.summary?.payment_rate || 0}%</p>
                <Progress 
                  value={stats?.summary?.payment_rate || 0} 
                  className="h-2 mt-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="border bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <PoundSterling className="w-8 h-8 text-[#005EA5]" />
              <div>
                <p className="text-sm text-[#505A5F]">Total Amount Due</p>
                <p className="text-3xl font-bold text-[#0B0C0C]">
                  {formatCurrency(stats?.summary?.total_amount_due)}
                </p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-sm text-[#505A5F]">Collected</p>
                <p className="text-xl font-semibold text-green-600">
                  {formatCurrency(stats?.summary?.total_collected)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#505A5F]">Outstanding</p>
                <p className="text-xl font-semibold text-amber-600">
                  {formatCurrency(stats?.summary?.total_outstanding)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="outstanding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="outstanding" data-testid="outstanding-tab">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Outstanding FPNs ({outstanding.length})
          </TabsTrigger>
          <TabsTrigger value="by-type" data-testid="by-type-tab">
            <FileText className="w-4 h-4 mr-2" />
            By Case Type
          </TabsTrigger>
        </TabsList>

        {/* Outstanding FPNs Tab */}
        <TabsContent value="outstanding">
          <Card className="border">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Outstanding FPNs</CardTitle>
              <CardDescription>
                FPNs awaiting payment, sorted by date issued (oldest first)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {outstanding.length === 0 ? (
                <div className="p-8 text-center text-[#505A5F]">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p>No outstanding FPNs</p>
                  <p className="text-sm">All issued FPNs have been paid</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Ref</TableHead>
                      <TableHead>FPN Ref</TableHead>
                      <TableHead>Case Type</TableHead>
                      <TableHead>Date Issued</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Days Outstanding</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outstanding.map((fpn) => (
                      <TableRow key={fpn.id} data-testid={`outstanding-row-${fpn.id}`}>
                        <TableCell className="font-medium">{fpn.reference_number}</TableCell>
                        <TableCell>{fpn.fpn_details?.fpn_ref || '—'}</TableCell>
                        <TableCell>{getCaseTypeLabel(fpn.case_type)}</TableCell>
                        <TableCell>
                          {fpn.fpn_details?.date_issued 
                            ? new Date(fpn.fpn_details.date_issued).toLocaleDateString('en-GB')
                            : '—'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(fpn.fpn_details?.fpn_amount)}
                        </TableCell>
                        <TableCell>
                          {getUrgencyBadge(fpn.days_outstanding)}
                        </TableCell>
                        <TableCell className="text-[#505A5F]">
                          {fpn.assigned_to_name || 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Link to={`/cases/${fpn.id}`}>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Case Type Tab */}
        <TabsContent value="by-type">
          <Card className="border">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">FPNs by Case Type</CardTitle>
              <CardDescription>
                Breakdown of FPNs issued by case type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {!stats?.by_case_type || Object.keys(stats.by_case_type).length === 0 ? (
                <div className="p-8 text-center text-[#505A5F]">
                  <Receipt className="w-12 h-12 mx-auto mb-3 text-[#B1B4B6]" />
                  <p>No FPN data available</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case Type</TableHead>
                      <TableHead className="text-right">FPNs Issued</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Payment Rate</TableHead>
                      <TableHead className="text-right">Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(stats.by_case_type).map(([type, data]) => (
                      <TableRow key={type}>
                        <TableCell className="font-medium">{getCaseTypeLabel(type)}</TableCell>
                        <TableCell className="text-right">{data.count}</TableCell>
                        <TableCell className="text-right text-green-600">{data.paid}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {data.count > 0 ? Math.round((data.paid / data.count) * 100) : 0}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(data.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FPNReports;
