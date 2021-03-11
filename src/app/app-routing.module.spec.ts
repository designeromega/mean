import { routes } from "./app-routing.module";
import { PinsComponent } from "./components/pins/pins.component";

fdescribe("App Routing", () => {
	it("Should have app as path", () => {
		expect(routes[0].path).toBe("app");
		expect(routes[0].children).toContain({
			path: "pins",
			component: PinsComponent,
		});
	});
});
