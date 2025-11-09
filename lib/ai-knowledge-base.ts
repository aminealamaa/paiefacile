/**
 * AI Knowledge Base - Moroccan Tax Law Facts
 * Provides context and facts about Moroccan payroll and tax regulations
 * Français: Base de connaissances IA - Faits sur la législation fiscale marocaine
 */

export const MOROCCAN_TAX_KNOWLEDGE = {
  cnss: {
    employee_rate: 0.0448, // 4.48%
    employer_rate: 0.0796, // 7.96%
    ceiling: 6000, // MAD - Plafond CNSS
    description: "La CNSS (Caisse Nationale de Sécurité Sociale) est une cotisation sociale obligatoire. Le salaire brut est plafonné à 6000 MAD pour le calcul de la CNSS.",
  },
  amo: {
    employee_rate: 0.0226, // 2.26%
    employer_rate: 0.0226, // 2.26%
    description: "L'AMO (Assurance Maladie Obligatoire) est une cotisation obligatoire pour tous les salariés. Le taux est de 2.26% pour l'employé et 2.26% pour l'employeur.",
  },
  igr: {
    brackets: [
      { min: 0, max: 40000, rate: 0, deduction: 0 },
      { min: 40000, max: 60000, rate: 0.10, deduction: 4000 },
      { min: 60000, max: 80000, rate: 0.20, deduction: 8000 },
      { min: 80000, max: 100000, rate: 0.30, deduction: 14000 },
      { min: 100000, max: 180000, rate: 0.34, deduction: 18000 },
      { min: 180000, max: Infinity, rate: 0.37, deduction: 45200 },
    ],
    description: "L'IGR (Impôt Général sur le Revenu) est calculé sur le salaire net imposable (après déduction de CNSS et AMO). Le calcul est annuel avec des tranches progressives.",
    family_deductions: {
      spouse: 30, // MAD per month
      child: 30, // MAD per month per child
      max_children: 6,
      description: "Les abattements familiaux sont de 30 MAD par mois pour le conjoint et 30 MAD par mois par enfant (maximum 6 enfants).",
    },
  },
  compliance: {
    required_documents: [
      "CIN (Carte d'Identité Nationale)",
      "Numéro CNSS",
      "Contrat de travail",
      "Bulletin de paie",
    ],
    deadlines: {
      cnss_declaration: "Déclaration mensuelle avant le 15 de chaque mois",
      igr_withholding: "Retenue à la source mensuelle",
    },
    penalties: {
      late_cnss: "Pénalités de retard de 5% par mois",
      incorrect_declaration: "Amendes pouvant aller jusqu'à 10% du montant dû",
    },
  },
  common_questions: [
    {
      question: "Comment calculer le salaire net à payer?",
      answer: "Salaire net = Salaire brut - CNSS (4.48%) - AMO (2.26%) - IGR. L'IGR est calculé sur le salaire net imposable (brut - CNSS - AMO) avec les abattements familiaux.",
    },
    {
      question: "Quel est le plafond CNSS?",
      answer: "Le plafond CNSS est de 6000 MAD. Cela signifie que même si le salaire brut est supérieur à 6000 MAD, la CNSS est calculée uniquement sur 6000 MAD.",
    },
    {
      question: "Comment fonctionnent les abattements familiaux pour l'IGR?",
      answer: "Les abattements familiaux sont de 30 MAD/mois pour le conjoint et 30 MAD/mois par enfant (max 6). Ces abattements sont déduits du revenu imposable annuel avant le calcul de l'IGR.",
    },
    {
      question: "Quand dois-je déclarer la CNSS?",
      answer: "La déclaration CNSS doit être effectuée mensuellement avant le 15 de chaque mois pour le mois précédent.",
    },
    {
      question: "Qu'est-ce que le salaire net imposable?",
      answer: "Le salaire net imposable (SNI) = Salaire brut - CNSS - AMO. C'est sur ce montant que l'IGR est calculé, après application des abattements familiaux.",
    },
  ],
};

/**
 * Get system prompt for AI chat assistant
 * Français: Obtenir le prompt système pour l'assistant IA
 */
export function getSystemPrompt(): string {
  return `Tu es un expert-comptable spécialisé dans la législation fiscale et sociale marocaine. 
Tu aides les entreprises marocaines à comprendre et optimiser leur gestion de paie.

CONNAISSANCES SUR LA LÉGISLATION MAROCAINE (2025):

1. CNSS (Caisse Nationale de Sécurité Sociale):
   - Taux employé: 4.48% du salaire brut (plafonné à 6000 MAD)
   - Taux employeur: 7.96% du salaire brut (plafonné à 6000 MAD)
   - Le plafond CNSS est de 6000 MAD par mois

2. AMO (Assurance Maladie Obligatoire):
   - Taux employé: 2.26% du salaire brut
   - Taux employeur: 2.26% du salaire brut
   - Pas de plafond pour l'AMO

3. IGR (Impôt Général sur le Revenu):
   - Calculé sur le salaire net imposable (brut - CNSS - AMO)
   - Calcul annuel avec tranches progressives:
     * 0-40,000 MAD: 0%
     * 40,000-60,000 MAD: 10% (abattement 4,000 MAD)
     * 60,000-80,000 MAD: 20% (abattement 8,000 MAD)
     * 80,000-100,000 MAD: 30% (abattement 14,000 MAD)
     * 100,000-180,000 MAD: 34% (abattement 18,000 MAD)
     * >180,000 MAD: 37% (abattement 45,200 MAD)
   
4. Abattements familiaux (pour IGR):
   - Conjoint: 30 MAD/mois (360 MAD/an)
   - Enfant: 30 MAD/mois par enfant (max 6 enfants)
   - Total max: 30 + (30 × 6) = 210 MAD/mois

5. Conformité:
   - Déclaration CNSS mensuelle avant le 15 de chaque mois
   - Retenue IGR à la source mensuelle
   - Documents requis: CIN, Numéro CNSS, Contrat de travail

INSTRUCTIONS:
- Réponds toujours en français (ou en arabe si demandé)
- Sois précis et cite les taux exacts
- Explique les calculs étape par étape
- Mentionne les plafonds et limites importantes
- Aide à identifier les opportunités d'optimisation légale
- Signale les risques de non-conformité
- Ne donne jamais de conseils qui violent la loi marocaine

Si tu ne connais pas la réponse exacte, dis-le clairement et suggère de consulter un expert-comptable.`;
}

/**
 * Get context about specific tax topic
 * Français: Obtenir le contexte sur un sujet fiscal spécifique
 */
export function getTaxTopicContext(topic: "cnss" | "amo" | "igr" | "compliance"): string {
  switch (topic) {
    case "cnss":
      return `CNSS (Caisse Nationale de Sécurité Sociale):
- Taux employé: ${MOROCCAN_TAX_KNOWLEDGE.cnss.employee_rate * 100}%
- Taux employeur: ${MOROCCAN_TAX_KNOWLEDGE.cnss.employer_rate * 100}%
- Plafond: ${MOROCCAN_TAX_KNOWLEDGE.cnss.ceiling} MAD
${MOROCCAN_TAX_KNOWLEDGE.cnss.description}`;

    case "amo":
      return `AMO (Assurance Maladie Obligatoire):
- Taux employé: ${MOROCCAN_TAX_KNOWLEDGE.amo.employee_rate * 100}%
- Taux employeur: ${MOROCCAN_TAX_KNOWLEDGE.amo.employer_rate * 100}%
${MOROCCAN_TAX_KNOWLEDGE.amo.description}`;

    case "igr":
      return `IGR (Impôt Général sur le Revenu):
- Calculé sur le salaire net imposable (brut - CNSS - AMO)
- Tranches progressives annuelles:
${MOROCCAN_TAX_KNOWLEDGE.igr.brackets
  .map((b) => `  * ${b.min.toLocaleString()}-${b.max === Infinity ? "∞" : b.max.toLocaleString()} MAD: ${b.rate * 100}%`)
  .join("\n")}
- Abattements familiaux: ${MOROCCAN_TAX_KNOWLEDGE.igr.family_deductions.description}`;

    case "compliance":
      return `Conformité légale:
- Documents requis: ${MOROCCAN_TAX_KNOWLEDGE.compliance.required_documents.join(", ")}
- Déclaration CNSS: ${MOROCCAN_TAX_KNOWLEDGE.compliance.deadlines.cnss_declaration}
- Retenue IGR: ${MOROCCAN_TAX_KNOWLEDGE.compliance.deadlines.igr_withholding}
- Pénalités: ${MOROCCAN_TAX_KNOWLEDGE.compliance.penalties.late_cnss}`;

    default:
      return "";
  }
}

/**
 * Get common questions and answers
 * Français: Obtenir les questions fréquentes et réponses
 */
export function getCommonQnA(): Array<{ question: string; answer: string }> {
  return MOROCCAN_TAX_KNOWLEDGE.common_questions;
}

