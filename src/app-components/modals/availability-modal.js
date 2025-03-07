import { connect } from 'redux-bundler-react';
import { format } from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default connect('doModalClose', ({ doModalClose, product, date }) => {
  // Display the modal header.
  const header = () => {
    return (
      <div className='bg-white'>
        <div className='p-6 pb-4'>
          {/* Display the product name */}
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            Product Availability
            <small className='font-mono text-xs text-gray-500 ml-2'>
              ({product.name})
            </small>
          </h3>

          {/* Display the current date. */}
          <p className='mt-1 text-sm text-gray-500'>
            {date && <i>{format(new UTCDate(date), 'EEEE, MMMM do, yyyy')}</i>}
          </p>
        </div>
      </div>
    );
  };

  // Display the modal footer.
  const footer = () => {
    return (
      <div className='px-4 py-3 bg-gray-50 border-t text-right'>
        {/* Add a button to close the modal. */}
        <button
          onClick={doModalClose}
          className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          <XMarkIcon className='-ml-0.5 mr-1 w-4 h-4' />
          Close
        </button>
      </div>
    );
  };

  return (
    <div className='shadow rounded-md overflow-hidden'>
      {header()}
      {footer()}
    </div>
  );
});
