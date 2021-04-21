<template>
  <mdb-row class="justify-content-md-center">
    <mdb-col col="12" sm="10" md="8" lg="7" xl="5">
      <mdb-card v-show="!loginSuccess">
        <mdb-card-body>
          <form @submit="onSubmit">
            <p class="h4 text-center py-4">登录系统</p>
            <div class="grey-text">
              <mdb-input required label="用户名" icon="user" group type="text" validate error="wrong" success="right" v-model="loginForm.username"/>
              <mdb-input required label="密码" icon="lock" group type="password" validate v-model="loginForm.password"/>
            </div>
            <div class="text-center py-4 mt-3">
              <mdb-btn color="blue darken-2" type="submit">登录</mdb-btn>
            </div>
          </form>
        </mdb-card-body>
      </mdb-card>
      <mdb-card v-show="loginSuccess">
        <mdb-card-body>
            <p class="h4 text-center py-4">登录成功</p>
        </mdb-card-body>
      </mdb-card>
    </mdb-col>
  </mdb-row>
</template>

<script>
/* eslint-disable */
import {mdbInput, mdbBtn, mdbCard, mdbCardBody, mdbRow, mdbCol} from 'mdbvue'
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
      },
      loginSuccess:false
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      const _this = this
      _this.axios.defaults.withCredentials = true
      _this.axios.post('/api/user/login',this.loginForm)
          .then((response) => {
            console.log(response)
            if(response.data.code === 0){
              //_this.$store.commit('setState',['username',response.data.data.user.username])
              //_this.$store.commit('setState',['access_token',response.data.data.access_token])
              this.$cookies.set('username', response.data.data.user.username)
              this.$cookies.set('access_token', response.data.data.access_token)
              this.$router.push('/audit')
              this.$router.go(0)
              this.loginSuccess = true
            }else{
              alert("登录失败")
            }
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