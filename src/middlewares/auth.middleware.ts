import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import bcryptjs from "bcryptjs"
import { sign, verify } from "jsonwebtoken";

export const AuthMiddleware = async (req: Request, res: Response, next: Function) => {
    try {
        const jwt = req.cookies["jwt"]

        const payload: any = verify(jwt, process.env.SECRET_KEY)

        if (!payload) {
            return res.status(401).send({
                message: "unauthenticated"
            })
        }

        const repository = getManager().getRepository(User)

        req["user"] = await repository.findOneBy({ id: payload.id })

        next()

    } catch (e) {
        return res.status(401).send({
            message: "unauthenticated"
        })
    }
}