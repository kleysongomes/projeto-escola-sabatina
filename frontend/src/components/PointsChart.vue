<template>
  <div class="chart-container">
    <apexchart
      v-if="chartData.series"
      type="area"
      height="350"
      :options="chartData.chartOptions"
      :series="chartData.series"
    ></apexchart>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  historyData: {
    type: Array,
    required: true,
  },
});

const authStore = useAuthStore();

const chartData = computed(() => {
  if (!props.historyData || props.historyData.length === 0) {
    return {};
  }

  const labels = props.historyData.map(item => {
    const parts = item.date.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  const points = props.historyData.map(item => item.points);

  const series = [{
    name: 'Pontos Ganhos',
    data: points,
  }];

  // A MÁGICA ACONTECE NA ATUALIZAÇÃO DESTAS OPÇÕES
  const chartOptions = {
    chart: {
      type: 'area', // MUDANÇA: de 'bar' para 'area'
      height: 350,
      toolbar: { show: false },
      fontFamily: 'Nunito, sans-serif',
      zoom: { enabled: false } // Desabilita o zoom
    },
    // plotOptions foi removido pois era específico para barras
    dataLabels: { enabled: false },
    // ADICIONADO: Configurações da linha
    stroke: {
      curve: 'smooth', // Linha curva
      width: 3,
    },
    // ADICIONADO: Configurações do preenchimento sob a linha
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    },
    // ADICIONADO: Marcadores nos pontos de dados
    markers: {
      size: 5,
      hover: {
        size: 7,
      }
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: authStore.user?.tema === 'dark' ? '#a6adc8' : '#777777',
          fontSize: '12px',
        }
      },
      tooltip: {
        enabled: false,
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: authStore.user?.tema === 'dark' ? '#a6adc8' : '#777777',
        }
      }
    },
    grid: {
      borderColor: authStore.user?.tema === 'dark' ? '#313244' : '#E5E5E5',
      strokeDashArray: 4
    },
    tooltip: {
      theme: authStore.user?.tema || 'light',
      y: {
        formatter: (val) => `${val} pontos`,
      },
    },
    colors: ['#3B82F6'],
  };

  return { series, chartOptions };
});
</script>

<style scoped>
.chart-container {
  width: 100%;
}
</style>