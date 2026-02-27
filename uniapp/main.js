import Vue from 'vue'
import App from './App'
import share from "./utils/share.js"
Vue.config.productionTip = false
import vuePrototype from './utils/vuePrototype.js'
import uView from '@/uni_modules/uview-ui'
import wxapi from "./utils/AllWxApi.js"
Vue.use(uView)
Vue.mixin(share)
App.mpType = 'app'


import * as filters from '@/utils/filter.js'
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})


import noData from './components/noData/noData.vue'
Vue.component('no-data', noData)

// 扩展vue原型方法
Vue.prototype.$utils = {}
Object.keys(wxapi).forEach(k => {
	Vue.prototype[k] = wxapi[k]
})

Object.keys(vuePrototype).forEach(k => {
	Vue.prototype[k] = vuePrototype[k]
})



Vue.filter('Format', (n) => {
	n = n ? n : null;
	let now = new Date(n * 1000), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
		y = now.getFullYear(),
		m = now.getMonth() + 1,
		d = now.getDate();
	return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0,
		8);
})

const app = new Vue({
	...App
})
app.$mount()