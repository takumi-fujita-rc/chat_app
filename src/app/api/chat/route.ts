import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatRequest, ChatResponse, ChatError } from "@/types/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse | ChatError>> {
  try {
    const body: ChatRequest = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "メッセージが空です" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "AIからの返答がありませんでした" }, { status: 500 });
    }

    return NextResponse.json({ message: content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "AI APIエラーが発生しました。しばらくしてから再試行してください。" },
      { status: 500 }
    );
  }
}
