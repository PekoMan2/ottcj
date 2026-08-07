export const supportingContent = Object.freeze({
  press: {
    eyebrow: 'pre médiá',
    title: 'Press kit.',
    introduction: 'Materiály pre redakcie, rozhovory a overenie faktov sú pripravené v jednej štruktúre. Fotky a logá budú pribúdať priebežne.',
    contactEmail: 'majocrnkovic@gmail.com',
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
    introduction: 'Registrácia upozornení prebieha cez Google Formulár. Finálne informácie o spracovaní údajov doplníme po právnom schválení.',
    missingItems: [
      'prevádzkovateľ a kontaktné údaje',
      'účel a právny základ spracovania',
      'rozsah údajov a doba uchovávania',
      'spracovatelia vrátane služieb Google (Formuláre) a Garmin',
      'práva dotknutých osôb a spôsob ich uplatnenia',
    ],
  },
});
