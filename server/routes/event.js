import express from 'express'
import { createEvent, deleteEvent, updateEvent } from '../controllers/event'

const router = express.Router()

router.post('/create', createEvent)
router.post('/update', updateEvent)
router.post('/delete', deleteEvent)

export const eventRouter = router