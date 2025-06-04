import { createClient } from '@supabase/supabase-js';

// These would be environment variables in a real implementation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// For demo purposes, we'll use localStorage as a fallback when Supabase is not configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http');
};

// Only create Supabase client if properly configured
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo data for fallback mode
export const demoArticles = [  {    id: '1',
    slug: 'what-is-title-insurance',
    title: 'What is Title Insurance, and Do Homebuyers Need It?',
    summary: 'Learn about title insurance policies that protect both lenders and homebuyers against potential problems with a property\'s deed after the transfer of ownership.',
    canonical_url: 'https://www.bankrate.com/real-estate/what-is-title-insurance/',
    author: 'Erik J. Martin',
    pub_date: '2025-02-05T00:00:00Z',
    quote: 'Title insurance is a one-time charge, but the protection lasts for as long as you own the home.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    tags: ['title-insurance', 'closing-costs', 'homebuying', 'real-estate'],
    sort_index: 1,
    created_at: '2025-02-05T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 4,
    is_published: true
  },  {
    id: '2',
    slug: 'moving-costs-guide-2025',
    title: 'How Much Does It Cost to Move? A Comprehensive Guide on What You Can Expect',
    summary: 'Learn about the typical costs of local, interstate and cross-country moves, plus what additional services you might need and how to avoid moving scams.',
    canonical_url: 'https://www.housebeautiful.com/design-inspiration/real-estate/a63003856/moving-costs-guide-2025/',
    author: 'Brittany Anas',
    pub_date: '2024-12-04T00:00:00Z',
    quote: 'The best tip to save on your move? Take less stuff with you! Purging unnecessary, underutilized items ahead of the move can help you scale down on moving costs.',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
    tags: ['moving-costs', 'relocation', 'real-estate', 'budget-tips'],
    sort_index: 2,
    created_at: '2024-12-04T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 7,
    is_published: true
  },  {
    id: '3',
    slug: 'is-home-warranty-worth-it',
    title: 'Is Buying a Home Warranty Worth It?',
    summary: 'Learn the pros and cons of home warranties, what they typically cover, and five essential questions to ask before purchasing one.',
    canonical_url: 'https://www.consumerreports.org/money/homeowners-insurance/is-buying-a-home-warranty-worth-it-a1160643417/',
    author: 'Justin Krajeski',
    pub_date: '2025-04-29T00:00:00Z',
    quote: 'A possible alternative to buying a home warranty is to self-insure by putting the money you would spend on a warranty into a savings account dedicated to home repairs.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
    tags: ['home-warranty', 'homeownership', 'insurance', 'appliances', 'home-maintenance'],
    sort_index: 3,
    created_at: '2025-04-29T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 6,
    is_published: true
  },  {
    id: '4',
    slug: 'tax-breaks-for-homeowners',
    title: 'Ten Tax Breaks for Homeowners and Homebuyers',
    summary: 'Learn about valuable tax deductions and credits available to homeowners, from mortgage interest and property tax deductions to energy-saving credits and capital gains exclusions when selling.',
    canonical_url: 'https://www.kiplinger.com/taxes/income-tax/603276/tax-breaks-for-homeowners-and-home-buyers',
    author: 'Rocky Mengle',
    pub_date: '2025-02-05T00:00:00Z',
    quote: 'While some of these tax breaks can be complex, and not everyone may be eligible for them, they can provide significant tax savings for those who are.',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    tags: ['tax-breaks', 'homeownership', 'tax-deductions', 'tax-credits', 'personal-finance'],
    sort_index: 4,
    created_at: '2025-02-05T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 8,
    is_published: true
  },  {
    id: '5',
    slug: 'negotiating-repairs-after-home-inspection',
    title: '7 Tips: Negotiating Repairs After a Home Inspection',
    summary: 'Learn effective strategies for negotiating repairs after a home inspection, from prioritizing safety issues to understanding when to ask for credits instead of repairs.',
    canonical_url: 'https://raleighrealty.com/blog/negotiating-repairs-after-home-inspection',
    author: 'Ryan Fitzgerald',
    pub_date: '2025-04-29T00:00:00Z',
    quote: 'One effective negotiation technique is the "Repair Threshold" approach. Rather than nitpicking every item, establish a reasonable dollar threshold and only request repairs for items exceeding this amount.',
    image_url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400',
    tags: ['home-inspection', 'negotiation', 'homebuying', 'repairs', 'real-estate'],
    sort_index: 5,
    created_at: '2025-04-29T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 10,
    is_published: true
  },  {
    id: '6',
    slug: 'home-inspection-checklist',
    title: 'Home Inspection Checklist for Buyers: What to Know',
    summary: 'Learn what home inspectors look for, what\'s not covered in a standard inspection, and how to make the most of this crucial step in the homebuying process.',
    canonical_url: 'https://www.bankrate.com/real-estate/home-inspection-checklist/',
    author: 'Ruben Caginalp',
    pub_date: '2025-01-03T00:00:00Z',
    quote: 'A home inspection contingency in your purchase offer will protect you in case the inspection uncovers a "deal-breaker" problem.',
    image_url: 'https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=400',
    tags: ['home-inspection', 'homebuying', 'real-estate', 'property', 'inspection-checklist'],
    sort_index: 6,
    created_at: '2025-01-03T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 5,
    is_published: true
  },  {
    id: '7',
    slug: 'what-you-can-negotiate-when-buying-a-home',
    title: 'Five Things You Can Negotiate When Buying a Home',
    summary: 'Discover key negotiation points beyond just price, from mortgage rates and lender fees to home repairs, closing costs, fixtures, and warranties.',
    canonical_url: 'https://www.kiplinger.com/real-estate/what-you-can-negotiate-when-buying-a-home',
    author: 'Daniel Bortz',
    pub_date: '2025-02-21T00:00:00Z',
    quote: 'Many times, home buyers aren\'t aware that they can negotiate for things other than a home\'s sale price.',
    image_url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    tags: ['homebuying', 'negotiation', 'real-estate', 'mortgage-rates', 'closing-costs'],
    sort_index: 7,
    created_at: '2025-02-21T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 5,
    is_published: true
  },  {
    id: '8',
    slug: 'home-appraisal-checklist',
    title: 'Home Appraisal Checklist: A Guide for Sellers',
    summary: 'Learn how to prepare for a home appraisal with checklists for before, during, and after the appraiser visits to help ensure your property gets valued fairly.',
    canonical_url: 'https://www.homelight.com/blog/home-appraisal-checklist/',
    author: 'Adrian E. Hirsch',
    pub_date: '2025-03-20T00:00:00Z',
    quote: 'The appraisal is usually the last piece of the loan package to be completed before closing. So, anything a seller can do to make sure the appraisal goes well contributes to an on-time closing and smooth sale.',
    image_url: 'https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=400',
    tags: ['home-appraisal', 'selling', 'real-estate', 'home-value', 'closing'],
    sort_index: 8,
    created_at: '2025-03-20T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 14,
    is_published: true
  },  {
    id: '9',
    slug: 'what-are-mortgage-points',
    title: 'What Are Mortgage Points and When Should You Buy Them?',
    summary: 'Learn how mortgage points work, how they can reduce your interest rate, and how to calculate if buying points makes financial sense for your situation.',
    canonical_url: 'https://www.bankrate.com/mortgages/mortgage-points/',
    author: 'Andrew Dehan',
    pub_date: '2025-04-02T00:00:00Z',
    quote: 'The longer you plan to live in a home, the more potential benefit you will get from paying for points.',
    image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400',
    tags: ['mortgage-points', 'interest-rates', 'home-financing', 'closing-costs', 'homebuying'],
    sort_index: 9,
    created_at: '2025-04-02T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 4,
    is_published: true
  },  {
    id: '10',
    slug: 'heat-pump-water-heaters-tax-credit',
    title: 'Heat Pump Water Heaters Tax Credit: Save 30% Through 2032',
    summary: 'Learn how to claim federal tax credits of up to $2,000 for energy-efficient heat pump water heaters, eligibility requirements, and strategies to maximize your savings.',
    canonical_url: 'https://www.energystar.gov/about/federal-tax-credits/heat-pump-water-heaters',
    author: 'ENERGY STAR',
    pub_date: '2025-03-01T00:00:00Z',
    quote: 'Heat pump water heaters that have earned the ENERGY STAR are eligible for this credit of 30% of project cost, up to $2,000 maximum credited.',
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45249ff78?w=400',
    tags: ['tax-credit', 'energy-efficiency', 'heat-pump', 'water-heater', 'home-improvement'],
    sort_index: 10,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 5,
    is_published: true
  },{    id: '11',
    slug: 'how-to-negotiate-closing-costs',
    title: '8 Strategies for Negotiating Closing Costs',
    summary: 'Learn how to save money on closing costs with strategies like lender credits, seller concessions, and comparing loan estimates from multiple lenders.',
    canonical_url: 'https://www.bankrate.com/real-estate/how-to-negotiate-closing-costs/',
    author: 'Dori Zinn',
    pub_date: '2025-04-05T00:00:00Z',
    quote: "When you're making such a big investment, it pays to take the time to negotiate what you can and look closely at fees that might be unnecessary.",
    image_url: 'https://images.unsplash.com/photo-1581093458791-9693f3ef9643?w=400',
    tags: ['closing-costs', 'negotiation', 'homebuying', 'mortgage', 'first-time-buyer'],
    sort_index: 11,
    created_at: '2025-04-05T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 8,
    is_published: true
  },  {
    id: '12',
    slug: 'credit-score-needed-to-buy-house',
    title: 'What Credit Score Do You Need to Buy a House?',
    summary: 'Learn about minimum credit score requirements for different types of mortgages and strategies to improve your score to qualify for better loan terms.',
    canonical_url: 'https://www.bankrate.com/mortgages/credit-score-to-buy-house/',
    author: 'Jeff Ostrowski',
    pub_date: '2025-05-15T00:00:00Z',
    quote: 'While it\'s possible to buy a house with a credit score as low as 500 with some loan programs, you\'ll get the best mortgage rates and terms with a score of 740 or higher.',
    image_url: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?w=400',
    tags: ['credit-score', 'mortgage-requirements', 'homebuying', 'loan-types', 'financial-planning'],
    sort_index: 12,
    created_at: '2025-05-15T00:00:00Z',
    updated_at: '2025-06-04T00:00:00Z',
    reading_time: 7,
    is_published: true
  }
];
