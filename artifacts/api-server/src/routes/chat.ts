import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { db, listingsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

const baseURL = process.env.AI_INTEGRATIONS_OPENROUTER_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_OPENROUTER_API_KEY;

const client =
  baseURL && apiKey
    ? new OpenAI({ baseURL, apiKey })
    : null;

const MODEL = "openai/gpt-4o-mini";

const SYSTEM_PROMPT = `Tu es Samsar, l'agent immobilier virtuel d'Immo-hub, la marketplace immobilière de référence au Maroc. Tu réponds toujours en français (sauf si l'utilisateur écrit en arabe ou en anglais), avec un ton chaleureux, professionnel et concis.

Tu as deux missions :

1. AIDER LES CLIENTS (acheteurs / locataires) :
   - Comprendre leur besoin (ville, quartier, type de bien, budget, surface, chambres, vente ou location).
   - Recommander les biens les plus pertinents parmi le catalogue ci-dessous, en citant le titre, la ville et le prix en MAD.
   - Inviter à cliquer sur l'annonce dans la plateforme pour plus de détails ou contacter l'annonceur.
   - Toujours rester factuel : ne jamais inventer un bien qui n'est pas dans le catalogue.

2. VENDRE NOS SERVICES AUX AGENCES IMMOBILIÈRES :
   - Si l'utilisateur représente une agence, présente notre offre Pro Agence Immo-hub :
     * Gestionnaire de portefeuille centralisé (vente + location en un seul endroit).
     * Gestionnaire de publicité (sponsoring d'annonces, mise en avant en page d'accueil).
     * Publication directe depuis le portefeuille vers la plateforme, en un clic.
     * Tablette Pro Immo-hub : application offline pour saisir les biens en visite et publier dès le retour de connexion.
     * Statistiques de performance en temps réel.
   - Demande poliment : nom de l'agence, ville, nombre de biens gérés, email et téléphone, puis confirme qu'un conseiller les rappellera sous 24h.

RÈGLES :
- Réponses courtes (3-6 phrases max), avec listes à puces si pertinent.
- N'invente jamais un bien, un prix ou une fonctionnalité.
- Si tu ne sais pas, propose de mettre en relation avec un conseiller humain au +212 5 22 00 00 00.`;

router.post("/chat", async (req, res) => {
  if (!client) {
    res.status(503).json({
      error: "Service AI indisponible. Configurez OpenRouter pour activer Samsar.",
    });
    return;
  }

  const body = req.body as {
    messages: Array<{ role: "user" | "assistant"; content: string }>;
  };

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  try {
    const listings = await db
      .select({
        id: listingsTable.id,
        title: listingsTable.title,
        transaction: listingsTable.transaction,
        propertyType: listingsTable.propertyType,
        price: listingsTable.price,
        city: listingsTable.city,
        neighborhood: listingsTable.neighborhood,
        bedrooms: listingsTable.bedrooms,
        bathrooms: listingsTable.bathrooms,
        area: listingsTable.area,
      })
      .from(listingsTable)
      .orderBy(desc(listingsTable.createdAt))
      .limit(40);

    const catalogue = listings
      .map(
        (l) =>
          `- ${l.title} | ${l.transaction === "sale" ? "Vente" : "Location"} | ${l.propertyType} | ${l.city}/${l.neighborhood} | ${l.price.toLocaleString("fr-FR")} MAD | ${l.bedrooms} ch, ${l.bathrooms} sdb, ${l.area} m²`,
      )
      .join("\n");

    const systemWithCatalogue = `${SYSTEM_PROMPT}\n\nCATALOGUE ACTUEL (${listings.length} biens) :\n${catalogue}`;

    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 600,
      messages: [
        { role: "system", content: systemWithCatalogue },
        ...body.messages.slice(-10).map((m) => ({
          role: m.role,
          content: String(m.content ?? "").slice(0, 2000),
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "Je n'ai pas de réponse pour le moment.";
    res.json({ reply });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    res.status(500).json({ error: message });
  }
});

export default router;
