import React from 'react';
import Modal from './app-components/Modal';
import AppContainer from './app-container/app-container';
// import Notification from './app-components/Notification';

import "leaflet/dist/leaflet.css";

const App = () => {
  return (
    <>
      {/* <Notification /> */}
      <AppContainer />
      <Modal />
    </>
  );
};

export default App;
