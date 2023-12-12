<script lang="ts">
  import AddService from "./AddService.svelte";
  import plusCircle from "../assets/header/plus-circle.svg";
  import userCircle from "../assets/header/user-circle.svg";

  let isAddOpen = false;
  let query = "";

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      window.open(`https://www.google.com/search?q=${query}`, '_blank')
    }
	}
</script>

<header>
  <button on:click={() => (isAddOpen = true)}>
    <img src={plusCircle} height="30px" alt="add service button" />
  </button>

  <div class="search">
    <input type="text" bind:value={query} on:keydown={handleKeydown} />
  </div>

  <button on:click={() => (isAddOpen = true)}>
    <img src={userCircle} height="30px" alt="user menu button" />
  </button>
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
    justify-content: space-between;
    padding: 4px 16px;
  }

  button,
  .search {
    display: flex;
    align-items: center;
  }

  img {
    filter: brightness(0) invert(1);
  }

  @media (prefers-color-scheme: light) {
    header {
      background-color: #f9f9f9;
    }

    img {
    filter: none;
  }
  }
</style>
