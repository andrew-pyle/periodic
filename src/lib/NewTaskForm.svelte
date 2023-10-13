<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";
  import Input from "./Input.svelte";
  import Label from "./Label.svelte";
  import Select from "./Select.svelte";
  import type { TaskT } from "./types";
  import { id } from "./utils";

  export let onSubmit: (task: TaskT) => void;

  /**
   * Create a new Task from a 'Create Task' <form>
   */
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    const formData = new FormData(event.currentTarget);

    // Developer Must Ensure inputs are the correct type for the cast below
    const name = formData.get("create-activity") as TaskT["name"];
    const period = formData.get("create-activity-period") as TaskT["period"];

    // Create New Activity
    const newActivity: TaskT = {
      id: id(),
      name,
      lastCompleted: null,
      period,
      tags: new Set(),
    };

    onSubmit(newActivity);

    // Clear Form
    event.currentTarget.reset();
  };
</script>

<form class="create-form" on:submit|preventDefault={handleSubmit}>
  <div class="label-group">
    <Label htmlFor="create-activity">Name</Label>
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
  <!-- <div class="label-group">
    <Label htmlFor="create-activity-tags">Tags</Label>
    <Input
      id="create-activity-tags"
      name="create-activity-tags"
      placeholder="Chores"
    />
  </div> -->

  <button type="submit" class="button button-intent--primary"
    >Create Task</button
  >
</form>

<!-- <ul class="create-form no-bullet">
  <li>Chores</li>
  <li>Schoolwork</li>
  <li>Cooking</li>
</ul> -->

<style>
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
</style>
