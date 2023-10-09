import App from "./App.svelte";
import "./app.css";

const target = document.getElementById("app");

if (!target) {
	throw new Error(
		'Tried to mount Svelte app at element with id="app", but that target was not found.',
	);
}

const app = new App({
	target,
});

export default app;
