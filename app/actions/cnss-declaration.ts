"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { generateCNSSDeclaration, generateCNSSExcelFile, generateCNSSCSVFile, generateCNSSPDFFile } from "@/lib/cnss-declaration";
import { z } from "zod";

const CNSSDeclarationSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2020).max(2030),
  format: z.enum(["excel", "csv", "pdf"]).default("excel")
});

export async function generateCNSSDeclarationAction(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const parsed = CNSSDeclarationSchema.safeParse({
      month: formData.get("month")?.toString(),
      year: formData.get("year")?.toString(),
      format: formData.get("format")?.toString() || "excel"
    });

    if (!parsed.success) {
      return { error: "Mois et année invalides" };
    }

    const { month, year, format } = parsed.data;
    
    // Generate the CNSS declaration data
    const declarationData = await generateCNSSDeclaration(user.id, month, year);
    
    // Generate file based on format
    let fileBuffer: Buffer;
    let fileName: string;
    let mimeType: string;

    if (format === "excel") {
      fileBuffer = generateCNSSExcelFile(declarationData);
      fileName = `Declaration_CNSS_${month}_${year}.xlsx`;
      mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    } else if (format === "csv") {
      const csvContent = generateCNSSCSVFile(declarationData);
      fileBuffer = Buffer.from(csvContent, 'utf-8');
      fileName = `Declaration_CNSS_${month}_${year}.csv`;
      mimeType = "text/csv";
    } else if (format === "pdf") {
      fileBuffer = generateCNSSPDFFile(declarationData);
      fileName = `Declaration_CNSS_${month}_${year}.pdf`;
      mimeType = "application/pdf";
    } else {
      throw new Error("Format non supporté");
    }
    
    // Return file data for download
    return { 
      success: true, 
      fileBuffer: fileBuffer.toString('base64'),
      fileName,
      mimeType,
      data: declarationData
    };
    
  } catch (error: unknown) {
    console.error("Error generating CNSS declaration:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la génération";
    return { error: errorMessage };
  }
}

export async function getCNSSDeclarationData(month: number, year: number) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const declarationData = await generateCNSSDeclaration(user.id, month, year);
    
    return { 
      success: true, 
      data: declarationData 
    };
    
  } catch (error: unknown) {
    console.error("Error getting CNSS declaration data:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la récupération";
    return { success: false, error: errorMessage };
  }
}
