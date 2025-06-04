import { useState, useEffect } from 'react';
import { MortgageProvider } from './context/MortgageContext';
import { LearningCenterProvider } from './context/LearningCenterContext';
import Layout from './components/Layout';
import LocationSearch from './components/mortgage/LocationSearch';
import PropertyInputs from './components/mortgage/PropertyInputs';
import PaymentSummary from './components/mortgage/PaymentSummary';
import AmortizationChart from './components/mortgage/AmortizationChart';
import RateComparison from './components/mortgage/RateComparison';
import ExtraPaymentCalculator from './components/mortgage/ExtraPaymentCalculator';
import LearningCenter from './components/learning/LearningCenter';
import ArticleDetail from './components/learning/ArticleDetail';
import { router, AppView, RouteState } from './utils/router';

function App() {
  const [routeState, setRouteState] = useState<RouteState>(() => router.getCurrentState());

  // Subscribe to route changes
  useEffect(() => {
    const unsubscribe = router.subscribe(setRouteState);
    return unsubscribe;
  }, []);

  // Legacy hash routing support (redirect to clean URLs)
  useEffect(() => {
    const handleLegacyRouting = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        if (hash.startsWith('article/')) {
          const articleId = hash.replace('article/', '');
          router.replace('article', articleId);
        } else if (hash === 'rates') {
          router.replace('rates');
        } else if (hash === 'learning') {
          router.replace('learning');
        }
        // Clear the hash
        window.history.replaceState({}, '', window.location.pathname);
      }
    };

    handleLegacyRouting();
  }, []);

  const handleViewChange = (view: AppView) => {
    router.navigate(view);
  };

  const handleArticleView = (articleSlug: string) => {
    router.navigate('article', articleSlug);
  };

  const renderCalculatorView = () => (
    <MortgageProvider>
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
    </MortgageProvider>
  );

  const renderRatesView = () => (
    <MortgageProvider>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
          Current Mortgage <span className="text-primary-600">Rates</span>
        </h1>
        <p className="mt-3 text-neutral-600 max-w-3xl mx-auto">
          Compare current mortgage rates from top lenders and see how they affect your monthly payment.
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <RateComparison />
      </div>
    </MortgageProvider>
  );

  const renderLearningView = () => (
    <LearningCenterProvider>
      <LearningCenter onArticleClick={handleArticleView} />
    </LearningCenterProvider>
  );

  const renderArticleView = () => (
    <LearningCenterProvider>
      {routeState.articleSlug && (
        <ArticleDetail 
          articleId={routeState.articleSlug} 
          onBack={() => handleViewChange('learning')}
          onArticleClick={handleArticleView}
        />
      )}
    </LearningCenterProvider>
  );

  return (
    <Layout currentView={routeState.view} onViewChange={handleViewChange}>
      {routeState.view === 'calculator' && renderCalculatorView()}
      {routeState.view === 'rates' && renderRatesView()}
      {routeState.view === 'learning' && renderLearningView()}
      {routeState.view === 'article' && renderArticleView()}
    </Layout>
  );
}

export default App;