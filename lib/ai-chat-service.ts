/**
 * AI Chat Service - OpenAI ChatGPT Integration
 * Handles chat conversations with the AI assistant
 * Français: Service de chat IA - Intégration OpenAI ChatGPT
 */

import OpenAI from "openai";
import { getSystemPrompt } from "./ai-knowledge-base";

// Get API key
function getOpenAIApiKey(): string | null {
  const key = process.env.OPENAI_API_KEY || null;
  
  if (process.env.NODE_ENV === "development") {
    if (key) {
      console.log("✓ OpenAI API key found (length:", key.length, ")");
    } else {
      console.warn("✗ OPENAI_API_KEY not found in environment variables");
    }
  }
  
  return key;
}

const OPENAI_API_KEY = getOpenAIApiKey();

if (!OPENAI_API_KEY) {
  console.warn("OPENAI_API_KEY not configured. AI features will be disabled.");
  console.warn("Please add OPENAI_API_KEY to your .env.local file and restart the server.");
}

// Initialize OpenAI client
const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

// Use gpt-4o-mini for cost-effectiveness, or gpt-4o for better quality
const MODEL_NAME = "gpt-4o-mini";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatResponse {
  message: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  error?: string;
}

/**
 * Send a chat message to OpenAI
 * Français: Envoyer un message de chat à OpenAI
 */
export async function sendChatMessage(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<ChatResponse> {
  if (!openai) {
    return {
      message: "L'API OpenAI n'est pas configurée. Veuillez contacter l'administrateur.",
      error: "API_KEY_NOT_CONFIGURED",
    };
  }

  try {
    const systemPrompt = getSystemPrompt();

    // Filter out error messages and initial greeting from history
    const filteredHistory = conversationHistory.filter(
      (msg) => 
        !msg.content.includes("Bonjour ! Je suis votre assistant") &&
        !msg.content.includes("Désolé, une erreur s'est produite")
    );

    // Build messages array for OpenAI
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    filteredHistory.forEach((msg) => {
      messages.push({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({ role: "user", content: userMessage });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseMessage = completion.choices[0]?.message?.content || "Désolé, aucune réponse générée.";

    return {
      message: responseMessage,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error: unknown) {
    console.error("Error calling OpenAI API:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      if (error.message.includes("API_KEY") || error.message.includes("401") || error.message.includes("Invalid API key")) {
        return {
          message: "Clé API OpenAI invalide ou manquante. Veuillez vérifier votre configuration.",
          error: "INVALID_API_KEY",
        };
      }
      
      if (error.message.includes("quota") || error.message.includes("limit") || error.message.includes("429")) {
        return {
          message: "Quota API dépassé. Veuillez réessayer plus tard.",
          error: "QUOTA_EXCEEDED",
        };
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    
    return {
      message: `Désolé, une erreur s'est produite: ${errorMessage}`,
      error: errorMessage,
    };
  }
}

/**
 * Ask a question with context about payroll data
 * Français: Poser une question avec contexte sur les données de paie
 */
export async function askQuestionWithContext(
  question: string,
  context: {
    anonymizedData?: unknown;
    topic?: "cnss" | "amo" | "igr" | "compliance";
    conversationHistory?: ChatMessage[];
  } = {}
): Promise<ChatResponse> {
  if (!openai) {
    return {
      message: "L'API OpenAI n'est pas configurée.",
      error: "API_KEY_NOT_CONFIGURED",
    };
  }

  try {
    // Start with base system prompt
    let systemPromptContent = getSystemPrompt();
    
    // Add anonymized data instructions to system prompt
    if (context.anonymizedData) {
      const data = context.anonymizedData as {
        anonymized_company?: { employee_count?: number; average_salary?: number; total_payroll?: number; sector?: string };
        anonymized_employees?: unknown[];
      };
      
      // Debug: Log data structure in development
      if (process.env.NODE_ENV === "development") {
        console.log("📊 Sending anonymized company data to AI:", {
          hasCompany: !!data?.anonymized_company,
          hasEmployees: !!data?.anonymized_employees,
          employeeCount: data?.anonymized_company?.employee_count || (data?.anonymized_employees?.length || 0),
          averageSalary: data?.anonymized_company?.average_salary,
          totalPayroll: data?.anonymized_company?.total_payroll,
        });
      }
      
      // Check if data is actually available
      const employeeCount = data?.anonymized_company?.employee_count || (data?.anonymized_employees?.length || 0);
      const averageSalary = typeof data?.anonymized_company?.average_salary === 'number' ? data.anonymized_company.average_salary : null;
      const totalPayroll = typeof data?.anonymized_company?.total_payroll === 'number' ? data.anonymized_company.total_payroll : null;
      
      // Always add instructions, even if no employees
      const avgSalaryStr = averageSalary !== null ? `${averageSalary.toFixed(2)} MAD` : 'Non disponible';
      const totalPayrollStr = totalPayroll !== null ? `${totalPayroll.toFixed(2)} MAD` : 'Non disponible';
      
      if (employeeCount === 0) {
        systemPromptContent += `\n\n⚠️ INSTRUCTIONS CRITIQUES - DONNÉES DE L'ENTREPRISE:
L'utilisateur a activé l'option pour inclure ses données d'entreprise.

IMPORTANT: L'utilisateur n'a actuellement AUCUN employé enregistré dans le système (nombre d'employés: 0).
Quand l'utilisateur demande "Combien d'employés ai-je ?", réponds EXACTEMENT: "Vous avez actuellement 0 employé enregistré dans votre système."

NE DIS JAMAIS que tu n'as pas accès aux données. Les données montrent qu'il n'y a pas d'employés.`;
      } else {
        // Add clear, concise instructions with actual values
        systemPromptContent += `\n\n⚠️⚠️⚠️ INSTRUCTIONS CRITIQUES - DONNÉES DE L'ENTREPRISE ⚠️⚠️⚠️

L'utilisateur a activé l'option pour inclure ses données d'entreprise. Tu DOIS ABSOLUMENT utiliser ces données pour répondre.

DONNÉES RÉELLES DE L'ENTREPRISE:
- Nombre d'employés: ${employeeCount}
- Salaire moyen: ${avgSalaryStr}
- Total masse salariale: ${totalPayrollStr}

RÈGLES ABSOLUES À SUIVRE:
1. Si l'utilisateur demande "Combien d'employés ai-je ?" ou "Combien d'employés j'ai ?", réponds EXACTEMENT: "Vous avez ${employeeCount} employé(s)."
2. Si l'utilisateur demande "Quel est le salaire moyen ?" ou "salaire moyen", réponds EXACTEMENT: "Le salaire moyen de vos employés est de ${avgSalaryStr}."
3. Si l'utilisateur demande des informations sur ses employés, utilise les données dans anonymized_employees.
4. NE DIS JAMAIS que tu n'as pas accès aux données. Les données sont fournies ci-dessous.
5. UTILISE TOUJOURS les valeurs exactes des données fournies, pas des estimations.

Les données complètes sont fournies dans le message suivant.`;
      }
    }

    // Add topic-specific context if provided
    if (context.topic) {
      const { getTaxTopicContext } = await import("./ai-knowledge-base");
      const topicContext = getTaxTopicContext(context.topic);
      systemPromptContent += `\n\nContexte spécifique sur le sujet: ${topicContext}`;
    }

    // Build messages array for OpenAI
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPromptContent },
    ];

    // Add company data as a user message if available (more reliable than system prompt only)
    if (context.anonymizedData) {
      const data = context.anonymizedData as {
        anonymized_company?: { employee_count?: number; average_salary?: number; total_payroll?: number; sector?: string };
        anonymized_employees?: unknown[];
      };
      const employeeCount = data?.anonymized_company?.employee_count || (data?.anonymized_employees?.length || 0);
      const avgSalary = typeof data?.anonymized_company?.average_salary === 'number' ? data.anonymized_company.average_salary : null;
      const totalPayroll = typeof data?.anonymized_company?.total_payroll === 'number' ? data.anonymized_company.total_payroll : null;
      
      // Always send data, even if employeeCount is 0
      const dataSummary = {
        nombre_employes: employeeCount,
        salaire_moyen: avgSalary,
        masse_salariale_totale: totalPayroll,
        secteur: data?.anonymized_company?.sector || null,
        employes: employeeCount > 0 ? (data?.anonymized_employees?.slice(0, 10) || []) : [] // Limit to first 10 for token efficiency
      };
      
      messages.push({
        role: "user",
        content: `[DONNÉES DE MON ENTREPRISE - À UTILISER POUR RÉPONDRE]\n\nVoici les données RÉELLES de mon entreprise. Utilise ces données pour répondre à ma question:\n\n${JSON.stringify(dataSummary, null, 2)}\n\nIMPORTANT: Si je demande "Combien d'employés ai-je ?", la réponse est: ${employeeCount} employé(s).\nSi je demande le salaire moyen, la réponse est: ${avgSalary !== null ? avgSalary.toFixed(2) + ' MAD' : 'Non disponible'}.\n\nUtilise ces valeurs exactes dans ta réponse.`,
      });
    }

    // Add conversation history if provided
    if (context.conversationHistory) {
      const filteredHistory = context.conversationHistory.filter(
        (msg) => 
          !msg.content.includes("Bonjour ! Je suis votre assistant") &&
          !msg.content.includes("Désolé, une erreur s'est produite") &&
          !msg.content.includes("[DONNÉES DE MON ENTREPRISE]") // Don't include previous data messages
      );
      
      filteredHistory.forEach((msg) => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    // Add current user message - but if it's about employee count and we have data, enhance it
    let enhancedQuestion = question;
    if (context.anonymizedData) {
      const data = context.anonymizedData as {
        anonymized_company?: { employee_count?: number; average_salary?: number; total_payroll?: number; sector?: string };
        anonymized_employees?: unknown[];
      };
      const employeeCount = data?.anonymized_company?.employee_count || (data?.anonymized_employees?.length || 0);
      
      // If question is about employee count, add the answer directly in the question
      if (question.toLowerCase().includes("employé") && (question.toLowerCase().includes("combien") || question.toLowerCase().includes("nombre"))) {
        enhancedQuestion = `${question}\n\n[RÉPONSE REQUISE: Vous avez ${employeeCount} employé(s) dans votre système. Utilise cette information pour répondre.]`;
      }
      
      // If question is about average salary, add the answer
      if (question.toLowerCase().includes("salaire") && question.toLowerCase().includes("moyen")) {
        const avgSalary = typeof data?.anonymized_company?.average_salary === 'number' ? data.anonymized_company.average_salary : null;
        if (avgSalary !== null) {
          enhancedQuestion = `${question}\n\n[RÉPONSE REQUISE: Le salaire moyen de vos employés est de ${avgSalary.toFixed(2)} MAD. Utilise cette information pour répondre.]`;
        }
      }
    }
    
    messages.push({ role: "user", content: enhancedQuestion });

    // Debug: Log the messages being sent (first message only to avoid spam)
    if (process.env.NODE_ENV === "development" && context.anonymizedData) {
      const data = context.anonymizedData as {
        anonymized_company?: { employee_count?: number; average_salary?: number; total_payroll?: number; sector?: string };
        anonymized_employees?: unknown[];
      };
      console.log("📤 Messages being sent to OpenAI:", {
        messageCount: messages.length,
        hasSystemPrompt: messages.some(m => m.role === "system"),
        hasDataMessage: messages.some(m => m.content.includes("[DONNÉES DE MON ENTREPRISE")),
        employeeCount: data?.anonymized_company?.employee_count || (data?.anonymized_employees?.length || 0),
        questionEnhanced: enhancedQuestion !== question,
      });
    }

    // Call OpenAI API directly
    const completion = await openai.chat.completions.create({
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const responseMessage = completion.choices[0]?.message?.content || "Désolé, aucune réponse générée.";

    return {
      message: responseMessage,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error: unknown) {
    console.error("Error in askQuestionWithContext:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      
      if (error.message.includes("API_KEY") || error.message.includes("401") || error.message.includes("Invalid API key")) {
        return {
          message: "Clé API OpenAI invalide ou manquante. Veuillez vérifier votre configuration.",
          error: "INVALID_API_KEY",
        };
      }
      
      if (error.message.includes("quota") || error.message.includes("limit") || error.message.includes("429")) {
        return {
          message: "Quota API dépassé. Veuillez réessayer plus tard.",
          error: "QUOTA_EXCEEDED",
        };
      }
    }
    
    return {
      message: "Erreur lors du traitement de votre question.",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

/**
 * Check if AI service is available
 * Français: Vérifier si le service IA est disponible
 */
export function isAIServiceAvailable(): boolean {
  return !!OPENAI_API_KEY && !!openai;
}
