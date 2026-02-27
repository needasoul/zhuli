export const ofLikes = (num) => {
	if (num > 9999) {
		return (num / 10000).toFixed(2) + '万'
	} else if (999 < num && num < 9999) {
		return (num / 1000).toFixed(2) + 'k'
	} else {
		return num + "元"
	}
}
export const Formatone = num => {
	//过滤器 用于格式化时间
	let date = new Date(num * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = year + '.' + month + "." + sdate
	// 返回
	return result;
}

export const FormatMount = num => {
	//过滤器 用于格式化时间
	let date = new Date(num); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = year + '.' + month
	// 返回
	return result;
}

export const Formatsdate = num => {
	//过滤器 用于格式化时间
	let date = new Date(num); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = month + "-" + sdate
	// 返回
	return result;
}
export const getprice = (num) => {
	let sign = String(num)
	let list = sign.split('.')
	// data = data.toFixed(2)
	// 将数字转换成字符串，并分割成数组
	// 注意：用split方法时，里面必须加双引号，才会逐个字符分割,再反转数组
	const arr = list[0].toString().split('').reverse()
	// 遍历数组
	for (let i = 0; i < arr.length; i++) {
		// 如果索引被3整除，并且索引不为0
		if (i % 3 === 0 && i !== 0) {
			// 在当前字符前面加一个逗号
			arr[i] = arr[i] + ','

		}
	}
	// 遍历完后，先反转数组，再将数组转换为字符串
	// 注意：用join方法时，里面必须加双引号，不然默认会用逗号分割
	const str = arr.reverse().join('')
	// 返回这个字符串
	// return str + "." + list[1]
	return str
}

export const quling = (num) => {
	let data = Number(num).toFixed(0)
	return data
}


export const timerFormat = num => {
	console.log('num', num);
	//过滤器 用于格式化时间
	let date = new Date(num * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = year + '-' + month + "-" + sdate + ' ' + hour + ':' + minute
	// 返回
	return result;
}


export const secFormat = num => {
	let time;
	if (num.length == 10) {
		time = num * 1000
	} else {
		time = num
	}
	//过滤器 用于格式化时间
	let date = new Date(time); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = year + '-' + month + "-" + sdate + ' ' + hour + ':' + minute + ':' + second
	// 返回
	return result;
}

export const Format = num => {
	console.log('num', num);
	//过滤器 用于格式化时间
	let date = new Date(num * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = +month + "/" + sdate + ' ' + hour + ':' + minute
	// 返回
	return result;
}

export const newday = num => {
	//过滤器 用于格式化时间
	let date = new Date(num); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	let year = date.getFullYear();
	let month = ("0" + (date.getMonth() + 1)).slice(-2);
	let sdate = ("0" + date.getDate()).slice(-2);
	let hour = ("0" + date.getHours()).slice(-2);
	let minute = ("0" + date.getMinutes()).slice(-2);
	let second = ("0" + date.getSeconds()).slice(-2);
	// 拼接
	let result = year + '年' + month + "月" + sdate + '日'
	// 返回
	return result;
}
export const lastfour = num => {
	// 截取后4位
	let lastFourDigits = num.slice(-4);
	return lastFourDigits
}
export const startfour = num => {
	// 截取第一个字
	let lastFourDigits = num.substring(0, 1);;
	return lastFourDigits

}

export const nine = num => {
	let res;
	if (num > 99) {
		res = '99+'
	} else {
		res = num
	}
	return res
}


// 定义一个方法，接收一个字符串参数，返回处理后的字符串
export const maskBankCardNumber = cardNumber => {
	let lastFourDigits = cardNumber.slice(-4);
	let res = '**** **** **** ' + lastFourDigits
	console.log('res', res);
	return res;
}