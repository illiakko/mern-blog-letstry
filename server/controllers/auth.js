import User from '../models/User.js';
import bccrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Regiter user
export const register = async (req, res) => {
    try {
        const { username, password } = req.body

        const isUsed = await User.findOne({ username })

        if (isUsed) {
            res.json({ message: 'Имя пользователя уже зарегистрированно.' })
        }

        const salt = bccrypt.genSaltSync(10)
        const hash = bccrypt.hashSync(password, salt)

        const newUser = new User({
            username,
            password: hash,
        })

        await newUser.save()

        res.json({
            newUser,
            message: 'Регистрация прошла успешно.'
        })

    } catch (error) {
        res.json({ message: 'Ошибка при создании пользователя.' })
    }
}

//Login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })
        if (!user) {
            res.json({ message: 'Такого юзера не существует.' })
        }

        const isPawwordCorrect = await bccrypt.compare(password, user.password)

        if (!isPawwordCorrect) {
            res.json({ message: 'Неверный пароль.' })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.json({
            token,
            user,
            message: 'Вы вошли в систему.'
        })


    } catch (error) {
        res.json({ message: 'Ошибка при авторизации.' })
    }
}

//Get me
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            res.json({ message: 'Такого юзера не существует.' })
        }

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '30d' })

        res.json({
            token,
            user,
        })

    } catch (error) {
        res.json({ message: 'Нет доступа.' })
    }
}