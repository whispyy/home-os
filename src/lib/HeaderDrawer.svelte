<script lang="ts">
  import Drawer from "./common/Drawer.svelte";
  import { DEFAULT_SERVICES, services } from "../utils/service";

  export let open: boolean;

  function resetServices() {
    $services = [...DEFAULT_SERVICES];
    open = false;
  }
</script>

<Drawer
  {open}
  placement="right"
  on:clickAway={() => (open = false)}
  size="600px"
>
  <div class="container">
    <div class="header">
      <button on:click={() => (open = false)}>x</button>
      <div>Menu</div>
    </div>

    <hr />

    <ul>
      <li>
        <button on:click={resetServices}>Reset services</button>
      </li>
    </ul>
  </div>
</Drawer>

<style>
  .container {
    padding: 4px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  ul {
    list-style-type: none;
    margin: 4px;
    padding: 0;
  }

  li {
    margin: 4px 0;
  }

  li button {
    width: 100%;
    border-radius: 0;
    margin: 4px 0;
  }
</style>
