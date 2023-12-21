<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import Portal from "./Portal.svelte";

  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  let modal: HTMLDivElement;

  const handle_keydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }

    if (e.key === "Tab") {
      // trap focus
      const nodes = modal.querySelectorAll("*");
      const tabbable = Array.from(nodes).filter(
        (n) => (n as HTMLElement).tabIndex >= 0
      );

      let index = tabbable.indexOf(document.activeElement as Element);
      if (index === -1 && e.shiftKey) index = 0;

      index += tabbable.length + (e.shiftKey ? -1 : 1);
      index %= tabbable.length;

      (tabbable[index] as HTMLElement).focus();
      e.preventDefault();
    }
  };

  const previously_focused =
    typeof document !== "undefined" && document.activeElement;

  if (previously_focused) {
    onDestroy(() => {
      // @ts-ignore
      previously_focused.focus();
    });
  }
</script>

<svelte:window on:keydown={handle_keydown} />
<Portal target="body">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-background" on:click={close} />

  <div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
    <div class="header">
      <slot name="header" />
    </div>
    <hr />
    <slot />
    <hr />

    <div class="footer">
      <!-- svelte-ignore a11y-autofocus -->
      <button on:click={close}>close</button>
      <slot name="action" />
    </div>
  </div>
</Portal>

<style>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  }

  .modal {
    position: fixed;
    left: 50%;
    top: 50%;
    width: calc(100vw - 4em);
    max-width: 32em;
    max-height: calc(100vh - 8em);
    overflow: auto;
    transform: translate(-50%, -50%);
    padding: 1em;
    border-radius: 0.2em;
    background: #888;

    /* pass over the drawer */
    z-index: 2;
  }

  .header {
    display: flex;
    justify-content: center;
  }

  .footer {
    display: flex;
    justify-content: space-between;
  }

  @media (prefers-color-scheme: light) {
    .modal {
      background-color: #708090;
    }
  }
</style>
