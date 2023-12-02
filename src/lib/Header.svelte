<script lang="ts">
  import { services, type Service } from "../utils/service";
  import AddService from "./AddService.svelte";
  import Modal from "./common/Modal.svelte";

  let isAddOpen = false;
</script>

<header>
  <button class="plus" on:click={() => (isAddOpen = true)}>+</button>
</header>

{#if isAddOpen}
  <AddService isOpen={isAddOpen} onClose={() => (isAddOpen = false)} />
{/if}

<style>
  header {
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    max-height: 60px;
    position: fixed;
    box-sizing: border-box;
    background-color: #1a1b1e;
    border-bottom: 1px solid #2c2e33;

    display: flex;
    padding: 4px 16px;
  }

  button.plus {
    border-radius: 100%;
    border: solid 1px;
  }

  @media (prefers-color-scheme: light) {
    header {
      background-color: #f9f9f9;
    }
  }
</style>
