import { MortgageProvider } from './context/MortgageContext';
import Layout from './components/Layout';
import LocationSearch from './components/mortgage/LocationSearch';
import PropertyInputs from './components/mortgage/PropertyInputs';
import PaymentSummary from './components/mortgage/PaymentSummary';
import AmortizationChart from './components/mortgage/AmortizationChart';
import RateComparison from './components/mortgage/RateComparison';
import ExtraPaymentCalculator from './components/mortgage/ExtraPaymentCalculator';

function App() {
  return (
    <MortgageProvider>
      <Layout>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Advanced Mortgage <span className="text-primary-600">Payment Calculator</span>
          </h1>
          <p className="mt-3 text-neutral-600 max-w-3xl mx-auto">
            Get a comprehensive breakdown of your monthly mortgage payment including principal, interest, taxes, insurance, and other costs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <LocationSearch />
            <PropertyInputs />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <PaymentSummary />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AmortizationChart />
              <ExtraPaymentCalculator />
            </div>
            <RateComparison />
          </div>
        </div>
      </Layout>
    </MortgageProvider>
  );
}

export default App;