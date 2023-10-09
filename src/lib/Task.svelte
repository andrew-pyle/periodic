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
  <p>
    <span class="muted">Last Completed:</span>
    {lastCompletedFormatter.format(task.lastCompleted ?? undefined)}
  </p>
  <p><span class="muted">Due Every</span> {task.period}</p>
  <button
    type="button"
    on:click={() => onComplete(task.id)}
    class="button button-intent--primary thumb-button">Done</button
  >
</div>

<style>
  .task {
    display: grid;
    grid-template-areas:
      "title title button"
      ".     .     button";
  }

  .title {
    grid-area: title;
  }

  .thumb-button {
    grid-area: button;
    margin-left: 0.755em;
  }
</style>
