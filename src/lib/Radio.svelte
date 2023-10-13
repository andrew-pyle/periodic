<!-- Adapted from Formation Component Library. See https://formation.fyi/docs/radio -->
<script lang="ts">
  export let name: string;
  export let value: string;
  export let checked: boolean;
</script>

<label class="radio-container">
  <input type="radio" {name} class="radio" {value} {checked} on:input />
  <span class="radio-overlay" />
  <span class="radio-label"><slot /></span>
</label>
