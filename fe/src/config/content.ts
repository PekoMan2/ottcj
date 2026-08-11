import { siteLinks } from "./links";

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
  status: "ready";
}

export interface MissingContentLink {
  label: string;
  note: string;
  status: "missing";
}

export type ContentLink = MissingContentLink | ReadyContentLink;

export interface ReadyContentImage {
  alt: string;
  height: number;
  src: string;
  status: "ready";
  width: number;
}

export interface MissingContentImage {
  label: string;
  note: string;
  status: "missing";
}

export type ContentImage = MissingContentImage | ReadyContentImage;

export interface DonioCampaignContent {
  beneficiary: string;
  collectedApproxEur: number;
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

export interface PartnerItem {
  href?: string;
  label?: string;
  logo?: ReadyContentImage;
  /** Used where logos are flattened to a silhouette: internal detail must be transparent, not coloured. */
  logoMono?: ReadyContentImage;
  name: string;
  variant?: "main" | "media";
}

export interface PartnersContent {
  list: readonly PartnerItem[];
  openSlot: {
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

export interface TrackingContent {
  eyebrow: string;
  notify: {
    body: string;
    formUrl: string;
    label: string;
    title: string;
  };
  officialHref: string;
  officialLabel: string;
  pendingNote: string;
  runningNote: string;
  title: string;
  unofficialLabel: string;
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
  tracking: TrackingContent;
}

const runFacts = [
  { label: "kilometrov", value: "347" },
  { label: "časový limit", value: "84 h" },
  { label: "bežec", value: "1" },
] as const;

export const siteContent = Object.freeze({
  eventDateLabel: "13. — 16. augusta 2026",
  runFacts,
  navigation: {
    header: [
      { href: "/#vily", label: "info o zbierke" },
      { href: "/#trasa", label: "trasa" },
      { href: "/#kontakt", label: "kontakt" },
    ],
    footer: [
      { href: "/#trasa", label: "trasa" },
      { href: "/#vily", label: "info o zbierke" },
      { href: "/#pribeh", label: "príbeh" },
      { href: "/#partneri", label: "partneri" },
      { href: "/#kontakt", label: "kontakt" },
      { href: "/press", label: "press" },
      { href: "/vily", label: "viac o Vilkovi" },
    ],
  },
  charity: {
    badge: "pomôž mi podporiť správnu vec",
    headingLead: "bež so mnou.",
    headingPurpose: "zachráňme Vilyho.",
    story: {
      tag: "→ kto je Vilko?",
      introduction:
        "Vilko má 2 roky. Bojuje s Duchennovou svalovou dystrofiou, vzácnou genetickou chorobou, ktorá mu postupne ničí svaly. Otec mu zohnal medzinárodný tím vedcov a pripravuje sa špecializovaná liečba.",
      accent:
        "Pred pár týždňami vyšiel Vilkov otec peši z Košíc do Bratislavy a vyzbieral 2 milióny zo 4 potrebných na vývin lieku. Ja pokračujem v jeho šľapajach: 347 km z Tatier k Dunaju. Sólo, bez štafety.",
    },
    ctaLead: "Podpor ma vo výkone tým, že prispeješ.",
    bet: {
      label: "bonus: stav si na môj čas",
      finishLead:
        "Ako prvý bežec ponúkam možnosť staviť si na čas môjho dobehu. V poznámke daru na Donio napíš okrem podpornej správy pre Vilkovu rodinu aj svoj tip:",
      finishCode: "Majo čas: 73:30:00",
      finishOutro:
        "Kto bude najbližšie, tomu dar po dobehu znásobím 5× a pošlem späť, a tú istú sumu prispejem na zbierku.",
      dnfLead: "Veríš, že to nedám? Napíš",
      dnfCode: "Majo čas: nedobehne",
      dnfOutro: "a ak budeš mať pravdu, stávku znásobím 10×.",
      hint: "Uveď svoje reálne meno ;-)",
    },
    campaign: {
      beneficiary: "Zachráňme Vilyho",
      collectedApproxEur: 2_000_000,
      targetEur: 4_000_000,
      destinationLabel: "donio.sk/zachranme-vilyho",
      destinationUrl: siteLinks.donio,
    },
  },
  runOverview: {
    eyebrow: "to nie je výlet",
    title: "347,32 km krížom cez Slovensko.",
    annotation: "sólo · bez štafety · non-stop",
    introduction:
      "Od štartu 13. 8. o 8:00 pred Hotelom Sorea Marmot, cez krásne údolia a hory Nízkych Tatier, desiatky slovenských obcí a miest, až po Tyršovo nábrežie v Bratislave. 347 km a časový limit 84 hodín.",
    facts: runFacts,
    route: {
      distance: "347,32 km",
      finish: "Tyršovo nábrežie",
      start: "Jasná",
      timeLimit: "84 hodín",
    },
  },
  joinRun: {
    eyebrow: "nebudem sa hnevať, naopak",
    title: "Pridaj sa ku mne počas behu.",
    annotation: "kedykoľvek, kdekoľvek na trase, hoci len kilometer",
    intro:
      "Ktokoľvek sa môže kedykoľvek pridať. Nájdi si ma podľa GPS, vybehni mi naproti a daj si so mnou kúsok trasy. Alebo to pošli kamarátovi bežcovi, ktorý býva blízko.",
    steps: [
      {
        title: "nájdi ma",
        text: "Počas behu tu bude živý odkaz na moju GPS polohu (Garmin LiveTrack).",
      },
      {
        title: "vybehni mi naproti",
        text: "Trasa aj obce, ktorými pobežím, sú na mape vyššie. Stačí aj kilometer.",
      },
      {
        title: "pošli to ďalej",
        text: "Poznáš bežca, ktorý býva pri trase? Pošli mu tento web.",
      },
    ],
    share: {
      title: "Majo · Od Tatier k Dunaju",
      text: "347 km sólo pre Zachráňme Vilyho. Pridaj sa na trase alebo prispej.",
    },
  },
  story: {
    eyebrow: "prečo do toho idem",
    title: "Môj bežecký príbeh.",
    annotation: "fotky a momentky postupne doplním",
    milestones: [
      {
        id: "zaciatky",
        tag: "začiatky",
        text: "Kedysi som behal len pre pivo. Fakt.",
        photo: {
          alt: "Majo s kamarátom pri pive v cieli behu",
          height: 1200,
          src: "/beer.jpg",
          status: "ready",
          width: 900,
        },
      },
      {
        id: "trening",
        tag: "dnes",
        text: "Dnes makám v tréningu na najdlhší beh môjho života.",
        photo: {
          alt: "Majo pri záťažovej diagnostike na ergometri",
          height: 900,
          src: "/run.jpg",
          status: "ready",
          width: 1200,
        },
      },
      {
        id: "uuultra",
        tag: "uuultra",
        text: "S partiou uuultra robíme behy, ktoré majú zmysel.",
        photo: {
          alt: "Majo s kamarátom z partie uuultra počas behu",
          height: 1200,
          src: "/party.jpg",
          status: "ready",
          width: 900,
        },
      },
      {
        id: "start",
        tag: "13. 8. 2026 · 8:00",
        text: "Štart pred Hotelom Sorea Marmot. 347 km, limit 84 hodín, sólo.",
        photo: {
          alt: "Majo pred panorámou Vysokých Tatier",
          height: 900,
          src: "/solo.jpg",
          status: "ready",
          width: 1200,
        },
      },
    ],
    interview: {
      status: "ready",
      href: "https://refresher.sk/205038-23-rocny-Majo-kedysi-behal-len-pre-pivo-teraz-sa-chysta-zdolat-345-km-v-behu-Od-Tatier-k-Dunaju-Rozhovor",
      label: "prečítaj celý rozhovor →",
    },
  },
  partners: {
    title: "Partneri.",
    list: [
      {
        name: "IontMax",
        href: "https://www.iontmax.com/",
        label: "hlavný partner",
        variant: "main",
        logo: {
          alt: "IontMax",
          height: 113,
          src: "/iontmax.png",
          status: "ready",
          width: 427,
        },
      },
      {
        name: "Shokz slúchadlá",
        href: "https://shokz.com/",
        logo: {
          alt: "Shokz slúchadlá",
          height: 156,
          src: "/shokz.png",
          status: "ready",
          width: 395,
        },
      },
      {
        name: "Daybyday Nitra",
        href: "https://daybday.sk/",
        logo: {
          alt: "Daybyday Nitra",
          height: 104,
          src: "/daybyday.png",
          status: "ready",
          width: 179,
        },
      },
      {
        name: "All People Nitra",
        href: "https://apn.sk/",
        logo: {
          alt: "All People Nitra",
          height: 198,
          src: "/allpeople.png",
          status: "ready",
          width: 800,
        },
      },
      {
        name: "Lisu",
        href: "https://lisu.cz",
        logo: {
          alt: "Lisu",
          height: 92,
          src: "/lisu.png",
          status: "ready",
          width: 206,
        },
      },
      {
        name: "Reklamask",
        href: "https://reklamask.sk/",
        logo: {
          alt: "Reklamask",
          height: 181,
          src: "/reklamask.png",
          status: "ready",
          width: 800,
        },
      },
      {
        name: "Garmond Nitra",
        href: "https://garmondnitra.sk/",
        logo: {
          alt: "Garmond Nitra",
          height: 200,
          src: "/garmondnitra.png",
          status: "ready",
          width: 587,
        },
      },
      {
        name: "Markíza",
        href: "https://www.markiza.sk/",
        label: "mediálny partner",
        variant: "media",
        logo: {
          alt: "Markíza",
          height: 213,
          src: "/markiza.png",
          status: "ready",
          width: 906,
        },
        logoMono: {
          alt: "Markíza",
          height: 213,
          src: "/markiza-mono.png",
          status: "ready",
          width: 906,
        },
      },
      {
        name: "Refresher",
        href: "https://refresher.sk/205038-23-rocny-Majo-kedysi-behal-len-pre-pivo-teraz-sa-chysta-zdolat-345-km-v-behu-Od-Tatier-k-Dunaju-Rozhovor",
        label: "mediálny partner",
        variant: "media",
        logo: {
          alt: "Refresher",
          height: 129,
          src: "/refresher.png",
          status: "ready",
          width: 450,
        },
      },
    ],
    openSlot: {
      title: "tu môžeš byť ty",
      email: "majocrnkovic@gmail.com",
    },
  },
  contact: {
    eyebrow: "ozvite sa mi",
    title: "Neboj sa, nekúšem.",
    annotation: "jeden mail na všetko – partnerstvá, médiá, povzbudenie",
    email: "majocrnkovic@gmail.com",
    emailNote: "partneri, médiá aj obyčajná ľudská podpora",
    press: { status: "ready", label: "press kit →", href: "/press" },
    personal: {
      heading: "OSOBNE – NAJLEPŠIA FORMA",
      body: "Vážim si, ak sa ako potenciálny partner pripojíte na úsek môjho behu a pokecáme osobne.",
    },
    socialLinks: [
      {
        status: "ready",
        label: "@majo.crnkovic",
        href: "https://www.instagram.com/majo.crnkovic/",
      },
      {
        status: "ready",
        label: "@uuultra.behy",
        href: "https://www.instagram.com/uuultra.behy/",
      },
    ],
  },
  tracking: {
    eyebrow: "sleduj ma naživo",
    title: "Kde práve som?",
    officialLabel: "oficiálny Live-track OTKD sólo bežcov →",
    officialHref: siteLinks.officialTracking,
    unofficialLabel: "Majov Garmin tracking (záložný)",
    pendingNote: "Garmin odkaz pridáme hneď po štarte.",
    runningNote: "Garmin beží priamo z Majových hodiniek.",
    notify: {
      title: "upozorni ma, keď Majo vybehne",
      body: "V momente štartu behu dostaneš na sms/email odkaz na sledovanie Majovej lokácie. Registruj sa cez krátky formulár.",
      label: "upozorni ma pri štarte",
      formUrl: siteLinks.notifyForm,
    },
  },
  finalCta: {
    eyebrow: "už vieš, prečo bežím",
    title: "Teraz bež so mnou.",
    body: "Prispej na Donio a do poznámky pridaj tip na môj čas. Každé euro ide projektu Zachráňme Vilyho.",
    annotation: "prispievaš priamo cez donio.sk · bez medzičlánkov",
  },
  footer: {
    brandPrefix: "uuu",
    brandName: "MAJO · OTKD",
    summary: "347 km sólo – zbierka pre Vilyho",
    navigationLabel: "Navigácia v pätičke",
    socialLabel: "Sociálne siete",
    socialLinks: [
      {
        status: "ready",
        label: "@majo.crnkovic",
        href: "https://www.instagram.com/majo.crnkovic/",
      },
      {
        status: "ready",
        label: "@uuultra.behy",
        href: "https://www.instagram.com/uuultra.behy/",
      },
      {
        status: "ready",
        label: "@odtatierkdunaju · organizátor behu",
        href: "https://www.instagram.com/odtatierkdunaju/",
      },
      {
        status: "ready",
        label: "Strava (Moje tréningy)",
        href: "https://www.strava.com/athletes/132549637",
      },
      {
        status: "ready",
        label: "YouTube · uuultra behy",
        href: "https://www.youtube.com/@uuultra.behyyy",
      },
    ],
  },
} satisfies SiteContent);
