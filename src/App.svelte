<script lang="ts">
  import type { FormEventHandler } from "svelte/elements";

  interface Task {
    id: ReturnType<typeof id>;
    name: string;
    lastCompleted: null | number; // millisecond time
    period: "hour" | "day" | "week" | "month" | "year";
  }

  const lastCompletedFormatter = new Intl.DateTimeFormat(
    Intl.DateTimeFormat().resolvedOptions().locale,
    {
      dateStyle: "short",
    }
  );

  let createMode = true;

  const [id1, id2, id3] = [id(), id(), id()];
  let activities = new Map<Task["id"], Task>([
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
   * Create a new Task ID
   */
  function id() {
    return crypto.randomUUID();
  }

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

  /**
   * Set the Task with the provided ID to have lastCompleted of now.
   */
  function completeActivity(id: Task["id"]) {
    const old = activities.get(id);
    if (!old) {
      throw new Error(
        `Cannot update Task with ID=${id} because it cannot be found in Task list.`
      );
    }
    const complete = { ...old, lastCompleted: new Date().valueOf() };
    activities = activities.set(id, complete);
  }
</script>

<main>
  <h1>Done Stuff</h1>

  <!-- Update -->
  <section>
    <table>
      <thead>
        <tr>
          <th>Task</th>
          <th>Last Completed</th>
          <th>How Often</th>
          <th>I Did It</th>
        </tr>
      </thead>
      <tbody>
        {#each activities as [id, { name, lastCompleted, period }]}
          <tr class="current">
            <td>{name}</td>
            <td
              ><time
                >{lastCompleted
                  ? lastCompletedFormatter.format(lastCompleted)
                  : "Never"}</time
              ></td
            >
            <td>{period}</td>
            <td
              ><button type="button" on:click={() => completeActivity(id)}
                >Done</button
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <!-- Create -->
  <hr />
  {#if createMode}
    <section>
      <form class="create-form" on:submit|preventDefault={onSubmit}>
        <label for="create-activity"
          >Create a New Activity
          <input
            type="text"
            id="create-activity"
            name="create-activity"
            placeholder="Sweep the Floor"
          />
        </label>

        <label for="create-activity-period"
          >Period
          <select name="create-activity-period" id="create-activity-period">
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Moth</option>
            <option value="year">Year</option>
          </select>
        </label>
        <button type="submit">Create Activity</button>
      </form>
    </section>
  {/if}
</main>

<style>
  :root {
    --color-bkg-current: green;
    --color-current: currentColor;
    --color-bkg-due: yellow;
    --color-due: black;
    --color-bkg-overdue: red;
    --color-overdue: currentColor;
  }

  h1 {
    text-align: center;
  }

  label {
    display: block;
    font-size: 0.9em;
  }

  hr {
    margin: 1em 0;
  }

  input[type="text"],
  select {
    display: block;
    padding: 0.6em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
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
    column-gap: 10px;
    align-items: end;
  }
</style>
