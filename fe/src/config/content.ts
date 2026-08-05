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

export interface DonioCampaignContent {
  beneficiary: string;
  collectedFallbackEur: number;
  destinationLabel: string;
  destinationUrl: string;
  targetEur: number;
}

export interface BetContent {
  dnfCode: string;
  dnfLead: string;
  dnfOutro: string;
  finishCode: string;
  finishLead: string;
  finishOutro: string;
  hint: string;
  label: string;
}

export interface CharityContent {
  badge: string;
  bet: BetContent;
  campaign: DonioCampaignContent;
  ctaLead: string;
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
    start: string;
    timeLimit: string;
  };
  title: string;
}

export interface JoinRunStep {
  text: string;
  title: string;
}

export interface JoinRunContent {
  annotation: string;
  eyebrow: string;
  intro: string;
  share: {
    text: string;
    title: string;
  };
  steps: readonly JoinRunStep[];
  title: string;
}

export interface StoryMilestone {
  id: string;
  photo: ContentImage;
  tag: string;
  text: string;
}

export interface StoryContent {
  annotation: string;
  eyebrow: string;
  interview: ContentLink;
  milestones: readonly StoryMilestone[];
  title: string;
}

export interface TeamRosterItem {
  name: string;
  note?: string;
  role: string;
}

export interface TeamContent {
  roster: readonly TeamRosterItem[];
  title: string;
}

export interface PartnerItem {
  href?: string;
  logo?: ReadyContentImage;
  name: string;
}

export interface PartnersContent {
  annotation: string;
  eyebrow: string;
  list: readonly PartnerItem[];
  openSlot: {
    body: string;
    email: string;
    title: string;
  };
  title: string;
}

export interface ContactContent {
  annotation: string;
  email: string;
  emailNote: string;
  eyebrow: string;
  personal: {
    body: string;
    heading: string;
  };
  press: ReadyContentLink;
  socialLinks: readonly ReadyContentLink[];
  title: string;
}

export interface FinalCtaContent {
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
  finalCta: FinalCtaContent;
  footer: FooterContent;
  joinRun: JoinRunContent;
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
  { label: 'bežec', value: '1' },
] as const;

const missingPhoto = (label: string): MissingContentImage => ({
  label,
  note: 'fotka pribudne čoskoro',
  status: 'missing',
});

export const siteContent = Object.freeze({
  eventDateLabel: '13. — 16. augusta 2026',
  runFacts,
  navigation: {
    header: [
      { href: '/#trasa', label: 'trasa' },
      { href: '/#vily', label: 'info o zbierke' },
      { href: '/#kontakt', label: 'kontakt' },
    ],
    footer: [
      { href: '/#trasa', label: 'trasa' },
      { href: '/#vily', label: 'info o zbierke' },
      { href: '/#pribeh', label: 'príbeh' },
      { href: '/#partneri', label: 'partneri' },
      { href: '/#kontakt', label: 'kontakt' },
      { href: '/press', label: 'press' },
      { href: '/vily', label: 'viac o Vilkovi' },
    ],
  },
  charity: {
    badge: 'pomôž mi podporiť správnu vec',
    headingLead: 'bež so mnou.',
    headingPurpose: 'zachráňme Vilyho.',
    story: {
      tag: '→ kto je Vilko?',
      introduction:
        'Vilko má 2 roky. Bojuje s Duchennovou svalovou dystrofiou, vzácnou genetickou chorobou, ktorá mu postupne ničí svaly. Otec mu zohnal medzinárodný tím vedcov a pripravuje sa špecializovaná liečba.',
      accent:
        'Pred pár týždňami vyšiel Vilkov otec peši z Košíc do Bratislavy a vyzbieral 2 milióny zo 4 potrebných na vývin lieku. Ja pokračujem v jeho šľapajach: 347 km z Tatier k Dunaju. Sólo, bez štafety.',
    },
    ctaLead: 'Podpor ma vo výkone tým, že prispeješ.',
    bet: {
      label: 'bonus: stav si na môj čas',
      finishLead:
        'Ako prvý bežec ponúkam možnosť staviť si na čas môjho dobehu. V poznámke daru na Donio napíš okrem podpornej správy pre Vilkovu rodinu aj svoj tip:',
      finishCode: 'Majo čas: 73:30:00',
      finishOutro: 'Kto bude najbližšie, tomu dar po dobehu znásobím 5× a pošlem späť.',
      dnfLead: 'Veríš, že to nedám? Napíš',
      dnfCode: 'Majo čas: nedobehne',
      dnfOutro: 'a ak budeš mať pravdu, stávku znásobím 10×.',
      hint: 'Uveď svoje reálne meno ;-)',
    },
    campaign: {
      beneficiary: 'Zachráňme Vilyho',
      collectedFallbackEur: 2_000_000,
      targetEur: 4_000_000,
      destinationLabel: 'donio.sk/zachranme-vilyho',
      destinationUrl: 'https://donio.sk/zachranme-vilyho/majo-od-tatier-k-dunaju',
    },
  },
  runOverview: {
    eyebrow: 'to nie je výlet',
    title: '347,32 km krížom cez Slovensko.',
    annotation: 'sólo · bez štafety · non-stop',
    introduction:
      'Od štartu 13. 8. o 8:00 pred Hotelom Sorea Marmot, cez krásne údolia a hory Nízkych Tatier, desiatky slovenských obcí a miest, až po Tyršovo nábrežie v Bratislave. 347 km a časový limit 84 hodín.',
    facts: runFacts,
    route: {
      distance: '347,32 km',
      finish: 'Tyršovo nábrežie',
      start: 'Jasná',
      timeLimit: '84 hodín',
    },
  },
  joinRun: {
    eyebrow: 'nebudem sa hnevať, naopak',
    title: 'Pridaj sa ku mne počas behu.',
    annotation: 'kedykoľvek, kdekoľvek na trase, hoci len kilometer',
    intro:
      'Ktokoľvek sa môže kedykoľvek pridať. Nájdi si ma podľa GPS, vybehni mi naproti a daj si so mnou kúsok trasy. Alebo to pošli kamarátovi bežcovi, ktorý býva blízko.',
    steps: [
      {
        title: 'nájdi ma',
        text: 'Počas behu tu bude živý odkaz na moju GPS polohu (Garmin LiveTrack).',
      },
      {
        title: 'vybehni mi naproti',
        text: 'Trasa aj obce, ktorými pobežím, sú na mape vyššie. Stačí aj kilometer.',
      },
      {
        title: 'pošli to ďalej',
        text: 'Poznáš bežca, ktorý býva pri trase? Pošli mu tento web.',
      },
    ],
    share: {
      title: 'Majo · Od Tatier k Dunaju',
      text: '347 km sólo pre Zachráňme Vilyho. Pridaj sa na trase alebo prispej.',
    },
  },
  story: {
    eyebrow: 'prečo do toho idem',
    title: 'Môj bežecký príbeh.',
    annotation: 'fotky a momentky postupne doplním',
    milestones: [
      {
        id: 'zaciatky',
        tag: 'začiatky',
        text: 'Kedysi som behal len pre pivo. Fakt.',
        photo: missingPhoto('FOTO ZO ZAČIATKOV'),
      },
      {
        id: 'trening',
        tag: 'dnes',
        text: 'Trénujem pod vedením Michala Šulu, majstra Slovenska v ultrabehu.',
        photo: missingPhoto('FOTO Z TRÉNINGU'),
      },
      {
        id: 'uuultra',
        tag: 'uuultra',
        text: 'S partiou uuultra robíme behy, ktoré majú zmysel.',
        photo: missingPhoto('FOTO PARTIE'),
      },
      {
        id: 'start',
        tag: '13. 8. 2026 · 8:00',
        text: 'Štart pred Hotelom Sorea Marmot. 347 km, limit 84 hodín, sólo.',
        photo: missingPhoto('FOTO ZO ŠTARTU'),
      },
    ],
    interview: {
      status: 'ready',
      href: 'https://refresher.sk/205038-23-rocny-Majo-kedysi-behal-len-pre-pivo-teraz-sa-chysta-zdolat-345-km-v-behu-Od-Tatier-k-Dunaju-Rozhovor',
      label: 'prečítaj celý rozhovor →',
    },
  },
  team: {
    title: 'tím za behom',
    roster: [
      { role: 'tréner', name: 'Michal Šula', note: 'majster Slovenska v ultrabehu' },
      { role: 'kamera', name: 'doplníme' },
      { role: 'support crew', name: 'ľudia, ktorí držia zázemie na trati' },
      { role: 'pojazdné zázemie', name: 'IontMax dodávka' },
    ],
  },
  partners: {
    eyebrow: 'bez nich by to nešlo',
    title: 'Partneri.',
    annotation: 'podporili beh a projekt Zachráňme Vilyho',
    list: [
      {
        name: 'IontMax',
        href: 'https://www.iontmax.com/',
        logo: {
          alt: 'IontMax',
          height: 113,
          src: '/iontmax.png',
          status: 'ready',
          width: 427,
        },
      },
      {
        name: 'Shokz slúchadlá',
        href: 'https://shokz.com/',
        logo: {
          alt: 'Shokz slúchadlá',
          height: 156,
          src: '/shokz.png',
          status: 'ready',
          width: 395,
        },
      },
      {
        name: 'Daybyday Nitra',
        logo: {
          alt: 'Daybyday Nitra',
          height: 104,
          src: '/daybyday.png',
          status: 'ready',
          width: 179,
        },
      },
      {
        name: 'All People Nitra',
        href: 'https://www.instagram.com/allpeoplenitra/',
        logo: {
          alt: 'All People Nitra',
          height: 198,
          src: '/allpeople.png',
          status: 'ready',
          width: 800,
        },
      },
    ],
    openSlot: {
      title: 'tu môžeš byť ty',
      body: 'Hľadám ďalších partnerov behu. Ozvi sa a pobežíme spolu.',
      email: 'majocrnkovic@gmail.com',
    },
  },
  contact: {
    eyebrow: 'ozvite sa mi',
    title: 'Neboj sa, nekúšem.',
    annotation: 'jeden mail na všetko – partnerstvá, médiá, povzbudenie',
    email: 'majocrnkovic@gmail.com',
    emailNote: 'partneri, médiá aj obyčajná ľudská podpora',
    press: { status: 'ready', label: 'press kit →', href: '/press' },
    personal: {
      heading: 'OSOBNE – NAJLEPŠIA FORMA',
      body: 'Vážim si, ak sa ako potenciálny partner pripojíte na úsek môjho behu a pokecáme osobne.',
    },
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
      {
        status: 'ready',
        label: '@odtatierkdunaju · organizátor behu',
        href: 'https://www.instagram.com/odtatierkdunaju/',
      },
      {
        status: 'ready',
        label: 'YouTube · uuultra behy',
        href: 'https://www.youtube.com/@uuultra.behyyy',
      },
    ],
  },
  finalCta: {
    eyebrow: 'už vieš, prečo bežím',
    title: 'Teraz bež so mnou.',
    body: 'Prispej na Donio a do poznámky pridaj tip na môj čas. Každé euro ide projektu Zachráňme Vilyho.',
    annotation: 'prispievaš priamo cez donio.sk · bez medzičlánkov',
  },
  footer: {
    brandPrefix: 'uuu',
    brandName: 'MAJO · OTKD',
    summary: '347 km sólo – zbierka pre Vilyho',
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
      {
        status: 'ready',
        label: '@odtatierkdunaju · organizátor behu',
        href: 'https://www.instagram.com/odtatierkdunaju/',
      },
      {
        status: 'ready',
        label: 'YouTube · uuultra behy',
        href: 'https://www.youtube.com/@uuultra.behyyy',
      },
    ],
  },
} satisfies SiteContent);
