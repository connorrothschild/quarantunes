<script>
import { Bar } from 'vue-chartjs'
import * as d3 from "d3";

export default {
  extends: Bar,
  name: 'PolarChart',
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
    const myData = this.trackInfo;
    const feature = this.feature;
    console.log(myData);

    console.log(this.$props.feature)
    
    const chartDataArray = myData.sort((a, b) => d3.ascending(a[feature], b[feature]));
    console.log(chartDataArray)

    const dataLabels = chartDataArray.map(d => d.name + " by " + d.artists[0].name);
    console.log(dataLabels);
    
    const chartData = { 
      labels: dataLabels,
      datasets: [
        {
          label: this.toProperCase(feature),
          data: chartDataArray.map(d => d[feature]),
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
              text: this.toProperCase(feature),
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
        tooltips: {
          displayColors: false,
        },
        responsive: false, // need to make response and maintain aspect ratio = false to make the chart load in tab https://stackoverflow.com/questions/48902410/vue-chart-js-doesnt-get-initialized-in-vue-tab
        maintainAspectRatio: true
        
      };        
      this.options = options;
      console.log(options)

      this.renderChart(this.chartData, this.options)
    },
  watch: {
    trackInfo: function () {
      this.renderChart(this.chartData, this.options)
    }
  }
}
</script>

<style>
</style>
