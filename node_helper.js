/* Magic Mirror
 * Node Helper: MMM-air-quality
 *
 * By PavlenkoM
 */

const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
  start: function () {
    this.expressApp.get("/air-quality", this.loadAirQualityData.bind(this));
  },

  loadAirQualityData: async function (req, res) {
	try {
		const key = req.query.key;
		if (!key) {
			throw new Error('No API key');
		}
		const airRaidData = await this.fetchRemoteData(`https://api.airvisual.com/v2/nearest_city?key=${key}`);
		res.send(airRaidData);
	} catch (e) {
		console.error(e);
		res.send(e);
	}
  },

  fetchRemoteData: function (url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			const { statusCode } = res;
			const contentType = res.headers['content-type'];

			let error;
			if (statusCode !== 200) {
				error = new Error('Request Failed.\n' +
								`Status Code: ${statusCode}`);
			} else if (!/^application\/json/.test(contentType || '')) {
				error = new Error('Invalid content-type.\n' +
								`Expected application/json but received ${contentType}`);
			}
			if (error) {
				console.error(error.message);
				res.resume();
				return reject(error);
			}

			res.setEncoding('utf8');
			let rawData = '';
			res.on('data', (chunk) => { rawData += chunk; });
			res.on('end', () => {
				try {
					const parsedData = JSON.parse(rawData);
					return resolve(parsedData);
				} catch (e) {
					console.error(e.message);
					return reject(e);
				}
			});
		}).on('error', (e) => {
			console.error(`Got error: ${e.message}`);
			return reject(e);
		});
	});
}
});
