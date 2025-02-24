import { connect } from 'redux-bundler-react';

export default connect('doModalClose', ({ doModalClose, date }) => {
  return (
    <div className='shadow rounded-md overflow-hidden'>
      <div className="'bg-white py-6 px-4 space-y-6 sm:p-6">
        <div>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            Product Availability
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            <i>{date}</i>
          </p>
        </div>
      </div>

      <hr />

      <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
        <button
          onClick={doModalClose}
          className='bg-slate-600 border border-transparent rounded-md shadow-sm py-2 px-4 mr-3 inline-flex justify-center text-sm font-medium text-white hover:bg-slate-700'
        >
          Close
        </button>
      </div>
    </div>
  );
});
