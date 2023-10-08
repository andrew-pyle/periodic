<script lang="ts">
  import type { Task } from "./types";
  import { lastCompletedFormatter } from "./utils";

  export let tasks: Iterable<Task>;
  export let onComplete: (id: Task["id"]) => void;
</script>

<table>
  <thead>
    <tr>
      <th>Task</th>
      <th>Last Completed</th>
      <th>How Often</th>
      <th>Due In</th>
      <th>I Did It</th>
    </tr>
  </thead>
  <tbody>
    {#each tasks as { id, name, lastCompleted, period }}
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
        <td>Due in {"TODO"} Units</td>
        <td
          ><button
            type="button"
            on:click={() => onComplete(id)}
            class="button button-intent--primary">Done</button
          ></td
        >
      </tr>
    {/each}
  </tbody>
</table>

<style>
  tr {
    border-radius: 10px;
    border: 2px solid white;
  }
</style>
