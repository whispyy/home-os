<script lang="ts">
  import { onMount } from "svelte";
  import refresh from "../../assets/home/refresh.svg";
  import thermometer from "../../assets/home/thermometer.svg";

  const TOKEN = import.meta.env.VITE_INFLUXDB_TOKEN
  const ORG = import.meta.env.VITE_INFLUXDB_ORG
  const BUCKET = import.meta.env.VITE_INFLUXDB_BUCKET

  let temperature: number;
  let temperatureTime: string;
  let humidity: number;

  onMount(() => fetchHomeTempHum());

  async function fetchHomeTempHum() {
    const res = await fetch('https://us-east-1-1.aws.cloud2.influxdata.com/api/v2/query', {
      method: 'POST',
      headers: {
        Authorization: `Token ${TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/csv',
      },
      body: JSON.stringify({
        org: `${ORG}`,
        query: `
          from(bucket: "${BUCKET}")
            |> range(start: -2h)
            |> filter(fn: (r) => r._measurement == "environment")
            |> last()
        `,
      }),
    });
    if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const csvData = await res.text();
  const rows = csvData.trim().split('\n');
  const headers = rows[0].split(',');

  const fieldIndex = headers.indexOf('_field');
  const valueIndex = headers.indexOf('_value');
  const timeIndex = headers.indexOf('_time');

  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(',');
    const field = columns[fieldIndex];
    const value = parseFloat(columns[valueIndex]);
    const time = columns[timeIndex];

    if (field === 'temperature') {
      temperature = value;
      temperatureTime = time;
    } else if (field === 'humidity') {
      humidity = value;
    }
  }

  return {
    temperature,
    humidity,
  };
}
</script>

<div class="card">
  <div class="top">
    <button on:click={fetchHomeTempHum}>
      <img src={refresh} alt="current location" height="20px" />
    </button>
    <div class="time">
      {#if temperatureTime}
        {new Date(temperatureTime).toLocaleTimeString()}
      {:else}
        -
      {/if}
    </div>
  </div>

  <div class="main">
    <img
      src={thermometer}
      height="50px"
      alt="weather icon"
    />
    {#if temperature}
      {temperature}°C {#if humidity}/{humidity}%{/if}
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
