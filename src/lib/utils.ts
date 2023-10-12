import { add } from "date-fns";
import type { TaskStatusT, TaskStore, TaskT } from "./types";

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
 * Formats durations appropriately for a "Next Due" timestamp
 */
export const nextDueFormatter = new Intl.RelativeTimeFormat();

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

export function sortTasksByStatus(a: TaskT, b: TaskT) {
	const aStatus = determineTaskStatus(a);
	const bStatus = determineTaskStatus(b);
	if (aStatus === "did-today") {
		return -1;
	} else {
		// TODO
		return 1;
	}
}

export function determineTaskStatus(task: TaskT): TaskStatusT {
	// Short-Circiut if the task has never been done, since there
	// is no start point for the period in this case. It's not meaningful.
	if (!task.lastCompleted) {
		return "up-to-date";
	}

	const now = new Date();

	// Add 1 "hours", etc. Per the task's period string
	const nextDue = add(new Date(task.lastCompleted), { [`${task.period}s`]: 1 });
	const secondsUntilNextDue = Math.round(
		(nextDue.valueOf() - now.valueOf()) / 1000,
	);

	return statusForSecondsLeftInPeriod(task.period, secondsUntilNextDue);
}

const TEN_MINUTES = 60 * 10;
const ONE_HOUR = 60 * 60;
const ONE_DAY = 60 * 60 * 24;
const ONE_WEEK = 60 * 60 * 24 * 7;
const ONE_MONTH = 60 * 60 * 24 * 7 * 12;

function statusForSecondsLeftInPeriod(
	period: TaskT["period"],
	secondsUntilPeriodElapsed: number,
): TaskStatusT {
	if (secondsUntilPeriodElapsed <= 0) {
		return "overdue";
	}

	switch (period) {
		case "hour": {
			if (secondsUntilPeriodElapsed <= TEN_MINUTES) {
				return "almost-due";
			} else {
				return "up-to-date";
			}
		}
		case "day": {
			if (secondsUntilPeriodElapsed <= ONE_HOUR) {
				return "almost-due";
			} else {
				return "up-to-date";
			}
		}
		case "week": {
			if (secondsUntilPeriodElapsed <= ONE_DAY) {
				return "almost-due";
			} else {
				return "up-to-date";
			}
		}
		case "month": {
			if (secondsUntilPeriodElapsed <= ONE_WEEK) {
				return "almost-due";
			} else {
				return "up-to-date";
			}
		}
		case "year": {
			if (secondsUntilPeriodElapsed <= ONE_MONTH) {
				return "almost-due";
			} else {
				return "up-to-date";
			}
		}
	}
}

/**
 * Create a set of default tasks to populate the app.
 */
export function initializeDefaultTasks(): TaskStore {
	const [id1, id2, id3, id4] = [id(), id(), id(), id()];
	return new Map([
		[
			id1,
			{
				id: id1,
				name: "Sweep the Kitchen",
				lastCompleted: new Date(2023, 9, 5).valueOf(),
				period: "week",
			},
		],
		[
			id2,
			{
				id: id2,
				name: "Vacuum the Kitchen",
				lastCompleted: new Date(2023, 8, 9).valueOf(),
				period: "month",
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
		[
			id4,
			{
				id: id4,
				name: "Mop Entryway",
				lastCompleted: new Date(2023, 9, 4).valueOf(),
				period: "week",
			},
		],
	]);
}

/**
 * Opt-in to persistent storage for the origin, globally.
 */
export async function requestStoragePersistence() {
	if (window.navigator.storage?.persist) {
		const isPersisted = await window.navigator.storage.persisted();
		console.log(`Persistent Storage granted: ${isPersisted}`);
		if (!isPersisted) {
			console.log("Requesting Persistent Storage.");
			const permissionGranted = await window.navigator.storage.persist();
			console.log(`Persistent Storage granted: ${permissionGranted}`);
		}
	}
}
