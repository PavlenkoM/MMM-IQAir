const AIR_QUALITY_MODULE_NAME = "MMM-IQAir";

Module.register(AIR_QUALITY_MODULE_NAME, {
    requiresVersion: "2.20.0",

    defaults: {
        key: '',
        updateTime: 30, // in minutes
        isColored: false,
    },

    iconSvg: '',

    modName: AIR_QUALITY_MODULE_NAME,

    units: {
        "p2": "pm2.5",
        "p1": "pm10",
        "o3": "Ozone O3",
        "n2": "Nitrogen dioxide NO2",
        "s2": "Sulfur dioxide SO2",
        "co": "Carbon monoxide CO"
    },

    qualityList: {
        good: {
            startPoints: 0,
            endPoints: 50,
            bgColor: '#a8e05f',
            imgColor: 'green',
            titleColor: '#607631',
            title: 'Good',
        },
        moderate: {
            startPoints: 51,
            endPoints: 100,
            bgColor: '#fdd64b',
            imgColor: 'yellow',
            titleColor: '#8C6C1D',
            title: 'Moderate'
        },
        unhealthySensitive: {
            startPoints: 101,
            endPoints: 150,
            bgColor: '#ff9b57',
            imgColor: 'orange',
            titleColor: '#974A20',
            title: 'Unhealthy for sensitive groups'
        },
        unhealthy: {
            startPoints: 151,
            endPoints: 200,
            bgColor: '#fe6a69',
            imgColor: 'red',
            titleColor: '#942431',
            title: 'Unhealthy'
        },
        veryUnhealthy: {
            startPoints: 201,
            endPoints: 300,
            bgColor: '#a070b6',
            imgColor: 'purple',
            titleColor: '#543B63',
            title: 'Very Unhealthy'
        },
        hazardous: {
            startPoints: 301,
            endPoints: 500,
            bgColor: '#a06a7b',
            imgColor: 'maroon',
            titleColor: '#573344',
            title: 'Hazardous'
        }
    },

    imgNameTemplate: function(color) {
        return `ic-face-${color}.svg`;
    },

    updateInterval: undefined,

    airData: {},

    start: function() {
        this.loadData();
        this.initUpdateInterval();
    },

    stop: function() {
        this.clearUpdateInterval();
    },

    getDom: async function() {
        const wrapper = document.createElement("div");
        wrapper.className = `${this.modName}__wrapper`;

        wrapper.innerHTML = await this.getAirQualityContent();

        return wrapper;
    },

    getAirQualityContent: async function() {
        const { aqius, mainus, city, country } = this.airData;
        const qualityItem = this.getCurrentStatus(aqius);

        if (!qualityItem) {
            return '';
        }

        return `
        <link rel="stylesheet" href="${this.modName}/style.css">

        <div class="${this.getContainerClasses()}" style="${this.getContainerStyles(qualityItem)}">
          <h1 class="${this.modName}__title">${qualityItem.title}</h1>

          <div  class="${this.modName}__quality-block">
              <div class="${this.modName}__icon">${await this.getIconSVG(qualityItem.imgColor)}</div>
              <h2 class="${this.modName}__number">${aqius}</h2>
          </div>

          <div class="${this.modName}__location">
              ${city} ${country}
          </div>
        </div>
    `;
    },

    loadData: async function() {
        const {lat, lon} = this.config.coordinates || {};

        try {
            const res = await fetch(`/air-quality?key=${this.config.key}&lat=${lat}&lon=${lon}`);
            const resBody = await res.json();
            const { current, city, country } = resBody.data;
            const { pollution } = current;
            this.airData = {
				city, country,
                aqius: pollution.aqius,
                mainus: pollution.mainus
            };
        } catch (err) {
            this.airData = {};
            console.error(err);
        }

        this.updateDom();
    },

    getUpdateIntervalTime: function() {
        return this.config.updateTime * 1000 * 60;
    },

    initUpdateInterval: function() {
        this.clearUpdateInterval();

        this.updateInterval = setTimeout(async () => {
            await this.loadData();
            this.initUpdateInterval();
        }, this.getUpdateIntervalTime());
    },

    clearUpdateInterval: function() {
        if (!!this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    },

    getCurrentStatus: function(pollutionLevel) {
        return Object.values(this.qualityList).find(qualityItem => (
            qualityItem.startPoints <= pollutionLevel && pollutionLevel <= qualityItem.endPoints
        ));
    },

    getIconSVG: async function(svgKey) {
        try {
            const responseData = await fetch(`/${this.modName}/ic-face-${svgKey}.svg`);
            this.iconSvg = await responseData.text();
        } catch (e) {
            console.error(e);
        }

        return this.iconSvg;
    },

    getContainerClasses: function() {
        const coloredClass = this.config.isColored ? `${this.modName}__container--colored` : '';
        return `${this.modName}__container ${coloredClass}`;
    },

	getContainerStyles: function(qualityItem) {
		return this.config.isColored ?
		`
			background-color: ${qualityItem.bgColor};
			border-color: ${qualityItem.bgColor};
			color: ${qualityItem.titleColor};
		` :
		'';
	},
});
