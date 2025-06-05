/**
 * Location-based utilities service for detailed city, state, and ZIP code utilities data
 * Provides average monthly utility costs by specific location
 */

// Define interfaces for location-based utilities data
export interface LocationUtilitiesData {
  state: string;
  city?: string;
  zipCode?: string;
  electricityAvg: number;
  gasAvg: number;
  waterAvg: number;
  internetAvg: number;
  trashAvg: number;
  totalAvg: number;
  lastUpdated?: string;
}

export interface StateUtilitiesData {
  stateCode: string;
  stateName: string;
  electricityAvg: number;
  gasAvg: number;
  waterAvg: number;
  internetAvg: number;
  trashAvg: number;
  totalAvg: number;
}

// Detailed location-based utilities data
// This will be populated with the data you provide
let locationUtilitiesDatabase: LocationUtilitiesData[] = [
  // Example entries - replace with your actual data
  {
    state: 'CA',
    city: 'Los Angeles',
    zipCode: '90210',
    electricityAvg: 120,
    gasAvg: 45,
    waterAvg: 65,
    internetAvg: 85,
    trashAvg: 35,
    totalAvg: 350,
    lastUpdated: '2025-06-05'
  },
  {
    state: 'NY', 
    city: 'New York',
    zipCode: '10001',
    electricityAvg: 110,
    gasAvg: 55,
    waterAvg: 70,
    internetAvg: 80,
    trashAvg: 40,
    totalAvg: 355,
    lastUpdated: '2025-06-05'
  }
  // More entries will be added here from your data
];

// State-level utilities data based on actual average monthly utility bills
// Data source: User-provided actual utilities data (June 2025)
const stateUtilitiesDatabase: StateUtilitiesData[] = [
  { stateCode: 'AL', stateName: 'Alabama', electricityAvg: 180, gasAvg: 85, waterAvg: 65, internetAvg: 75, trashAvg: 47, totalAvg: 453 },
  { stateCode: 'AK', stateName: 'Alaska', electricityAvg: 220, gasAvg: 150, waterAvg: 80, internetAvg: 85, trashAvg: 35, totalAvg: 570 },
  { stateCode: 'AZ', stateName: 'Arizona', electricityAvg: 185, gasAvg: 65, waterAvg: 75, internetAvg: 80, trashAvg: 56, totalAvg: 461 },
  { stateCode: 'AR', stateName: 'Arkansas', electricityAvg: 160, gasAvg: 75, waterAvg: 55, internetAvg: 70, trashAvg: 44, totalAvg: 404 },
  { stateCode: 'CA', stateName: 'California', electricityAvg: 175, gasAvg: 55, waterAvg: 85, internetAvg: 90, trashAvg: 33, totalAvg: 438 },
  { stateCode: 'CO', stateName: 'Colorado', electricityAvg: 145, gasAvg: 70, waterAvg: 60, internetAvg: 75, trashAvg: 22, totalAvg: 372 },
  { stateCode: 'CT', stateName: 'Connecticut', electricityAvg: 200, gasAvg: 120, waterAvg: 80, internetAvg: 85, trashAvg: 48, totalAvg: 533 },
  { stateCode: 'DE', stateName: 'Delaware', electricityAvg: 170, gasAvg: 85, waterAvg: 70, internetAvg: 75, trashAvg: 36, totalAvg: 436 },
  { stateCode: 'FL', stateName: 'Florida', electricityAvg: 185, gasAvg: 35, waterAvg: 80, internetAvg: 80, trashAvg: 78, totalAvg: 458 },
  { stateCode: 'GA', stateName: 'Georgia', electricityAvg: 180, gasAvg: 80, waterAvg: 70, internetAvg: 75, trashAvg: 70, totalAvg: 475 },
  { stateCode: 'HI', stateName: 'Hawaii', electricityAvg: 280, gasAvg: 25, waterAvg: 100, internetAvg: 95, trashAvg: 64, totalAvg: 564 },
  { stateCode: 'ID', stateName: 'Idaho', electricityAvg: 135, gasAvg: 60, waterAvg: 55, internetAvg: 70, trashAvg: 48, totalAvg: 368 },
  { stateCode: 'IL', stateName: 'Illinois', electricityAvg: 155, gasAvg: 85, waterAvg: 65, internetAvg: 75, trashAvg: 32, totalAvg: 412 },
  { stateCode: 'IN', stateName: 'Indiana', electricityAvg: 175, gasAvg: 90, waterAvg: 70, internetAvg: 75, trashAvg: 60, totalAvg: 470 },
  { stateCode: 'IA', stateName: 'Iowa', electricityAvg: 160, gasAvg: 80, waterAvg: 60, internetAvg: 70, trashAvg: 54, totalAvg: 424 },
  { stateCode: 'KS', stateName: 'Kansas', electricityAvg: 165, gasAvg: 75, waterAvg: 65, internetAvg: 72, trashAvg: 54, totalAvg: 431 },
  { stateCode: 'KY', stateName: 'Kentucky', electricityAvg: 170, gasAvg: 85, waterAvg: 70, internetAvg: 73, trashAvg: 67, totalAvg: 465 },
  { stateCode: 'LA', stateName: 'Louisiana', electricityAvg: 155, gasAvg: 65, waterAvg: 60, internetAvg: 70, trashAvg: 40, totalAvg: 390 },
  { stateCode: 'ME', stateName: 'Maine', electricityAvg: 165, gasAvg: 95, waterAvg: 70, internetAvg: 75, trashAvg: 28, totalAvg: 433 },
  { stateCode: 'MD', stateName: 'Maryland', electricityAvg: 170, gasAvg: 90, waterAvg: 75, internetAvg: 80, trashAvg: 35, totalAvg: 450 },
  { stateCode: 'MA', stateName: 'Massachusetts', electricityAvg: 175, gasAvg: 105, waterAvg: 75, internetAvg: 85, trashAvg: 0, totalAvg: 440 },
  { stateCode: 'MI', stateName: 'Michigan', electricityAvg: 155, gasAvg: 85, waterAvg: 65, internetAvg: 75, trashAvg: 33, totalAvg: 413 },
  { stateCode: 'MN', stateName: 'Minnesota', electricityAvg: 145, gasAvg: 90, waterAvg: 60, internetAvg: 75, trashAvg: 11, totalAvg: 381 },
  { stateCode: 'MS', stateName: 'Mississippi', electricityAvg: 155, gasAvg: 75, waterAvg: 60, internetAvg: 70, trashAvg: 52, totalAvg: 412 },
  { stateCode: 'MO', stateName: 'Missouri', electricityAvg: 170, gasAvg: 80, waterAvg: 65, internetAvg: 75, trashAvg: 57, totalAvg: 447 },
  { stateCode: 'MT', stateName: 'Montana', electricityAvg: 140, gasAvg: 75, waterAvg: 55, internetAvg: 70, trashAvg: 39, totalAvg: 379 },
  { stateCode: 'NE', stateName: 'Nebraska', electricityAvg: 140, gasAvg: 80, waterAvg: 55, internetAvg: 70, trashAvg: 34, totalAvg: 379 },
  { stateCode: 'NV', stateName: 'Nevada', electricityAvg: 140, gasAvg: 65, waterAvg: 60, internetAvg: 75, trashAvg: 37, totalAvg: 377 },
  { stateCode: 'NH', stateName: 'New Hampshire', electricityAvg: 165, gasAvg: 100, waterAvg: 70, internetAvg: 80, trashAvg: 19, totalAvg: 434 },
  { stateCode: 'NJ', stateName: 'New Jersey', electricityAvg: 175, gasAvg: 95, waterAvg: 80, internetAvg: 85, trashAvg: 19, totalAvg: 454 },
  { stateCode: 'NM', stateName: 'New Mexico', electricityAvg: 135, gasAvg: 60, waterAvg: 55, internetAvg: 70, trashAvg: 43, totalAvg: 363 },
  { stateCode: 'NY', stateName: 'New York', electricityAvg: 170, gasAvg: 100, waterAvg: 80, internetAvg: 85, trashAvg: -1, totalAvg: 434 },
  { stateCode: 'NC', stateName: 'North Carolina', electricityAvg: 150, gasAvg: 75, waterAvg: 65, internetAvg: 75, trashAvg: 36, totalAvg: 401 },
  { stateCode: 'ND', stateName: 'North Dakota', electricityAvg: 145, gasAvg: 85, waterAvg: 60, internetAvg: 70, trashAvg: 37, totalAvg: 397 },
  { stateCode: 'OH', stateName: 'Ohio', electricityAvg: 175, gasAvg: 90, waterAvg: 70, internetAvg: 75, trashAvg: 63, totalAvg: 473 },
  { stateCode: 'OK', stateName: 'Oklahoma', electricityAvg: 150, gasAvg: 70, waterAvg: 60, internetAvg: 70, trashAvg: 58, totalAvg: 408 },
  { stateCode: 'OR', stateName: 'Oregon', electricityAvg: 120, gasAvg: 80, waterAvg: 65, internetAvg: 80, trashAvg: 63, totalAvg: 408 },
  { stateCode: 'PA', stateName: 'Pennsylvania', electricityAvg: 165, gasAvg: 90, waterAvg: 70, internetAvg: 80, trashAvg: 38, totalAvg: 443 },
  { stateCode: 'RI', stateName: 'Rhode Island', electricityAvg: 170, gasAvg: 98, waterAvg: 70, internetAvg: 82, trashAvg: 20, totalAvg: 440 },
  { stateCode: 'SC', stateName: 'South Carolina', electricityAvg: 175, gasAvg: 70, waterAvg: 70, internetAvg: 75, trashAvg: 63, totalAvg: 453 },
  { stateCode: 'SD', stateName: 'South Dakota', electricityAvg: 150, gasAvg: 80, waterAvg: 60, internetAvg: 70, trashAvg: 49, totalAvg: 409 },
  { stateCode: 'TN', stateName: 'Tennessee', electricityAvg: 165, gasAvg: 75, waterAvg: 65, internetAvg: 75, trashAvg: 51, totalAvg: 431 },
  { stateCode: 'TX', stateName: 'Texas', electricityAvg: 165, gasAvg: 70, waterAvg: 70, internetAvg: 80, trashAvg: 40, totalAvg: 425 },
  { stateCode: 'UT', stateName: 'Utah', electricityAvg: 125, gasAvg: 70, waterAvg: 55, internetAvg: 75, trashAvg: 21, totalAvg: 346 },
  { stateCode: 'VT', stateName: 'Vermont', electricityAvg: 150, gasAvg: 105, waterAvg: 65, internetAvg: 80, trashAvg: 6, totalAvg: 406 },
  { stateCode: 'VA', stateName: 'Virginia', electricityAvg: 160, gasAvg: 80, waterAvg: 70, internetAvg: 80, trashAvg: 40, totalAvg: 430 },
  { stateCode: 'WA', stateName: 'Washington', electricityAvg: 115, gasAvg: 85, waterAvg: 70, internetAvg: 85, trashAvg: 46, totalAvg: 401 },
  { stateCode: 'WV', stateName: 'West Virginia', electricityAvg: 180, gasAvg: 85, waterAvg: 70, internetAvg: 75, trashAvg: 76, totalAvg: 486 },
  { stateCode: 'WI', stateName: 'Wisconsin', electricityAvg: 145, gasAvg: 90, waterAvg: 60, internetAvg: 75, trashAvg: 26, totalAvg: 396 },
  { stateCode: 'WY', stateName: 'Wyoming', electricityAvg: 145, gasAvg: 75, waterAvg: 55, internetAvg: 75, trashAvg: 49, totalAvg: 399 },
  { stateCode: 'DC', stateName: 'Washington DC', electricityAvg: 170, gasAvg: 95, waterAvg: 80, internetAvg: 90, trashAvg: 35, totalAvg: 470 }
];

/**
 * ZIP code to state mapping for common ZIP codes
 * This helps determine state from ZIP code when specific city data isn't available
 */
const zipCodeToStateMap: Record<string, string> = {
  // Alabama ZIP codes
  '35004': 'AL', '35005': 'AL', '35006': 'AL', '35007': 'AL', '35010': 'AL',
  '35201': 'AL', '35202': 'AL', '35203': 'AL', '35204': 'AL', '35205': 'AL',
  
  // Alaska ZIP codes
  '99501': 'AK', '99502': 'AK', '99503': 'AK', '99504': 'AK', '99505': 'AK',
  '99701': 'AK', '99702': 'AK', '99801': 'AK', '99901': 'AK', '99902': 'AK',
  
  // Arizona ZIP codes
  '85001': 'AZ', '85002': 'AZ', '85003': 'AZ', '85004': 'AZ', '85005': 'AZ',
  '85201': 'AZ', '85202': 'AZ', '85301': 'AZ', '85302': 'AZ', '85701': 'AZ',
  
  // Arkansas ZIP codes
  '71601': 'AR', '71602': 'AR', '71701': 'AR', '71801': 'AR', '71901': 'AR',
  '72201': 'AR', '72202': 'AR', '72301': 'AR', '72401': 'AR', '72501': 'AR',
  
  // California ZIP codes  
  '90001': 'CA', '90002': 'CA', '90003': 'CA', '90004': 'CA', '90005': 'CA',
  '90210': 'CA', '90211': 'CA', '90212': 'CA', '90213': 'CA', '90214': 'CA',
  '94102': 'CA', '94103': 'CA', '94104': 'CA', '94105': 'CA', '94106': 'CA',
  '91901': 'CA', '92101': 'CA', '92102': 'CA', '92103': 'CA', '92104': 'CA',
  
  // Colorado ZIP codes
  '80001': 'CO', '80002': 'CO', '80003': 'CO', '80004': 'CO', '80005': 'CO',
  '80201': 'CO', '80202': 'CO', '80203': 'CO', '80204': 'CO', '80205': 'CO',
  
  // Connecticut ZIP codes
  '06001': 'CT', '06002': 'CT', '06010': 'CT', '06011': 'CT', '06013': 'CT',
  '06101': 'CT', '06102': 'CT', '06103': 'CT', '06104': 'CT', '06105': 'CT',
  
  // Delaware ZIP codes
  '19701': 'DE', '19702': 'DE', '19703': 'DE', '19801': 'DE', '19802': 'DE',
  '19901': 'DE', '19902': 'DE', '19903': 'DE', '19904': 'DE', '19905': 'DE',
  
  // Florida ZIP codes
  '32003': 'FL', '32004': 'FL', '32005': 'FL', '32006': 'FL', '32007': 'FL',
  '33101': 'FL', '33102': 'FL', '33103': 'FL', '33104': 'FL', '33105': 'FL',
  '34601': 'FL', '34602': 'FL', '34603': 'FL', '34604': 'FL', '34605': 'FL',
  
  // Georgia ZIP codes
  '30002': 'GA', '30003': 'GA', '30004': 'GA', '30005': 'GA', '30006': 'GA',
  '30301': 'GA', '30302': 'GA', '30303': 'GA', '30304': 'GA', '30305': 'GA',
  
  // Hawaii ZIP codes
  '96701': 'HI', '96702': 'HI', '96703': 'HI', '96704': 'HI', '96705': 'HI',
  '96801': 'HI', '96802': 'HI', '96803': 'HI', '96804': 'HI', '96805': 'HI',
  
  // Idaho ZIP codes
  '83001': 'ID', '83002': 'ID', '83003': 'ID', '83004': 'ID', '83005': 'ID',
  '83201': 'ID', '83202': 'ID', '83203': 'ID', '83204': 'ID', '83301': 'ID',
  
  // Illinois ZIP codes
  '60001': 'IL', '60002': 'IL', '60003': 'IL', '60004': 'IL', '60005': 'IL',
  '60601': 'IL', '60602': 'IL', '60603': 'IL', '60604': 'IL', '60605': 'IL',
  
  // Indiana ZIP codes
  '46001': 'IN', '46002': 'IN', '46003': 'IN', '46004': 'IN', '46005': 'IN',
  '46201': 'IN', '46202': 'IN', '46203': 'IN', '46204': 'IN', '46205': 'IN',
  
  // Iowa ZIP codes
  '50001': 'IA', '50002': 'IA', '50003': 'IA', '50004': 'IA', '50005': 'IA',
  '50301': 'IA', '50302': 'IA', '50303': 'IA', '50304': 'IA', '50305': 'IA',
  
  // Kansas ZIP codes
  '66002': 'KS', '66003': 'KS', '66004': 'KS', '66005': 'KS', '66006': 'KS',
  '66101': 'KS', '66102': 'KS', '66103': 'KS', '66104': 'KS', '66105': 'KS',
  
  // Kentucky ZIP codes
  '40003': 'KY', '40004': 'KY', '40005': 'KY', '40006': 'KY', '40007': 'KY',
  '40201': 'KY', '40202': 'KY', '40203': 'KY', '40204': 'KY', '40205': 'KY',
  
  // Louisiana ZIP codes
  '70001': 'LA', '70002': 'LA', '70003': 'LA', '70004': 'LA', '70005': 'LA',
  '70112': 'LA', '70113': 'LA', '70114': 'LA', '70115': 'LA', '70116': 'LA',
  
  // Maine ZIP codes
  '04001': 'ME', '04002': 'ME', '04003': 'ME', '04004': 'ME', '04005': 'ME',
  '04101': 'ME', '04102': 'ME', '04103': 'ME', '04104': 'ME', '04105': 'ME',
  
  // Maryland ZIP codes
  '20601': 'MD', '20602': 'MD', '20603': 'MD', '20604': 'MD', '20605': 'MD',
  '21201': 'MD', '21202': 'MD', '21203': 'MD', '21204': 'MD', '21205': 'MD',
  
  // Massachusetts ZIP codes
  '01001': 'MA', '01002': 'MA', '01003': 'MA', '01004': 'MA', '01005': 'MA',
  '02101': 'MA', '02102': 'MA', '02103': 'MA', '02104': 'MA', '02105': 'MA',
  
  // Michigan ZIP codes
  '48001': 'MI', '48002': 'MI', '48003': 'MI', '48004': 'MI', '48005': 'MI',
  '48034': 'MI', '48104': 'MI', '48105': 'MI', '48197': 'MI', '48198': 'MI',
  '48201': 'MI', '48202': 'MI', '48301': 'MI', '48335': 'MI', '49001': 'MI',
  
  // Minnesota ZIP codes
  '55001': 'MN', '55002': 'MN', '55003': 'MN', '55004': 'MN', '55005': 'MN',
  '55401': 'MN', '55402': 'MN', '55403': 'MN', '55404': 'MN', '55405': 'MN',
  
  // Mississippi ZIP codes
  '38601': 'MS', '38602': 'MS', '38603': 'MS', '38604': 'MS', '38605': 'MS',
  '39201': 'MS', '39202': 'MS', '39203': 'MS', '39204': 'MS', '39205': 'MS',
  
  // Missouri ZIP codes
  '63001': 'MO', '63002': 'MO', '63003': 'MO', '63004': 'MO', '63005': 'MO',
  '63101': 'MO', '63102': 'MO', '63103': 'MO', '63104': 'MO', '63105': 'MO',
  
  // Montana ZIP codes
  '59001': 'MT', '59002': 'MT', '59003': 'MT', '59004': 'MT', '59005': 'MT',
  '59601': 'MT', '59602': 'MT', '59701': 'MT', '59801': 'MT', '59901': 'MT',
  
  // Nebraska ZIP codes
  '68001': 'NE', '68002': 'NE', '68003': 'NE', '68004': 'NE', '68005': 'NE',
  '68101': 'NE', '68102': 'NE', '68103': 'NE', '68104': 'NE', '68105': 'NE',
  
  // Nevada ZIP codes
  '89001': 'NV', '89002': 'NV', '89003': 'NV', '89004': 'NV', '89005': 'NV',
  '89101': 'NV', '89102': 'NV', '89103': 'NV', '89104': 'NV', '89105': 'NV',
  
  // New Hampshire ZIP codes
  '03031': 'NH', '03032': 'NH', '03033': 'NH', '03034': 'NH', '03036': 'NH',
  '03101': 'NH', '03102': 'NH', '03103': 'NH', '03104': 'NH', '03105': 'NH',
  
  // New Jersey ZIP codes
  '07001': 'NJ', '07002': 'NJ', '07003': 'NJ', '07004': 'NJ', '07005': 'NJ',
  '07101': 'NJ', '07102': 'NJ', '07103': 'NJ', '07104': 'NJ', '07105': 'NJ',
  
  // New Mexico ZIP codes
  '87001': 'NM', '87002': 'NM', '87004': 'NM', '87005': 'NM', '87006': 'NM',
  '87101': 'NM', '87102': 'NM', '87103': 'NM', '87104': 'NM', '87105': 'NM',
  
  // New York ZIP codes
  '10001': 'NY', '10002': 'NY', '10003': 'NY', '10004': 'NY', '10005': 'NY',
  '11201': 'NY', '11202': 'NY', '11203': 'NY', '11204': 'NY', '11205': 'NY',
  '12201': 'NY', '12202': 'NY', '12203': 'NY', '12204': 'NY', '12205': 'NY',
  
  // North Carolina ZIP codes
  '27006': 'NC', '27007': 'NC', '27009': 'NC', '27010': 'NC', '27011': 'NC',
  '27601': 'NC', '27602': 'NC', '27603': 'NC', '27604': 'NC', '27605': 'NC',
  
  // North Dakota ZIP codes
  '58001': 'ND', '58002': 'ND', '58004': 'ND', '58005': 'ND', '58006': 'ND',
  '58102': 'ND', '58103': 'ND', '58104': 'ND', '58105': 'ND', '58201': 'ND',
  
  // Ohio ZIP codes
  '43001': 'OH', '43002': 'OH', '43003': 'OH', '43004': 'OH', '43005': 'OH',
  '44101': 'OH', '44102': 'OH', '44103': 'OH', '44104': 'OH', '44105': 'OH',
  
  // Oklahoma ZIP codes
  '73001': 'OK', '73002': 'OK', '73003': 'OK', '73004': 'OK', '73005': 'OK',
  '73101': 'OK', '73102': 'OK', '73103': 'OK', '73104': 'OK', '73105': 'OK',
  
  // Oregon ZIP codes
  '97001': 'OR', '97002': 'OR', '97003': 'OR', '97004': 'OR', '97005': 'OR',
  '97201': 'OR', '97202': 'OR', '97203': 'OR', '97204': 'OR', '97205': 'OR',
  
  // Pennsylvania ZIP codes
  '15001': 'PA', '15002': 'PA', '15003': 'PA', '15004': 'PA', '15005': 'PA',
  '19101': 'PA', '19102': 'PA', '19103': 'PA', '19104': 'PA', '19105': 'PA',
  
  // Rhode Island ZIP codes
  '02801': 'RI', '02802': 'RI', '02804': 'RI', '02806': 'RI', '02807': 'RI',
  '02901': 'RI', '02902': 'RI', '02903': 'RI', '02904': 'RI', '02905': 'RI',
  
  // South Carolina ZIP codes
  '29001': 'SC', '29002': 'SC', '29003': 'SC', '29006': 'SC', '29007': 'SC',
  '29201': 'SC', '29202': 'SC', '29203': 'SC', '29204': 'SC', '29205': 'SC',
  
  // South Dakota ZIP codes
  '57001': 'SD', '57002': 'SD', '57003': 'SD', '57004': 'SD', '57005': 'SD',
  '57101': 'SD', '57103': 'SD', '57104': 'SD', '57105': 'SD', '57106': 'SD',
  
  // Tennessee ZIP codes
  '37010': 'TN', '37011': 'TN', '37012': 'TN', '37013': 'TN', '37014': 'TN',
  '37201': 'TN', '37202': 'TN', '37203': 'TN', '37204': 'TN', '37205': 'TN',
  
  // Texas ZIP codes
  '73301': 'TX', '75001': 'TX', '75002': 'TX', '75003': 'TX', '75004': 'TX',
  '75201': 'TX', '75202': 'TX', '75203': 'TX', '75204': 'TX', '75205': 'TX',
  '77001': 'TX', '77002': 'TX', '77003': 'TX', '77004': 'TX', '77005': 'TX',
  '78701': 'TX', '78702': 'TX', '78703': 'TX', '78704': 'TX', '78705': 'TX',
  
  // Utah ZIP codes
  '84001': 'UT', '84002': 'UT', '84003': 'UT', '84004': 'UT', '84005': 'UT',
  '84101': 'UT', '84102': 'UT', '84103': 'UT', '84104': 'UT', '84105': 'UT',
  
  // Vermont ZIP codes
  '05001': 'VT', '05002': 'VT', '05003': 'VT', '05004': 'VT', '05005': 'VT',
  '05101': 'VT', '05141': 'VT', '05143': 'VT', '05144': 'VT', '05146': 'VT',
  
  // Virginia ZIP codes
  '22003': 'VA', '22015': 'VA', '22025': 'VA', '22026': 'VA', '22027': 'VA',
  '23219': 'VA', '23220': 'VA', '23221': 'VA', '23222': 'VA', '23223': 'VA',
  
  // Washington ZIP codes
  '98001': 'WA', '98002': 'WA', '98003': 'WA', '98004': 'WA', '98005': 'WA',
  '98101': 'WA', '98102': 'WA', '98103': 'WA', '98104': 'WA', '98105': 'WA',
  
  // West Virginia ZIP codes
  '24701': 'WV', '24712': 'WV', '24714': 'WV', '24715': 'WV', '24716': 'WV',
  '25301': 'WV', '25302': 'WV', '25303': 'WV', '25304': 'WV', '25305': 'WV',
  
  // Wisconsin ZIP codes
  '53001': 'WI', '53002': 'WI', '53003': 'WI', '53004': 'WI', '53005': 'WI',
  '53201': 'WI', '53202': 'WI', '53203': 'WI', '53204': 'WI', '53205': 'WI',
  
  // Wyoming ZIP codes
  '82001': 'WY', '82002': 'WY', '82003': 'WY', '82005': 'WY', '82006': 'WY',
  '82601': 'WY', '82602': 'WY', '82604': 'WY', '82609': 'WY', '82615': 'WY',
  
  // Washington DC ZIP codes
  '20001': 'DC', '20002': 'DC', '20003': 'DC', '20004': 'DC', '20005': 'DC'
};

/**
 * Search for utilities data by ZIP code
 */
export const getUtilitiesByZipCode = (zipCode: string): LocationUtilitiesData | null => {
  return locationUtilitiesDatabase.find(location => location.zipCode === zipCode) || null;
};

/**
 * Get state from ZIP code
 */
export const getStateFromZipCode = (zipCode: string): string | null => {
  const state = zipCodeToStateMap[zipCode] || null;
  console.log(`Looking up ZIP code ${zipCode} => Found state: ${state}`);
  return state;
};

/**
 * Search for utilities data by city and state
 */
export const getUtilitiesByCity = (city: string, state: string): LocationUtilitiesData | null => {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toUpperCase().trim();
  
  return locationUtilitiesDatabase.find(location => 
    location.city?.toLowerCase() === normalizedCity && 
    location.state.toUpperCase() === normalizedState
  ) || null;
};

/**
 * Search for utilities data by state
 */
export const getUtilitiesByState = (state: string): StateUtilitiesData | null => {
  const normalizedState = state.toUpperCase().trim();
  return stateUtilitiesDatabase.find(stateData => 
    stateData.stateCode === normalizedState
  ) || null;
};

/**
 * Parse location string and extract utilities data
 * Handles ZIP codes, "City, State", state codes, and full addresses
 */
export const parseLocationAndGetUtilities = (locationString: string): {
  utilitiesData: LocationUtilitiesData | StateUtilitiesData | null;
  source: 'zipcode' | 'city' | 'state' | 'none';
  parsedLocation: {
    zipCode?: string;
    city?: string;
    state?: string;
  };
} => {
  const trimmed = locationString.trim();
  
  // Try ZIP code first (5 digits)
  const zipMatch = trimmed.match(/\b(\d{5})\b/);
  if (zipMatch) {
    const zipCode = zipMatch[1];
    const zipData = getUtilitiesByZipCode(zipCode);
    if (zipData) {
      return {
        utilitiesData: zipData,
        source: 'zipcode',
        parsedLocation: { zipCode, city: zipData.city, state: zipData.state }
      };
    }
    
    // Try to get state from ZIP code mapping
    const stateFromZip = getStateFromZipCode(zipCode);
    if (stateFromZip) {
      const stateData = getUtilitiesByState(stateFromZip);
      if (stateData) {
        return {
          utilitiesData: stateData,
          source: 'state',
          parsedLocation: { state: stateFromZip }
        };
      }
    }
  }
  
  // Try "City, State" format
  const cityStateMatch = trimmed.match(/^([^,]+),\s*([A-Za-z]{2})$/);
  if (cityStateMatch) {
    const city = cityStateMatch[1].trim();
    const state = cityStateMatch[2].trim();
    const cityData = getUtilitiesByCity(city, state);
    if (cityData) {
      return {
        utilitiesData: cityData,
        source: 'city',
        parsedLocation: { city, state }
      };
    }
    
    // Fallback to state data if city not found
    const stateData = getUtilitiesByState(state);
    if (stateData) {
      return {
        utilitiesData: stateData,
        source: 'state',
        parsedLocation: { city, state }
      };
    }
  }
  
  // Try state code only
  const stateMatch = trimmed.match(/^([A-Za-z]{2})$/);
  if (stateMatch) {
    const state = stateMatch[1];
    const stateData = getUtilitiesByState(state);
    if (stateData) {
      return {
        utilitiesData: stateData,
        source: 'state',
        parsedLocation: { state }
      };
    }
  }
  
  // Try to extract state from longer address
  const addressStateMatch = trimmed.match(/\b([A-Za-z]{2})\b(?:\s+\d{5})?$/);
  if (addressStateMatch) {
    const state = addressStateMatch[1];
    const stateData = getUtilitiesByState(state);
    if (stateData) {
      return {
        utilitiesData: stateData,
        source: 'state',
        parsedLocation: { state }
      };
    }
  }
  
  return {
    utilitiesData: null,
    source: 'none',
    parsedLocation: {}
  };
};

/**
 * Get utilities cost estimate with home size adjustment
 */
export const getLocationUtilitiesCost = (
  locationString: string, 
  squareFeet: number = 2000
): {
  monthlyCost: number;
  breakdown?: {
    electricity: number;
    gas: number;
    water: number;
    internet: number;
    trash: number;
  };
  source: string;
  location: string;
} => {
  const result = parseLocationAndGetUtilities(locationString);
  
  if (!result.utilitiesData) {
    // Fallback to national average
    return {
      monthlyCost: 395,
      source: 'National Average',
      location: 'United States'
    };
  }
  
  const data = result.utilitiesData;
  
  // Home size adjustment factor (similar to existing service)
  const averageHomeSize = 2000;
  const scaleFactor = Math.pow(squareFeet / averageHomeSize, 0.7);
  
  let breakdown: any = {};
  let totalCost: number;
    if ('electricityAvg' in data) {
    // Detailed breakdown available
    breakdown = {
      electricity: Math.round(data.electricityAvg * scaleFactor),
      gas: Math.round(data.gasAvg * scaleFactor),
      water: Math.round(data.waterAvg * scaleFactor),
      internet: data.internetAvg, // Internet typically doesn't scale with home size
      trash: data.trashAvg // Trash also typically doesn't scale
    };
    totalCost = breakdown.electricity + breakdown.gas + breakdown.water + breakdown.internet + breakdown.trash;
  } else {
    // Only total available (state data)
    totalCost = Math.round((data as StateUtilitiesData).totalAvg * scaleFactor);
  }
  
  let locationName = '';
  if (result.source === 'zipcode' && 'city' in data && data.city) {
    locationName = `${data.city}, ${data.state}`;
  } else if (result.source === 'city' && result.parsedLocation.city) {
    locationName = `${result.parsedLocation.city}, ${result.parsedLocation.state}`;
  } else if (result.source === 'state') {
    const stateData = data as StateUtilitiesData;
    locationName = stateData.stateName || result.parsedLocation.state || '';
  }
  
  return {
    monthlyCost: totalCost,
    breakdown: Object.keys(breakdown).length > 0 ? breakdown : undefined,
    source: result.source === 'zipcode' ? 'ZIP Code Data' : 
            result.source === 'city' ? 'City Data' : 
            result.source === 'state' ? 'State Average' : 'National Average',
    location: locationName
  };
};

/**
 * Add new location utilities data (for when you provide the data)
 */
export const addLocationUtilitiesData = (data: LocationUtilitiesData[]): void => {
  locationUtilitiesDatabase = [...locationUtilitiesDatabase, ...data];
};

/**
 * Update existing location utilities data
 */
export const updateLocationUtilitiesDatabase = (data: LocationUtilitiesData[]): void => {
  locationUtilitiesDatabase = data;
};

/**
 * Get all available locations for debugging/admin purposes
 */
export const getAllLocationData = (): LocationUtilitiesData[] => {
  return locationUtilitiesDatabase;
};

/**
 * Get utilities statistics for a location
 */
export const getUtilitiesStats = (locationString: string): {
  isAvailable: boolean;
  dataSource: string;
  lastUpdated?: string;
  coverageLevel: 'zipcode' | 'city' | 'state' | 'national';
} => {
  const result = parseLocationAndGetUtilities(locationString);
  
  return {
    isAvailable: result.utilitiesData !== null,
    dataSource: result.source,
    lastUpdated: result.utilitiesData && 'lastUpdated' in result.utilitiesData ? result.utilitiesData.lastUpdated : undefined,
    coverageLevel: result.source === 'none' ? 'national' : result.source
  };
};
