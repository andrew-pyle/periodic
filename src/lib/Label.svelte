<!-- Adapted from Formation Component Library. See https://formation.fyi/docs/label -->
<script lang="ts">
  export let id: string | undefined = undefined;
  export let inline: boolean = false;
  export let htmlFor: string | undefined = undefined;
</script>

<label for={htmlFor} {id} class={`label ${inline ? "label--inline" : ""}`}>
  <slot />
</label>
