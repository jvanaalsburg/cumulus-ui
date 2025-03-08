import { useRef, forwardRef, useImperativeHandle } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ProductsMapOverlay from './products-map-overlay';

const ProductsMapContainer = forwardRef(function (props, ref) {
  const mapOverlay = useRef(null);

  useImperativeHandle(
    ref,
    () => {
      return { disableEditing };
    },
    []
  );

  const disableEditing = () => {
    mapOverlay.current.disableEditing();
  };

  return (
    <div ref={ref} className='map-container'>
      <MapContainer center={[37.1, -95.7]} zoom={4} scrollWheelZoom={false}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <ProductsMapOverlay
          ref={mapOverlay}
          onRegionUpdate={props.onRegionUpdate}
          onGeometryUpdate={props.onGeometryUpdate}
        />
        {props.locations.map((loc, i) => (
          <Marker
            key={`loc-${i}`}
            position={[loc.location.lat, loc.location.lon]}
          >
            <Popup>
              <h2>{loc.name}</h2>
              <p>{loc.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
});

export default ProductsMapContainer;
