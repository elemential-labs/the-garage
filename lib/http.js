const Task = require("data.task")
const request = require("request")

const get = url => new Task((reject, resolve) => 
	request(url, (err, res, body) => 
		(err || res.statusCode >= 400) ? reject(err || body) : resolve(body))
)

const getJSON = url => new Task((reject, resolve) => 
	request(url, (err, res, body) => 
		(err || res.statusCode >= 400) ? reject(err || body) : resolve(JSON.parse(body)))
)

const post = (url, object) => new Task((reject, resolve) =>
	request({url: url, method: 'POST', json: object}, (err, res, body) =>
		(err || res.statusCode >= 400) ? reject(err || body) : resolve(body))
)

module.exports = { get, post, getJSON }