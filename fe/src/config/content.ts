export interface RunFact {
  label: string;
  value: string;
}

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

export interface SiteContent {
  charity: CharityContent;
  eventDateLabel: string;
  runFacts: readonly RunFact[];
}

export const siteContent: SiteContent = Object.freeze({
  eventDateLabel: '13. — 16. augusta 2026',
  runFacts: [
    { label: 'kilometrov', value: '347' },
    { label: 'časový limit', value: '84 h' },
    { label: 'odovzdávok', value: '36' },
    { label: 'bežec', value: '1' },
  ],
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
});
