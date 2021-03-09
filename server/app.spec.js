const express = require("express");
const logger = require("morgan");
const http = require("http");

const PinsRouter = require("./routes/pins");
const Pins = require("./models/Pins");
const request = require("request");
const requestPromise = require("request-promise-native");
const axios = require("axios");

const app = express();
const apiUrl = "http://localhost:3000/api";
app.use(logger("dev"));
app.use(express.json());
app.use("/api", PinsRouter.router);

describe("Testing de Router", () => {
	let server;

	beforeAll(() => {
		server = http.createServer(app);
		server.listen(3000);
	});

	afterAll(() => {
		server.close();
	});

	describe("GET /api", () => {
		// 200 Ok
		it("200 /api and find pin", (done) => {
			const data = [{ id: 1 }];
			spyOn(Pins, "find").and.callFake((callBack) => {
				callBack(false, data);
			});

			request.get(`${apiUrl}/`, (error, response, body) => {
				expect(response.statusCode).toBe(200);
				expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
				done();
			});
		});

		// 500
		it("500 /api when not found", (done) => {
			const data = [{ id: 1 }];
			spyOn(Pins, "find").and.callFake((callBack) => {
				callBack(true, data);
			});

			request.get(`${apiUrl}/`, (error, response, body) => {
				expect(response.statusCode).toBe(500);
				done();
			});
		});
	});

	describe("GET /api Custom Pin", () => {
		// 200 Ok
		it("200 /api/:id and get custom pin", (done) => {
			const data = [{ id: 1 }];
			const elementId = "2112";
			spyOn(Pins, "findById").and.callFake((id, callBack) => {
				expect(elementId).toEqual(id);
				callBack(false, data);
			});

			request.get(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(response.statusCode).toBe(200);
				expect(JSON.parse(response.body)).toEqual([{ id: 1 }]);
				done();
			});
		});

		// 500
		it("500 /api/:id when not found", (done) => {
			const data = [{ id: 1 }];
			const elementId = "2112";
			spyOn(Pins, "findById").and.callFake((id, callBack) => {
				callBack(true, data);
			});

			request.get(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(response.statusCode).toBe(500);
				done();
			});
		});
	});

	describe("POST /api con un recurso html o PDF", () => {
		it("200 /api html", (done) => {
			const post = [
				{
					title: "Platzi",
					author: "Platzi",
					description: "Platzi",
					percentage: 0,
					tags: [],
					assets: [],
				},
			];
			spyOn(Pins, "create").and.callFake((id, callBack) => {
				callBack(false, {});
			});

			spyOn(requestPromise, "get").and.returnValue(
				Promise.resolve(
					'<title>Platzi</title><meta name="description" content="Platzi"/>'
				)
			);

			const assets = [{ url: "http://platzi.com" }];
			axios
				.post(`${apiUrl}/`, {
					tittle: "title",
					author: "author",
					description: "description",
					assets,
				})
				.then((res) => {
					expect(res.status).toBe(200);
					done();
				});
		});

		it("200 /api PDF", (done) => {
			spyOn(Pins, "create").and.callFake((id, callBack) => {
				callBack(false, {});
			});

			const assets = [{ url: "http://platzi.pdf" }];

			axios
				.post(`${apiUrl}/`, {
					tittle: "title",
					author: "author",
					description: "description",
					assets,
				})
				.then((res) => {
					expect(res.status).toBe(200);
					done();
				});
		});

		it("500 /api HTML", (done) => {
			spyOn(Pins, "create").and.callFake((id, callBack) => {
				callBack(true, {});
			});

			spyOn(requestPromise, "get").and.returnValue(
				Promise.resolve(
					'<title>Platzi</title><meta name="description" content="Platzi"/>'
				)
			);

			const assets = [{ url: "http://platzi.co" }];

			axios
				.post(`${apiUrl}/`, {
					tittle: "title",
					author: "author",
					description: "description",
					assets,
				})
				.catch((res) => {
					expect(res.response.status).toBe(500);
					done();
				});
		});

		it("500 /api PDF", (done) => {
			spyOn(Pins, "create").and.callFake((id, callBack) => {
				callBack(true, {});
			});

			const assets = [{ url: "http://google.pdf" }];

			axios
				.post(`${apiUrl}/`, {
					tittle: "title",
					author: "author",
					description: "description",
					assets,
				})
				.catch((res) => {
					expect(res.response.status).toBe(500);
					done();
				});
		});
	});

	describe("PUT /api/:id", () => {
		it("200 /api/:id", (done) => {
			const pin = [{ id: 1 }];
			const elementId = "333";
			spyOn(Pins, "findByIdAndUpdate").and.callFake((id, body, callBack) => {
				callBack(false, pin);
			});

			request.put(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(error).toBeNull();
				expect(response.statusCode).toBe(200);
				done();
			});
		});

		it("500 /api/:id", (done) => {
			const elementId = "333";
			spyOn(Pins, "findByIdAndUpdate").and.callFake((id, body, callBack) => {
				callBack(true, null);
			});

			request.put(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(response.statusCode).toBe(500);
				done();
			});
		});
	});

	describe("DELETE /api/:id", () => {
		it("200 /api/:id", (done) => {
			const pin = [{ id: 1 }];
			const elementId = "555";
			spyOn(Pins, "findByIdAndRemove").and.callFake((id, body, callBack) => {
				callBack(false, pin);
			});

			request.delete(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(error).toBeNull();
				expect(response.statusCode).toBe(200);
				done();
			});
		});

		it("500 /api/:id", (done) => {
			const elementId = "555";
			spyOn(Pins, "findByIdAndRemove").and.callFake((id, body, callBack) => {
				callBack(true, null);
			});

			request.delete(`${apiUrl}/${elementId}`, (error, response, body) => {
				expect(response.statusCode).toBe(500);
				done();
			});
		});
	});
});
