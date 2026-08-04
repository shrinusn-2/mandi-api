import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ historyData, commodity, state }) {
  if (!historyData || historyData.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          No trend history data available for {commodity || 'selected crop'} in {state || 'selected state'}.
        </p>
      </div>
    );
  }

  const labels = historyData.map(item => item.arrival_date);
  const modalPrices = historyData.map(item => item.avg_modal_price || item.modal_price);
  const minPrices = historyData.map(item => item.avg_min_price || item.min_price);
  const maxPrices = historyData.map(item => item.avg_max_price || item.max_price);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Modal Price (₹/Quintal)',
        data: modalPrices,
        borderColor: '#d89b3c',
        backgroundColor: 'rgba(216, 155, 60, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#d89b3c',
        pointRadius: 4
      },
      {
        label: 'Min Price (₹)',
        data: minPrices,
        borderColor: '#b5502e',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.3
      },
      {
        label: 'Max Price (₹)',
        data: maxPrices,
        borderColor: '#e8c468',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#b8ac97',
          font: { family: 'Plus Jakarta Sans', size: 12 }
        }
      },
      title: {
        display: true,
        text: `Daily Price Trends — ${commodity} (${state})`,
        color: '#ede6d6',
        font: { family: 'Plus Jakarta Sans', size: 15, weight: '700' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#b8ac97' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#b8ac97' }
      }
    }
  };

  return (
    <div className="glass-card" style={{ height: '360px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
