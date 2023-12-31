<script lang="ts">
  import { onMount } from "svelte";
  import { mapVMOCode, type Weather } from "../../utils/weather";
  import currentLocation from "../../assets/weather/current-location.svg";

  let weather: Weather;

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchWeather);
    }
  }

  onMount(() => getLocation());

  async function fetchWeather(position: {
    coords: { latitude: number; longitude: number };
  }) {
    const x = position.coords.latitude;
    const y = position.coords.longitude;
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${x}&longitude=${y}&current=temperature_2m,weather_code,wind_speed_10m,is_day`
    );
    const json = await res.json();

    weather = {
      x,
      y,
      json,
      lastUpdated: `${json.current.time}:00.000Z`,
      code: json.current.weather_code,
      temperature: json.current.temperature_2m,
      temperatureUnit: json.current_units.temperature_2m,
      isDay: json.current.is_day,
    };
  }
</script>

<div class="card">
  <div class="top">
    <button on:click={getLocation}>
      <img src={currentLocation} alt="current location" height="20px" />
    </button>
    <div class="time">
      {#if weather}
        {new Date(weather.lastUpdated).toLocaleTimeString()}
      {:else}
        -
      {/if}
    </div>
  </div>

  <div class="main">
    <img
      src={mapVMOCode(weather?.code, !!weather?.isDay)}
      height="50px"
      alt="weather icon"
    />
    {#if weather}
      {Math.round(weather.temperature)}{weather.temperatureUnit}
    {:else}
      -
    {/if}
  </div>
</div>

<style>
  .card {
    border-radius: 16px;
    border: solid 1px #ffffff;
    background-color: transparent;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    height: 100px;
    width: 250px;

    transition: transform 300ms;
  }

  .top {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .top button {
    background-color: transparent;
    padding: 0;
    border-radius: 100%;
    display: flex;
  }

  .top .time {
    font-size: 12px;
  }

  .main {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
  }

  img {
    filter: brightness(0) invert(1);
  }

  @media (prefers-color-scheme: light) {
    .card {
      background-color: #708090;
      color: #ffffff;
    }
  }
</style>
