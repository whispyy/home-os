<script lang="ts">
  import type { Service } from "../utils/service";

  export let service: Service;
</script>

<a class="card" href={service.url} rel="noreferer" target="_blank">
  {#if service.imgUrl}
    <img height="30px" src={service.imgUrl} alt={`${service.name} image`} />
  {/if}
  <div class="name" title={service.name}>{service.name}</div>
</a>

<style>
  .card {
    border-radius: 16px;
    border: solid 1px white;
    background-color: transparent;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 16px;
    height: 100px;
    width: 100px;

    transition: transform 300ms;
  }

  .card:hover {
    transform: scale(1.1);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: inherit;
  }

  @media (prefers-color-scheme: light) {
    .card {
      border: solid 1px #213547;
    }
  }
</style>
