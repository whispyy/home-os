<script lang="ts">
  import Card from "./lib/Card.svelte";
  import Header from "./lib/Header.svelte";
  import DownloadWidget from "./lib/widget/DownloadWidget.svelte";
  import WeatherWidget from "./lib/widget/WeatherWidget.svelte";

  import { services } from "./utils/service";
</script>

<Header />

<main>
  <div class="section">
    <WeatherWidget />
    <DownloadWidget />
  </div>

  <div class="section">
    {#each $services as service}
      <Card {service} />
    {/each}
  </div>
</main>

<style>
  .section {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex: 1 0 auto;
    gap: 16px;
    margin: 16px 0;
  }
</style>
