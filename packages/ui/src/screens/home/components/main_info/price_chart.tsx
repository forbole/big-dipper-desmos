import { readTheme } from '@/recoil/settings';
import axios from 'axios';
import { createChart, IChartApi, SingleValueData } from 'lightweight-charts';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Spinner from '@/components/loadingSpinner';
import daysjs from 'dayjs';

// import useTranslation from 'next-translate/useTranslation';
import useStyles from './styles';

const PriceChart: React.FC = () => {
  const { classes } = useStyles();
  const chartRef = useRef<IChartApi>();
  const theme = useRecoilValue(readTheme);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isError, setIsError] = useState<Boolean>(false);
  const [data, setData] = useState<SingleValueData[]>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        try {
          setIsLoading(true);
          setIsError(false);
          const to = daysjs();
          const from = daysjs().subtract(7, 'day');
          const response = await axios.get('https://api.sologenic.org/api/v1/chartcombinator', {
            params: {
              period: '1h',
              from: from.unix(),
              to: to.unix(),
              issuer: 'rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D',
              currency: '434F524500000000000000000000000000000000',
            },
          });
          if (response.status === 200) {
            setData(response.data);
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Error fetching price chart.', e);
          setIsLoading(false);
          setIsError(true);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && !chartRef.current && data) {
      const chartOptions = {
        layout: {
          textColor: theme === 'dark' ? 'white' : 'black',
          background: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
        },
        grid: {
          vertLines: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
          horzLines: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
        },
        // disable scaling and panning since we aren't implementing a scrollback-refetch
        handleScroll: false,
        handleScale: false,
      };
      const chartPrice = document.getElementById('price-chart')!;
      chartRef.current = createChart(chartPrice, chartOptions);
      const baselineSeries = chartRef.current.addBaselineSeries({
        baseValue: {
          type: 'price',
          price: data[0].value,
        },
        topLineColor: 'rgba( 38, 166, 154, 1)',
        topFillColor1: 'rgba( 38, 166, 154, 0.28)',
        topFillColor2: 'rgba( 38, 166, 154, 0.05)',
        bottomLineColor: 'rgba( 239, 83, 80, 1)',
        bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
        bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
      });

      baselineSeries.setData(data);

      chartRef.current.timeScale().fitContent();
    }
  }, [data]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          textColor: theme === 'dark' ? 'white' : 'black',
          background: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
        },
        grid: {
          vertLines: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
          horzLines: {
            color: theme === 'dark' ? '#1B1D23' : 'white',
          },
        },
      });
    }
  }, [theme]);

  useEffect(() => {
    const handle = (e: any) => {
      const container: any = document.getElementById('price-chart');
      const dimensions = {
        width: e.target.innerWidth * (e.target.innerWidth > 767 ? 0.5 : 0.83),
        height: container.clientHeight,
      };
      chartRef.current?.applyOptions(dimensions);
    };
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('resize', handle);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner customStyle={{ justifyContent: 'center' }} />
      ) : (
        !isError && <div className={classes.chart} id="price-chart" />
      )}
      {isError && (
        <div className={classes.error}>
          Error getting price chart. Please refresh or try again later
        </div>
      )}
    </>
  );
};

export default PriceChart;
