import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Changed
export const userScheme = async (req, res) => {

    try {
        await UserModel.create({ ...req.body })
        return res.status(201).send({ success: true })
    } catch (ex) {
        return res.status(400).send({ success: false, error: 'invalid data | most likely missing field(s) or duplicate id ', mongoError: ex })
    }

}

