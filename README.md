# MMM-IQAir

This is an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It shows the current status of air quality.
Based on data from [IQAir](https://www.iqair.com).

__img


## Installation
1. Install and configure [MagicMirror](https://docs.magicmirror.builders).
2. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/PavlenkoM/MMM-air-quality.git`
3. To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-IQAir',
		config: {
			key: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
		}
	}
]
````

## Configuration options
The following properties can be configured:
By default widget displays like a Black&White. And get location by IP.
To enable color version need to add config `isColored`.
If widget should be configured to different location should be added config `coordinates`.

| Option | Description | Type | Required |
| --- | --- | --- | --- |
| `key` | API key from [https://www.iqair.com/commercial/air-quality-monitors/airvisual-platform/api](https://www.iqair.com/commercial/air-quality-monitors/airvisual-platform/api) | string | ✔️ |
| `isColored` | Enable colored schema for widget view | boolean |  |
| `coordinates` | Object with coordinates `{ lat: 00.00000, lon: 00.00000 }` | `{ [key: 'lat' | 'lan']: number }` |  |

