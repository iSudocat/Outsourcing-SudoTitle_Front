<template>
  <mdb-row class="justify-content-md-center">
    <mdb-col col="12" sm="10" md="8" lg="7" xl="5">
      <mdb-card>
        <mdb-card-body>
          <form @submit="onSubmit">
            <p class="h4 text-center py-4">登录系统</p>
            <div class="grey-text">
              <mdb-input label="用户名" icon="user" group type="text" validate error="wrong" success="right" v-model="loginForm.username"/>
              <mdb-input label="密码" icon="lock" group type="password" validate v-model="loginForm.password"/>
            </div>
            <div class="text-center py-4 mt-3">
              <mdb-btn color="blue darken-2" type="submit">登录</mdb-btn>
            </div>
          </form>
        </mdb-card-body>
      </mdb-card>
    </mdb-col>
  </mdb-row>


</template>

<script>
/* eslint-disable */
import {mdbInput, mdbBtn, mdbCard, mdbCardBody, mdbRow, mdbCol} from 'mdbvue';
export default {
  name: 'Login',
  components: {
    mdbInput,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbRow,
    mdbCol
  },
  data() {
    return {
      loginForm:{
        username:'',
        password:''
      }
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.axios.defaults.withCredentials = true
      this.axios.post('/api/user/login',this.loginForm)
          .then((response) => {
            console.log(response)

          })
          .catch((error) => {
            console.log(error)
          })

    },
  }
}
</script>


<style scoped>

</style>