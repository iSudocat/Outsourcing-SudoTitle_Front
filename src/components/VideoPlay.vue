<template>
  <section id="maps">
    <mdb-row>
      <mdb-col md="8" class="mt-3">
        <div>
          <video ref="videoPlayer" class="video-js" :options="videoOptions" @timeupdate="onTimeUpdateListener">
            <source id="my-spanish-audio-track" :src="this.videoOptions.sources[0].audioSource" type="audio/wav">
          </video>
        </div>
      </mdb-col>

      <mdb-col md="4">
        <mdb-card cascade narrow class="mt-3">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">
              实时字幕
            </h4>
          </mdb-view>
          <mdb-card-body class="text-center">
            <mdb-scrollbar height="70vh" id="sc">
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
  name: 'VideoPlay',
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
        audioTracks: {
          tracks:[]
        },
        sources: [
          {
            src: '',
            type: '',
            poster: '',
            audioSource:''
          }
        ]
      },
      scy: 0,
      playerHeight: null,
      tlTableFields: [],
      tlTableItems: [],
    }
  },
  beforeMount() {
    if(this.$cookies.get('username') === null) {
      this.$router.push('/login')
    }
    console.log(this.$route.query.videoStream)
    this.videoOptions.sources[0].src = this.$route.query.videoStream
    this.videoOptions.sources[0].audioSource = this.$route.query.audioStream
    this.getTimeLine()


  },
  mounted() {
    let t = this
    this.player = videojs(this.$refs.videoPlayer, this.videoOptions, function onPlayerReady() {
      console.log('onPlayerReady', this);
      t.playerHeight = t.$refs.videoPlayer.clientHeight
      console.log(t.playerHeight)
    })

    let track = new videojs.AudioTrack({
      id: 'my-spanish-audio-track',
      kind: 'main',
      label: 'Spanish',
      language: 'zh-Hans-CN',
      enabled: true
    });

    this.player.audioTracks().addTrack(track)

  },
  ready() {

  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {

    onTimeUpdateListener: function (){

      let curTime = this.player.cache_.currentTime
      console.log('onPlayerTimeupdate!', curTime)

      //this.playerHeight = this.$refs.videoPlayer.clientHeight
      //console.log(this.playerHeight)
      let curTimeMs =  Math.round(curTime * 1000)
      //console.log(this.tlTableItems)
      for(let i = this.tlTableItems.length - 1; i > 0 ; i--){
        if(curTimeMs > this.tlTableItems[i].msBegin){
          console.log(this.tlTableItems[i].text)
          let sc = document.querySelector('#sc')

          sc.scroll(0,55 + i * 55)
          break;
        }
      }
    },
    getTimeLine: function () {
      const _this = this
      console.log('getTimeLine')
      /*
      this.tlTableFields.push({
        key: 'id',
        label: 'ID'
      })

       */

      this.tlTableFields.push({
        key: 'begin',
        label: '时间',
      })
      this.tlTableFields.push({
        key: 'text',
        label: '字幕文本'
      })
      let fieldData = null

      this.axios.get('/api/subtitle/query?video_id=' + this.$route.query.id, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
          .then((response) => {
            console.log(response.data)
            fieldData = response.data.data.subs
            let temp = []
            fieldData.forEach((element,index) => {
              temp.push({
                msBegin:element.begin,
                begin:_this.formatTime(element.begin),
                text:element.text
              })
            })
            console.log(temp)
            this.tlTableItems = temp
          })
          .catch((error) => {
            console.log(error)
          });

    },
    formatTime: function (msTime) {
      let time = msTime / 1000;

      let hour = Math.floor(time / 60 / 60);

      hour = hour.toString().padStart(2, "0");

      let minute = Math.floor(time / 60) % 60;

      minute = minute.toString().padStart(2, "0");

      let second = Math.floor(time) % 60;

      second = second.toString().padStart(2, "0");

      return `${hour}:${minute}:${second}`;
    }
  },
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
