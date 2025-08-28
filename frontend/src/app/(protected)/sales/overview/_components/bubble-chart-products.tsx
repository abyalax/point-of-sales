import type { ProductProfitable } from '~/modules/product/product.schema';
import { Container } from '~/components/ui/container/container';
import { useMantineColorScheme } from '@mantine/core';
import { LoadingV1, NotDataFoundV2 } from '~/assets';
import { useEffect, useMemo, useRef } from 'react';
import Lottie from 'lottie-react';
import { Chart } from 'chart.js';
import Big from 'big.js';
import { formatCurrency } from '~/utils/format';

interface MatrixBubbleCharts {
  x: number;
  y: number;
  r: number;
  label: string;
  category: string;
  revenue: number;
}

type MatrixChart = Chart<'bubble', MatrixBubbleCharts[], unknown>;

export function ProductBubbleChart(props: { data?: ProductProfitable[]; isLoading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<MatrixChart | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isLightMode = colorScheme === 'light';

  const revenues = props.data?.map((d) => Number(d.revenue)) ?? [];
  const minRev = revenues.length > 0 ? Math.min(...revenues) : 0;
  const maxRev = revenues.length > 0 ? Math.max(...revenues) : 1;

  const categoryColors = useMemo(() => {
    const palette = ['#18551aff', '#2196f3', '#ff9800', '#3027b0ff', '#f44336', '#00bcd4', '#acfa52ff', '#ffeb3b', '#795548', '#607d8b'];

    function djb2Hash(str: string) {
      let hash = 5381;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) + hash + str.charCodeAt(i);
      }
      return Math.abs(hash);
    }

    const categories = Array.from(new Set(props.data?.map((d) => d.category)));
    const map: Record<string, string> = {};

    categories.forEach((category) => {
      map[category] = palette[djb2Hash(category) % palette.length];
    });

    return map;
  }, [props.data]);

  const bubbles = useMemo(
    () =>
      props.data?.map((d) => {
        const min = new Big(minRev);
        const max = new Big(maxRev);
        const revenue = new Big(d.revenue);
        const margin = new Big(d.margin_percentage).mul(100);
        const r = 5 + 25 * revenue.minus(min).div(max.minus(min)).toNumber(); // scale radius 5 - 30 px
        const quantity = d.quantity;

        return {
          x: quantity,
          y: margin.toNumber(),
          r,
          label: d.name,
          category: d.category,
          revenue: revenue.toNumber(),
        };
      }) ?? [],
    [maxRev, minRev, props.data],
  );

  useEffect(() => {
    if (!canvasRef.current || bubbles.length === 0) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart<'bubble', MatrixBubbleCharts[], unknown>(canvasRef.current, {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'Product Profitable',
            datalabels: { display: false },
            data: bubbles,
            backgroundColor: (ctx) => {
              const raw = ctx.raw as MatrixBubbleCharts;
              const category = raw.category;
              return categoryColors[category] ?? '#9e9e9e';
            },
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        aspectRatio: 5 / 2,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(context) {
                const point = context.raw as MatrixBubbleCharts;
                return [
                  `${point.label} (${point.category})`,
                  `Volume: ${point.x} items`,
                  `Margin: ${point.y.toFixed(2)}%`,
                  `Revenue: ${formatCurrency(point.revenue.toString())}`,
                ];
              },
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Quantity Sold', color: isLightMode ? '#202020' : '#d4d0d0' },
            ticks: { color: isLightMode ? '#202020' : '#d4d0d0' },
            grid: { display: false },
          },
          y: {
            title: { display: true, text: 'Margin (%)', color: isLightMode ? '#202020' : '#d4d0d0' },
            ticks: { color: isLightMode ? '#202020' : '#d4d0d0' },
            grid: { display: false },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [bubbles, categoryColors, isLightMode]);

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
