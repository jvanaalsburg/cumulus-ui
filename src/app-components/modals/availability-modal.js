import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { format, addDays, subDays } from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CUMULUS_API_URL = process.env.REACT_APP_CUMULUS_API_URL;

/**
 * Indicate whether or not the file has been successfully uploaded.
 *
 * @param {Object} file - A product file.
 * @param file.is_available - Whether or not the file has been uploaded.
 * @returns JSX.Element
 */
const fileStatus = (file) => {
  return file.is_available ? (
    <p className='flex items-center text-xs text-gray-400'>
      <span className='mr-1'>Available</span>
      <CheckCircleIcon className='mr-1 w-5 h-5 text-green-400' />
    </p>
  ) : (
    <p className='flex items-center text-xs text-gray-400'>
      <span className='mr-1'>Missing</span>
      <XCircleIcon className='mr-1 w-5 h-5 text-red-400' />
    </p>
  );
};

/**
 * Display a list of product files.
 *
 * @param {Object[]} files - A list of product files.
 * @param {string} files[].datetime - The time of the file upload.
 * @param {bool} files[].is_available - Whether or not the file has been uploaded.
 * @returns JSX.Element
 */
const fileList = (files) => {
  return (
    <ul role='list' className='divide-y divide-gray-200 border-t'>
      {files.map((file, index) => (
        <li
          key={`file-item-${index}`}
          className='flex justify-between items-center px-4 py-3 hover:bg-gray-50'
        >
          {/* Display the start of the time interval in the user's local time zone. */}
          <p className='text-sm font-medium text-gray-900'>
            <span>{format(new Date(file.datetime), 'MMM dd HH:mm')}</span>

            {/* We also display UTC time. */}
            <small className='font-mono text-gray-400 ml-2'>
              {format(new UTCDate(file.datetime), 'HH:mm')}
              <span className='ml-1'>(UTC)</span>
            </small>
          </p>

          {/* Add icon/text with the file availability status. */}
          {fileStatus(file)}
        </li>
      ))}
    </ul>
  );
};

export default connect('doModalClose', ({ doModalClose, product, date }) => {
  const [currDate, setCurrDate] = useState(null);
  const [files, setFiles] = useState([]);

  // Initialize the component.
  useEffect(() => {
    fetchData(date);
  }, []);

  /**
   * Make a request for the file availability data.
   * @date {datetime} - The date for the data request.
   */
  const fetchData = (date) => {
    // Update the current date.
    setCurrDate(date);

    // Fetch the availability data and then update the files list.
    const url = `${CUMULUS_API_URL}/products/${
      product.id
    }/file-availability?date=${date.toISOString()}`;

    fetch(url)
      .then((response) => response.json())
      .then(setFiles);
  };

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
            {currDate && (
              <i>{format(new UTCDate(currDate), 'EEEE, MMMM do, yyyy')}</i>
            )}
          </p>
        </div>
      </div>
    );
  };

  // Display UI for fetching the previous and next day's data.
  const paginationControls = () => {
    return (
      <div className='flex justify-between border-y border-gray-200 p-2'>
        {/* Add button for retrieving the previous day's availability. */}
        <button
          type='button'
          className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          onClick={() => fetchData(subDays(currDate, 1))}
        >
          <ChevronLeftIcon className='-ml-1 mr-3 w-5 h-5' aria-hidden='true' />
          Prev
        </button>

        {/* Add button for retrieving the next day's availability. */}
        <button
          type='button'
          className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          onClick={() => fetchData(addDays(currDate, 1))}
        >
          Next
          <ChevronRightIcon className='ml-2 -mr-1 w-5 h-5' aria-hidden='true' />
        </button>
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
      {paginationControls()}
      {fileList(files)}
      {footer()}
    </div>
  );
});
