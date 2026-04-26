import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/inquiries", async (req, res) => {
  const body = CreateInquiryBody.parse(req.body);
  const [created] = await db
    .insert(inquiriesTable)
    .values({
      listingId: body.listingId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    })
    .returning();
  res.status(201).json({
    id: created.id,
    listingId: created.listingId,
    name: created.name,
    email: created.email,
    phone: created.phone,
    message: created.message,
    createdAt: created.createdAt.toISOString(),
  });
});

export default router;
