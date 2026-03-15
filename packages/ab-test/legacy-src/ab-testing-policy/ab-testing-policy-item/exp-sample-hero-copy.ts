import { type LegacyPolicy } from '../types';

const expSampleHeroCopyKey = 'exp_sample_hero_copy';

const expSampleHeroCopyVariants = {
  control: 'control',
  benefit: 'benefit',
} as const;

const expSampleHeroCopy: LegacyPolicy<
  typeof expSampleHeroCopyKey,
  keyof typeof expSampleHeroCopyVariants
> = {
  name: 'Sample hero copy experiment',
  description:
    'Generic reference experiment kept in legacy-src to show the old policy shape without product-specific context.',
  featureKey: expSampleHeroCopyKey,
  eventPropertyKey: expSampleHeroCopyKey,
  logging: true,
  applyCandidates: [
    {
      applyRate: 50,
      cookieValue: expSampleHeroCopyVariants.control,
    },
    {
      applyRate: 50,
      cookieValue: expSampleHeroCopyVariants.benefit,
    },
  ],
};

export default expSampleHeroCopy;
