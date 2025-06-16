import express, { RequestHandler } from "express"
import { allHabits, createHabit, deleteHabit, updateHabit } from "../controllers/habit.controller"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.post('/create', verifyToken, createHabit as RequestHandler)
router.get('/bulk', verifyToken, allHabits as RequestHandler)
router.put('/update/:_id', verifyToken, updateHabit  as RequestHandler)
router.delete('/delete/:_id', verifyToken, deleteHabit  as RequestHandler)

export default router