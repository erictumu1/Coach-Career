import { supabase } from "@/lib/supabase";

export async function uploadToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(process.env.SUPABASE_BUCKET_NAME!)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}


