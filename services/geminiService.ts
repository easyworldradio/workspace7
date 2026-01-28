
import { GoogleGenAI } from "@google/genai";

// İstemciyi fonksiyon içinde oluşturmak, process.env.API_KEY'in 
// doğru zamanda erişilebilir olmasını sağlar ve top-level crash riskini azaltır.
function getAiClient() {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export async function refineBusinessSummary(summary: string): Promise<string> {
  if (!summary.trim()) return summary;
  
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Lütfen aşağıdaki iş fikri özetini daha profesyonel, vizyoner ve vurucu hale getirerek Türkçeleştir: "${summary}"`,
      config: {
        systemInstruction: "Sen profesyonel bir iş stratejistisin. Kullanıcının iş fikirlerini daha net ve etkileyici bir dille özetle.",
        temperature: 0.7,
      }
    });
    return response.text || summary;
  } catch (error) {
    console.error("Gemini Refine Error:", error);
    return summary;
  }
}

export async function suggestNextSteps(summary: string): Promise<string[]> {
  if (!summary.trim()) return [];
  
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Aşağıdaki iş fikri için hayata geçirme aşamasında yapılması gereken en kritik 5 adımı liste halinde ver: "${summary}"`,
      config: {
        systemInstruction: "Sen bir startup mentörüsün. İş fikirleri için somut ve uygulanabilir adımlar öner.",
      }
    });
    return (response.text || "").split('\n').filter(s => s.trim().length > 0).slice(0, 5);
  } catch (error) {
    console.error("Gemini Suggest Error:", error);
    return ["Pazar araştırması yap", "Minimum Viable Product (MVP) tasarla", "Potansiyel müşteri görüşmeleri yap"];
  }
}
