import ApiError from '../errors/apiError.ts'
import {Request, Response} from 'express'
import { Event } from '../models/models.ts'

class FormController {
    async sendForm(req: Request, res: Response, next) {
        try {
            const {name, date, place, budget} = req.body
            const EventForm = await Event.create({name, date, place, budget})
            return res.json(EventForm)

        }
        catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
    async getAll(req: Request, res: Response, next) {
        try {
            const forms = await Event.find()
            return res.json(forms)
        }
        catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}


export default new FormController()
