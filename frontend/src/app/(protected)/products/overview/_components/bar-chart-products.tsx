import type { ProductFrequencySold } from '~/modules/product/product.schema';
import { Container } from '~/components/ui/container/container';
import { LoadingV1, NotDataFoundV2 } from '~/assets';
import { useEffect, useMemo, useRef } from 'react';
import Lottie from 'lottie-react';
import { Chart } from 'chart.js';
import { useMantineColorScheme } from '@mantine/core';

export function ProductBarCharts({ data, loading }: { data?: ProductFrequencySold[]; loading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const { colorScheme } = useMantineColorScheme();

  const chartData = useMemo(() => {
    console.log('calculate bar chart data...');

    const threshold = Math.ceil((data?.length ?? 0) * 0.2);
    return (data ?? []).map((e, i) => ({
      name: e.name,
      total: e.total_product,
      category: e.category,
      backgroundColor: i < threshold ? '#30b4e1' : '#cccccc',
      hoverBackgroundColor: i < threshold ? '#138cb4ff' : '#928d8dff',
    }));
  }, [data]);

  const isLightMode = colorScheme === 'light';
  const labels = chartData.map((e) => e.name);
  const values = chartData.map((e) => e.total);
  const backgroundColor = chartData.map((e) => e.backgroundColor);
  const hoverBackgroundColor = chartData.map((e) => e.hoverBackgroundColor);

  console.log('rerender...');

  useEffect(() => {
    if (!canvasRef.current) return;
    if (data === undefined) return;
    if (chartRef.current) chartRef.current.destroy();
    console.log('rerender...');

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Product Sold',
            backgroundColor,
            hoverBackgroundColor,
            data: values,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        aspectRatio: 6 / 2,
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'point',
        },
        scales: {
          y: {
            ticks: {
              color: isLightMode ? '#202020ff' : '#d4d0d0ff',
              align: 'center',
              font: {
                size: 14,
              },
            },
          },
          x: {
            ticks: {
              color: isLightMode ? '#202020ff' : '#d4d0d0ff',
            },
          },
        },
        plugins: {
          datalabels: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'point',
            callbacks: {
              label: (tooltipItems) => {
                return `${tooltipItems.dataset.label} : ${tooltipItems.formattedValue} item`;
              },
              afterLabel: (tooltipItems) => {
                return `Category : ${data[tooltipItems.dataIndex].category}`;
              },
            },
          },
          legend: {
            display: true,
            align: 'center',
            labels: {
              color: isLightMode ? '#202020ff' : '#d4d0d0ff',
            },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [backgroundColor, data, hoverBackgroundColor, isLightMode, labels, values]);

  if (loading) {
    return (
      <Container w={'100%'} h={'100%'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Lottie autoplay loop animationData={LoadingV1} style={{ height: '300px', width: '300px' }} />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container w={'100%'} h={'100%'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Lottie autoplay loop animationData={NotDataFoundV2} style={{ height: '300px', width: '300px' }} />
      </Container>
    );
  }

  return <canvas ref={canvasRef} width={'calc(100% - 5rem)'} />;
}
