import type { TaskT } from "./types";

/**
 * Create a new Task ID
 */
export function id() {
	return crypto.randomUUID();
}

/**
 * Formats dates appropriately for a "Last Completed" timestamp
 */
export const lastCompletedFormatter = new Intl.DateTimeFormat(
	Intl.DateTimeFormat().resolvedOptions().locale,
	{
		dateStyle: "short",
	},
);

/**
 * Mutates provided Map, setting the Task with the provided ID
 * to have lastCompleted of now.
 * @throws {Error} - If no entry in the Map for the provided ID, throws Error.
 */
export function completeActivity(
	tasks: Map<TaskT["id"], TaskT>,
	id: TaskT["id"],
) {
	const old = tasks.get(id);
	if (!old) {
		throw new Error(
			`Cannot update Task with ID=${id} because it cannot be found in Task list.`,
		);
	}
	const complete = { ...old, lastCompleted: new Date().valueOf() };
	return tasks.set(id, complete);
}
