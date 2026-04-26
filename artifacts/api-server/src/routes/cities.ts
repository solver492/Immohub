import { Router, type IRouter } from "express";
import { db, listingsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/cities", async (_req, res) => {
  const rows = await db
    .select({
      city: listingsTable.city,
      listingsCount: sql<number>`cast(count(*) as int)`,
      forSale: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'sale') as int)`,
      forRent: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'rent') as int)`,
      coverImage: sql<string | null>`min(${listingsTable.images}[1])`,
    })
    .from(listingsTable)
    .groupBy(listingsTable.city)
    .orderBy(sql`count(*) desc`);

  res.json(
    rows.map((r) => ({
      city: r.city,
      listingsCount: r.listingsCount,
      forSale: r.forSale,
      forRent: r.forRent,
      coverImage: r.coverImage,
    })),
  );
});

export default router;
