import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import { RegisterValidation } from "../validations/register.validation";
import bcryptjs from "bcryptjs"
import { sign, verify } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {

    const body = req.body

    const { error } = RegisterValidation.validate(body)

    if (error) {
        return res.status(400).send(error.details)
    }

    if (body.password != body.passwordConfirm) {
        return res.status(400).send({ message: "Passwords do not match" })
    }

    const repository = getManager().getRepository(User)

    const { password, ...user } = await repository.save({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10)
    })

    res.send(user)
}


export const Login = async (req: Request, res: Response) => {
    const repository = getManager().getRepository(User)

    const user = await repository.findOneBy({ email: req.body.email })

    if (!user) {
        return res.status(404).send({
            message: "invalid credentials"
        })
    }

    if (!await bcryptjs.compare(req.body.password, user.password)) {
        return res.status(400).send({
            message: "invalid credentials"
        })
    }

    const token = sign({ id: user.id }, "VeryScecretKey2023")

    res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })



    res.send({
        message: "success"
    })

}


export const AuthenticatedUser = async (req: Request, res: Response) => {
    const jwt = req.cookies["jwt"]

    const payload: any = verify(jwt, "VeryScecretKey2023")

    if (!payload) {
        return res.status(401).send({
            message: "unauthenticated"
        })
    }

    const repository = getManager().getRepository(User)

    const { password, ...user } = await repository.findOneBy({ id: payload.id })

    res.send(user)
}
