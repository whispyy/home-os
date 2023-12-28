<script lang="ts">
  import { onMount } from "svelte";
  import { transformer, type Download } from "../../utils/download";

  let downloads: Download[];

  onMount(() => fetchDownloads());

  async function fetchDownloads() {
    const res = await fetch(
      `http://192.168.1.12:8082/gui/?token=pEvnbngNLdcuU4wuWCYZeKtCaSJ5w5638tk93BDkka9a9pKJkxuXExyhhWUAAAAA&list=1`
    );
    const json = await res.json();

    downloads = transformer(json);
  }
</script>

<div>
  {#if downloads}
    {JSON.stringify(downloads)}
  {:else}
    -
  {/if}
</div>
