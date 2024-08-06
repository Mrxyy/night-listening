import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from 'zod';
import model from "@/server/llm"
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function getWord(req: NextApiRequest, res: NextApiResponse) {
  const {targetLang,sourceLang,text} = req.body;
  const { object:{wordArray:wordArr} } = await generateObject({
    model: model,
    schema: z.object({
      wordArray:z.array(z.string())
    }),
    mode:"json",
    prompt: `请在这个段文本中提取 **${targetLang}** 所有词或字:
    ${text}
    `
  })

  const schema: Parameters<typeof z.object>[0] = {};
  wordArr.forEach((v) => {
    schema[v] = z.string();
  });

  const { object } = await generateObject({
  model,
  mode:"json",
  schema: z.object(schema),
  prompt: `请按照顺序将${JSON.stringify(wordArr)}翻译为${sourceLang},并按照{K:V}的形式输出数组`,
});
  res.json(object);
}