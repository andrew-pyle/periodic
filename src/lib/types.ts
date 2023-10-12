export interface TaskT {
	id: string;
	name: string;
	lastCompleted: null | number; // millisecond time
	period: "hour" | "day" | "week" | "month" | "year";
	tags?: Set<string>;
}

export type TaskStatusT = "did-today" | "up-to-date" | "almost-due" | "overdue";

export type TaskStore = Map<TaskT["id"], TaskT>;
