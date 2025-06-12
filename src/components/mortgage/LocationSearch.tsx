import React, { useState, useEffect } from 'react';
import { MapPin, Search, Home, Settings } from 'lucide-react';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Notification } from '../ui/Notification';
import ApiKeyModal from '../ui/ApiKeyModal';
import { useMortgage } from '../../context/MortgageContext';
import { getPropertyTaxRate } from '../../services/propertyTaxService';
import { hasApiKey } from '../../services/apiConfig';
import { validateZipCode, isValidAddress } from '../../utils/validation';
import { getStateFromZipCode } from '../../services/locationUtilitiesService';

const LocationSearch: React.FC = () => {
  const { state, updateLocation, updatePropertyDetails, recalculatePayment } = useMortgage();
  const [address, setAddress] = useState(state.location.address);
  const [isLoading, setIsLoading] = useState(false);
  const [taxRate, setTaxRate] = useState<number | null>(null);
  const [lastCheckedZip, setLastCheckedZip] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [addressError, setAddressError] = useState<string>('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    description?: string;
    visible: boolean;
  } | null>(null);
  
  // Enhanced function to extract and validate ZIP code from address string
  const extractZipCode = (address: string): string | null => {
    const zipMatch = address.match(/\b\d{5}\b/);
    const zip = zipMatch ? zipMatch[0] : null;
    
    if (zip && validateZipCode(zip)) {
      return zip;
    }
    return null;
  };
  
  // Auto-fetch tax rate when address contains a ZIP code
  useEffect(() => {
    const zipCode = extractZipCode(address);
    
    // Only fetch if we have a 5-digit ZIP code and it's different from the last one we checked
    if (zipCode && zipCode !== lastCheckedZip) {
      setIsLoading(true);
      
      // Fetch property tax data for the ZIP code
      getPropertyTaxRate(zipCode)
        .then((result) => {
          setTaxRate(result.taxRate);
          setLastCheckedZip(zipCode);
          
          // Update property details with the new tax rate
          updatePropertyDetails({ customTaxRate: result.taxRate });
          
          // Recalculate mortgage payment
          recalculatePayment();
          
          // Show success notification
          setNotification({
            type: 'success',
            message: `Property Tax Rate Updated`,
            description: `Using ${result.taxRate.toFixed(2)}% tax rate for your calculations`,
            visible: true
          });
        })
        .catch(() => {
          // Error auto-fetching property tax data
          
          // Show error notification
          setNotification({
            type: 'error',
            message: 'Error Fetching Tax Data',
            description: 'Could not retrieve property tax data for this location.',
            visible: true
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [address, lastCheckedZip, updatePropertyDetails, recalculatePayment]);
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputAddress = e.target.value;
    setAddress(inputAddress);
    
    // Clear error if field is being filled
    if (addressError && inputAddress.trim().length > 0) {
      setAddressError('');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug logging
    console.log('Validating address:', address);
    console.log('isValidAddress result:', isValidAddress(address));
    
    // Validate address format before proceeding
    if (!isValidAddress(address)) {
      console.log('Address validation failed for:', address);
      setAddressError('Invalid address format. Please enter a valid ZIP code, city, state, or address.');
      return;
    } else {
      setAddressError('');
    }
    
    setIsLoading(true);
      try {
      // Fetch property tax rate for the location
      const taxRateResult = await getPropertyTaxRate(address);
      setTaxRate(taxRateResult.taxRate);
      const zipCode = extractZipCode(address);
      setLastCheckedZip(zipCode);
      
      // Get state from ZIP code for better utilities calculation
      let stateValue = taxRateResult.state;      // If we found a ZIP code, try to get its state from our mapping
      if (zipCode) {
        console.log(`[LocationSearch] Found ZIP code: ${zipCode}, determining state...`);
        const stateFromZip = getStateFromZipCode(zipCode);
        
        if (stateFromZip) {
          console.log(`[LocationSearch] Detected state ${stateFromZip} from ZIP code ${zipCode}`);
          stateValue = stateFromZip;
        }
      }
      
      console.log(`[LocationSearch] Updating location with address: "${address}", state: "${stateValue}"`);
        // Update location in state with the state information
      updateLocation({ 
        address, 
        radius: 5, // Default radius value
        state: stateValue,
        zipCode: zipCode || undefined 
      });
      
      // Update the property tax calculation in the mortgage calculator
      // We do this by updating a custom tax rate in the property details
      updatePropertyDetails({ customTaxRate: taxRateResult.taxRate });
      
      // Recalculate payments with new tax rate
      recalculatePayment();
      
      // Show success notification
      setNotification({
        type: 'success',
        message: 'Location Updated',
        description: `Using ${taxRateResult.taxRate.toFixed(2)}% property tax rate in your mortgage calculation`,
        visible: true
      });
    } catch (error) {
      // Error fetching property tax data
      setNotification({
        type: 'error',
        message: 'Error Fetching Tax Data',
        description: 'Could not retrieve property tax data for this location.',
        visible: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card className="p-6">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            <Home className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-neutral-800">Property Location</h2>
          </div>
          
          {/* API Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="flex items-center text-xs text-neutral-600 hover:text-primary-600"
          >
            <Settings className="h-3 w-3 mr-1" />
            API Settings
          </Button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-1">
              <Input
                label="Address or Location"
                placeholder="Enter ZIP code (48034), city (Detroit), state (MI), or full address"
                value={address}
                onChange={handleAddressChange}
                icon={<MapPin className="h-5 w-5 text-neutral-400" />}
                error={addressError}
              />
              {lastCheckedZip && taxRate !== null && (
                <div className="text-xs text-emerald-600 flex items-center pt-1">
                  <span>✓ Using {taxRate.toFixed(2)}% tax rate for ZIP: {lastCheckedZip}</span>
                </div>
              )}
              {isLoading && (
                <div className="text-xs text-blue-600 flex items-center pt-1">
                  <span>Fetching property tax data...</span>
                </div>
              )}
              {!hasApiKey('ninjas') && (
                <div className="text-xs text-amber-600 flex items-center pt-1">
                  <span>⚠️ No API key set. Using fallback data. Click 'API Settings' to add your API key.</span>
                </div>
              )}
              {hasApiKey('ninjas') && (
                <div className="text-xs text-emerald-600 flex items-center pt-1">
                  <span>✓ API key configured. Real property tax data will be used when available.</span>
                </div>              )}
            </div>
            
            <Button
              type="submit" 
              icon={isLoading ? 
                <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg> : 
                <Search className="h-4 w-4" />
              }
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : extractZipCode(address) === lastCheckedZip && taxRate !== null ? 'Update Location' : 'Search Location'}
            </Button>
            
            {taxRate !== null && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">Property Tax Rate: {taxRate.toFixed(2)}%</p>
                <p className="text-xs text-blue-600">
                  Based on this location, we've updated your mortgage calculations.
                </p>
              </div>
            )}
          </div>
        </form>
      </Card>
      
      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
      
      {/* Notification */}
      {notification && notification.visible && (
        <Notification
          type={notification.type}
          message={notification.message}
          description={notification.description}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}
    </>
  );
};

export default LocationSearch;