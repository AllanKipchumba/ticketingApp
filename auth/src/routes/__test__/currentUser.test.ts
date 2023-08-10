import request from "supertest";
import { app } from "../../app";

it("Responds with details about the current user", async () => {
  const cookie = await global.getAuthCookie();

  //send a cookie along with the request
  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send({})
    .expect(400);

  //   console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("Responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  //   console.log(response.body);
  expect(response.body.currentUser).toEqual(undefined);
});
