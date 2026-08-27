import type { Request, Response } from "express";
import prisma from "../config/database.js";

export const createBooking = async (req: Request, res: Response) => {

    const {seatId, userId} = req.body;

    const seat = await prisma.seat.findUnique({where: { id:seatId }});

    if(!seat || seat.status !== "AVAILABLE") {
        return res.status(409).json({error : "Seat is not available"});
    }

    await prisma.seat.update({
        where: {id: seatId},
        data: {status: "BOOKED"}
    });

    const booking = await prisma.booking.create({
        data: {seatId, userId},
    });

    res.status(201).json(booking);


}