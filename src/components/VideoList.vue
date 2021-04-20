<template>
  <section id="tables">
    <mdb-row>
      <mdb-col md="12">
        <mdb-card cascade narrow class="mt-5">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">Basic tables</h4>
          </mdb-view>
          <mdb-card-body>
            <h3 class="mt-5 text-left"><strong>视频列表</strong></h3>
            <p>点击视频，进入视频与字幕的预览界面。</p>
            <mdb-tbl>
              <mdb-scrollbar height="70vh" id="sc">
                <b-table hover :responsive="true" :fields="videoTableFields" :items="videoTableItems"></b-table>
              </mdb-scrollbar>
            </mdb-tbl>

          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
import { mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbTbl } from 'mdbvue'

export default {
  name: 'Tables',
  components: {
    mdbRow,
    mdbCol,
    mdbCard,
    mdbView,
    mdbCardBody,
    mdbTbl
  },
  data () {
    return {
      videoTableFields: [],
      videoTableItems: [],
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
