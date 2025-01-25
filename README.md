# K1M’s Place

K1M’s Place är en Next.js‐applikation som erbjuder AI-baserad föräldrarådgivning.  
Projektet samlar information från källor som BRIS, 1177, Friends och andra källor för att ge stöd och vägledning till vårdnadshavare.

## Innehåll

- [Komma igång](#komma-igång)
- [Miljövariabler](#miljövariabler)
- [Utvecklingsläge](#utvecklingsläge)
- [Bygga för produktion](#bygga-för-produktion)
- [Testning](#testning)
- [Lint & Format](#lint--format)
- [Lär dig mer om Next.js](#lär-dig-mer-om-nextjs)
- [Deploy på Vercel](#deploy-på-vercel-valfritt)

---

## Komma igång

1. **Klona** repot:

   ```bash
   git clone https://github.com/ConnyPettersson/K1M-s-place.git

   ```

2. Gå in i projektmappen:
   cd K1M-s-place

3. Installera beroenden
   npm install

## Miljövariabler

1. Skapa en fil .env i projektets rot och lägg till
   OPENAI_API_KEY=dinhemliganyckel
2. Se till att .env är listad i .gitignore, så att du inte oavsiktligt checkar in hemliga värden.

## Utvecklingsläge

1. Kör en utvecklingsserver som laddar om vid filändringar:
   npm run dev

2. Öppna http://localhost:3000 i webbläsaren för att se resultatet

## Bygga för produktion

1. Bygg projektet:
   npm run build

2. Starta den optimerade servern:
   npm run start

3. Besök http://localhost:3000 för att köra appen i produktionsläge

## Testning

1. Projektet är konfigurerat för att köra tester med Jest och relaterade verktyg.
   För att köra tester:
   npm run test

## Lint & Format

1. Lintning (ESLint):
   npm run lint

2. Formatering (Prettier):
   npm run format

3. Husky & lint-staged:
   Vid commit körs lint och format automatiskt om du inte har avaktiverat det i projektinställningarna.

## Lär dig mer om Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy på Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
