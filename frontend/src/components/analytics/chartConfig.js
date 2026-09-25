import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Register all required Chart.js components once for the entire application
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      titleColor: "#F8FAFC",
      bodyColor: "#E2E8F0",
      borderColor: "rgba(51, 65, 85, 0.5)",
      borderWidth: 1,
      padding: 8,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: "#94A3B8",
        font: { size: 10 }
      }
    },
    y: {
      grid: {
        color: "rgba(148, 163, 184, 0.1)"
      },
      ticks: {
        color: "#94A3B8",
        font: { size: 10 }
      }
    }
  }
};

export default ChartJS;
