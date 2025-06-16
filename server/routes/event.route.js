import express from 'express'
import { createEvent, deleteEvent, getallEvents, getMyEvents, getSingleEvent, updateEvent } from '../controllers/event.controller.js'
import {updateImage, deleteImage, uploadImage, upload} from "../middlewares/cloudinary.middleware.js"
const router = express.Router()

router.get("/", getallEvents)
router.get("/myevents", getMyEvents)
router.get("/:id", getSingleEvent)
router.post('/create',upload.single("image"),uploadImage, createEvent)
router.patch('/update',upload.single("image"),updateImage, updateEvent)
router.delete('/delete',deleteImage, deleteEvent)

export const eventRouter = router