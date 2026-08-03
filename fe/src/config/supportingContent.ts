export const supportingContent = Object.freeze({
  thankYou: {
    eyebrow: 'prísľub odoslaný',
    title: 'Ďakujeme, že bežíš s nami.',
    body: 'Tvoj prísľub pomáha niesť príbeh Zachráňme Vilyho ďalej. Zdieľaj výzvu s niekým, kto sa chce pridať.',
    shareTitle: 'Majo · Od Tatier k Dunaju',
    shareText: '347 km sólo pre Zachráňme Vilyho. Pridaj sa verejným prísľubom.',
  },
  press: {
    eyebrow: 'pre médiá',
    title: 'Press kit.',
    introduction: 'Materiály pre redakcie, rozhovory a overenie faktov sú pripravené v jednej štruktúre. Súbory zverejníme až po dodaní a schválení.',
    assets: [
      { label: 'TLAČOVÁ SPRÁVA', note: 'finálny text a formát čakajú na dodanie' },
      { label: 'HD FOTOGRAFIE', note: 'fotografie, titulky, kredity a práva čakajú na dodanie' },
      { label: 'LOGO PACK', note: 'produkčné logá a pravidlá použitia čakajú na dodanie' },
    ],
  },
  vily: {
    eyebrow: 'pre koho bežíme',
    title: 'Zachráňme Vilyho.',
    additionalSections: [] as readonly { body: string; title: string }[],
  },
  gdpr: {
    eyebrow: 'ochrana osobných údajov',
    title: 'GDPR informácie.',
    warning: 'PRÁVNY TEXT NIE JE SCHVÁLENÝ',
    introduction: 'Finálne informácie o spracovaní údajov z Google Formulára doplníme po právnom schválení.',
    missingItems: [
      'prevádzkovateľ a kontaktné údaje',
      'účel a právny základ spracovania',
      'rozsah údajov a doba uchovávania',
      'spracovatelia vrátane služieb Google',
      'práva dotknutých osôb a spôsob ich uplatnenia',
    ],
  },
});
