<template>
  <section id="maps">
    <mdb-row>
      <mdb-col md="8" class="mt-3">
        <div>
          <video ref="videoPlayer" class="video-js" :options="videoOptions" @timeupdate="onTimeUpdateListener"
                 @pause="videoPause" @play="videoPlay"></video>
          <audio id="au" :src="this.videoOptions.sources[0].audioSource"></audio>
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
              <b-table id="table" hover :responsive="true" :fields="tlTableFields" :items="tlTableItems"
                       style="text-align:left ">
                <template v-slot:cell(operation)="row">
                  <b-button variant="info" size="sm" @click="modifyAudio(row.item, row.index, $event.target)"
                            style="width: 5rem">
                    修改
                  </b-button>
                </template>
              </b-table>
            </mdb-scrollbar>

            <b-modal size="md" :id="titleModal.id" :title="titleModal.title">
              <form>
                <b-form-group label="字幕：">
                  <b-form-input v-model="titleModal.subTitle"></b-form-input>
                </b-form-group>
                <b-form-group label="选择录音文件:">
                  <input type="file" id="input_file" v-on:change="uploadFile"/>
                </b-form-group>
              </form>


              <template v-slot:modal-footer>
                <b-button variant="danger" @click="handleCancel">
                  取消
                </b-button>
                <b-button variant="success" @click="handleOk">
                  确定
                </b-button>
              </template>
            </b-modal>

          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
import {
  mdbRow,
  mdbCol,
  mdbCard,
  mdbView,
  mdbCardBody,
  mdbBtn,
  mdbTbl,
  mdbTblHead,
  mdbTblBody,
  mdbScrollbar,
  mdbDatatable2
} from 'mdbvue'
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
  data() {
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
          tracks: []
        },
        sources: [
          {
            src: '',
            type: '',
            poster: '',
            audioSource: ''
          }
        ]
      },
      scy: 0,
      playerHeight: null,
      tlTableFields: [],
      tlTableItems: [],
      titleModal: {
        index: null,
        id: 'info-modal',
        title: '修改字幕',
        subTitle: '',
        file: {},
        filename: ''
      }
    }
  },
  beforeMount() {
    if (this.$cookies.get('username') === null) {
      this.$router.push('/login')
    }
    console.log(this.$route.query)
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


  },
  ready() {

  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  },
  methods: {
    videoPause: function () {
      let curTime = this.player.cache_.currentTime
      let audio = document.querySelector('#au')
      audio.currentTime = curTime
      audio.pause()
    },
    videoPlay: function () {
      let curTime = this.player.cache_.currentTime
      let audio = document.querySelector('#au')
      audio.currentTime = curTime
      audio.play()
    },
    onTimeUpdateListener: function () {
      let curTime = this.player.cache_.currentTime
      let audio = document.querySelector('#au')
      audio.currentTime = curTime
      //audio.play()
      console.log('onPlayerTimeupdate!', curTime)

      //this.playerHeight = this.$refs.videoPlayer.clientHeight
      //console.log(this.playerHeight)
      let curTimeMs = Math.round(curTime * 1000)
      //console.log(this.tlTableItems)
      for (let i = this.tlTableItems.length - 1; i > 0; i--) {
        if (curTimeMs > this.tlTableItems[i].msBegin) {
          console.log(this.tlTableItems[i].text)
          let sc = document.querySelector('#sc')
          sc.scroll(0, 55 + i * 80)

          break;
        }
      }
    },
    getTimeLine: function () {
      const _this = this
      console.log('getTimeLine')

      this.tlTableFields.push({
        key: 'begin',
        label: '时间',
      })
      this.tlTableFields.push({
        key: 'text',
        label: '字幕文本'
      })
      this.tlTableFields.push({
        key: 'operation',
        label: '操作'
      })
      let fieldData = null

      this.axios.get('/api/subtitle/query?video_id=' + this.$route.query.id, {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
          .then((response) => {
            console.log(response.data)
            fieldData = response.data.data.subs
            let temp = []
            fieldData.forEach((element, index) => {
              temp.push({
                msBegin: element.begin,
                begin: _this.formatTime(element.begin),
                text: element.text,
                id: element.id
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
    },
    modifyAudio: function (item, index, button) {
      console.log(index)
      console.log(item)
      this.titleModal.index = item.id
      this.titleModal.subTitle = item.text
      this.$root.$emit('bv::show::modal', this.titleModal.id, button)
    },
    handleCancel() {
      this.$nextTick(() => {
        this.$bvModal.hide(this.titleModal.id)
      })
    },
    handleOk() {
      const COS = require('cos-js-sdk-v5')
      const _this = this
      if (_this.titleModal.subTitle === '') {
        alert("请填写修改内容！")
      } else {

        this.axios.get('/api/subtitle/credential', {headers: {Authorization: "Bearer " + this.$cookies.get('access_token')}})
            .then((response) => {
              console.log(response.data)
              let cos = new COS({
                SecretId: response.data.data.tmpSecretId,
                SecretKey: response.data.data.tmpSecretKey,
                XCosSecurityToken: response.data.data.sessionToken,
                ExpiredTime: response.data.data.expiredTime
              })
              cos.putObject({
                Bucket: 'sudotitle-1251910132', /* 必须 */
                Region: 'ap-chengdu',     /* 存储桶所在地域，必须字段 */
                Key: 'raw/' + _this.titleModal.index + "_" + new Date().getTime() + "_" + _this.titleModal.filename,              /* 必须 */
                StorageClass: 'STANDARD',
                Body: _this.titleModal.file, // 上传文件对象
                onProgress: function (progressData) {
                  console.log(JSON.stringify(progressData));
                }
              }, function (err, data) {
                console.log(err || data);
                _this.axios
                    .put("/api/subtitle/modify", {
                      "id":  _this.titleModal.index,
                      "text":  _this.titleModal.subTitle,
                      "filename": _this.titleModal.index + "_" + new Date().getTime() + "_" + _this.titleModal.filename
                    }, {headers: {Authorization: "Bearer " + _this.$cookies.get('access_token')}})
                    .then((response) => {
                      console.log(response.data)
                    })
                    .catch((error) => {
                      console.log(error)
                    })

              });
            })
            .catch((error) => {
              console.log(error)
            });


        this.$nextTick(() => {
          this.$bvModal.hide(this.titleModal.id)
        })
      }
    },
    uploadFile() {
      const _this = this
      const selectedFile = document.getElementById('input_file').files[0]
      // 读取文件名
      const name = selectedFile.name
      console.log(name)
      _this.titleModal.filename = name
      // 读取文件大小
      const size = selectedFile.size
      // FileReader对象，h5提供的异步api，可以读取文件中的数据。
      const reader = new FileReader()
      // readAsText是个异步操作，只有等到onload时才能显示数据。
      reader.readAsBinaryString(selectedFile)
      reader.onload = function () {
        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
        _this.titleModal.file = this.result
        //console.log(this.result);
      }


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

.b-table tr {
  line-height: 25px;
  min-height: 25px;
  height: 25px;
}
</style>
