import { Router, type IRouter } from "express";
import healthRouter from "./health";
import listingsRouter from "./listings";
import statsRouter from "./stats";
import citiesRouter from "./cities";
import inquiriesRouter from "./inquiries";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(listingsRouter);
router.use(statsRouter);
router.use(citiesRouter);
router.use(inquiriesRouter);
router.use(chatRouter);

export default router;
