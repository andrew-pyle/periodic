<!-- Adapted from Formation Component Library. See https://formation.fyi/docs/checkbox -->
<script lang="ts">
  export let checked: HTMLInputElement["checked"];
</script>

<label class="checkbox-container checkbox-size--large">
  <input type="checkbox" class="checkbox" bind:checked />
  <span class="checkbox-overlay" /><span class="checkbox-label"><slot /></span>
</label>
