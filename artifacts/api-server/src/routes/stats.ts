import { Router, type IRouter } from "express";
import { db, listingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats/overview", async (_req, res) => {
  const [totals] = await db
    .select({
      total: sql<number>`cast(count(*) as int)`,
      forSale: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'sale') as int)`,
      forRent: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'rent') as int)`,
      avgSale: sql<number>`coalesce(cast(avg(${listingsTable.price}) filter (where ${listingsTable.transaction} = 'sale') as int), 0)`,
      avgRent: sql<number>`coalesce(cast(avg(${listingsTable.price}) filter (where ${listingsTable.transaction} = 'rent') as int), 0)`,
    })
    .from(listingsTable);

  const cityRows = await db
    .select({
      city: listingsTable.city,
      listingsCount: sql<number>`cast(count(*) as int)`,
      forSale: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'sale') as int)`,
      forRent: sql<number>`cast(count(*) filter (where ${listingsTable.transaction} = 'rent') as int)`,
    })
    .from(listingsTable)
    .groupBy(listingsTable.city)
    .orderBy(sql`count(*) desc`)
    .limit(6);

  const typeRows = await db
    .select({
      propertyType: listingsTable.propertyType,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(listingsTable)
    .groupBy(listingsTable.propertyType)
    .orderBy(sql`count(*) desc`);

  res.json({
    totalListings: totals.total,
    forSale: totals.forSale,
    forRent: totals.forRent,
    averageSalePrice: totals.avgSale,
    averageRentPrice: totals.avgRent,
    topCities: cityRows.map((c) => ({
      city: c.city,
      listingsCount: c.listingsCount,
      forSale: c.forSale,
      forRent: c.forRent,
    })),
    byType: typeRows,
  });
});

export default router;
