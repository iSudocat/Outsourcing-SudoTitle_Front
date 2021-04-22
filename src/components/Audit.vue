<template>
  <section id="audit">
    <section>
      <mdb-row class="justify-content-center">
        <mdb-col lg="12" sm="12">
          <mdb-card cascade narrow class="mt-5">
            <mdb-view class="gradient-card-header blue darken-2">
              <h4 class="h4-responsive text-white">视频修改次数统计</h4>
            </mdb-view>
            <mdb-card-body>
              <mdb-row>
                <mdb-col md="6">
                  <p>开始时间：</p>
                  <b-form-input id="date1" type="date" v-model="startTime" @change="dateUpdate"></b-form-input>
                </mdb-col>
                <mdb-col md="6">
                  <p>结束时间：</p>
                  <b-form-input id="date2" type="date" v-model="endTime" @change="dateUpdate"></b-form-input>
                </mdb-col>
              </mdb-row>
              <table style="margin-top: 30px" id="table" data-show-export="true">
              </table>
            </mdb-card-body>
          </mdb-card>
        </mdb-col>



      </mdb-row>

      <mdb-row class="justify-content-center">
        <mdb-col md="12">
          <mdb-card cascade narrow class="mt-5">
            <mdb-view class="gradient-card-header blue darken-2">
              <h4 class="h4-responsive text-white">视频修改详细记录</h4>
            </mdb-view>
            <mdb-card-body>

              <table style="margin-top: 30px" id="table2" data-show-export="true">
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

    }
  },
  methods: {
    dateUpdate:function (){
      if(this.startTime !== '' && this.endTime !== ''){
        const $table = $('#table')
        this.axios.post('/api/record/querybytime', {
          start_time: this.startTime + " 00:00:00",
          end_time: this.endTime + " 23:59:59"
        }, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
            .then((response) => {
              console.log(response.data)
              $table.bootstrapTable('load', response.data.data);

            })
            .catch((error) => {
              console.log(error)
            });
      }

    }
  },
  computed:{

  },
  beforeMount() {
    if (this.$cookies.get('username') === null) {
      this.$router.push('/login')
    }

  },
  mounted() {
    const _this = this
    const $table = $('#table')
    const $table2 = $('#table2')
    $table.bootstrapTable({
      height: 510,
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
      data: []
    })

    this.axios.get('/api/record/query', {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
        .then((response) => {
          console.log(response.data)
          $table2.bootstrapTable({
            height: 510,
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
                field: 'modifyTime',
                title: '修改时间',
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

.btn .btn-secondary{
  background-color: #2196f3;
}
</style>
