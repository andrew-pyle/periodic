<!-- Adapted from Formation Component Library. See https://formation.fyi/docs/select -->
<script lang="ts">
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
</script>

<div class="container">
  <span class="select-container">
    <select {name} {id} class="select select-intent--default">
      <slot />
    </select>
    <svg viewBox="0 0 16 16" class="icon select-icon"
      ><path
        d="M5 7h6a1.003 1.003 0 00.71-1.71l-3-3C8.53 2.11 8.28 2 8 2s-.53.11-.71.29l-3 3A1.003 1.003 0 005 7zm6 2H5a1.003 1.003 0 00-.71 1.71l3 3c.18.18.43.29.71.29s.53-.11.71-.29l3-3A1.003 1.003 0 0011 9z"
      /></svg
    >
  </span>
</div>

<style>
  .container {
    display: flex;
  }
</style>
