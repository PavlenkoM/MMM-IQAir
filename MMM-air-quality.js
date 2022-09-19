const AIR_QUALITY_MODULE_NAME = "MMM-air-quality";

Module.register(AIR_QUALITY_MODULE_NAME, {
  requiresVersion: "2.20.0",

  defaults: {
	updateTime: 1, // in minutes
  },

  units: {
	"p2": "pm2.5",
	"p1": "pm10",
	"o3": "Ozone O3",
	"n2": "Nitrogen dioxide NO2",
	"s2": "Sulfur dioxide SO2",
	"co": "Carbon monoxide CO"
  },

  updateInterval: undefined,

  airData: {},

  start: function () {
	this.loadData();
	this.initUpdateInterval();
  },

  stop: function () {
	this.clearUpdateInterval();
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = `${AIR_QUALITY_MODULE_NAME}-wrapper`;

    wrapper.innerHTML = this.getAirQualityContent();

    return wrapper;
  },

  getAirQualityContent: function () {
	const { aqius, mainus } = this.airData;
	return `${aqius} ${this.units[mainus]}`;
  },

  loadData: async function () {
	try {
		const res = await fetch(`/air-quality?key=${this.config.key}`);
		const resBody = await res.json();
		const { current } = resBody.data;
		const { pollution } = current;
		this.airData = {
			aqius: pollution.aqius,
			mainus: pollution.mainus
		};
	} catch(err) {
		this.airData = {};
	}

	console.log(this.airData);

	this.updateDom();
  },

  getUpdateIntervalTime: function () {
	return this.config.updateTime * 1000 * 60;
  },

  initUpdateInterval: function () {
	this.clearUpdateInterval();

	this.updateInterval = setInterval(() => {
		this.clearInterval();
		this.loadAirQualityData();
		this.initUpdateInterval();
	}, this.getUpdateIntervalTime());
  },

  clearUpdateInterval: function () {
	if (!!this.updateInterval) {
		clearInterval(this.updateInterval);
		this.updateInterval = null;
	}
  }
});
