<script>
import { Bar } from 'vue-chartjs'
import * as d3 from "d3";

export default {
  extends: Bar,
  name: 'BarChart',
  props: ["trackInfo", "feature"],
  methods: {
    toProperCase: function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      }
  },
  data: () => ({
    chartData: null,
    options: null,
  }),
  mounted () {
    // Grab data and feature from props
    const myData = this.trackInfo;
    const feature = this.feature;
    
    // Sort data according to feature
    const chartDataArray = myData.sort((a, b) => d3.ascending(a[feature], b[feature]));

    // Grab labels, which are a combination of name + artist
    const dataLabels = chartDataArray.map(d => d.name + " by " + d.artists[0].name);
    
    // Chart.ks parameters
    const chartData = { 
      labels: dataLabels,
      datasets: [
        {
          label: this.toProperCase(feature),
          data: chartDataArray.map(d => d[feature]),
          backgroundColor: '#1DB954',
          borderColor: "grey",
          borderWidth: 0.15,
          // categoryPercentage: .95,
          // barPercentage: .9,
        },
      ],
    }
    this.chartData = chartData;

    const options = {
        legend: {
          display: false
        },
        title: {
          display: false,
        },
        scales: {
          xAxes: [{
              ticks: {
                  display: false 
              }
          }]
        },
        tooltips: {
          displayColors: false,
        },
        responsive: true, 
        maintainAspectRatio: true
      };        
      this.options = options;

      this.renderChart(this.chartData, this.options)
    },
}
</script>

<style>
</style>
