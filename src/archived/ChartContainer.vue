<template>
  <div class="container">
    <BarChart/>
  </div>
</template>

<script>
import BarChart from "./BarChart.vue";
import * as d3 from "d3";
import { mapGetters } from "vuex";

export default {
  name: 'ChartContainer',
  props: ["trackInfo"],
  components: { BarChart },
    computed: {
    ...mapGetters({
      trackInfo: "getTrackInfo",
    }),
    },
  data: () => ({
    chartData: null,
    options: null,
  }),
  async mounted () {
    const myData = this.trackInfo;
    console.log(this.trackInfo);

    const chartDataArray = myData.sort((a, b) =>
        d3.ascending(a.danceability, b.danceability)
      );

    const dataLabels = chartDataArray.map(d => d.name + " by " + d.artists[0].name);
    
    const chartData = { 
      labels: dataLabels,
      datasets: [
        {
          label: "Danceability",
          data: chartDataArray.map(d => d.danceability),
          backgroundColor: '#1DB954',
          borderColor: "grey",
          borderWidth: 0.15,
        },
      ],
    }
    this.chartData = chartData;
    console.log(chartData);

const options = {
      legend: {
        display: false
      },
      title: {
            display: true,
            text: 'Danceability',
            fontSize: 24,
            fontColor: '#FFFFFF'
        },
      scales: {
        xAxes: [{
            ticks: {
                display: false //this will remove only the label
            }
        }]
      },
      responsive: true,
      tooltips: {
        displayColors: false,
      },
      maintainAspectRatio: false
    };
    this.options = options;
    console.log(options)
  },
}
</script>
