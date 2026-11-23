import { getLLMText, latestPages } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const scan = latestPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return new Response(scanned.join("\n\n"));
}
