import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet/hooks';
import * as Leaflet from 'leaflet';
import {
  TerraDraw,
  TerraDrawRectangleMode,
  TerraDrawSelectMode,
} from 'terra-draw';
import { TerraDrawLeafletAdapter } from 'terra-draw-leaflet-adapter';

export default function ProductsMapOverlay() {
  const draw = useRef(null);
  const map = useMap();

  useEffect(() => {
    const terraDraw = new TerraDraw({
      adapter: new TerraDrawLeafletAdapter({
        lib: Leaflet,
        map,
      }),
      modes: [
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

    draw.current = terraDraw;
  }, []);

  return null;
}
