<!-- TODO: Light mode status colors look bad! -->

<script lang="ts">
  import {
    createIndexedDBStorage,
    persist,
  } from "@macfja/svelte-persistent-store";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import Checkbox from "./lib/Checkbox.svelte";

  import NewTaskForm from "./lib/NewTaskForm.svelte";
  import Radio from "./lib/Radio.svelte";
  import Task from "./lib/Task.svelte";
  import type { TaskStore, TaskT } from "./lib/types";
  import {
    completeActivity,
    determineTaskStatus,
    initializeDefaultTasks,
    requestStoragePersistence,
  } from "./lib/utils";

  // Types

  let editMode = false;
  let tagFilter = "all";

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

  function updateTagFilter(event: Event) {
    if (event.currentTarget instanceof HTMLInputElement) {
      tagFilter = event.currentTarget.value;
    } else {
      console.error(
        "Event handler should be attached to HTMLInputElement, but was not."
      );
    }
  }

  function addTask(task: TaskT) {
    // Update State
    $tasks = $tasks.set(task.id, task);
  }

  function completeTask(id: Task["id"]) {
    // Mutate & Update State
    const newTasksMap = completeActivity($tasks, id);
    $tasks = newTasksMap;
  }

  /**
   * Remove a Task from the App
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
   * Update the fields of a Task by ID
   */
  function editTask(id: TaskT["id"], task: TaskT) {
    const { id: _id, ...payload } = task; // Ignore id from task object
    $tasks = $tasks.set(id, { id, ...payload });
  }

  // Reactive

  $: sortedByLastCompleted = Array.from($tasks.values())
    .filter((t) => (tagFilter === "all" ? true : t.tags?.has(tagFilter)))
    .sort((a, b) => (a.lastCompleted ?? 0) - (b.lastCompleted ?? 0));

  $: tags = Array.from($tasks.values())
    .map((t) => t.tags ?? new Set<string>())
    .reduce((tags, next) => new Set([...tags, ...next]), new Set());

  // Debug
  $: {
    if (import.meta.env.DEV) {
      console.log("Debug $tasks", $tasks);
      console.log("Debug tags", tags);
    }
  }
</script>

<!-- Todo: Filters for statuses -->
<main>
  <h1>Done Stuff</h1>

  <div class="filter-form capitalize">
    <p class="muted">Filter Tags</p>
    <Radio
      name="tags-filter"
      value="all"
      checked={tagFilter === "all"}
      on:input={updateTagFilter}
    >
      All
    </Radio>
    {#each tags as tag}
      <Radio
        name="tags-filter"
        value={tag}
        checked={tagFilter === tag}
        on:input={updateTagFilter}
      >
        <!-- Replace hyphens with spaces -->
        {tag.replace(/-/g, " ")}
      </Radio>
    {/each}
  </div>

  <!-- Tasks List -->
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
    <NewTaskForm onSubmit={addTask} />
  </div>
</main>

<!-- Development Helpers -->
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

<!-- Footer -->
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

  .edit-mode-container {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 10px;
    margin: 0 25px;
    font-size: 22px;
    font-weight: 700;
  }

  .filter-form {
    margin-left: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }
</style>
