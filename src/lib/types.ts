export interface TaskT {
	id: string;
	name: string;
	lastCompleted: null | number; // millisecond time
	period: "hour" | "day" | "week" | "month" | "year";
}
