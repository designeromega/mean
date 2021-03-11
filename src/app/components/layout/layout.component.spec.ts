import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatBottomSheet } from "@angular/material/bottom-sheet";

import { LayoutComponent } from "./layout.component";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";
import { FileDetector } from "selenium-webdriver";
import { ActionsComponent } from "../actions/actions.component";
class MatBottomSheetStub {
	open() {}
}

fdescribe("LayoutComponent", () => {
	let component: LayoutComponent;
	let fixture: ComponentFixture<LayoutComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LayoutComponent],
			providers: [{ provide: MatBottomSheet, useClass: MatBottomSheetStub }],
			imports: [
				RouterTestingModule.withRoutes([
					{ path: "", component: LayoutComponent },
					{ path: "app/add", component: LayoutComponent },
				]),
			],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LayoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should set the edit mode to false", async(() => {
		const verifyEditmode = spyOn(component, "verifyEditMode").and.callThrough();

		fixture.ngZone.run(() => {
			(<any>component).router.navigate(["/"]);

			fixture.whenStable().then(() => {
				expect(component.editMode).toBeFalsy();
				expect(verifyEditmode).toHaveBeenCalled();
			});
		});
	}));

	it("should set the edit mode to true", async(() => {
		const verifyEditmode = spyOn(component, "verifyEditMode").and.callThrough();

		fixture.ngZone.run(() => {
			(<any>component).router.navigate(["/app/add"]);

			fixture.whenStable().then(() => {
				expect(component.editMode).toBeTruthy();
				expect(verifyEditmode).toHaveBeenCalled();
			});
		});
	}));

	it("should call openBottomSheet", () => {
		const open = spyOn((<any>component).bottomSheet, "open");

		component.openBottomSheet();

		expect(open).toHaveBeenCalledWith(ActionsComponent);
	});
});
