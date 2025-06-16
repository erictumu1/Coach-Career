import { supabase } from "@/lib/supabase";

export async function uploadToSupabase(fileBase64: string, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .upload(fileName, Buffer.from(fileBase64, 'base64'), {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
