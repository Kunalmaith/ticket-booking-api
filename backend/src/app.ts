import express from "express";
import eventRoutes from "./routes/event.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express()
app.use(express.json());


app.get("/health",(req, res) => {
    res.status(200).json({ status : "ok"});
});

app.use("/events", eventRoutes);
app.use("/bookings", bookingRoutes);

export default app;