import { MedicalTerm } from '../types';

export const SAMPLE_TERMS: MedicalTerm[] = [
  {
    id: 'term_001',
    term: 'tachycardia',
    pronunciation: '/ˌtakɪˈkɑrdiə/',
    syllables: 'tach·y·car·di·a',
    partOfSpeech: 'noun',
    definition: 'Abnormally rapid heart rate, defined as more than 100 beats per minute at rest in adults.',
    example: 'The patient presented to the emergency department with complaints of palpitations and was found to have tachycardia with a heart rate of 130 bpm.',
    etymology: {
      prefix: 'tachy-',
      root: 'cardia',
      meaning: 'tachy- (fast, rapid) + -cardia (heart)'
    },
    category: 'Cardiovascular',
    specialty: 'Cardiology',
    relatedTerms: ['bradycardia', 'arrhythmia', 'palpitations'],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date('2025-01-08'),
  },
  {
    id: 'term_002',
    term: 'dyspnea',
    pronunciation: '/dɪspˈniə/',
    syllables: 'dysp·ne·a',
    partOfSpeech: 'noun',
    definition: 'Subjective sensation of difficult, labored, or uncomfortable breathing, commonly described as shortness of breath.',
    example: 'The patient with chronic obstructive pulmonary disease reported worsening dyspnea on exertion over the past three weeks.',
    etymology: {
      prefix: 'dys-',
      root: 'pnea',
      meaning: 'dys- (difficult, painful) + -pnea (breathing)'
    },
    category: 'Respiratory',
    specialty: 'Pulmonology',
    relatedTerms: ['orthopnea', 'tachypnea', 'apnea', 'hypoxia'],
    difficulty: 1,
    commonlyMisspelled: true,
    createdAt: new Date('2025-01-08'),
  },
  {
    id: 'term_003',
    term: 'hypertension',
    pronunciation: '/ˌhaɪpərˈtɛnʃən/',
    syllables: 'hy·per·ten·sion',
    partOfSpeech: 'noun',
    definition: 'Abnormally elevated blood pressure, defined as systolic BP ≥130 mmHg or diastolic BP ≥80 mmHg.',
    example: 'The patient was diagnosed with stage 2 hypertension after multiple readings showed blood pressure consistently above 140/90 mmHg.',
    etymology: {
      prefix: 'hyper-',
      root: 'tension',
      meaning: 'hyper- (excessive, above) + tension (pressure)'
    },
    category: 'Cardiovascular',
    specialty: 'Cardiology',
    relatedTerms: ['hypotension', 'blood pressure', 'stroke', 'heart disease'],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date('2025-01-08'),
  },
  {
    id: 'term_004',
    term: 'anemia',
    pronunciation: '/əˈnimiə/',
    syllables: 'a·ne·mi·a',
    partOfSpeech: 'noun',
    definition: 'Condition characterized by deficiency of red blood cells or hemoglobin, resulting in reduced oxygen-carrying capacity of the blood.',
    example: 'Laboratory results revealed severe anemia with hemoglobin of 7.2 g/dL, requiring blood transfusion.',
    etymology: {
      prefix: 'an-',
      root: 'emia',
      meaning: 'an- (without) + -emia (blood condition)'
    },
    category: 'Hematologic',
    specialty: 'Hematology',
    relatedTerms: ['hemoglobin', 'iron deficiency', 'fatigue', 'pallor'],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date('2025-01-08'),
  },
  {
    id: 'term_005',
    term: 'arthritis',
    pronunciation: '/ɑrˈθraɪtɪs/',
    syllables: 'ar·thri·tis',
    partOfSpeech: 'noun',
    definition: 'Inflammation of one or more joints, characterized by joint pain, swelling, stiffness, warmth, and decreased range of motion.',
    example: 'The patient was diagnosed with rheumatoid arthritis after presenting with symmetric joint swelling and morning stiffness lasting over an hour.',
    etymology: {
      root: 'arthr',
      suffix: '-itis',
      meaning: 'arthr- (joint) + -itis (inflammation)'
    },
    category: 'Musculoskeletal',
    specialty: 'Rheumatology',
    relatedTerms: ['osteoarthritis', 'rheumatoid arthritis', 'joint pain', 'inflammation'],
    difficulty: 1,
    commonlyMisspelled: false,
    createdAt: new Date('2025-01-08'),
  },
];

export const STORAGE_KEYS = {
  TERMS: '@vocab_app:terms',
  USER_PROGRESS: '@vocab_app:user_progress',
  STREAK_DATA: '@vocab_app:streak',
} as const;
