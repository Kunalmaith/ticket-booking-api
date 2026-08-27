import type { Request, Response } from "express";

import prisma from "../config/database.js";

export const listEvents = async (req : Request, res: Response) => {
    const events = await prisma.event.findMany({include : {seats :true}});
    res.status(200).json(events);
};