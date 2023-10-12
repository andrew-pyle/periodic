<!-- TODO: Light mode status colors look bad! -->

<script lang="ts">
  import {
    createIndexedDBStorage,
    persist,
  } from "@macfja/svelte-persistent-store";
  import { onMount } from "svelte";
  import type { FormEventHandler } from "svelte/elements";
  import { writable } from "svelte/store";
  import Checkbox from "./lib/Checkbox.svelte";
  import Input from "./lib/Input.svelte";
  import Label from "./lib/Label.svelte";
  import Select from "./lib/Select.svelte";
  import Task from "./lib/Task.svelte";
  import type { TaskStore, TaskT } from "./lib/types";
  import {
    completeActivity,
    determineTaskStatus,
    id,
    initializeDefaultTasks,
    requestStoragePersistence,
  } from "./lib/utils";

  // Types

  let editMode = false;

  let tasks = persist(
    writable<TaskStore>(new Map()),
    createIndexedDBStorage(),
    "tasks"
  );

  // Lifecycle

  onMount(async () => {
    // Opt-in the origin for persistent storage
    await requestStoragePersistence();
  });

  // Business Logic

  /**
   * Create a new Task from a 'Create Task' <form>
   */
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const formData = new FormData(event.currentTarget);

    // Developer Must Ensure inputs are the correct type for the cast below
    const name = formData.get("create-activity") as Task["name"];
    const period = formData.get("create-activity-period") as Task["period"];

    // Create New Activity
    const newActivity: TaskT = {
      id: id(),
      name,
      lastCompleted: null,
      period,
    };

    // Update State
    $tasks = $tasks.set(newActivity.id, newActivity);

    // Clear Form
    event.currentTarget.reset();
  };

  function completeTask(id: Task["id"]) {
    // Mutate & Update State
    const newTasksMap = completeActivity($tasks, id);
    $tasks = newTasksMap;
  }

  /**
   * TODO: Delete doesn't work. Maybe IDs aren't stable?
   */
  function deleteTask(id: TaskT["id"]) {
    // Delete ID from Task Map
    const somethingDeleted = $tasks.delete(id);

    // Only re-render if something was really deleted
    if (somethingDeleted) {
      $tasks = $tasks;
    }
  }

  /**
   * TODO: Doesn't work. Sometimes clones existing items.
   * Maybe IDs aren't stable?
   */
  function editTask(task: TaskT) {
    console.log(task);
    $tasks = $tasks.set(task.id, task);
  }

  // Reactive

  $: sortedByLastCompleted = [...$tasks.values()].sort(
    (a, b) => (a.lastCompleted ?? 0) - (b.lastCompleted ?? 0)
  );

  // Debug
  $: {
    if (import.meta.env.DEV) {
      console.log("Debug $tasks", $tasks);
    }
  }
</script>

<!-- Todo: Filters for statuses -->
<main>
  <h1>Done Stuff</h1>
  <ul class="no-bullet">
    {#each sortedByLastCompleted as task (task.id)}
      <li>
        <Task
          {task}
          status={determineTaskStatus(task)}
          onComplete={completeTask}
          onDelete={deleteTask}
          onEdit={editTask}
          {editMode}
        />
      </li>
    {/each}
  </ul>

  <!-- Edit Mode -->
  <div class="edit-mode-container">
    <Checkbox bind:checked={editMode}>Edit Mode</Checkbox>
  </div>

  <!-- Create -->
  <hr />
  <h2>Create a New Task</h2>
  <div class="form-container">
    <form class="create-form" on:submit|preventDefault={onSubmit}>
      <div class="label-group">
        <Label htmlFor="create-activity">Task Name</Label>
        <Input
          id="create-activity"
          name="create-activity"
          placeholder="Sweep the Floor"
        />
      </div>
      <div class="label-group">
        <Label htmlFor="create-activity-period">Period</Label>
        <Select name="create-activity-period" id="create-activity-period">
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </Select>
      </div>
      <button type="submit" class="button button-intent--primary"
        >Create Task</button
      >
    </form>
  </div>
</main>
{#if import.meta.env.DEV}
  <section class="development-mode-controls">
    <h2>Development</h2>
    <div>
      <!-- Populate Default tasks -->
      <button
        type="button"
        class="button button-intent--warning"
        on:click={() => ($tasks = initializeDefaultTasks())}
        >Restore Default Task List</button
      >
      <!-- Clear Persisted Store -->
      <button
        type="button"
        class="button button-intent--warning"
        on:click={() => tasks.delete()}>Delete Task Store</button
      >
    </div>
  </section>
{/if}
<footer>
  Made with <a href="https://svelte.dev">Svelte</a> &
  <a href="https://formation.fyi">Formation</a>
</footer>

<style>
  :root {
    --color-bkg-current: green;
    --color-current: currentColor;
    --color-bkg-due: yellow;
    --color-due: black;
    --color-bkg-overdue: red;
    --color-overdue: currentColor;
  }

  main,
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 700px;
    margin: 0 auto;
    margin-bottom: 3em;
    padding: 8px;
  }

  hr {
    margin: 1em 0;
  }

  .form-container {
    margin: 0 30px;
  }

  .create-form {
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: start;
  }
  @media screen and (min-width: 450px) {
    .create-form {
      flex-direction: row;
      justify-content: center;
      align-items: end;
    }
  }

  .label-group {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 3fr;
    align-items: baseline;
  }
  @media screen and (min-width: 450px) {
    .label-group {
      display: flex;
      gap: 10px;
      flex-direction: column;
    }
  }

  .edit-mode-container {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 10px;
    margin: 0 25px;
    font-size: 22px;
    font-weight: 700;
  }

  /* Utility Classes */
  .no-bullet {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }
</style>
