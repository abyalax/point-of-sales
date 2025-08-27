import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useMemo, useRef } from 'react';
import { formatCurrency } from '~/utils/format';
import { Loader } from '@mantine/core';
import { Chart } from 'chart.js';
import type { SalesByCategory } from '~/modules/transaction/transaction.schema';
import { Container } from '~/components/ui/container/container';
import Lottie from 'lottie-react';
import { NotDataFoundV1 } from '~/assets';
import { getColors } from '~/components/themes';

Chart.register(ChartDataLabels);

export function SalesPieChart({ data, loading }: { data?: SalesByCategory[]; loading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const total_sold = useMemo(() => data?.reduce((acc, e) => acc + parseFloat(e.total_qty), 0) ?? 0, [data]);
  const categories = useMemo(
    () => data?.map((e) => `${e.category} : ${((parseInt(e.total_qty) / total_sold) * 100).toFixed(2)}%`) ?? [],
    [data, total_sold],
  );
  const data_sold = useMemo(() => data?.map((e) => parseFloat(e.total_qty)) ?? [], [data]);

  useEffect(() => {
    if (data === undefined) return;
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Total Sales',
            data: data_sold,
            borderWidth: 1,
            backgroundColor: ['#30b4e1', '#3b7ddd', '#23bf93', '#ff6b6b', '#ff9f43', '#e9c46a'],
            hoverBackgroundColor: ['#1e8fb7', '#2662b0', '#178068', '#cc5252', '#cc7c26', '#b89a4f'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            color: 'white',
            formatter(value, context) {
              const label = context.chart.data.labels![context.dataIndex] as string;
              if ((value / total_sold) * 100 < 15) return label.split(':')[0];
              return label;
            },
            font: {
              size: 16,
            },
            textAlign: 'center',
          },
          legend: {
            position: 'top',
            title: {
              display: true,
              position: 'center',
              text: 'Categories',
            },
            fullSize: true,
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            displayColors: true,
            callbacks: {
              title(tooltipItems) {
                return data[tooltipItems[0].dataIndex].category;
              },
              afterTitle(tooltipItems) {
                return `${data[tooltipItems[0].dataIndex].total_qty} items sold`;
              },
              beforeBody(tooltipItem) {
                return `Total Revenue: ${formatCurrency(data[tooltipItem[0].dataIndex].total_revenue)}`;
              },
              afterBody(tooltipItem) {
                return `Total Profit: ${formatCurrency(data[tooltipItem[0].dataIndex].total_profit)}`;
              },
              label(tooltipItem) {
                return `Total Sales: ${formatCurrency(data[tooltipItem.dataIndex].total_sales)}`;
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [categories, data, data_sold, total_sold]);

  if (loading) {
    return (
      <Container w={'100%'} h={'100%'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader color="blue" size="xl" type="dots" />
      </Container>
    );
  }

  if (data === undefined) {
    return (
      <Container
        w={'100%'}
        h={'100%'}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: getColors('primary') }}
      >
        <Lottie
          color="red"
          allowTransparency
          autoplay
          loop
          animationData={NotDataFoundV1}
          style={{ height: '300px', width: '300px', backgroundColor: 'red' }}
        />
      </Container>
    );
  }
  return <canvas ref={canvasRef} />;
}
