import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertTriangle, Car, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Case types that have VRM/registration fields
const VRM_CASE_TYPES = [
  'abandoned_vehicle',
  'nuisance_vehicle',
  'nuisance_vehicle_sale',
  'nuisance_vehicle_repair',
  'nuisance_vehicle_abandoned'
];

const DuplicateVRMWarning = ({ caseId, caseType, vrm, onCheck }) => {
  const navigate = useNavigate();
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!vrm || !VRM_CASE_TYPES.includes(caseType)) {
      setDuplicates([]);
      return;
    }

    const checkDuplicates = async () => {
      setLoading(true);
      try {
        let url = '';
        if (caseId) {
          // For existing case - use the case endpoint
          url = `${API}/cases/${caseId}/duplicate-vrm-check`;
        } else {
          // For new case - use the general check endpoint
          url = `${API}/cases/check-duplicate-vrm?vrm=${encodeURIComponent(vrm)}&case_type=${caseType}`;
        }
        
        const response = await axios.get(url);
        setDuplicates(response.data.duplicates || []);
        if (onCheck) {
          onCheck(response.data.duplicates || []);
        }
      } catch (error) {
        console.error('Failed to check VRM duplicates:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the check
    const timer = setTimeout(checkDuplicates, 500);
    return () => clearTimeout(timer);
  }, [caseId, caseType, vrm, onCheck]);

  if (!VRM_CASE_TYPES.includes(caseType) || duplicates.length === 0) {
    return null;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  return (
    <Alert className="border-amber-500 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800 flex items-center gap-2">
        <Car className="w-4 h-4" />
        Duplicate Vehicle Registration Found
        <Badge className="bg-amber-200 text-amber-800">{duplicates.length}</Badge>
      </AlertTitle>
      <AlertDescription>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-amber-700">
              {isOpen ? 'Hide' : 'Show'} previous cases with this VRM
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {duplicates.map((dup) => (
              <div
                key={dup.id}
                className="flex items-center justify-between p-2 bg-white rounded border border-amber-200"
              >
                <div>
                  <p className="font-medium text-sm">{dup.reference_number}</p>
                  <p className="text-xs text-gray-600">
                    {formatDate(dup.created_at)} - {dup.status}
                  </p>
                  {dup.location?.address && (
                    <p className="text-xs text-gray-500">{dup.location.address}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/cases/${dup.id}`)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </AlertDescription>
    </Alert>
  );
};

// Badge component to show in case list
export const DuplicateVRMBadge = ({ count }) => {
  if (!count || count === 0) return null;
  
  return (
    <Badge className="bg-amber-100 text-amber-800 ml-2" title="Duplicate VRM found">
      <Car className="w-3 h-3 mr-1" />
      {count} prior
    </Badge>
  );
};

export default DuplicateVRMWarning;
