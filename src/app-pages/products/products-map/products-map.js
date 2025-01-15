import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import ProductsMapContainer from './products-map-container';

export default connect(function ProductsMap() {
  const [region, setRegion] = useState(null);

  return (
    <div className='shadow bg-slate-100 h-full ml-5 mr-5 overflow-hidden border-b border-t border-gray-200 sm:rounded-lg'>
      <ProductsMapContainer onRegionUpdate={setRegion} />
    </div>
  );
});
