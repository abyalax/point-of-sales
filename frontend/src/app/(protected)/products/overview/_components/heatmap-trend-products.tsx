import { Chart, type ChartDataset } from 'chart.js';
import { useEffect, useMemo, useRef } from 'react';
import Lottie from 'lottie-react';
import { LoadingV1, NotDataFoundV2 } from '~/assets';
import { Container } from '~/components/ui/container/container';
import type { ProductTrending } from '~/modules/product/product.schema';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isoWeekYear from 'dayjs/plugin/isoWeeksInYear';
import { useMantineColorScheme } from '@mantine/core';
dayjs.extend(isoWeek);
dayjs.extend(isoWeekYear);

interface MatrixCategoryPoint {
  x: number;
  y: number;
  v: number;
}
type MatrixChart = Chart<'matrix', MatrixCategoryPoint[], unknown>;
export function ProductHeatmapTrend(props: { data?: ProductTrending[]; isLoading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<MatrixChart | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isLightMode = colorScheme === 'light';

  const xLabels = useMemo(() => {
    const weeks = [...new Set(props.data?.map((d) => d.periode))];
    return weeks;
  }, [props.data]);

  const yLabels = useMemo(() => {
    const products = [...new Set(props.data?.map((d) => d.name))];
    return products;
  }, [props.data]);

  const formatPeriode = (value: number) => {
    const str = value.toString();
    if (str.length !== 6) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'];
      return months[value - 1];
    }
    const year = parseInt(str.slice(0, 4), 10);
    const week = parseInt(str.slice(4), 10);
    const date = dayjs().year(year).isoWeek(week);
    const start = date.startOf('isoWeek');
    const end = date.endOf('isoWeek');
    return `${start.format('D')} - ${end.format('D MMMM')}`;
  };

  const matrix: MatrixCategoryPoint[] = useMemo(() => {
    if (!props.data) return [];
    const matrixData: MatrixCategoryPoint[] = [];
    xLabels.forEach((periode, xIndex) => {
      yLabels.forEach((product, yIndex) => {
        const dataPoint = props.data?.find((item) => item.periode === periode && item.name === product);
        matrixData.push({
          x: xIndex,
          y: yIndex,
          v: dataPoint ? dataPoint.total_qty : 0,
        });
      });
    });
    return matrixData;
  }, [props.data, xLabels, yLabels]);

  const xCount = xLabels.length;
  const yCount = yLabels.length;
  const values = matrix.map((m) => m.v);
  const min = Math.min(...values);
  const max = Math.max(...values);

  useEffect(() => {
    if (!canvasRef.current || matrix.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    function getBackgroundColor(value: number) {
      if (value === 0) return isLightMode ? '#f3f4f6' : '#6e6e6eff'; // Warna abu-abu terang untuk nilai 0
      const ratio = (value - min) / (max - min || 1);
      const hue = ratio * 120; // 0 = merah, 120 = hijau
      return isLightMode ? `hsl(${hue}, 70%, 50%)` : `hsl(${hue}, 90%, 30%)`;
    }

    function getHoverBackgroundColor(value: number) {
      if (value === 0) {
        return '#bdbec0ff';
      }
      const ratio = (value - min) / (max - min || 1);
      const hue = ratio * 120; // 0 = merah, 120 = hijau
      return `hsl(${hue}, 70%, 40%)`;
    }

    const data: ChartDataset<'matrix', MatrixCategoryPoint[]> = {
      label: 'Product Trending',
      data: matrix,
      backgroundColor(context) {
        const point = context.dataset.data[context.dataIndex] as MatrixCategoryPoint;
        return getBackgroundColor(point.v);
      },
      hoverBackgroundColor(ctx) {
        const point = ctx.dataset.data[ctx.dataIndex] as MatrixCategoryPoint;
        return getHoverBackgroundColor(point.v);
      },
      borderColor: '#ffffff',
      borderWidth: 1,
      width: ({ chart }) => (chart.chartArea?.width ?? 0) / xCount - 1,
      height: ({ chart }) => (chart.chartArea?.height ?? 0) / yCount - 1,
      anchorX: 'center',
      anchorY: 'center',
      datalabels: {
        display: false,
      },
    };

    chartRef.current = new Chart<'matrix', MatrixCategoryPoint[], unknown>(canvasRef.current, {
      type: 'matrix',
      data: { datasets: [data] },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        aspectRatio: 5 / 2,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title() {
                return '';
              },
              label(context) {
                const point = context.dataset.data[context.dataIndex] as MatrixCategoryPoint;
                const product = yLabels[point.y];
                const periode = xLabels[point.x];
                return `${product} (${formatPeriode(periode)}): ${point.v} pcs`;
              },
            },
          },
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: -0.5,
            max: xCount - 0.5,
            offset: false,
            alignToPixels: true,
            display: true,
            grid: { display: false },
            ticks: {
              callback: function (value) {
                const index = Math.round(value as number);
                return index >= 0 && index < xLabels.length ? formatPeriode(xLabels[index]) : '';
              },
              stepSize: 1,
              color: isLightMode ? '#202020ff' : '#d4d0d0ff',
              align: 'start',
              font: {
                size: 14,
              },
            },
          },
          y: {
            type: 'linear',
            min: -0.5,
            max: yCount - 0.5,
            grid: { display: false },
            ticks: {
              callback: function (value) {
                const index = Math.round(value as number);
                return index >= 0 && index < yLabels.length ? yLabels[index] : '';
              },
              stepSize: 1,
              color: isLightMode ? '#202020ff' : '#d4d0d0ff',
              align: 'start',
              font: {
                size: 14,
              },
            },
          },
        },
        layout: {
          padding: 0,
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [matrix, props.data, max, min, xCount, xLabels, yCount, yLabels, isLightMode]);

  if (props.isLoading) {
    return (
      <Container w={'100%'} h={'100%'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Lottie autoplay loop animationData={LoadingV1} style={{ height: '300px', width: '300px' }} />
      </Container>
    );
  }

  if (!props.data || props.data.length === 0) {
    return (
      <Container w={'100%'} h={'100%'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Lottie autoplay loop animationData={NotDataFoundV2} style={{ height: '300px', width: '300px' }} />
      </Container>
    );
  }

  return <canvas ref={canvasRef} />;
}
