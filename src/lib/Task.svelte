<!--  TODO View is breaking out horizontally at 375px width -->
<!--  TODO Use Formation intent colors or Callout colors for background color of Task.-->

<script lang="ts">
  import type { TaskT } from "./types";
  import { lastCompletedFormatter } from "./utils";

  export let task: TaskT;
  export let onComplete: (id: TaskT["id"]) => void;
</script>

<div class="card task">
  <h2 class="title">{task.name}</h2>
  <p class="key-value">
    <span class="muted">Last&nbsp;Completed</span>
    <span>{lastCompletedFormatter.format(task.lastCompleted ?? undefined)}</span
    >
  </p>
  <p class="key-value">
    <span class="muted">Due&nbsp;Every</span><span>{task.period}</span>
  </p>
  <button
    type="button"
    on:click={() => onComplete(task.id)}
    class="button button-intent--primary thumb-button">Done</button
  >
</div>

<style>
  .task {
    display: grid;
    grid-template-columns: 1fr 1fr minmax(10%, 0.75fr);
    grid-template-areas:
      "title title button"
      ".     .     button";
    column-gap: 10px;
    /* Reset */
    width: unset;
  }
  /* Only the narrowest screens */
  @media screen and (max-width: 350px) {
    .task {
      grid-template-columns: 1fr minmax(10%, 0.75fr);
      grid-template-areas:
        "title title"
        ".     button"
        ".     button";
      row-gap: 10px;
    }
  }

  .title {
    grid-area: title;
  }

  .thumb-button {
    grid-area: button;
    align-self: center;
    min-height: 60px;
  }

  .key-value {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  @media screen and (min-width: 525px) {
    .key-value {
      flex-direction: row;
    }
  }
</style>