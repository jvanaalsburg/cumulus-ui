import { useEffect, useRef, useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { timeMonth, utcTicks, utcWeek } from 'd3';
import useElementSize from '../../../custom-hooks/useElementSize';
import { mergeRefs } from '../../../utils';

// width to height ratio to make our cells square
const ratio = 640 / 112;

export default function WaterYearHeatMap({ year = 2022, data, onclick }) {
  const ticks = useMemo(() => {
    const waterYearStart = new Date(`10-01-${year - 1}`);
    const waterYearEnd = new Date(`10-01-${year}`);
    const t = {};
    utcTicks(waterYearStart, waterYearEnd, timeMonth).forEach((tickDate) => {
      const x = utcWeek.count(waterYearStart, tickDate);
      const label = tickDate.toLocaleString('default', { month: 'short' });
      t[x] = label;
    });
    return t;
  }, [year]);

  const elRef = useRef();
  const [sizeRef, { width }] = useElementSize();

  useEffect(() => {
    if (!data) return null;
    const Chart = Plot.plot({
      height: width / ratio,
      width: width,
      x: {
        axis: 'top',
        ticks: Number(Object.keys(ticks)),
        tickFormat: (i) => {
          return ticks[i];
        },
        tickSize: 0,
        align: 0.5,
      },
      y: {
        padding: 0,
        tickFormat: Plot.formatWeekday('en', 'narrow'),
        tickSize: 0,
      },
      color: {
        type: 'threshold',
        domain: [0, 1, 24], // max is hours in the day
        scheme: 'bugn',
      },
      marks: [
        Plot.cell(data, {
          x: (d) => d.x,
          y: (d) => d.y,
          fill: (d) => (d.count ? d.count : -1),
          inset: 0.6,
          channels: {
            date: (d) => d.date.toLocaleDateString(),
            files: 'count',
          },
          tip: {
            format: {
              x: false,
              y: false,
              fill: false,
              date: true,
              files: true,
            },
          },
          render(index, scales, values, dimensions, context, next) {
            const g = next(index, scales, values, dimensions, context);
            for (let i = 0; i < index.length; i++) {
              g.childNodes[i].onclick = () => {
                let date = values.channels.date.value[i];
                onclick(date);
              };
            }
            return g;
          },
        }),
        // Possibly turn this on via config?
        // Plot.text(data, {
        //   x: (d) => d.x,
        //   y: (d) => d.y,
        //   text: (d) => (d.count ? d.count : ''),
        // }),
      ],
    });
    elRef.current.append(Chart);
    return () => Chart.remove();
  }, [elRef, data, ticks, width]);

  return (
    <div className='w-full'>
      <div className='mt-3 mb-2 max-w-2xl text-sm text-gray-500'>{`Water Year ${year}`}</div>
      <div className='w-full' ref={mergeRefs(elRef, sizeRef)} />
    </div>
  );
}
