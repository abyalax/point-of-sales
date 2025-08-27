import type { ReportSales } from '~/modules/transaction/transaction.schema';
import { useEffect, useMemo, useRef } from 'react';
import { Chart } from 'chart.js';
import { Container } from '~/components/ui/container/container';
import { LoadingV1, NotDataFoundV2 } from '~/assets';
import Lottie from 'lottie-react';

export function SalesLineChart({ data, loading }: { data?: ReportSales[]; loading: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  const total_sales = useMemo(() => data?.map((item) => parseFloat(item.total_sales)) ?? [], [data]);
  const total_revenue = useMemo(() => data?.map((item) => parseFloat(item.total_revenue)) ?? [], [data]);
  const total_profit = useMemo(() => data?.map((item) => parseFloat(item.total_profit)) ?? [], [data]);
  const months = useMemo(() => data?.map((item) => item.month) ?? [], [data]);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (data === undefined) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Sales',
            fill: true,
            tension: 0.4,
            borderCapStyle: 'round',
            pointRadius: 0.2,
            backgroundColor: 'transparent',
            borderColor: '#30b4e1',
            data: total_sales,
          },
          {
            label: 'Revenue',
            fill: true,
            tension: 0.4,
            borderCapStyle: 'round',
            pointRadius: 0.2,
            backgroundColor: 'transparent',
            borderColor: '#3b7ddd',
            data: total_revenue,
          },
          {
            label: 'Profit',
            fill: true,
            tension: 0.4,
            borderCapStyle: 'round',
            pointRadius: 0.2,
            backgroundColor: 'transparent',
            borderColor: '#23bf93',
            borderDash: [4, 4],
            data: total_profit,
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
                return `${tooltipItems.dataset.label} : Rp ${tooltipItems.formattedValue}`;
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
  }, [data, months, total_profit, total_revenue, total_sales]);

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

  return <canvas ref={canvasRef} />;
}
