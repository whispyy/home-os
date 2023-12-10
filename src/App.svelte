<script lang="ts">
  import Card from "./lib/Card.svelte";
  import Header from "./lib/Header.svelte";
  import WeatherWidget from "./lib/widget/WeatherWidget.svelte";

  import { services } from "./utils/service";
</script>

<Header />

<main>
  <WeatherWidget />
  <div class="container">
    {#each $services as service}
      <Card {service} />
    {/each}
  </div>
</main>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    flex: 1 0 auto;
    gap: 16px;
    margin: 16px 0;
  }
</style>
