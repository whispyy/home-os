<script lang="ts">
  import { services, type Service } from "../utils/service";
  import Modal from "./common/Modal.svelte";

  export let isOpen = false;
  export let onClose: () => void;
  let newService: Service = {
    name: "",
    url: "",
    imgUrl: undefined,
    description: undefined,
  };

  const add = (service: Service) => {
    $services = [...$services, service];
    onClose();
  };
</script>

{#if isOpen}
  <form>
    <Modal on:close={onClose}>
      <h2 slot="header">Add Service</h2>

      <label>
        Name*
        <input id="name" bind:value={newService.name} required />
      </label>
      <label>
        Link*
        <input id="url" bind:value={newService.url} required />
      </label>

      <hr />

      <label>
        Image Link
        <input id="imgUrl" bind:value={newService.imgUrl} />
      </label>
      <label>
        Description
        <input id="description" bind:value={newService.description} />
      </label>

      <button
        slot="action"
        type="submit"
        on:click={() => add(newService)}
        disabled={!(newService.name.length && newService.url.length)}
      >
        Add
      </button>
    </Modal>
  </form>
{/if}

<style>
  label {
    display: flex;
    flex-direction: column;
  }
</style>
