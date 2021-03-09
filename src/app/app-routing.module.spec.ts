import { routes } from "./app-routing.module";
import { PinsComponent } from "./components/pins/pins.component";

fdescribe("App Routing", () => {
	beforeAll(() => {
		console.log("BeforeAll");
	});
	beforeEach(() => {
		console.log("BeforEach");
	});
	afterAll(() => {
		console.log("AfterAll");
	});
	afterEach(() => {
		console.log("AfterEach");
	});

	it("Should have app as path", () => {
		expect(routes[0].path).toBe("app");
		expect(routes[0].children).toContain({
			path: "pins",
			component: PinsComponent,
		});
	});
});
