import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Receipt,
  Save,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  PoundSterling,
  FileText
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FPNTab = ({ caseData, canEdit, onUpdate }) => {
  const [fpnDetails, setFpnDetails] = useState({
    fpn_ref: '',
    date_issued: '',
    fpn_amount: '',
    paid: false,
    date_paid: '',
    pay_reference: ''
  });
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (caseData?.fpn_details) {
      setFpnDetails({
        fpn_ref: caseData.fpn_details.fpn_ref || '',
        date_issued: caseData.fpn_details.date_issued || '',
        fpn_amount: caseData.fpn_details.fpn_amount || '',
        paid: caseData.fpn_details.paid || false,
        date_paid: caseData.fpn_details.date_paid || '',
        pay_reference: caseData.fpn_details.pay_reference || ''
      });
    }
  }, [caseData?.fpn_details]);

  const handleFieldChange = (field, value) => {
    setFpnDetails(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/cases/${caseData.id}`, {
        fpn_details: {
          ...fpnDetails,
          fpn_amount: fpnDetails.fpn_amount ? parseFloat(fpnDetails.fpn_amount) : null
        }
      });
      toast.success('FPN details saved successfully');
      setHasChanges(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to save FPN details');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  return (
    <Card className="border">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Fixed Penalty Notice
          </CardTitle>
          <CardDescription>
            FPN details and payment status for this case
          </CardDescription>
        </div>
        {canEdit && hasChanges && (
          <Button
            onClick={handleSave}
            className="bg-[#005EA5] hover:bg-[#004F8C]"
            disabled={saving}
            data-testid="save-fpn-btn"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Status Summary */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {fpnDetails.paid ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-green-700">FPN Paid</p>
                <p className="text-sm text-green-600">
                  {fpnDetails.date_paid && `Paid on ${new Date(fpnDetails.date_paid).toLocaleDateString('en-GB')}`}
                  {fpnDetails.pay_reference && ` • Ref: ${fpnDetails.pay_reference}`}
                </p>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-800">
                {formatCurrency(fpnDetails.fpn_amount)}
              </Badge>
            </>
          ) : (
            <>
              <XCircle className="w-8 h-8 text-amber-600" />
              <div>
                <p className="font-medium text-amber-700">FPN Outstanding</p>
                <p className="text-sm text-amber-600">
                  {fpnDetails.date_issued && `Issued on ${new Date(fpnDetails.date_issued).toLocaleDateString('en-GB')}`}
                </p>
              </div>
              <Badge className="ml-auto bg-amber-100 text-amber-800">
                {formatCurrency(fpnDetails.fpn_amount)} Due
              </Badge>
            </>
          )}
        </div>

        <Separator />

        {/* FPN Details Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fpn_ref" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              FPN Reference
            </Label>
            <Input
              id="fpn_ref"
              placeholder="e.g., FPN-2024-001234"
              value={fpnDetails.fpn_ref}
              onChange={(e) => handleFieldChange('fpn_ref', e.target.value)}
              disabled={!canEdit}
              data-testid="fpn-ref-input"
              className={!canEdit ? 'bg-gray-50' : ''}
            />
            <p className="text-xs text-[#505A5F]">External paper-based reference number</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_issued" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Issued
            </Label>
            <Input
              id="date_issued"
              type="date"
              value={fpnDetails.date_issued}
              onChange={(e) => handleFieldChange('date_issued', e.target.value)}
              disabled={!canEdit}
              data-testid="fpn-date-issued"
              className={!canEdit ? 'bg-gray-50' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fpn_amount" className="flex items-center gap-2">
              <PoundSterling className="w-4 h-4" />
              FPN Amount (£)
            </Label>
            <Input
              id="fpn_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 150.00"
              value={fpnDetails.fpn_amount}
              onChange={(e) => handleFieldChange('fpn_amount', e.target.value)}
              disabled={!canEdit}
              data-testid="fpn-amount-input"
              className={!canEdit ? 'bg-gray-50' : ''}
            />
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg h-10">
              <Checkbox
                id="fpn_paid"
                checked={fpnDetails.paid}
                onCheckedChange={(checked) => handleFieldChange('paid', checked)}
                disabled={!canEdit}
                data-testid="fpn-paid-checkbox"
              />
              <label 
                htmlFor="fpn_paid" 
                className="text-sm font-medium cursor-pointer select-none"
              >
                FPN Paid
              </label>
            </div>
          </div>
        </div>

        {/* Payment Details - shown when paid is checked */}
        {fpnDetails.paid && (
          <>
            <Separator />
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-800 mb-4">Payment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date_paid">Date Paid</Label>
                  <Input
                    id="date_paid"
                    type="date"
                    value={fpnDetails.date_paid}
                    onChange={(e) => handleFieldChange('date_paid', e.target.value)}
                    disabled={!canEdit}
                    data-testid="fpn-date-paid"
                    className={!canEdit ? 'bg-green-100' : 'bg-white'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay_reference">Payment Reference</Label>
                  <Input
                    id="pay_reference"
                    placeholder="e.g., TXN-123456"
                    value={fpnDetails.pay_reference}
                    onChange={(e) => handleFieldChange('pay_reference', e.target.value)}
                    disabled={!canEdit}
                    data-testid="fpn-pay-ref"
                    className={!canEdit ? 'bg-green-100' : 'bg-white'}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Helpful Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> FPN details entered here are for record-keeping purposes. 
            The actual FPN is issued via the council&apos;s paper-based system. 
            Update the payment status once payment has been received and processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FPNTab;
