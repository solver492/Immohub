import { Router, type IRouter } from "express";
import { db, listingsTable } from "@workspace/db";
import { and, desc, eq, gte, ilike, lte, or, sql } from "drizzle-orm";
import {
  CreateListingBody,
  ListListingsQueryParams,
  GetListingParams,
  DeleteListingParams,
  GetSimilarListingsParams,
  GetRecentListingsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/listings", async (req, res) => {
  const params = ListListingsQueryParams.parse(req.query);
  const limit = params.limit ?? 24;
  const offset = params.offset ?? 0;

  const conditions = [];
  if (params.search) {
    conditions.push(
      or(
        ilike(listingsTable.title, `%${params.search}%`),
        ilike(listingsTable.description, `%${params.search}%`),
        ilike(listingsTable.city, `%${params.search}%`),
        ilike(listingsTable.neighborhood, `%${params.search}%`),
      ),
    );
  }
  if (params.city) conditions.push(eq(listingsTable.city, params.city));
  if (params.transaction)
    conditions.push(eq(listingsTable.transaction, params.transaction));
  if (params.propertyType)
    conditions.push(eq(listingsTable.propertyType, params.propertyType));
  if (params.minPrice !== undefined)
    conditions.push(gte(listingsTable.price, params.minPrice));
  if (params.maxPrice !== undefined)
    conditions.push(lte(listingsTable.price, params.maxPrice));
  if (params.minBedrooms !== undefined)
    conditions.push(gte(listingsTable.bedrooms, params.minBedrooms));
  if (params.minArea !== undefined)
    conditions.push(gte(listingsTable.area, params.minArea));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  let orderBy;
  switch (params.sort) {
    case "priceAsc":
      orderBy = listingsTable.price;
      break;
    case "priceDesc":
      orderBy = desc(listingsTable.price);
      break;
    case "areaDesc":
      orderBy = desc(listingsTable.area);
      break;
    default:
      orderBy = desc(listingsTable.createdAt);
  }

  const items = await db
    .select()
    .from(listingsTable)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(listingsTable)
    .where(whereClause);

  res.json({
    items: items.map(serialize),
    total: count,
    limit,
    offset,
  });
});

router.get("/listings/featured", async (_req, res) => {
  const items = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.featured, true))
    .orderBy(desc(listingsTable.createdAt))
    .limit(8);
  res.json(items.map(serialize));
});

router.get("/listings/recent", async (req, res) => {
  const { limit } = GetRecentListingsQueryParams.parse(req.query);
  const items = await db
    .select()
    .from(listingsTable)
    .orderBy(desc(listingsTable.createdAt))
    .limit(limit ?? 12);
  res.json(items.map(serialize));
});

router.get("/listings/:id", async (req, res) => {
  const { id } = GetListingParams.parse(req.params);
  const [listing] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, id))
    .limit(1);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  res.json(serialize(listing));
});

router.get("/listings/:id/similar", async (req, res) => {
  const { id } = GetSimilarListingsParams.parse(req.params);
  const [base] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.id, id))
    .limit(1);
  if (!base) {
    res.json([]);
    return;
  }
  const items = await db
    .select()
    .from(listingsTable)
    .where(
      and(
        eq(listingsTable.city, base.city),
        eq(listingsTable.transaction, base.transaction),
        sql`${listingsTable.id} <> ${id}`,
      ),
    )
    .orderBy(desc(listingsTable.createdAt))
    .limit(6);
  res.json(items.map(serialize));
});

router.post("/listings", async (req, res) => {
  const body = CreateListingBody.parse(req.body);
  const [created] = await db
    .insert(listingsTable)
    .values({
      title: body.title,
      description: body.description,
      transaction: body.transaction,
      propertyType: body.propertyType,
      price: body.price,
      city: body.city,
      neighborhood: body.neighborhood,
      address: body.address ?? null,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      area: body.area,
      images: body.images ?? [],
      videoUrl: body.videoUrl ?? null,
      features: body.features ?? [],
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      agencyName: body.agencyName ?? null,
    })
    .returning();
  res.status(201).json(serialize(created));
});

router.delete("/listings/:id", async (req, res) => {
  const { id } = DeleteListingParams.parse(req.params);
  await db.delete(listingsTable).where(eq(listingsTable.id, id));
  res.status(204).end();
});

type Row = typeof listingsTable.$inferSelect;

function serialize(row: Row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    transaction: row.transaction,
    propertyType: row.propertyType,
    price: row.price,
    currency: row.currency,
    city: row.city,
    neighborhood: row.neighborhood,
    address: row.address ?? undefined,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    images: row.images,
    videoUrl: row.videoUrl ?? null,
    features: row.features,
    contactName: row.contactName,
    contactPhone: row.contactPhone,
    contactEmail: row.contactEmail,
    agencyName: row.agencyName ?? null,
    featured: row.featured,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;
