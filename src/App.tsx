import React from 'react'
import descriptions from './assets/descriptions.json';

interface WeatherData {
    current: {
        temperature_2m: number | null,
        is_day: boolean | null,
        weather_code: number | null,
    }
}
interface TimeOfDay {
    description: string | null;
    image: string | null;
}

interface WeatherDescription {
    day: TimeOfDay;
    night: TimeOfDay;
}

const App: React.FC = () => {
	const [weatherData, setWeatherData] = React.useState<WeatherData>({
		current: {
			temperature_2m: null,
			is_day: null,
			weather_code: null,
		}
	});
	const [weatherDescription, setWeatherDescription] = React.useState<TimeOfDay>({
		description: null,
		image: null
	})
	const [isLoading, setIsLoading] = React.useState<boolean>(true);

	const fetchWeatherData = async () => {
		setIsLoading(true);
		const url = "https://api.open-meteo.com/v1/forecast?latitude=60.397076&longitude=5.324383&current=temperature_2m,is_day,weather_code&forecast_days=1";
		try {
			await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((response) => response.json())
				.then((data) => {
					if (data === null) {
						throw new Error("No data received");
					}

					setWeatherData({
						current: {
							temperature_2m: data.current.temperature_2m,
							is_day: data.current.is_day,
							weather_code: data.current.weather_code,
						}
					});
				})
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	const getWeatherImg = () => {
		const weatherCode = weatherData.current.weather_code;
		const isDay = weatherData.current.is_day

		if (weatherCode !== null && isDay !== null) {
			const weatherDescription: WeatherDescription = descriptions[weatherCode.toString() as keyof typeof descriptions];
			if (isDay) {
				setWeatherDescription(weatherDescription.day);
			} else {
				setWeatherDescription(weatherDescription.night);
			}
		}
	}

	React.useEffect(() => {
		fetchWeatherData();
	}, []);

	React.useEffect(() => {
		getWeatherImg();
	}, [weatherData]);

	if (isLoading) {
		return <div role="status" aria-label="Laster innhold">Laster...</div>
	}

	return (
		<main>
			<h1>Vær App</h1>
			<div className="container" role="region" aria-label="Værmelding">
				<h2>Bryggen i Bergen</h2>
				<p>Temperatur: {weatherData.current.temperature_2m} C°</p>
				<div className='current-weather'>
					<p>
						{weatherData.current.is_day
							? 'Det er dag'
							: 'Det er natt'
						}
					</p>
					{/*  default-weather.png er placeholder bilde*/}
					<img 
						role="img"
						src={weatherDescription.image || '/default-weather.png'} 
						alt={weatherDescription.description || 'Vær type mangler'} 
						aria-label={`Vær type: ${weatherDescription.description || 'mangler'}`}
					/> 
				</div>
			</div>
		</main>
	)
}

export default App