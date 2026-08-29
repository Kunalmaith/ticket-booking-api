import request from "supertest";
import app from "../src/app.js";
import prisma from "../src/config/database.js";

describe("Booking concurreency", () => {
  let seatId: string;

  beforeAll(async () => {
    const event = await prisma.event.create({
      data: {
        name: "Test Event",
        date: new Date(),
      },
    });
    const seat = await prisma.seat.create({
      data: {
        seatNumber: "A1",
        status: "AVAILABLE",
        eventId: event.id,
      },
    });
    seatId = seat.id;
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("only allows exactly one booking when 50 reqs hit the same seat simultaneously", async () => {
    const requests = Array.from({ length: 50 }, (_, i) =>
      request(app)
        .post("/bookings")
        .send({ seatId, userId: `user-${i}` }),
    );

    const responses = await Promise.all(requests);

    const successes = responses.filter((res) => res.status === 201);
    const failures = responses.filter((res) => res.status === 409);

    const statusCounts = responses.reduce(
      (acc, res) => {
        acc[res.status] = (acc[res.status] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>,
    );

    console.log("Status breakdown:", statusCounts);

    console.log(
      `Successes : ${successes.length}, Failures: ${failures.length}`,
    );

    expect(successes.length).toBe(1);
    expect(failures.length).toBe(49);
  });
});
