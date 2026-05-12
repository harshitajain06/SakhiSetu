/**
 * SakhiSetu source citations aligned with SakhiSetu_Source_Citation (MoHFW / UNICEF / NHP / etc.).
 * Each entry: PDF-style Source + Adapted/Adopted from + link to official portal or document where available.
 */

const MOHFW = 'Ministry of Health and Family Welfare (MoHFW), Govt. of India';
const UNICEF_INDIA = 'UNICEF India';
const UNICEF_PARENTING = 'UNICEF Parenting (Global/India)';
const NHP_INDIA = 'National Health Portal (NHP) India';
const NHM_INDIA = 'National Health Mission (NHM), Govt. of India';
const MWCD = 'Ministry of Women and Child Development, Govt. of India';
const NMHP = 'National Mental Health Programme (NMHP), Govt. of India';
const FSSAI = 'Food Safety and Standards Authority of India (FSSAI)';

/** @typedef {{ source: string, adaptedFrom: string, url?: string, adaptedFromUrl?: string, fromLabel?: 'Adapted from' | 'Adopted from' }} LearnSourceCitation */

export const URLS = {
  mohfw: 'https://www.mohfw.gov.in/',
  nhm: 'https://nhm.gov.in/',
  nhmMhsOperationalPdf:
    'https://nhm.gov.in/New_Updates_2018/NHM_Components/RMNCHA/MHS/Guidelines/Operational_guidelines_Menstrual_hygiene_scheme.pdf',
  mcpCardPdf:
    'https://nhm.gov.in/New_Updates_2018/NHM_Components/Immunization/Guildelines_for_immunization/MCP_Card_English_version.pdf',
  mcpGuidePdf:
    'https://nhm.gov.in/New_Updates_2018/NHM_Components/Immunization/Guildelines_for_immunization/MCP_Guide_Book.pdf',
  nhpHome: 'https://www.nhp.gov.in/',
  nhpMenstrualHygiene: 'https://www.nhp.gov.in/disease/gynaecology-and-obstetrics/menstrual-hygiene',
  nhpRti: 'https://www.nhp.gov.in/disease/gynaecology-and-obstetrics/reproductive-tract-infections-rti',
  nhpAdolescentHealth: 'https://www.nhp.gov.in/healthlyliving/adolescence-health-0',
  unicefIndiaWash: 'https://www.unicef.org/india/what-we-do/health/water-sanitation-hygiene-wash',
  unicefIndiaMythsStory: 'https://www.unicef.org/india/stories/busting-myths-and-misconceptions-around-menstruation',
  unicefParenting: 'https://www.unicef.org/parenting',
  unicefMhhGuidancePdf:
    'https://www.unicef.org/media/91341/file/Guidance-on-menstrual-health-and-hygiene.pdf',
  anemiaMuktBharat: 'https://anemiamuktbharat.info/',
  poshan: 'https://poshanabhiyaan.gov.in/',
  telemanas: 'https://telemanas.mohfw.gov.in/',
  pmsma: 'https://pmsma.nhm.gov.in/',
  fssaiEatRight: 'https://www.fssai.gov.in/cms/eat-right-india.php',
  wcd: 'https://wcd.nic.in/',
  nhmJssk: 'https://nhm.gov.in/New_Updates_2018/NHM_Components/RMNCHA/MH/Guidelines/JSSK_Final_English.pdf',
};

// --- Menstrual: Myths & facts (PDF) ---
export const UNICEF_INDIA_BUSTED_EIGHT_MYTHS = {
  source: 'UNICEF India: Busted - Eight Myths About Periods',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaMythsStory,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const NHM_MH_TRAINING_GUIDE = {
  source: 'NHM Menstrual Hygiene Training Guide',
  adaptedFrom: MOHFW,
  url: URLS.nhmMhsOperationalPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adapted from',
};

export const UNICEF_MHM = {
  source: 'UNICEF: Menstrual Hygiene Management',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const NHP_MENSTRUAL_HYGIENE = {
  source: 'NHP India: Menstrual Hygiene',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpMenstrualHygiene,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adapted from',
};

export const NHM_MH_READING_MATERIAL = {
  source: 'NHM Menstrual Hygiene Reading Material',
  adaptedFrom: MOHFW,
  url: URLS.nhmMhsOperationalPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adapted from',
};

export const UNICEF_MHM_ADOLESCENTS = {
  source: 'UNICEF: Menstrual Hygiene Management for Adolescents',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const NHP_ADOLESCENT_MENSTRUATION = {
  source: 'NHP: Adolescent Health - Menstruation',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpAdolescentHealth,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adapted from',
};

export const UNICEF_GUIDANCE_MHH = {
  source: 'UNICEF: Guidance on Menstrual Health and Hygiene',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefMhhGuidancePdf,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const UNICEF_MYTHS_AND_FACTS_PERIODS = {
  source: 'UNICEF: Myths and Facts About Periods',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaMythsStory,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const UNICEF_CHALLENGING_TABOOS = {
  source: 'UNICEF: Challenging Menstrual Taboos',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const UNICEF_PERIOD_MYTHS_BUSTED = {
  source: 'UNICEF: Period Myths Busted',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaMythsStory,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const UNICEF_MYTHS_ABOUT_PERIODS = {
  source: 'UNICEF: Myths About Periods',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaMythsStory,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

// --- Menstrual: Staying clean (PDF uses Adopted from for several) ---
export const NHM_OPERATIONAL_PROMOTION_MHM = {
  source: 'NHM Operational Guidelines: Promotion of Menstrual Hygiene',
  adaptedFrom: MOHFW,
  url: URLS.nhmMhsOperationalPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_GUIDE_MHM_MATERIALS = {
  source: 'UNICEF Guide to Menstrual Hygiene Materials',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_MHM_MANAGEMENT = {
  source: 'NHP India: Menstrual Hygiene Management',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpMenstrualHygiene,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_MHM_GUIDELINES = {
  source: 'UNICEF: Menstrual Hygiene Management (MHM) Guidelines',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefMhhGuidancePdf,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_RTI = {
  source: 'NHP India: Reproductive Tract Infections (RTI)',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpRti,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_MENSTRUAL_HYGIENE_SHORT = {
  source: 'UNICEF: Menstrual Hygiene',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adapted from',
};

export const NHM_READING_MHS = {
  source: 'NHM Reading Material: Menstrual Hygiene Scheme',
  adaptedFrom: MOHFW,
  url: URLS.nhmMhsOperationalPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

// --- Menstrual: Well-being (PDF Adopted from) ---
export const NHM_TRAINING_GUIDE_MHS = {
  source: 'NHM Training Guide: Menstrual Hygiene Scheme',
  adaptedFrom: MOHFW,
  url: URLS.nhmMhsOperationalPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_INDIA_MENTAL_HEALTH_TIPS = {
  source: 'UNICEF India: Tips to Take Care of Your Mental Health',
  adaptedFrom: UNICEF_INDIA,
  url: 'https://www.unicef.org/india/what-we-do/child-protection/mental-health',
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const UNICEF_INDIA_BUSTED_EIGHT_ADOPTED = {
  source: 'UNICEF India: Busted - Eight Myths About Periods',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaMythsStory,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_ADOLESCENT_PUBERTY = {
  source: 'NHP: Adolescent Health - Puberty Education',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpAdolescentHealth,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const POSHAN_NUTRITION_ADOLESCENT_GIRLS = {
  source: 'POSHAN Abhiyaan: Nutrition for Adolescent Girls',
  adaptedFrom: MWCD,
  url: URLS.poshan,
  adaptedFromUrl: URLS.wcd,
  fromLabel: 'Adopted from',
};

export const UNICEF_WHAT_TO_EAT_PERIOD = {
  source: 'UNICEF: What to Eat During Your Period',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const TELEMANAS = {
  source: 'Tele-MANAS: Mental Health Assistance and Networking',
  adaptedFrom: NMHP,
  url: URLS.telemanas,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_INDIA_MENTAL_HEALTH_STANDARDS = {
  source: 'UNICEF India: Mental Health and Well-being Standards',
  adaptedFrom: UNICEF_INDIA,
  url: 'https://www.unicef.org/india/what-we-do/child-protection/mental-health',
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const MOHFW_SAFE_MOTHERHOOD_ADOLESCENT = {
  source: 'MoHFW Safe Motherhood & Adolescent Health Guidelines',
  adaptedFrom: MOHFW,
  url: URLS.mohfw,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const NHP_REST_MENSTRUATION = {
  source: 'NHP India: Importance of Rest During Menstruation',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpMenstrualHygiene,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Menstrual: Health diet & care ---
export const UNICEF_NUTRITION_ADOLESCENT_GIRLS = {
  source: 'UNICEF India: Nutrition for Adolescent Girls',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const ANEMIA_MUKT_BHARAT = {
  source: 'Anemia Mukt Bharat: Nutritional Guidelines',
  adaptedFrom: MOHFW,
  url: URLS.anemiaMuktBharat,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_PREVENTING_ANEMIA = {
  source: 'UNICEF: Preventing Anemia in Adolescent Girls',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_HEALTHY_LIVING_DIET = {
  source: 'NHP India: Healthy Living and Diet',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_HEALTHY_EATING_CUES = {
  source: 'UNICEF: Healthy Eating Cues during Menstruation',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const UNICEF_WASH_MHM = {
  source: 'UNICEF: WASH and Menstrual Hygiene Management',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_MENSTRUAL_HYGIENE_PRACTICES = {
  source: 'NHP India: Menstrual Hygiene Practices',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpMenstrualHygiene,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const POSHAN_ADOLESCENT_NUTRITION_PROTOCOLS = {
  source: 'POSHAN Abhiyaan: Adolescent Nutrition Protocols',
  adaptedFrom: MWCD,
  url: URLS.poshan,
  adaptedFromUrl: URLS.wcd,
  fromLabel: 'Adopted from',
};

export const UNICEF_INDIA_MHM_GUIDELINES = {
  source: 'UNICEF India: Menstrual Hygiene Management (MHM) Guidelines',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefMhhGuidancePdf,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const WIFS_PROGRAMME = {
  source: 'WIFS (Weekly Iron and Folic Acid Supplementation) Programme',
  adaptedFrom: MOHFW,
  url: 'https://anemiamuktbharat.info/wifs/',
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_NUTRITION_SUPPLEMENTS_ADOLESCENTS = {
  source: 'UNICEF: Nutrition Supplements for Adolescents',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const UNICEF_MHH_TRAINING = {
  source: 'UNICEF: Menstrual Health and Hygiene Training',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const EAT_RIGHT_HEALTHY_SNACKING = {
  source: 'Eat Right India: Healthy Snacking Guidelines',
  adaptedFrom: FSSAI,
  url: URLS.fssaiEatRight,
  adaptedFromUrl: 'https://www.fssai.gov.in/',
  fromLabel: 'Adopted from',
};

export const UNICEF_INDIA_ADOLESCENT_NUTRITION = {
  source: 'UNICEF India: Adolescent Nutrition and Well-being',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefIndiaWash,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

// --- Maternal: Pregnancy basics ---
export const NHM_MCP_CARD = {
  source: 'NHM Mother and Child Protection (MCP) Card',
  adaptedFrom: MOHFW,
  url: URLS.mcpCardPdf,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_PARENTING_FIRST_TRIMESTER = {
  source: 'UNICEF Parenting: Pregnancy Week by Week - First Trimester',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_ANTENATAL_EARLY = {
  source: 'NHP India: Antenatal Care - Early Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const MOHFW_MY_SAFE_MOTHERHOOD = {
  source: 'MoHFW My Safe Motherhood Booklet',
  adaptedFrom: MOHFW,
  url: URLS.nhmJssk,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_PARENTING_FETAL_MATERNAL = {
  source: 'UNICEF Parenting: Fetal Development and Maternal Changes',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_MATERNAL_MILESTONES = {
  source: 'NHP India: Maternal Health and Milestones',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_OPERATIONAL_MATERNAL_HEALTH = {
  source: 'NHM Operational Guidelines: Maternal Health',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_PARENTING_PREPARING_BIRTH = {
  source: 'UNICEF Parenting: Preparing for Birth',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_FINAL_STAGES_LABOR = {
  source: 'NHP India: Final Stages of Pregnancy and Labor Signs',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const MOHFW_MCTS = {
  source: 'MoHFW Mother and Child Tracking System (MCTS)',
  adaptedFrom: MOHFW,
  url: URLS.mohfw,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_INTERACTIVE_PREGNANCY = {
  source: 'UNICEF: Interactive Pregnancy Roadmap',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_COMMON_CHANGES_PREGNANCY = {
  source: 'NHP India: Common Changes During Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Prenatal ---
export const UNICEF_PARENTING_MONTH_BY_MONTH = {
  source: 'UNICEF Parenting: Pregnancy Month by Month',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_ANTENATAL_PORTAL = {
  source: 'NHP India: Antenatal Care Portal',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const MOHFW_IFA_GUIDELINES = {
  source: 'MoHFW Guidelines for Iron and Folic Acid Supplementation',
  adaptedFrom: MOHFW,
  url: URLS.anemiaMuktBharat,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_NUTRITION_SUPPLEMENTS_PREGNANCY = {
  source: 'UNICEF: Nutrition and Supplements During Pregnancy',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const AMB_PREGNANT_WOMEN = {
  source: 'Anemia Mukt Bharat: Pregnant Women Protocol',
  adaptedFrom: MOHFW,
  url: URLS.anemiaMuktBharat,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const PMSMA = {
  source: 'Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)',
  adaptedFrom: MOHFW,
  url: URLS.pmsma,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const NHP_ANTENATAL_CLINICAL = {
  source: 'NHP India: Antenatal Clinical Tests & Screening',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_WHY_PRENATAL = {
  source: 'UNICEF: Why Prenatal Care Matters',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHM_MATERNAL_DANGER_SIGNS = {
  source: 'NHM Operational Guidelines: Maternal Health & Danger Signs',
  adaptedFrom: MOHFW,
  url: URLS.nhmJssk,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_PREGNANCY_DANGER_SIGNS = {
  source: 'UNICEF: Pregnancy Danger Signs to Watch For',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_COMMON_DISCOMFORTS = {
  source: 'NHP India: Common Discomforts in Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Nutrition pregnancy ---
export const UNICEF_WHAT_TO_EAT_PREGNANT = {
  source: 'UNICEF: What to Eat When Pregnant',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_DIET_PREGNANCY = {
  source: 'NHP India: Diet and Nutrition During Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_FOODS_AVOID_PREGNANT = {
  source: 'UNICEF: Foods to Avoid While Pregnant',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const FSSAI_PREGNANT_WOMEN = {
  source: 'FSSAI: Food Safety for Pregnant Women',
  adaptedFrom: FSSAI,
  url: URLS.fssaiEatRight,
  adaptedFromUrl: 'https://www.fssai.gov.in/',
  fromLabel: 'Adopted from',
};

export const NHM_ANTENATAL_CARE_OG = {
  source: 'NHM Operational Guidelines: Antenatal Care',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_MORNING_SICKNESS = {
  source: 'UNICEF: Coping with Morning Sickness',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_COMMON_AILMENTS_DIET = {
  source: 'NHP India: Common Ailments and Diet in Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_MATERNAL_HEALTH_OG = {
  source: 'NHM Maternal Health Operational Guidelines',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_WEIGHT_GAIN_ROADMAP = {
  source: 'UNICEF Parenting: Healthy Weight Gain Roadmap',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_MONITORING_WEIGHT = {
  source: 'NHP India: Monitoring Weight During Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const POSHAN_JAN_ANDOLAN = {
  source: 'POSHAN Abhiyaan: Jan Andolan Guidelines',
  adaptedFrom: MWCD,
  url: URLS.poshan,
  adaptedFromUrl: URLS.wcd,
  fromLabel: 'Adopted from',
};

export const UNICEF_BALANCED_MEALS_EXPECTING = {
  source: 'UNICEF India: Balanced Meals for Expecting Mothers',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const EAT_RIGHT_SAFE_FOOD_MOTHERS = {
  source: 'Eat Right India: Safe Food Handling for Mothers',
  adaptedFrom: FSSAI,
  url: URLS.fssaiEatRight,
  adaptedFromUrl: 'https://www.fssai.gov.in/',
  fromLabel: 'Adopted from',
};

// --- Postpartum ---
export const NHM_POSTNATAL_CARE_GUIDANCE = {
  source: 'NHM Guidance Note on Optimizing Post-Natal Care',
  adaptedFrom: NHM_INDIA,
  url: URLS.nhm,
  adaptedFromUrl: URLS.nhm,
  fromLabel: 'Adopted from',
};

export const UNICEF_BODY_AFTER_BIRTH = {
  source: 'UNICEF Parenting: Your Body After Birth',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_POSTNATAL_RECOVERY = {
  source: 'NHP India: Postnatal Care and Recovery',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_POSTPARTUM_DEPRESSION = {
  source: 'UNICEF India: Understanding Postpartum Depression',
  adaptedFrom: UNICEF_INDIA,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_POSTPARTUM_MENTAL = {
  source: 'NHP India: Postpartum Mental Health Support',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const MAA_PROGRAMME = {
  source: "MAA Programme: Mothers' Absolute Affection Guidelines",
  adaptedFrom: MOHFW,
  url: URLS.mohfw,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const MAA_PROGRAMME_PAREN = {
  source: "MAA (Mothers' Absolute Affection) Programme Guidelines",
  adaptedFrom: MOHFW,
  url: URLS.mohfw,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_BREASTFEEDING_CHALLENGES = {
  source: 'UNICEF: Breastfeeding Challenges and Solutions',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_BREASTFEEDING_ISSUES = {
  source: 'NHP India: Common Breastfeeding Issues and Care',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_WHAT_TO_EAT_BREASTFEEDING = {
  source: 'UNICEF: What to Eat When Breastfeeding',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const POSHAN_LACTATING = {
  source: 'POSHAN Abhiyaan: Lactating Mother Nutrition',
  adaptedFrom: MWCD,
  url: URLS.poshan,
  adaptedFromUrl: URLS.wcd,
  fromLabel: 'Adopted from',
};

export const NHM_POSTNATAL_EXERCISE = {
  source: 'NHM Operational Guidelines: Postnatal Exercise and Recovery',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_EXERCISE_AFTER_BABY = {
  source: 'UNICEF: Exercise After Having a Baby',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_PHYSICAL_ACTIVITY_DELIVERY = {
  source: 'NHP India: Physical Activity After Delivery',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Newborn ---
export const NHM_IYCF = {
  source: 'NHM IYCF Training Guide',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const NHM_IYCF_FULL = {
  source: 'NHM IYCF (Infant and Young Child Feeding) Training Guide',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_BREASTFEEDING_NEWBORN = {
  source: 'UNICEF: Breastfeeding Your Newborn',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_IYCF = {
  source: 'NHP India: Infant and Young Child Feeding (IYCF)',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_HBNC = {
  source: 'NHM Home Based Newborn Care (HBNC) Guidelines',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_SAFE_SLEEP = {
  source: 'UNICEF Parenting: Safe Sleep Guide for Babies',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_NEWBORN_SAFETY = {
  source: 'NHP India: Newborn Care and Safety',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_ENC = {
  source: 'NHM Operational Guidelines: Essential Newborn Care',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_NEWBORN_SKIN = {
  source: "UNICEF: Caring for Your Newborn's Skin",
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_HYGIENE_NEWBORN = {
  source: 'NHP India: Hygiene and Newborn Health',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_ASHA_NEWBORN = {
  source: 'NHM Training Module for ASHA: Newborn Care',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_FIRST_THREE_MONTHS = {
  source: 'UNICEF: The First Three Months - Understanding Cues',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_COMMON_NEWBORN_PROBLEMS = {
  source: 'NHP India: Common Problems in Newborns',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_ECD_MILESTONES = {
  source: 'UNICEF: Early Childhood Development Milestones',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_IMMUNIZATION = {
  source: 'NHP India: Child Health and Immunization Schedule',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const NHM_KMC = {
  source: 'NHM KMC and Optimal Feeding Guidelines',
  adaptedFrom: MOHFW,
  url: URLS.nhm,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_SKIN_TO_SKIN = {
  source: 'UNICEF India: The Power of Skin-to-Skin Contact',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefIndiaWash,
  fromLabel: 'Adopted from',
};

export const NHP_ENC = {
  source: 'NHP India: Essential Newborn Care (ENC)',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Breastfeeding guide ---
export const UNICEF_LATCH_GUIDE = {
  source: 'UNICEF: Breastfeeding Positions and Latch Guide',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_INCREASE_MILK = {
  source: 'UNICEF: How to Increase Your Breast Milk Supply',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_BF_PROBLEMS = {
  source: 'NHP India: Common Breastfeeding Problems & Solutions',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_BF_CHALLENGES_OVERCOME = {
  source: 'UNICEF: Breastfeeding Challenges and How to Overcome Them',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_EXPRESS_STORE_MILK = {
  source: 'UNICEF: How to Express and Store Breast Milk Safely',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const POSHAN_LACTATING_REQ = {
  source: 'POSHAN Abhiyaan: Nutritional Requirements for Lactating Mothers',
  adaptedFrom: MWCD,
  url: URLS.poshan,
  adaptedFromUrl: URLS.wcd,
  fromLabel: 'Adopted from',
};

export const NHP_NURSING_NUTRITION = {
  source: 'NHP India: Diet and Nutrition for Nursing Mothers',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

// --- Maternal wellness ---
export const NHP_MATERNAL_MENTAL_IMPORTANCE = {
  source: 'NHP India: Maternal Mental Health Importance',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_MENTAL_HEALTH_STANDARDS_PARENTING = {
  source: 'UNICEF India: Mental Health and Well-being Standards',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_SELF_CARE_PREGNANCY = {
  source: 'UNICEF: Taking Care of Yourself During Pregnancy',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_POSTNATAL_RECOVERY = {
  source: 'UNICEF Parenting: Postnatal Recovery and Wellness',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_MANAGING_STRESS_MOTHERS = {
  source: 'UNICEF India: Managing Stress for New and Expecting Mothers',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const MOHFW_SOCIAL_SUPPORT = {
  source: 'MoHFW Guidelines: Social Support in Maternal Health',
  adaptedFrom: MOHFW,
  url: URLS.mohfw,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_SUPPORT_SYSTEM = {
  source: 'UNICEF: Why a Support System is Vital for New Parents',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const TELEMANAS_14416 = {
  source: 'Tele-MANAS: 24/7 National Mental Health Helpline (14416)',
  adaptedFrom: MOHFW,
  url: URLS.telemanas,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const NHP_WARNING_PPD = {
  source: 'NHP India: Warning Signs of Postpartum Depression',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_WHEN_PROFESSIONAL = {
  source: 'UNICEF: When to Talk to a Professional About Your Mental Health',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

// --- Exercise ---
export const NHP_PHYSICAL_ACTIVITY_PREGNANCY = {
  source: 'NHP India: Physical Activity During Pregnancy',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_STAYING_ACTIVE_PREGNANCY = {
  source: 'UNICEF: Staying Active During Pregnancy',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const UNICEF_PREGNANCY_EXERCISE_ROADMAP = {
  source: 'UNICEF Parenting: Pregnancy Exercise Roadmap',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHP_MATERNAL_HEALTH_GUIDELINES = {
  source: 'NHP Maternal Health Guidelines',
  adaptedFrom: NHP_INDIA,
  url: URLS.nhpHome,
  adaptedFromUrl: URLS.nhpHome,
  fromLabel: 'Adopted from',
};

export const UNICEF_SAFETY_PRECAUTIONS = {
  source: 'UNICEF: Safety Precautions for Pregnant Women',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const MOHFW_MATERNAL_DANGER_PROTOCOLS = {
  source: 'MoHFW Protocols: Maternal Health Danger Signs',
  adaptedFrom: MOHFW,
  url: URLS.nhmJssk,
  adaptedFromUrl: URLS.mohfw,
  fromLabel: 'Adopted from',
};

export const UNICEF_WHEN_STOP_EXERCISING = {
  source: 'UNICEF Parenting: When to Stop Exercising',
  adaptedFrom: UNICEF_PARENTING,
  url: URLS.unicefParenting,
  adaptedFromUrl: URLS.unicefParenting,
  fromLabel: 'Adopted from',
};

export const NHM_POSTNATAL_CARE_NOTE = {
  source: 'NHM Guidance Note on Postnatal Care',
  adaptedFrom: NHM_INDIA,
  url: URLS.nhm,
  adaptedFromUrl: URLS.nhm,
  fromLabel: 'Adopted from',
};
