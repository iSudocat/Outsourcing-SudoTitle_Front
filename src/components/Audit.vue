<template>
  <section id="audit">
    <section>
      <mdb-row class="justify-content-center">
        <mdb-col lg="6" sm="12">
          <mdb-card cascade narrow class="mt-5">
            <mdb-view class="gradient-card-header blue darken-2">
              <h4 class="h4-responsive text-white">视频修改次数统计表</h4>
            </mdb-view>
            <mdb-card-body>
              <mdb-row>
                <mdb-col md="6">
                  <p>开始时间：</p>
                  <b-form-input id="date1" type="date"></b-form-input>
                </mdb-col>
                <mdb-col md="6">
                  <p>结束时间：</p>
                  <b-form-input id="date2" type="date"></b-form-input>
                </mdb-col>
              </mdb-row>
              <table style="margin-top: 30px" id="table" data-pagination="true" data-page-list="[5, 10, 20, all]"
                     data-show-footer="false"
                     data-page-size="5">
              </table>
            </mdb-card-body>
          </mdb-card>
        </mdb-col>

        <mdb-col lg="6" sm="12">
          <mdb-card cascade narrow class="mt-5">
            <mdb-view class="gradient-card-header blue darken-2">
              <h4 class="h4-responsive text-white">视频修改次数统计图</h4>
            </mdb-view>
            <mdb-card-body>
              <mdb-container>
                <mdb-pie-chart
                    id="pChart"
                    datalabels
                    :data="pieChartData"
                    :options="pieChartOptions"
                    :width="600"
                    :height="300"
                />
              </mdb-container>
            </mdb-card-body>
          </mdb-card>

        </mdb-col>

      </mdb-row>

      <mdb-row class="justify-content-center">
        <mdb-col md="12">
          <mdb-card cascade narrow class="mt-5">
            <mdb-view class="gradient-card-header blue darken-2">
              <h4 class="h4-responsive text-white">视频修改次数统计</h4>
            </mdb-view>
            <mdb-card-body>

              <table style="margin-top: 30px" id="table2" data-pagination="true" data-page-list="[5, 10, 20, all]"
                     data-show-footer="false"
                     data-page-size="5">
              </table>
            </mdb-card-body>
          </mdb-card>
        </mdb-col>
      </mdb-row>

    </section>
  </section>

</template>

<script>
/* eslint-disable */

import {mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbPieChart, mdbContainer} from 'mdbvue'
import $ from 'jquery'

export default {
  name: 'Audit',
  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbView,
    mdbCardBody,
    mdbPieChart,
    mdbContainer,
  },
  data() {
    return {
      startTime: '',
      endTime: '',
      pieChartData: {
        labels: this.clabels,
        datasets: [
          {
            data: this.cdata,
            backgroundColor: [
              "#F7464A",
              "#46BFBD",
              "#FDB45C",
              "#949FB1",
              "#4D5360"
            ],
            hoverBackgroundColor: [
              "#FF5A5E",
              "#5AD3D1",
              "#FFC870",
              "#A8B3C5",
              "#616774"
            ]
          }
        ]
      },
      pieChartOptions: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            color: "white",
            align: "center",
            font: {
              size: 16
            },
            formatter: value => {
              const [dataset] = this.pieChartData.datasets;
              const setValue = dataset.data.reduce((a, b) => a + b);

              return `${Math.round((value / setValue) * 100)}%`;
            }
          }
        }
      },
      querybytimeData:[],
      querybytimeLabels:[]
    }
  },
  methods: {
    getRandomColor: function () {
      const letters = '0123456789ABCDEF'.split('');
      let colors = []
      for (let i = 0; i < 100; i++) {
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        colors.push(color)
      }

      return colors;
    }

  },
  computed:{
    cdata:function (){
      return this.querybytimeData
    },
    clabels:function (){
      return this.querybytimeLabels
    }
  },
  beforeMount() {
    if (this.$cookies.get('username') === null) {
      this.$router.push('/login')
    }

    const _this = this
    const $table = $('#table')
    this.axios.post('/api/record/querybytime', {
      start_time: "2021-04-19 12:41:00",
      end_time: "2021-04-23 12:41:00"
    }, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
        .then((response) => {
          console.log(response.data.data)

          for(let i=0;i<5;i++){
            if(response.data.data[i] !== undefined){
              _this.querybytimeLabels.push(response.data.data[i].videoName)
              _this.querybytimeData.push(response.data.data[i].count)
            }
          }
          let c = document.querySelector('#pChart')
          //c.destroy()
          //this.renderChart(this.data, this.options);

          _this.renderChart(this.pieChartData, this.pieChartOptions);
          console.log(this.pieChartData)
        })
        .catch((error) => {
          console.log(error)
        });
  },
  mounted() {
    const _this = this
    const $table = $('#table')
    const $table2 = $('#table2')

    this.axios.post('/api/record/querybytime', {
      start_time: "2021-04-19 12:41:00",
      end_time: "2021-04-23 12:41:00"
    }, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
        .then((response) => {
          console.log(response.data)
          _this.querybytimeData = response.data.data
          _this.pieChartData.datasets.data = []
          _this.pieChartData.datasets.labels = []
          for(let i=0;i<5;i++){
            if(_this.querybytimeData[i] !== undefined){
              _this.pieChartData.datasets.labels.push(_this.querybytimeData[i].videoName)
              _this.pieChartData.datasets.data.push(_this.querybytimeData[i].count)
            }
          }

          $table.bootstrapTable({
            exportTypes: ['csv'],
            exportDataType: "all",
            locale: 'zh-CN',
            columns: [
              {
                field: 'videoId',
                title: '#',
                sortable: false,
                align: 'left'
              },
              {
                field: 'videoName',
                title: '视频名称',
                sortable: false,
                align: 'left'
              },
              {
                field: 'count',
                title: '修改次数',
                sortable: false,
                align: 'center',
              }],
            data: response.data.data
          })
        })
        .catch((error) => {
          console.log(error)
        });


    this.axios.get('/api/record/query', {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
        .then((response) => {
          console.log(response.data)
          $table2.bootstrapTable({
            exportTypes: ['csv'],
            exportDataType: "all",
            locale: 'zh-CN',
            columns: [
              {
                field: 'videoName',
                title: '视频名称',
                sortable: false,
                align: 'left'
              },
              {
                field: 'realname',
                title: '修改者',
                sortable: false,
                align: 'left',
              },
              {
                field: 'oldText',
                title: '修改前字幕',
                sortable: false,
                align: 'left',
              },
              {
                field: 'newText',
                title: '修改后字幕',
                sortable: false,
                align: 'left',
              }],
            data: response.data.data
          })
        })
        .catch((error) => {
          console.log(error)
        });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.card.card-cascade .view.gradient-card-header {
  padding: 1rem 1rem;
  text-align: center;
}

.card.card-cascade h3,
.card.card-cascade h4 {
  margin-bottom: 0;
}

</style>
