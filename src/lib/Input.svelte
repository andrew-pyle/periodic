<!-- Adapted from Formation Component Library. See https://formation.fyi/docs/input -->
<script lang="ts">
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export let placeholder: string | undefined = undefined;
  export let value: string = "";
  let icon = false; // Unimplemented
</script>

<div class="input-container">
  <input type="text" {name} {id} {value} {placeholder} class="input" />
  {#if icon}
    <span class="input-icon input-icon--left"
      ><svg class="icon" viewBox="0 0 16 16"
        ><path
          d="M15.55 13.43l-2.67-2.68a6.94 6.94 0 001.11-3.76c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.39 0 2.68-.42 3.76-1.11l2.68 2.67a1.498 1.498 0 102.12-2.12zm-8.56-1.44c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
        /></svg
      ></span
    >
  {/if}
</div>
