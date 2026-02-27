import request from '../utils/request.js'

/** 
 * @param {string} code 
 */
export function authentication(data) {
	return request({
		url: 'client/authentication',
		method: 'get',
		data
	})
}

export function addLog(data) {
	return request({
		url: 'businuss/add_log',
		method: 'post',
		data
	})
}