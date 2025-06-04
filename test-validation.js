// Test validation functions

const validateZipCode = (zip) => {
  const zipPattern = /^\d{5}(-\d{4})?$/;
  return zipPattern.test(zip.trim());
};

const validateAddress = (address) => {
  const trimmed = address.trim();
  
  // Too short to be valid
  if (trimmed.length < 3) {
    return '';
  }
  
  // Check if it's a valid ZIP code (5 digits, optionally with dash and 4 more digits)
  if (validateZipCode(trimmed)) {
    return trimmed;
  }
  
  // Check if it's a city name (letters, spaces, commas, periods)
  const cityPattern = /^[a-zA-Z\s,.-]+$/;
  if (cityPattern.test(trimmed) && trimmed.length >= 3) {
    return trimmed;
  }
  
  // Check if it's a full address (must contain at least one number and one letter)
  const hasNumber = /\d/.test(trimmed);
  const hasLetter = /[a-zA-Z]/.test(trimmed);
  
  if (hasNumber && hasLetter && trimmed.length >= 5) {
    return trimmed;
  }
  
  // If none of the patterns match, return empty string
  return '';
};

const isValidAddress = (address) => {
  return validateAddress(address) !== '';
};

// Test cases
const testCases = ['48034', '90210', 'New York', 'NY', 'California', '123 Main St', '123 Main Street, New York, NY 10001'];

console.log('Testing validation:');
testCases.forEach(test => {
  const zipValid = validateZipCode(test);
  const addrValid = validateAddress(test);
  const boolValid = isValidAddress(test);
  console.log(`'${test}' -> ZIP: ${zipValid}, ADDR: '${addrValid}', BOOL: ${boolValid}`);
});
