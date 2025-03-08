import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useMap } from 'react-leaflet/hooks';
import * as Leaflet from 'leaflet';
import {
  TerraDraw,
  TerraDrawRectangleMode,
  TerraDrawRenderMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';
import shp from 'shpjs';
import * as turf from '@turf/turf';

const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>`;

const uploadIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>`;

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>`;

const ProductsMapOverlay = forwardRef(function (props, ref) {
  const draw = useRef(null);
  const featureId = useRef(null);
  const layerGroup = useRef(null);
  const fileInput = useRef(null);
  const map = useMap();

  useImperativeHandle(
    ref,
    () => {
      return { disableEditing };
    },
    []
  );

  const disableEditing = () => {
    draw.current.setMode('render');
  };

  useEffect(() => {
    const terraDraw = new TerraDraw({
      adapter: new TerraDrawLeafletAdapter({
        lib: Leaflet,
        map,
      }),
      modes: [
        new TerraDrawRenderMode({
          modeName: 'render',
        }),
        new TerraDrawRectangleMode(),
        new TerraDrawSelectMode({
          flags: {
            rectangle: {
              feature: {
                draggable: true,
                coordinates: {
                  resizable: 'opposite',
                },
              },
            },
          },
        }),
      ],
    });

    terraDraw.start();
    terraDraw.setMode('rectangle');

    terraDraw.on('change', onChange);
    terraDraw.on('finish', onCreate);

    Leaflet.easyButton(editIcon, onEdit).addTo(map);
    Leaflet.easyButton(trashIcon, onDelete).addTo(map);
    Leaflet.easyButton(uploadIcon, async () =>
      fileInput.current?.click(),
    ).addTo(map);

    draw.current = terraDraw;
  }, []);

  const onChange = () => {
    const snapshot = draw.current.getSnapshot()[0];
    props.onRegionUpdate({ type: 'FeatureCollection', features: [snapshot] });
  };

  const onCreate = (id, context) => {
    draw.current.selectFeature(id);
    featureId.current = id;
    onChange();
  };

  const onEdit = () => {
    draw.current.selectFeature(featureId.current);
  };

  const onDelete = () => {
    if (layerGroup.current) {
      map.removeLayer(layerGroup.current);
      layerGroup.current = null;
    }

    draw.current.clear();
    draw.current.setMode('rectangle');

    props.onRegionUpdate(null);
    props.onGeometryUpdate(null);
  };

  const onFileUpload = async (e) => {
    const file = e.target.files[0];

    const data = await file.arrayBuffer();
    const geojson = await shp(data);

    const simplified = await turf.convex(geojson);

    props.onRegionUpdate(simplified);
    props.onGeometryUpdate(geojson);

    const group = new Leaflet.LayerGroup();
    group.addLayer(Leaflet.geoJSON(geojson));
    group.addLayer(
      Leaflet.geoJSON(simplified, {
        style: {
          color: 'lime',
          fillOpacity: 0.0,
        },
      }),
    );
    group.addTo(map);

    layerGroup.current = group;

    draw.current.setMode('render');
  };

  return (
    <div ref={ref}>
      <input
        type='file'
        ref={fileInput}
        onChange={onFileUpload}
        style={{ display: 'none' }}
      />
    </div>
  );
});

export default ProductsMapOverlay;
