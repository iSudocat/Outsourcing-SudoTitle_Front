<template>

  <section id="tables">
    <mdb-row class="justify-content-md-center">
      <mdb-col md="10">
        <mdb-card cascade narrow class="mt-5">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">视频列表</h4>
          </mdb-view>
          <mdb-card-body>
            <mdb-row style="align-items:center;justify-content:space-between">
              <mdb-col>
                <p>点击预览按钮，可进入视频与字幕的预览界面。</p>
                <p>勾选需要生成字幕的视频，即可生成字幕。</p>
              </mdb-col>
              <mdb-col>
                <mdb-btn style="float:right" color="primary" size="sm" @click="recognizeClick">
                  <mdb-icon icon="magic" class="mr-1"/>
                  为选定视频生成字幕
                </mdb-btn>
              </mdb-col>
            </mdb-row>
            <table style="margin-top: 20px" id="table" data-pagination="false" data-show-footer="false" >
            </table>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>


</template>

<script>
/* eslint-disable */
import $ from 'jquery'

import {mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbTbl, mdbScrollbar, mdbBtn, mdbIcon} from 'mdbvue'


export default {
  name: 'VideoList',
  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbView,
    mdbCardBody,
    mdbTbl,
    mdbScrollbar,
    mdbBtn,
    mdbIcon
  },
  data() {
    return {
      selections: []
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
    const $remove = $('#remove')

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
                field: 'state',
                checkbox: true,
                align: 'center',
                valign: 'middle',
                formatter: checkBoxFormatter
              },
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
                field: 'status',
                title: '字幕状态',
                sortable: false,
                formatter: statusFormatter,
                align: 'left'
              },
              {
                field: 'operate1',
                title: '视频预览',
                align: 'center',
                clickToSelect: false,
                events: operateEvents,
                formatter: operateFormatter,
                width: 40
              },
              {
                field: 'operate2',
                title: '下载字幕',
                align: 'center',
                clickToSelect: false,
                events: operateEvents,
                formatter: operateFormatter1,
                width: 40
              }],
            data: response.data.data.videos
          })

          function getIdSelections() {
            return $.map($table.bootstrapTable('getSelections'), function (row) {
              return row.id
            })
          }

          $table.on('check.bs.table uncheck.bs.table ' +
              'check-all.bs.table uncheck-all.bs.table',
              function () {
                $remove.prop('disabled', !$table.bootstrapTable('getSelections').length)
                // save your data, here just save the current page
                _this.selections = getIdSelections()
                console.log(_this.selections)
                // push or splice the selections if you want to save all data selections
              })
        })
        .catch((error) => {
          console.log(error)
        });

    let operateEvents = {
      'click .vd': function (e, value, row, index) {
        _this.$router.push({name: 'VideoPlay', query: row})
      },
      'click .dl': function (e, value, row, index) {
        console.log($table.bootstrapTable('getData'))
        _this.funDownload(JSON.stringify($table.bootstrapTable('getData')),row.id + ".json")

      },
    }

    function operateFormatter(value, row, index) {
      switch (row.status) {
        case 0:
          return [
            '<a class="vd" href="javascript:void(0)" title="预览">',
            '<i class="fas fa-play"></i>',
            '</a>'
          ].join('')
        case 1:
        case 2:
          return []
        case 3:
          return [
            '<a class="vd" href="javascript:void(0)" title="预览">',
            '<i class="fas fa-play"></i>',
            '</a>'
          ].join('')
      }
    }
    function operateFormatter1(value, row, index) {
      switch (row.status) {
        case 0:
        case 1:
        case 2:
          return []
        case 3:
          return [
            '<a class="dl" href="javascript:void(0)" title="下载字幕">',
            '<i class="fas fa-cloud-download-alt"></i>',
            '</a>'
          ].join('')
      }
    }

    function statusFormatter(value, row, index) {
      switch (value) {
        case 0:
          return "未生成字幕"
        case 1:
          return "字幕生成中，请稍后"
        case 2:
          return "字幕已修改，正在合成，请稍后"
        case 3:
          return "字幕已生成，可预览视频"
      }
    }

    function checkBoxFormatter(value, row, index) {
      if (row.status !== 0)
        return {disabled: true}
    }
  },
  methods: {
    recognizeClick: function () {
      console.log(this.selections)
      const $table = $('#table')
      //console.log($table.bootstrapTable('getData'))

      this.selections.forEach((element, index) => {
        this.axios.put('/api/video/recognize', {"video_id": element}, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
            .then((response) => {
              console.log(response.data)
              alert("请求成功！请等待视频字幕生成完成，即可预览。")
              this.$router.go(0)
            })
            .catch((error) => {
              console.log(error)
            });
      })
    },
    funDownload: function (content, filename) {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      // 字符内容转变成blob地址
      var blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
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
