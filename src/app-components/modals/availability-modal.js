import { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Switch } from '@headlessui/react';
import { format, addDays, subDays } from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import {
  CloudIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const CUMULUS_API_URL = process.env.REACT_APP_CUMULUS_API_URL;

/**
 * Display the number of successful, and missing, file uploads in badge components.
 *
 * @param {Object[]} files - A list of product files.
 * @param {bool} files[].is_available - Whether or not the file has been uploaded.
 * @returns JSX.Element
 */
const fileBadges = (files) => {
  // Generate a list containing the failed (or missing) files.
  const failed = files.filter((f) => !f.is_available);

  return (
    <div className='mt-3'>
      {/* We always display the number of successfully uploaded files. */}
      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 mr-3'>
        <CloudIcon className='mr-2 w-5 h-5' />
        {files.filter((f) => f.is_available).length} Files
      </span>

      {/* If there are missing files, we display those in a separate badge. */}
      {failed.length ? (
        <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800'>
          <ExclamationTriangleIcon className='mr-2 w-5 h-5' />
          {failed.length} Failed
        </span>
      ) : null}
    </div>
  );
};

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
 * @param {bool} missingOnly - Flag used to only display files that have not been uploaded.
 * @returns JSX.Element
 */
const fileList = (files, missingOnly = false) => {
  // Generate a list of files that should be displayed. If `missingOnly` is true,
  // or not specified, all files will be displayed.
  const filteredFiles = files.filter((f) => !missingOnly || !f.is_available);

  return (
    <ul role='list' className='divide-y divide-gray-200 border-t'>
      {filteredFiles.map((file, index) => (
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
  const [showMissing, setShowMissing] = useState(false);

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

          {/* Add badges with the file counts. */}
          {fileBadges(files)}
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

  // Display a toggle button for limiting displayed results to only missing files.
  const showMissingToggle = () => {
    return (
      <div className='flex justify-end px-2 py-1'>
        <Switch.Group as='div' className='flex items-center'>
          {/* */}
          <Switch.Label as='span' className='mr-3'>
            <span className='text-sm font-medium text-gray-500'>
              Show missing only
            </span>
          </Switch.Label>

          {/* */}
          <Switch
            checked={showMissing}
            onChange={setShowMissing}
            className={`${showMissing ? 'bg-indigo-600' : 'bg-gray-200'}
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
          >
            <span
              aria-hidden='true'
              className={`${showMissing ? 'translate-x-4' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
        </Switch.Group>
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
      {showMissingToggle()}
      {fileList(files, showMissing)}
      {footer()}
    </div>
  );
});
