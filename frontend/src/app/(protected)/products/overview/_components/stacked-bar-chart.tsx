import type { ProductDiscountImpact } from '~/modules/product/product.schema';
import { Container } from '~/components/ui/container/container';
import { useMantineColorScheme } from '@mantine/core';
import { LoadingV1, NotDataFoundV2 } from '~/assets';
import { useEffect, useMemo, useRef } from 'react';
import { Chart } from 'chart.js';
import Lottie from 'lottie-react';

export function ProductStackedBarCharts({ data, loading }: { data?: ProductDiscountImpact[]; loading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const { colorScheme } = useMantineColorScheme();

  const isLightMode = colorScheme === 'light';
  const total_with_discount = useMemo(() => data?.map((item) => parseFloat(item.with_discount)) ?? [], [data]);
  const total_without_discount = useMemo(() => data?.map((item) => parseFloat(item.without_discount)) ?? [], [data]);
  const names = useMemo(() => data?.map((item) => item.name) ?? [], [data]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (data === undefined) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [
          {
            label: 'Total Sold With Discount',
            backgroundColor: '#30b4e1',
            hoverBackgroundColor: '#138cb4ff',
            data: total_with_discount,
          },
          {
            label: 'Total Sold Without Discount',
            backgroundColor: '#f39c12',
            hoverBackgroundColor: '#d68910',
            data: total_without_discount,
          },
        ],
      },
      options: {
        aspectRatio: 6 / 2,
        responsive: true,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          datalabels: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            callbacks: {
              label: (tooltipItems) => {
                return `${tooltipItems.dataset.label} : ${tooltipItems.formattedValue} items`;
              },
            },
          },
          legend: {
            display: true,
            align: 'center',
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [data, isLightMode, names, total_with_discount, total_without_discount]);

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
