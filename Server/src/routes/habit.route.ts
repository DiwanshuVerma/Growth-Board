import express, { RequestHandler } from "express"
import { allHabits, createHabit, deleteHabit, updateHabit } from "../controllers/habit.controller"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.post('/create', verifyToken, createHabit as RequestHandler)
router.get('/bulk', verifyToken, allHabits)
router.put('/update/:_id', updateHabit)
router.delete('/delete/:_id', deleteHabit)

export default router