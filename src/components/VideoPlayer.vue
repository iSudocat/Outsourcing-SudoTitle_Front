<template>
  <div>
    <video @timeupdate="onTimeUpdateListener" ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';

export default {
  /* eslint-disable */
  name: "VideoPlayer",
  props: {
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      player: null
    }
  },
  methods:{
    onTimeUpdateListener: function (){
      this.gklog = this.player.cache_.currentTime
      console.log(' onPlayerTimeupdate!', this.gklog)

    }
  },
  mounted() {
    this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>

<style scoped>

</style>