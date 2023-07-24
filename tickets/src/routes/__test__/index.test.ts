import request from "supertest";
import { app } from "../../app";

const createTicket = async () => {
  const cookie = await global.getAuthCookie();

  return request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "hsgdsh",
      price: 10,
    })
    .expect(201);
};

it("can fetch a list if tickets", async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
