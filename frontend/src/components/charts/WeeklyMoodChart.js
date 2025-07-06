import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getMoodEmoji } from '../../utils/moodData';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyMoodChart = ({ data, title = "Weekly Mood Patterns" }) => {
  // Transform data for chart
  const formatChartData = () => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = data.map(item => {
      const date = new Date(item._id.year, item._id.month - 1, item._id.day);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    });

    const morningData = data.map(item => item.morningMood || 0);
    const afternoonData = data.map(item => item.afternoonMood || 0);
    const eveningData = data.map(item => item.eveningMood || 0);
    const averageData = data.map(item => item.averageMood);

    return {
      labels,
      datasets: [
        {
          label: 'Morning',
          data: morningData,
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: '#ffc107',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Afternoon',
          data: afternoonData,
          backgroundColor: 'rgba(255, 152, 0, 0.7)',
          borderColor: '#ff9800',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Evening',
          data: eveningData,
          backgroundColor: 'rgba(156, 39, 176, 0.7)',
          borderColor: '#9c27b0',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
        {
          label: 'Daily Average',
          data: averageData,
          type: 'line',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          yAxisID: 'y'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label;
            const value = context.parsed.y;
            
            if (value === 0) {
              return `${label}: No data`;
            }
            
            const emoji = getMoodEmoji(Math.round(value));
            return `${label}: ${emoji} ${value.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280',
          callback: function(value) {
            if (value === 0) return '';
            return getMoodEmoji(value);
          }
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const chartData = formatChartData();

  if (chartData.labels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <span className="text-4xl mb-2 block">📅</span>
            <p>No weekly data available</p>
            <p className="text-sm">Track your mood at different times to see patterns!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Track your mood at different times of the day to identify patterns and optimize your daily routine.</p>
      </div>
    </div>
  );
};

export default WeeklyMoodChart; 