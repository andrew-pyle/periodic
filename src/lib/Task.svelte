<script lang="ts">
  import type { TaskStatusT, TaskT } from "./types";
  import { lastCompletedFormatter } from "./utils";

  export let task: TaskT;
  export let status: TaskStatusT;
  export let editMode: boolean;
  export let onComplete: (id: TaskT["id"]) => void;
  export let onDelete: (id: TaskT["id"]) => void;
  export let onEdit: (task: TaskT) => void;

  // Possible Statuses of the Task
  const statusMap: { [T in TaskStatusT]: string } = {
    "did-today": "success",
    "up-to-date": "blank",
    "almost-due": "warning",
    overdue: "danger",
  };
</script>

<div class={`card task color--intent-${statusMap[status]}`}>
  <!-- Title -->
  <h2
    class="title"
    contenteditable={editMode}
    on:input={(event) =>
      onEdit({ ...task, name: event.currentTarget.textContent ?? "" })}
  >
    {task.name}
  </h2>

  <!-- Metadata: Last Completed -->
  <p class="key-value">
    <span class="muted">Last&nbsp;Completed</span>
    <span
      >{task.lastCompleted
        ? lastCompletedFormatter.format(task.lastCompleted)
        : "Never"}</span
    >
  </p>

  <!-- Metadata: Period -->
  <p class="key-value">
    <span class="muted">Due&nbsp;Every</span>
    {#if editMode}
      <select
        class="edit-period"
        value={task.period}
        on:input={(event) =>
          onEdit({ ...task, period: event.currentTarget.value })}
      >
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>
    {:else}
      <span class="period">{task.period}</span>
    {/if}
  </p>

  <!-- Button -->
  {#if editMode}
    <button
      type="button"
      on:click={() => onDelete(task.id)}
      class="button button-intent--danger thumb-button">Delete</button
    >
  {:else}
    <button
      type="button"
      on:click={() => onComplete(task.id)}
      class="button button-intent--primary thumb-button">Done</button
    >
  {/if}
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

  .title[contenteditable="true"] {
    outline: 1px solid currentColor;
    border-radius: 2px;
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

  .period {
    text-transform: capitalize;
  }

  .edit-period {
    font: inherit;
    background: transparent;
    color: inherit;
    border: 0;
  }
</style>
