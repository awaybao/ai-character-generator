import { NextRequest, NextResponse } from "next/server";
import { generateCharacter } from "@/lib/replicate";

export async function POST(req: NextRequest) {
  try {
    const { prompt, style } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "请输入角色描述" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "描述文字过长，请控制在500字以内" },
        { status: 400 }
      );
    }

    const imageUrl = await generateCharacter(prompt.trim(), style || "cartoon");

    return NextResponse.json({
      success: true,
      imageUrl,
      prompt: prompt.trim(),
      style: style || "cartoon",
    });
  } catch (error: any) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error.message || "生成失败，请稍后重试" },
      { status: 500 }
    );
  }
}
