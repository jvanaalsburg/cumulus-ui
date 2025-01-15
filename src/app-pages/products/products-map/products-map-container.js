import { MapContainer, TileLayer } from 'react-leaflet';
import ProductsMapOverlay from './products-map-overlay';

export default function ProductsMapContainer(props) {
  return (
    <div className='map-container'>
      <MapContainer center={[37.1, -95.7]} zoom={4} scrollWheelZoom={false}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        <ProductsMapOverlay onRegionUpdate={props.onRegionUpdate} />
      </MapContainer>
    </div>
  );
}
