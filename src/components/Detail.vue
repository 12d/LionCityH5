<template>
  <div>
    <h1>新闻详情页面</h1>
    <h2>{{state.Title}}</h2>
    <h5>{{state.Description}}</h5>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
var A
export default A = {
  name: 'Detail',
  beforeCreate () {
    console.log('beforeCreate')
  },
  created () {
    console.log('created')
    var self = this
    A.prefetch(this.$route).then(function (rs) {
      let data = rs.data.Data.Infos
      console.log('request', data)
//      self.state.Title = data.Title
//      self.state.Description = data.Description
      self.state = {
        Title: data.Title,
        Description: data.Description
      }
    })
  },
  prefetch ($route) {
    return axios.get('http://www.meitu.io/sharedline/getweistore', {
      params: {
        key: $route.params.id
      }
    })
  },
  beforeMount () {
    console.log('beforeMount')
  },
  mounted () {
    console.log('mounted')
  },
  beforeDestroy () {
    console.log('beforeDestroy')
  },
  destroyed () {
    console.log('destroyed')
  },
  data () {
    return {
      state: (this.$isServer ? Vue.__data : window.__INITIAL_STATE__) || {}
    }
  }
}
</script>
<style>

</style>
