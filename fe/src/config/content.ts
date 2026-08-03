export interface RunFact {
  label: string;
  value: string;
}

export interface NavigationItem {
  href: `/${string}`;
  label: string;
}

export interface ReadyContentLink {
  href: string;
  label: string;
  status: 'ready';
}

export interface MissingContentLink {
  label: string;
  note: string;
  status: 'missing';
}

export type ContentLink = MissingContentLink | ReadyContentLink;

export interface ReadyContentImage {
  alt: string;
  height: number;
  src: string;
  status: 'ready';
  width: number;
}

export interface MissingContentImage {
  label: string;
  note: string;
  status: 'missing';
}

export type ContentImage = MissingContentImage | ReadyContentImage;

export interface CharityContent {
  badge: string;
  campaign: {
    beneficiary: string;
    collectedApproximation: string;
    destinationLabel: string;
    destinationUrl: string;
    targetApproximation: string;
    updatedAt: string | null;
  };
  headingLead: string;
  headingPurpose: string;
  story: {
    accent: string;
    introduction: string;
    tag: string;
  };
}

export interface RunOverviewContent {
  annotation: string;
  eyebrow: string;
  facts: readonly RunFact[];
  introduction: string;
  route: {
    distance: string;
    finish: string;
    handoffs: string;
    start: string;
    timeLimit: string;
  };
  title: string;
}

export interface StoryContent {
  annotation: string;
  biography: {
    placeholder: string;
    status: 'missing';
  };
  eyebrow: string;
  interview: ContentLink;
  quote: string;
  quoteAttribution: string;
  quoteStatus: string;
  title: string;
}

export interface TeamMemberContent {
  description: string;
  id: string;
  image: ContentImage;
  name: string;
  role: string;
  statusLabel?: string;
}

export interface TeamContent {
  annotation: string;
  eyebrow: string;
  members: readonly TeamMemberContent[];
  title: string;
}

export interface PartnerContent {
  asset: ContentImage;
  description: string;
  destination: ContentLink;
  name: string;
  statusLabel: string;
}

export interface PartnerTierContent {
  annotation: string;
  emptyMessage?: string;
  id: string;
  partners: readonly PartnerContent[];
  title: string;
}

export interface PartnersContent {
  annotation: string;
  eyebrow: string;
  tiers: readonly PartnerTierContent[];
  title: string;
}

export interface ContactChannelContent {
  description: string;
  id: string;
  links: readonly ContentLink[];
  title: string;
}

export interface ContactContent {
  annotation: string;
  channels: readonly ContactChannelContent[];
  eyebrow: string;
  title: string;
}

export interface FinalPledgeContent {
  annotation: string;
  body: string;
  eyebrow: string;
  title: string;
}

export interface FooterContent {
  brandName: string;
  brandPrefix: string;
  navigationLabel: string;
  socialLabel: string;
  socialLinks: readonly ContentLink[];
  summary: string;
}

export interface SiteContent {
  charity: CharityContent;
  contact: ContactContent;
  eventDateLabel: string;
  finalPledge: FinalPledgeContent;
  footer: FooterContent;
  navigation: {
    footer: readonly NavigationItem[];
    header: readonly NavigationItem[];
  };
  partners: PartnersContent;
  runFacts: readonly RunFact[];
  runOverview: RunOverviewContent;
  story: StoryContent;
  team: TeamContent;
}

const runFacts = [
  { label: 'kilometrov', value: '347' },
  { label: 'časový limit', value: '84 h' },
  { label: 'odovzdávok', value: '36' },
  { label: 'bežec', value: '1' },
] as const;

const missingPhoto = (label: string): MissingContentImage => ({
  label,
  note: 'fotografia, alt text a povolenie čakajú na dodanie',
  status: 'missing',
});

const missingPartnerAsset = (label: string): MissingContentImage => ({
  label,
  note: 'logo a povolenie na použitie čakajú na dodanie',
  status: 'missing',
});

export const siteContent = Object.freeze({
  eventDateLabel: '13. — 16. augusta 2026',
  runFacts,
  navigation: {
    header: [
      { href: '/#trasa', label: 'trasa' },
      { href: '/#vily', label: 'Vily' },
      { href: '/#tim', label: 'tím' },
      { href: '/#partneri', label: 'partneri' },
      { href: '/#prislub', label: 'prísľub' },
    ],
    footer: [
      { href: '/#trasa', label: 'trasa' },
      { href: '/#vily', label: 'Vily' },
      { href: '/#pribeh', label: 'príbeh' },
      { href: '/#tim', label: 'tím' },
      { href: '/#partneri', label: 'partneri' },
      { href: '/#kontakt', label: 'kontakt' },
      { href: '/#prislub', label: 'prísľub' },
      { href: '/prislub-zoznam', label: 'zoznam prísľubov' },
      { href: '/press', label: 'press' },
      { href: '/vily', label: 'viac o Vilym' },
      { href: '/gdpr', label: 'GDPR' },
    ],
  },
  charity: {
    badge: 'verejný prísľub · charitatívny beh',
    headingLead: 'bež so mnou.',
    headingPurpose: 'zachráňme Vilyho.',
    story: {
      tag: '→ kto je Vily?',
      introduction:
        'Vily má 2 roky. Bojuje s Duchennovou svalovou dystrofiou — vzácnou genetickou chorobou, ktorá mu postupne ničí svaly. Prvé 4 roky sú kritické. Otec mu zohnal medzinárodný tím vedcov (Francúzsko, UPJŠ Košice, Comenius Bratislava) a pripravuje sa špecializovaná liečba.',
      accent:
        'Vilyho otec šiel sám peši 430 km z Košíc do Bratislavy, aby pomohol synovi. Ja pokračujem v jeho šľapajach — 347 km z Tatier k Dunaju. Sólo, bez štafety.',
    },
    campaign: {
      beneficiary: 'Zachráňme Vilyho',
      collectedApproximation: '~2 milióny €',
      destinationLabel: 'donio.sk/zachranme-vilyho',
      destinationUrl: 'https://donio.sk/zachranme-vilyho',
      targetApproximation: '4 milióny €',
      updatedAt: null,
    },
  },
  runOverview: {
    eyebrow: 'to nie je výlet',
    title: '347,32 km krížom cez Slovensko.',
    annotation: 'sólo · bez štafety · non-stop',
    introduction:
      'Od štartu v Jasnej po cieľ na Tyršovom nábreží. Jedna súvislá trať, 36 oficiálnych odovzdávok a časový limit 84 hodín.',
    facts: runFacts,
    route: {
      distance: '347,32 km',
      finish: 'Tyršovo nábrežie',
      handoffs: '36 odovzdávok',
      start: 'Jasná',
      timeLimit: '84 hodín',
    },
  },
  story: {
    eyebrow: 'prečo do toho idem',
    title: 'Majov príbeh.',
    annotation: 'celé bio ešte dopíšeme, príbeh si nevymýšľame',
    biography: {
      status: 'missing',
      placeholder:
        'Schválené Majo bio v rozsahu 3–5 viet čaká na dodanie. Toto miesto je pripravené na finálny text bez zmeny rozloženia.',
    },
    quote: '„Nie, ale môžeš byť prvý. A bude to trápenie.“',
    quoteAttribution: 'Michal Šula',
    quoteStatus: 'dočasný citát zo zdrojového briefu',
    interview: {
      status: 'missing',
      label: 'prečítaj celý rozhovor →',
      note: 'finálny odkaz na Refresher čaká na dodanie',
    },
  },
  team: {
    eyebrow: '347 km nie je sólo projekt',
    title: 'Tím za behom.',
    annotation: 'ľudia, ktorí držia tempo, obraz aj zázemie',
    members: [
      {
        id: 'michal-sula',
        name: 'Michal Šula',
        role: 'tréner',
        description: 'Majster Slovenska v ultrabehu.',
        image: missingPhoto('FOTO TRÉNERA'),
        statusLabel: 'údaje zo zdrojového briefu',
      },
      {
        id: 'camera-operator',
        name: 'MENO ČAKÁ NA DODANIE',
        role: 'kamera',
        description: 'Meno, jedna schválená veta a produkčné údaje čakajú na dodanie.',
        image: missingPhoto('FOTO KAMERAMANA'),
      },
      {
        id: 'support-crew',
        name: 'SUPPORT CREW',
        role: 'zázemie na trati',
        description: 'Mená, konkrétne roly a schválený popis čakajú na dodanie.',
        image: missingPhoto('FOTO SUPPORT CREW'),
      },
      {
        id: 'iontmax-van',
        name: 'IontMax dodávka',
        role: 'partnerské zázemie',
        description: 'Hlavný partner behu podľa zdrojového briefu.',
        image: missingPhoto('FOTO DODÁVKY'),
        statusLabel: 'potvrdené v zdrojovom briefe',
      },
    ],
  },
  partners: {
    eyebrow: 'partneri na dlhej trati',
    title: 'Kto stojí pri projekte.',
    annotation: 'veľkosť karty zodpovedá partnerstvu, nie abecede',
    tiers: [
      {
        id: 'main-partner',
        title: 'hlavný partner',
        annotation: 'potvrdený v zdrojovom briefe',
        partners: [
          {
            name: 'IontMax',
            description: 'Hlavný partner behu. Finálne partnerské znenie čaká na schválenie.',
            statusLabel: 'potvrdený partner',
            asset: missingPartnerAsset('LOGO IONTMAX'),
            destination: {
              status: 'missing',
              label: 'web partnera',
              note: 'finálna URL čaká na dodanie',
            },
          },
        ],
      },
      {
        id: 'supporting-partners',
        title: 'supporting partneri',
        annotation: 'sloty zostávajú voľné do potvrdenia',
        emptyMessage: 'Žiadny supporting partner zatiaľ nie je potvrdený.',
        partners: [],
      },
      {
        id: 'media-partners',
        title: 'mediálni partneri',
        annotation: 'mená doplníme až po potvrdení partnerstva',
        emptyMessage: 'Mediálnych partnerov zverejníme až po potvrdení.',
        partners: [],
      },
    ],
  },
  contact: {
    eyebrow: 'tri otázky, tri cesty',
    title: 'Ozvite sa správnym smerom.',
    annotation: 'žiadny univerzálny inbox',
    channels: [
      {
        id: 'sponsors',
        title: 'pre sponzorov',
        description: 'Partnerstvá, materiálna podpora a spolupráca na trati.',
        links: [
          {
            status: 'ready',
            label: 'partneri@majootkd.sk',
            href: 'mailto:partneri@majootkd.sk',
          },
        ],
      },
      {
        id: 'media',
        title: 'pre médiá',
        description: 'Rozhovory, overené fakty a budúci press kit.',
        links: [
          {
            status: 'ready',
            label: 'media@majootkd.sk',
            href: 'mailto:media@majootkd.sk',
          },
          { status: 'ready', label: 'press kit →', href: '/press' },
        ],
      },
      {
        id: 'personal',
        title: 'osobne',
        description: 'Beh, komunita a zákulisie projektu na Instagrame.',
        links: [
          {
            status: 'ready',
            label: '@majo.crnkovic',
            href: 'https://www.instagram.com/majo.crnkovic/',
          },
          {
            status: 'ready',
            label: '@uuultra.behy',
            href: 'https://www.instagram.com/uuultra.behy/',
          },
        ],
      },
    ],
  },
  finalPledge: {
    eyebrow: 'už vieš, prečo bežím',
    title: 'Teraz bež so mnou.',
    body: 'Prisľúb základnú sumu. Výsledný čas rozhodne o násobku a podpora smeruje projektu Zachráňme Vilyho.',
    annotation: 'jeden formulár · jasné pravidlá · verejný prísľub',
  },
  footer: {
    brandPrefix: 'uuu',
    brandName: 'MAJO · OTKD',
    summary: '347 km sólo · verejný prísľub pre Zachráňme Vilyho',
    navigationLabel: 'Navigácia v pätičke',
    socialLabel: 'Sociálne siete',
    socialLinks: [
      {
        status: 'ready',
        label: '@majo.crnkovic',
        href: 'https://www.instagram.com/majo.crnkovic/',
      },
      {
        status: 'ready',
        label: '@uuultra.behy',
        href: 'https://www.instagram.com/uuultra.behy/',
      },
    ],
  },
} satisfies SiteContent);
