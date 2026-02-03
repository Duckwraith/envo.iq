import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Trash2 } from 'lucide-react';

// Required field indicator
const RequiredLabel = ({ children, required = false }) => (
  <Label className="flex items-center gap-1">
    {children}
    {required && <span className="text-red-500">*</span>}
  </Label>
);

// Field configurations
const WASTE_TYPES = [
  { value: 'household', label: 'Household Waste' },
  { value: 'commercial', label: 'Commercial Waste' },
  { value: 'construction', label: 'Construction Waste' },
  { value: 'mixed', label: 'Mixed Waste' },
  { value: 'unknown', label: 'Unknown' },
];

const VEHICLE_CONDITIONS = [
  { value: 'good', label: 'Good Condition' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'vandalised', label: 'Vandalised' },
  { value: 'burnt_out', label: 'Burnt Out' },
  { value: 'unknown', label: 'Unknown' },
];

const LITTER_TYPES = [
  { value: 'cigarette_end', label: 'Cigarette End' },
  { value: 'food_packaging', label: 'Food Packaging' },
  { value: 'general_waste', label: 'General Waste' },
  { value: 'other', label: 'Other' },
];

const PSPO_BREACH_TYPES = [
  { value: 'dogs_off_lead', label: 'Dogs Off Lead' },
  { value: 'dog_exclusion_zone', label: 'Dog Exclusion Zone' },
  { value: 'failure_to_pick_up', label: 'Failure to Pick Up' },
  { value: 'exceeding_dog_limit', label: 'Exceeding Dog Limit' },
  { value: 'other', label: 'Other' },
];

const YES_NO_UNKNOWN = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Unknown' },
];

const NUISANCE_TYPES = [
  { value: 'on_street_seller', label: 'On-Street Seller' },
  { value: 'parking', label: 'Parking-Related' },
  { value: 'asb', label: 'ASB-Linked Vehicle' },
];

const LAND_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'public', label: 'Public Land' },
  { value: 'industrial', label: 'Industrial' },
];

const LICENSE_STATUS = [
  { value: 'valid', label: 'Valid' },
  { value: 'expired', label: 'Expired' },
  { value: 'none', label: 'No License' },
  { value: 'unknown', label: 'Unknown' },
];

// Fly Tipping Fields Component
export const FlyTippingFields = ({ data, onChange, readOnly = false, hasEvidence = false }) => {
  const fields = data?.fly_tipping || {};
  
  const updateField = (field, value) => {
    onChange({
      ...data,
      fly_tipping: { ...fields, [field]: value }
    });
  };

  const updateVehicleField = (field, value) => {
    onChange({
      ...data,
      fly_tipping: {
        ...fields,
        vehicle_details: { ...(fields.vehicle_details || {}), [field]: value }
      }
    });
  };

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          Fly Tipping Details
          <span className="text-xs font-normal text-[#505A5F]">(Environmental Protection Act 1990)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <RequiredLabel required>Description of Waste</RequiredLabel>
          <Textarea
            placeholder="Describe the waste found..."
            value={fields.waste_description || ''}
            onChange={(e) => updateField('waste_description', e.target.value)}
            disabled={readOnly}
            data-testid="fly-tipping-waste-description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Estimated Quantity/Size</Label>
            <Input
              placeholder="e.g., 2 cubic metres, 10 bags"
              value={fields.estimated_quantity || ''}
              onChange={(e) => updateField('estimated_quantity', e.target.value)}
              disabled={readOnly}
              data-testid="fly-tipping-quantity"
            />
          </div>
          <div className="space-y-2">
            <Label>Waste Type</Label>
            <Select value={fields.waste_type || ''} onValueChange={(v) => updateField('waste_type', v)} disabled={readOnly}>
              <SelectTrigger data-testid="fly-tipping-waste-type">
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                {WASTE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Label>Were any offenders witnessed or identified?</Label>
          <Switch
            checked={fields.offender_witnessed || false}
            onCheckedChange={(v) => updateField('offender_witnessed', v)}
            disabled={readOnly}
            data-testid="fly-tipping-offender-witnessed"
          />
        </div>

        {fields.offender_witnessed && (
          <div className="space-y-4 pl-4 border-l-2 border-blue-200">
            <div className="space-y-2">
              <Label>Offender Description</Label>
              <Textarea
                placeholder="Describe the offender(s)..."
                value={fields.offender_description || ''}
                onChange={(e) => updateField('offender_description', e.target.value)}
                disabled={readOnly}
                data-testid="fly-tipping-offender-description"
              />
            </div>
            <p className="text-sm font-medium text-[#505A5F]">Vehicle Details (if applicable)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">Registration</Label>
                <Input placeholder="e.g., AB12 CDE" value={fields.vehicle_details?.registration_number || ''} onChange={(e) => updateVehicleField('registration_number', e.target.value.toUpperCase())} disabled={readOnly} data-testid="fly-tipping-vehicle-reg" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Make</Label>
                <Input placeholder="e.g., Ford" value={fields.vehicle_details?.make || ''} onChange={(e) => updateVehicleField('make', e.target.value)} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Model</Label>
                <Input placeholder="e.g., Transit" value={fields.vehicle_details?.model || ''} onChange={(e) => updateVehicleField('model', e.target.value)} disabled={readOnly} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Colour</Label>
                <Input placeholder="e.g., White" value={fields.vehicle_details?.colour || ''} onChange={(e) => updateVehicleField('colour', e.target.value)} disabled={readOnly} />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Any identifying evidence found?</Label>
          <Textarea
            placeholder="Describe any evidence that may identify the source..."
            value={fields.identifying_evidence || ''}
            onChange={(e) => updateField('identifying_evidence', e.target.value)}
            disabled={readOnly}
            data-testid="fly-tipping-evidence"
          />
        </div>

        {!hasEvidence && (
          <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-sm">
            <Checkbox
              id="no-evidence"
              checked={fields.no_evidence_available || false}
              onCheckedChange={(checked) => updateField('no_evidence_available', checked)}
              disabled={readOnly}
              data-testid="fly-tipping-no-evidence-checkbox"
            />
            <label htmlFor="no-evidence" className="text-sm text-amber-800 cursor-pointer">
              No photographic evidence available for this case
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Clearance Outcome Component (for Waste Management)
export const ClearanceOutcomeFields = ({ data, onChange, readOnly = false, canEdit = false }) => {
  const fields = data?.clearance_outcome || {};
  
  const updateField = (field, value) => {
    onChange({
      ...data,
      clearance_outcome: { ...fields, [field]: value }
    });
  };

  if (!canEdit && !fields.items_cleared) return null;

  return (
    <Card className="border mt-4 border-green-200">
      <CardHeader className="pb-3 bg-green-50">
        <CardTitle className="text-base flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-green-600" />
          Waste Clearance Outcome
          <span className="text-xs font-normal text-green-600">(Waste Management)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <RequiredLabel required>Items Cleared?</RequiredLabel>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="items-cleared"
                checked={fields.items_cleared === true}
                onChange={() => updateField('items_cleared', true)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="items-cleared"
                checked={fields.items_cleared === false}
                onChange={() => updateField('items_cleared', false)}
                disabled={readOnly}
                className="w-4 h-4"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>

        {fields.items_cleared === false && (
          <div className="space-y-2 pl-4 border-l-2 border-red-200">
            <RequiredLabel required>Reason Not Cleared</RequiredLabel>
            <Textarea
              placeholder="Explain why the items could not be cleared..."
              value={fields.reason_not_cleared || ''}
              onChange={(e) => updateField('reason_not_cleared', e.target.value)}
              disabled={readOnly}
              data-testid="clearance-reason"
            />
          </div>
        )}

        {fields.items_cleared === true && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-green-200">
            <div className="space-y-2">
              <Label>Clearance Date</Label>
              <Input
                type="date"
                value={fields.clearance_date || ''}
                onChange={(e) => updateField('clearance_date', e.target.value)}
                disabled={readOnly}
                data-testid="clearance-date"
              />
            </div>
            <div className="space-y-2">
              <Label>Disposal Method</Label>
              <Input
                placeholder="e.g., Recycled, Landfill"
                value={fields.disposal_method || ''}
                onChange={(e) => updateField('disposal_method', e.target.value)}
                disabled={readOnly}
                data-testid="disposal-method"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Abandoned Vehicle Fields Component
export const AbandonedVehicleFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.abandoned_vehicle || {};
  const updateField = (field, value) => onChange({ ...data, abandoned_vehicle: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Abandoned Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2 col-span-2 md:col-span-1">
            <RequiredLabel required={!fields.registration_not_visible}>Registration Number</RequiredLabel>
            <Input placeholder="e.g., AB12 CDE" value={fields.registration_number || ''} onChange={(e) => updateField('registration_number', e.target.value.toUpperCase())} disabled={readOnly || fields.registration_not_visible} data-testid="abandoned-vehicle-reg" className={fields.registration_not_visible ? 'bg-gray-100' : ''} />
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox id="reg-not-visible" checked={fields.registration_not_visible || false} onCheckedChange={(checked) => { updateField('registration_not_visible', checked); if (checked) updateField('registration_number', ''); }} disabled={readOnly} />
              <label htmlFor="reg-not-visible" className="text-xs text-[#505A5F] cursor-pointer">Registration not visible</label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Make</Label>
            <Input placeholder="e.g., Ford" value={fields.make || ''} onChange={(e) => updateField('make', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input placeholder="e.g., Focus" value={fields.model || ''} onChange={(e) => updateField('model', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Colour</Label>
            <Input placeholder="e.g., Blue" value={fields.colour || ''} onChange={(e) => updateField('colour', e.target.value)} disabled={readOnly} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tax Status</Label>
            <Select value={fields.tax_status || ''} onValueChange={(v) => updateField('tax_status', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="taxed">Taxed</SelectItem>
                <SelectItem value="untaxed">Untaxed</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>MOT Status</Label>
            <Select value={fields.mot_status || ''} onValueChange={(v) => updateField('mot_status', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <RequiredLabel required>Vehicle Condition</RequiredLabel>
            <Select value={fields.condition || ''} onValueChange={(v) => updateField('condition', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
              <SelectContent>
                {VEHICLE_CONDITIONS.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel required>Estimated Time at Location</RequiredLabel>
            <Input placeholder="e.g., 2 weeks" value={fields.estimated_time_at_location || ''} onChange={(e) => updateField('estimated_time_at_location', e.target.value)} disabled={readOnly} />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
            <Label>Causing obstruction or danger?</Label>
            <Switch checked={fields.causing_obstruction || false} onCheckedChange={(v) => updateField('causing_obstruction', v)} disabled={readOnly} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Littering Fields Component
export const LitteringFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.littering || {};
  const updateField = (field, value) => onChange({ ...data, littering: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">Littering Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <RequiredLabel required>Type of Litter</RequiredLabel>
          <Select value={fields.litter_type || ''} onValueChange={(v) => updateField('litter_type', v)} disabled={readOnly}>
            <SelectTrigger><SelectValue placeholder="Select litter type" /></SelectTrigger>
            <SelectContent>{LITTER_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
          <RequiredLabel required>Was the offence witnessed?</RequiredLabel>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="littering-witnessed" checked={fields.offence_witnessed === true} onChange={() => updateField('offence_witnessed', true)} disabled={readOnly} className="w-4 h-4" />
              <span className="text-sm">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="littering-witnessed" checked={fields.offence_witnessed === false} onChange={() => updateField('offence_witnessed', false)} disabled={readOnly} className="w-4 h-4" />
              <span className="text-sm">No</span>
            </label>
          </div>
        </div>
        {fields.offence_witnessed && (
          <div className="space-y-2 pl-4 border-l-2 border-blue-200">
            <Label>Offender Description</Label>
            <Textarea placeholder="Describe the offender..." value={fields.offender_description || ''} onChange={(e) => updateField('offender_description', e.target.value)} disabled={readOnly} />
          </div>
        )}
        <div className="space-y-2">
          <Label>Supporting Evidence</Label>
          <Textarea placeholder="Describe any supporting evidence..." value={fields.supporting_evidence || ''} onChange={(e) => updateField('supporting_evidence', e.target.value)} disabled={readOnly} />
        </div>
      </CardContent>
    </Card>
  );
};

// Dog Fouling Fields Component
export const DogFoulingFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.dog_fouling || {};
  const updateField = (field, value) => onChange({ ...data, dog_fouling: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">Dog Fouling Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel required>Date and Time of Occurrence</RequiredLabel>
            <Input type="datetime-local" value={fields.occurrence_datetime || ''} onChange={(e) => updateField('occurrence_datetime', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Repeat occurrence?</Label>
            <Select value={fields.repeat_occurrence || ''} onValueChange={(v) => updateField('repeat_occurrence', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{YES_NO_UNKNOWN.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Offender Description</Label>
            <Textarea placeholder="Describe the person..." value={fields.offender_description || ''} onChange={(e) => updateField('offender_description', e.target.value)} disabled={readOnly} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>Dog Description</Label>
            <Textarea placeholder="Describe the dog(s)..." value={fields.dog_description || ''} onChange={(e) => updateField('dog_description', e.target.value)} disabled={readOnly} rows={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// PSPO Fields Component
export const PSPOFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.pspo_dog_control || {};
  const updateField = (field, value) => onChange({ ...data, pspo_dog_control: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">PSPO Enforcement Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel required>Nature of PSPO Breach</RequiredLabel>
            <Select value={fields.breach_nature || ''} onValueChange={(v) => updateField('breach_nature', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select breach type" /></SelectTrigger>
              <SelectContent>{PSPO_BREACH_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <RequiredLabel required>Signage Present?</RequiredLabel>
            <Select value={fields.signage_present || ''} onValueChange={(v) => updateField('signage_present', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{YES_NO_UNKNOWN.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location Within PSPO Area</Label>
          <Input placeholder="e.g., Near playground" value={fields.location_within_area || ''} onChange={(e) => updateField('location_within_area', e.target.value)} disabled={readOnly} />
        </div>
        <div className="space-y-2">
          <Label>Officer Notes</Label>
          <Textarea placeholder="Additional observations..." value={fields.officer_notes || ''} onChange={(e) => updateField('officer_notes', e.target.value)} disabled={readOnly} rows={3} />
        </div>
      </CardContent>
    </Card>
  );
};

// Untidy Land Fields Component
export const UntidyLandFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.untidy_land || {};
  const updateField = (field, value) => onChange({ ...data, untidy_land: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">Untidy Land Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Land Type</Label>
            <Select value={fields.land_type || ''} onValueChange={(v) => updateField('land_type', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{LAND_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Land Ownership</Label>
            <Input placeholder="Owner details if known" value={fields.land_ownership || ''} onChange={(e) => updateField('land_ownership', e.target.value)} disabled={readOnly} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Issues Identified</Label>
          <Textarea placeholder="e.g., Overgrown vegetation, accumulated debris..." value={fields.issues_identified?.join(', ') || ''} onChange={(e) => updateField('issues_identified', e.target.value.split(',').map(s => s.trim()))} disabled={readOnly} />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
          <Label>Previous notices served?</Label>
          <Switch checked={fields.previous_notices || false} onCheckedChange={(v) => updateField('previous_notices', v)} disabled={readOnly} />
        </div>
        {fields.previous_notices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
            <div className="space-y-2">
              <Label>Notice Date</Label>
              <Input type="date" value={fields.notice_date || ''} onChange={(e) => updateField('notice_date', e.target.value)} disabled={readOnly} />
            </div>
            <div className="space-y-2">
              <Label>Compliance Deadline</Label>
              <Input type="date" value={fields.compliance_deadline || ''} onChange={(e) => updateField('compliance_deadline', e.target.value)} disabled={readOnly} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// High Hedges Fields Component
export const HighHedgesFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.high_hedges || {};
  const updateField = (field, value) => onChange({ ...data, high_hedges: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">High Hedges Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Hedge Type</Label>
            <Input placeholder="e.g., Leylandii, Privet" value={fields.hedge_type || ''} onChange={(e) => updateField('hedge_type', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Hedge Height (metres)</Label>
            <Input type="number" step="0.1" placeholder="e.g., 4.5" value={fields.hedge_height_meters || ''} onChange={(e) => updateField('hedge_height_meters', parseFloat(e.target.value))} disabled={readOnly} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Affected Property</Label>
            <Input placeholder="Address of affected property" value={fields.affected_property || ''} onChange={(e) => updateField('affected_property', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Hedge Owner Details</Label>
            <Input placeholder="Owner details if known" value={fields.hedge_owner_details || ''} onChange={(e) => updateField('hedge_owner_details', e.target.value)} disabled={readOnly} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox id="prev-complaints" checked={fields.previous_complaints || false} onCheckedChange={(v) => updateField('previous_complaints', v)} disabled={readOnly} />
            <label htmlFor="prev-complaints" className="text-sm">Previous complaints</label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="mediation" checked={fields.mediation_attempted || false} onCheckedChange={(v) => updateField('mediation_attempted', v)} disabled={readOnly} />
            <label htmlFor="mediation" className="text-sm">Mediation attempted</label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Waste Carrier Fields Component
export const WasteCarrierFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.waste_carrier || {};
  const updateField = (field, value) => onChange({ ...data, waste_carrier: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">Waste Carrier / Licensing Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input placeholder="Company name" value={fields.business_name || ''} onChange={(e) => updateField('business_name', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Carrier License Number</Label>
            <Input placeholder="License number" value={fields.carrier_license_number || ''} onChange={(e) => updateField('carrier_license_number', e.target.value)} disabled={readOnly} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>License Status</Label>
            <Select value={fields.license_status || ''} onValueChange={(v) => updateField('license_status', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
              <SelectContent>{LICENSE_STATUS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Vehicle Registration</Label>
            <Input placeholder="e.g., AB12 CDE" value={fields.vehicle_registration || ''} onChange={(e) => updateField('vehicle_registration', e.target.value.toUpperCase())} disabled={readOnly} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Breach Details</Label>
          <Textarea placeholder="Describe the breach..." value={fields.breach_details || ''} onChange={(e) => updateField('breach_details', e.target.value)} disabled={readOnly} />
        </div>
      </CardContent>
    </Card>
  );
};

// Nuisance Vehicle Fields Component
export const NuisanceVehicleFields = ({ data, onChange, readOnly = false }) => {
  const fields = data?.nuisance_vehicle || {};
  const updateField = (field, value) => onChange({ ...data, nuisance_vehicle: { ...fields, [field]: value } });

  return (
    <Card className="border mt-4">
      <CardHeader className="pb-3"><CardTitle className="text-base">Nuisance Vehicle Details</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Registration</Label>
            <Input placeholder="e.g., AB12 CDE" value={fields.vehicle_registration || ''} onChange={(e) => updateField('vehicle_registration', e.target.value.toUpperCase())} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Make</Label>
            <Input placeholder="e.g., Ford" value={fields.vehicle_make || ''} onChange={(e) => updateField('vehicle_make', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Input placeholder="e.g., Transit" value={fields.vehicle_model || ''} onChange={(e) => updateField('vehicle_model', e.target.value)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Colour</Label>
            <Input placeholder="e.g., White" value={fields.vehicle_colour || ''} onChange={(e) => updateField('vehicle_colour', e.target.value)} disabled={readOnly} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <RequiredLabel required>Nuisance Type</RequiredLabel>
            <Select value={fields.nuisance_type || ''} onValueChange={(v) => updateField('nuisance_type', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{NUISANCE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Location Frequency</Label>
            <Select value={fields.location_frequency || ''} onValueChange={(v) => updateField('location_frequency', v)} disabled={readOnly}>
              <SelectTrigger><SelectValue placeholder="How often?" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="occasional">Occasional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {fields.nuisance_type === 'on_street_seller' && (
          <div className="space-y-2 pl-4 border-l-2 border-blue-200">
            <Label>Business Activity</Label>
            <Input placeholder="What is being sold?" value={fields.business_activity || ''} onChange={(e) => updateField('business_activity', e.target.value)} disabled={readOnly} />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
            <Label>Causing Obstruction?</Label>
            <Switch checked={fields.obstruction_caused || false} onCheckedChange={(v) => updateField('obstruction_caused', v)} disabled={readOnly} />
          </div>
          <div className="space-y-2">
            <Label>Previous Warnings</Label>
            <Input type="number" placeholder="0" value={fields.previous_warnings || ''} onChange={(e) => updateField('previous_warnings', parseInt(e.target.value))} disabled={readOnly} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Additional Notes</Label>
          <Textarea placeholder="Additional observations..." value={fields.additional_notes || ''} onChange={(e) => updateField('additional_notes', e.target.value)} disabled={readOnly} />
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
export const CaseTypeFields = ({ caseType, data, onChange, readOnly = false, isWasteManagement = false }) => {
  if (!caseType) return null;

  const fieldComponents = {
    fly_tipping: FlyTippingFields,
    fly_tipping_private: FlyTippingFields,
    fly_tipping_organised: FlyTippingFields,
    abandoned_vehicle: AbandonedVehicleFields,
    littering: LitteringFields,
    dog_fouling: DogFoulingFields,
    pspo_dog_control: PSPOFields,
    untidy_land: UntidyLandFields,
    high_hedges: HighHedgesFields,
    waste_carrier_licensing: WasteCarrierFields,
    nuisance_vehicle: NuisanceVehicleFields,
    nuisance_vehicle_seller: NuisanceVehicleFields,
    nuisance_vehicle_parking: NuisanceVehicleFields,
    nuisance_vehicle_asb: NuisanceVehicleFields,
  };

  const FieldComponent = fieldComponents[caseType];
  const isFlyTipping = caseType?.startsWith('fly_tipping');

  return (
    <>
      {FieldComponent && <FieldComponent data={data} onChange={onChange} readOnly={readOnly} />}
      {isFlyTipping && (
        <ClearanceOutcomeFields 
          data={data} 
          onChange={onChange} 
          readOnly={readOnly || !isWasteManagement} 
          canEdit={isWasteManagement}
        />
      )}
    </>
  );
};

export default CaseTypeFields;
