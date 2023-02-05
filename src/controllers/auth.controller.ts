import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entities/user.entity";
import { RegisterValidation } from "../validations/register.validation";
import bcryptjs from "bcryptjs"

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

    const { password, ...data } = user

    res.send(data)

}
