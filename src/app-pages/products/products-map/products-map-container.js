import { MapContainer, TileLayer } from 'react-leaflet';

export default function ProductsMapContainer() {
  return (
    <div className='map-container'>
      <MapContainer center={[37.1, -95.7]} zoom={4} scrollWheelZoom={false}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
}
