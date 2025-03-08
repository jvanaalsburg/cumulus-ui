import { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ProductsMapContainer from './products-map-container';
import * as turf from '@turf/turf';

const MAP_SEARCH_URL = process.env.REACT_APP_MAP_SEARCH_URL;

function SearchButton({ onClick, isDisabled }) {
  return (
    <button
      className={
        'inline-flex items-center text-base font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 py-2 px-4 ' +
        (isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')
      }
      onClick={onClick}
      disabled={isDisabled}
    >
      <MagnifyingGlassIcon className='w-4 h-4 mr-2' /> Search Region
    </button>
  );
}

function Debug({ data, label }) {
  return (
    <div>
      <tt className='text-gray-500 font-bold'>{label}:</tt>
      <pre className='text-xs'>{JSON.stringify(data, null, '\t')}</pre>
    </div>
  );
}

export default connect(function ProductsMap() {
  const [region, setRegion] = useState(null);
  const [geometry, setGeometry] = useState(null);
  const [results, setResults] = useState([]);

  const submitSearch = () => {
    fetch(MAP_SEARCH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(region),
    })
      .then((response) => response.json())
      .then(filterResults)
      .then(setResults);
  };

  const filterResults = (data) => {
    if (!geometry) {
      return data;
    }

    return data.filter((loc) => {
      const point = turf.point([loc.location.lon, loc.location.lat]);

      let isWithin = false;

      turf.featureEach(geometry, (feature) => {
        if (turf.booleanWithin(point, feature)) {
          isWithin = true;
        }
      });

      return isWithin;
    });
  };

  return (
    <div className='shadow bg-slate-100 h-full ml-5 mr-5 overflow-hidden border-b border-t border-gray-200 sm:rounded-lg'>
      <ProductsMapContainer
        onRegionUpdate={setRegion}
        onGeometryUpdate={setGeometry}
        locations={results}
      />

      <div className='flex justify-end mt-2 mb-2 mr-2'>
        <SearchButton onClick={submitSearch} isDisabled={!region} />
      </div>

      <div className='grid grid-cols-2 gap-4 ml-5 mr-5 mb-5'>
        <Debug data={region} label='region' />
        <Debug data={results} label='results' />
      </div>
    </div>
  );
});
