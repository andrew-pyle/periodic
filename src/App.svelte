<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";
  import Input from "./lib/Input.svelte";
  import Label from "./lib/Label.svelte";
  import Select from "./lib/Select.svelte";
  import Task from "./lib/Task.svelte";
  import type { TaskT } from "./lib/types";
  import { completeActivity, id } from "./lib/utils";

  let createMode = true;

  const [id1, id2, id3] = [id(), id(), id()];
  let activities: Map<TaskT["id"], TaskT> = new Map([
    [
      id1,
      {
        id: id1,
        name: "Sweep the Kitchen",
        lastCompleted: new Date(2023, 9, 10).valueOf(),
        period: "week",
      },
    ],
    [
      id2,
      {
        id: id2,
        name: "Vacuum the Kitchen",
        lastCompleted: new Date(2023, 8, 10).valueOf(),
        period: "week",
      },
    ],
    [
      id3,
      {
        id: id3,
        name: "Dust the TV",
        lastCompleted: null,
        period: "week",
      },
    ],
  ]);

  /**
   * Create a new Task from a 'Create Task' <form>
   */
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const formData = new FormData(event.currentTarget);

    // Developer Must Ensure inputs are the correct type for the cast below
    const name = formData.get("create-activity") as Task["name"];
    const period = formData.get("create-activity-period") as Task["period"];

    // Create New Activity
    const newActivity = {
      id: id(),
      name,
      lastCompleted: null,
      period,
    };

    // Update State
    activities = activities.set(id(), newActivity);
  };

  function completeTask(id: Task["id"]) {
    // Mutate & Update State
    const newTasksMap = completeActivity(activities, id);
    activities = newTasksMap;
  }
</script>

<div class="container">
  <main>
    <h1>Done Stuff</h1>

    <!-- Update -->
    <!-- 
    <h2>Table</h2>
    <TaskTable tasks={activities.values()} onComplete={completeTask} /> -->

    <!-- OR -->
    <!-- <h2>List</h2> -->
    <ul class="no-bullet">
      {#each activities.values() as task}
        <li>
          <Task {task} onComplete={completeTask} />
        </li>
      {/each}
    </ul>

    <!-- Create -->
    <hr />
    {#if createMode}
      <h2>Create a New Task</h2>
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
            <option value="month">Moth</option>
            <option value="year">Year</option>
          </Select>
        </div>
        <button type="submit" class="button button-intent--primary"
          >Create Task</button
        >
      </form>
    {/if}
  </main>
  <footer>
    Made with <a href="https://svelte.dev">Svelte</a> &
    <a href="https://formation.fyi">Formation</a>
  </footer>
</div>

<style>
  :root {
    --color-bkg-current: green;
    --color-current: currentColor;
    --color-bkg-due: yellow;
    --color-due: black;
    --color-bkg-overdue: red;
    --color-overdue: currentColor;
  }

  main {
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

  .current {
    color: var(--color-current);
    background: var(--color-bkg-current);
  }

  .due {
    /* background: var(--color-due); */
    color: var(--color-bkg-due);
  }

  .overdue {
    color: var(--color-overdue);
    background: var(--color-bkg-overdue);
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

  /* .label-group {
    display: flex;
    gap: 10px;
    flex-direction: row;
    align-items: baseline;
  } */
  .label-group {
    display: grid;
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

  /* Utility Classes */
  .no-bullet {
    padding: 0;
    list-style-type: none;
  }
</style>
