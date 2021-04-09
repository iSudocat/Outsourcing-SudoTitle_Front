<template>
  <section id="maps">
    <mdb-row>
      <mdb-col md="8" class="mt-3">
        <div>
          <video ref="videoPlayer" class="video-js" :options="videoOptions" @timeupdate="onTimeUpdateListener" ></video>
        </div>
        <mdb-btn color="default" @click='declick'>Default</mdb-btn>
      </mdb-col>

      <mdb-col md="4">
        <mdb-card cascade narrow class="mt-3">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">
              实时字幕
            </h4>
          </mdb-view>
          <mdb-card-body class="text-center">
            <mdb-scrollbar height="70vh">
              <b-table hover :responsive="true" :fields="tlTableFields" :items="tlTableItems"></b-table>
            </mdb-scrollbar>

          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
import { mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbBtn, mdbTbl, mdbTblHead, mdbTblBody, mdbScrollbar, mdbDatatable2 } from 'mdbvue'
import videojs from 'video.js';
export default {
  /* eslint-disable */

  name: 'Maps',
  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbView,
    mdbCardBody,
    mdbBtn,
    videojs,
    mdbTbl,
    mdbTblHead,
    mdbTblBody,
    mdbScrollbar,
    mdbDatatable2,
  },
  data () {
    return {
      player: null,
      videoOptions: {
        language: 'zh-Hans-CN',
        fluid: true,
        autoplay: false,
        controls: true,
        preload: 'metadata',
        controlBar: { // 设置控制条组件
          volumePanel: {
            inline: false,
          }
        },
        sources: [
          {
            src: 'https://sudotitle-1251910132.cos.ap-chengdu.myqcloud.com/%E9%9B%86%E5%90%88%E6%A6%82%E8%BF%B0.mp4',
            type: '',
            poster: ''
          }
        ]
      },
      scy: 0,
      playerHeight: null,
      tlTableFields: [],
      tlTableItems: [],
    }
  },
  mounted() {
    let t = this
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      console.log('onPlayerReady', this);
      t.playerHeight = t.$refs.videoPlayer.clientHeight
      console.log(t.playerHeight)
    })

  },
  ready() {

  },
  methods: {

    declick: function (){
      /*
      this.player.currentTime(16)
      this.player.play()

      this.gklog = this.player.cache_.currentTime
      console.log('onPlayerTimeupdate!', this.gklog)


      let sc = document.querySelector('#sc')
      this.scy+=55
      console.log(this.scy)
      sc.scroll(0,this.scy)
       */
      this.getTimeLine()

    },
    onTimeUpdateListener: function (){

      this.gklog = this.player.cache_.currentTime
      console.log('onPlayerTimeupdate!', this.gklog)
      this.playerHeight = this.$refs.videoPlayer.clientHeight
      console.log(this.playerHeight)

    },
    getTimeLine: function () {
      console.log('getTimeLine')
      this.tlTableFields.push({
        key: 'id',
        label: 'ID'
      })
      this.tlTableFields.push({
        key: 'beginningTime',
        label: '时间',
      })
      this.tlTableFields.push({
        key: 'text',
        label: '字幕文本'
      })
      this.tlTableItems.push({
        id: 1,
        beginningTime: 1.2,
        text: '练练练练练'
      })
    }
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
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
.card.card-cascade h3, .card.card-cascade h4 {
  margin-bottom: 0px;
}

</style>
