export interface Task {
	id: string;
	name: string;
	lastCompleted: null | number; // millisecond time
	period: "hour" | "day" | "week" | "month" | "year";
}
