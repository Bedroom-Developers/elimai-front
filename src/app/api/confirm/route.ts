import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const algorithm = process.env.NEXT_PUBLIC_ALG ?? "";
const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY ?? "";
const iv = crypto.randomBytes(16);

// Encrypt
function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decrypt
function decrypt(encryptedText: string): string {
  const [ivHex, encryptedHex] = encryptedText.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    ivBuffer,
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
  return decrypted.toString();
}

export async function POST(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const id = s.get("id");
  if (!id) {
    return NextResponse.json({ message: "No id specified" });
  }
  const body = await req.json();
  const encrypted = encrypt(JSON.stringify(body));

  (await cookies()).set(id == "register" ? "rg-body" : "rs-body", encrypted, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 15,
  });

  return NextResponse.json({ message: "Cookies set" });
}

export async function GET(req: NextRequest, res: NextResponse) {
  const s = req.nextUrl.searchParams;
  const id = s.get("id");
  if (!id) {
    return NextResponse.json({ message: "No id specified" }, { status: 400 });
  }
  const cookie = await cookies().get(id == "register" ? "rg-body" : "rs-body");
  if (!cookie) {
    return NextResponse.json({ message: "No cookie found" }, { status: 404 });
  }
  const decrypted = decrypt(cookie.value);
  const parsed = JSON.parse(decrypted);
  console.log(parsed);

  return NextResponse.json(parsed);
}
export async function DELETE(req: NextRequest) {
  const s = req.nextUrl.searchParams;
  const id = s.get("id");
  if (!id) {
    return NextResponse.json({ message: "No id specified" });
  }
  (await cookies()).delete(id == "register" ? "rg-body" : "rs-body");

  return NextResponse.json({});
}
