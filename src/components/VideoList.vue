<template>
  <section id="tables">
    <mdb-row>
      <mdb-col md="12">
        <mdb-card cascade narrow class="mt-5">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">视频列表</h4>
          </mdb-view>
          <mdb-card-body>
            <!--<h3 class="mt-5 text-left"><strong>视频列表</strong></h3>-->
            <p>点击视频，进入视频与字幕的预览界面。</p>
            <table id="table" data-pagination="true" data-page-list="[10, 25, 50, 100, all]" data-show-footer="false"
                   data-page-size="10">
            </table>

            <!--
            <mdb-tbl>
              <mdb-scrollbar height="50vh" id="sc">
                <b-table hover :responsive="true" :fields="videoTableFields" :items="videoTableItems">
                  <template v-slot:cell(operation)="row" >
                    <b-button variant="info" size="sm" @click="jumpToVideo(row.item, row.index, $event.target)">
                      详情
                    </b-button>
                  </template>
                </b-table>
              </mdb-scrollbar>
            </mdb-tbl>
            -->

          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
/* eslint-disable */

import {mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbTbl, mdbScrollbar} from 'mdbvue'
import $ from 'jquery'

export default {
  name: 'VideoList',
  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbView,
    mdbCardBody,
    mdbTbl,
    mdbScrollbar
  },
  data() {
    return {

    }
  },
  beforeMount() {
    if (this.$cookies.get('username') === null) {
      this.$router.push('/login')
    }
  },
  mounted() {
    const _this = this
    const $table = $('#table')

    this.axios.get('/api/video/query', {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
        .then((response) => {
          console.log(response.data)
          this.videoTableItems = response.data.data.videos
          $table.bootstrapTable({
            exportTypes: ['csv'],
            exportDataType: "all",
            locale: 'zh-CN',
            columns: [
              {
                field: 'id',
                title: '#',
                sortable: false,
                align: 'left'
              },
              {
                field: 'filename',
                title: '名称',
                sortable: false,
                align: 'left'
              },
              {
                field: 'operate',
                title: '视频预览',
                align: 'center',
                clickToSelect: false,
                events: operateEvents,
                formatter: operateFormatter,
                width: 60
              }],
            data:response.data.data.videos
          })
        })
        .catch((error) => {
          console.log(error)
        });

    let data = [
      {
        "id": 0,
        "name": "Item 0",
        "price": "$0",
        "amount": 3
      },
      {
        "id": 1,
        "name": "Item 1",
        "price": "$1",
        "amount": 4
      },
      {
        "id": 2,
        "name": "Item 2",
        "price": "$2",
        "amount": 8
      },
      {
        "id": 3,
        "name": "Item 3",
        "price": "$3",
        "amount": 2
      },
      {
        "id": 4,
        "name": "Item 4",
        "price": "$4",
        "amount": 90
      },
      {
        "id": 5,
        "name": "Item 5",
        "price": "$5",
        "amount": 2
      },
      {
        "id": 6,
        "name": "Item 6",
        "price": "$6",
        "amount": 3
      },
      {
        "id": 7,
        "name": "Item 7",
        "price": "$7",
        "amount": 7
      },
      {
        "id": 8,
        "name": "Item 8",
        "price": "$8",
        "amount": 39
      },
      {
        "id": 9,
        "name": "Item 9",
        "price": "$9",
        "amount": 78
      },
      {
        "id": 10,
        "name": "Item 10",
        "price": "$10",
        "amount": 30
      },
      {
        "id": 11,
        "name": "Item 11",
        "price": "$11",
        "amount": 32
      },
      {
        "id": 12,
        "name": "Item 12",
        "price": "$12",
        "amount": 12
      },
      {
        "id": 13,
        "name": "Item 13",
        "price": "$13",
        "amount": 76
      },
      {
        "id": 14,
        "name": "Item 14",
        "price": "$14",
        "amount": 10
      },
      {
        "id": 15,
        "name": "Item 15",
        "price": "$15",
        "amount": 9
      },
      {
        "id": 16,
        "name": "Item 16",
        "price": "$16",
        "amount": 8
      },
      {
        "id": 17,
        "name": "Item 17",
        "price": "$17",
        "amount": 1
      },
      {
        "id": 18,
        "name": "Item 18",
        "price": "$18",
        "amount": 99
      },
      {
        "id": 19,
        "name": "Item 19",
        "price": "$19",
        "amount": 100
      },
      {
        "id": 20,
        "name": "Item 20",
        "price": "$20",
        "amount": 109
      }
    ]

    let operateEvents = {
      'click .dl': function (e, value, row, index) {
        console.log(row)
        _this.$router.push({ name: 'VideoPlay', query: row})

      }
    }

    function operateFormatter(value, row, index) {
        return [
          '<a class="dl" href="javascript:void(0)" title="查看视频">',
          '<i class="fas fa-play"></i>',
          '</a>'
        ].join('')
    }
  },
  methods:{
    jumpToVideo:function (item, index, button){
      console.log(index)
    }
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
