import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the provided id does not exist", async () => {
  const cookie = await global.getAuthCookie();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", cookie)
    .send({
      title: "zxcvbnm",
      price: 10,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "zxcvbnm",
      price: 10,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  //create a new ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.getAuthCookie())
    .send({
      title: "new ticket",
      price: 10,
    });

  //attemp to update the ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", await global.getAuthCookie()) //gets a new instance of another user other than the one that created the ticket
    .send({
      title: "updated ticket",
      price: 1000,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await global.getAuthCookie();
  //create a new ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "new ticket",
      price: 10,
    });

  //bad  tittle
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 1000,
    })
    .expect(400);

  //bad price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "updated new ticket",
      price: -10,
    });
});

it("updates the tickets provided valid inputs", async () => {
  const cookie = await global.getAuthCookie();
  //create a new ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "new ticket",
      price: 10,
    });

  //edit the ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});
