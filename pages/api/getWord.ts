import { generateObject, generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from 'zod';
import { gemini } from "@/server/llm"
import { NextRequest, NextResponse } from "next/server";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { size } from "lodash";


const model = gemini("models/gemini-1.5-flash-latest");
export default async function getWord(req: NextApiRequest, res: NextApiResponse) {
  const { targetLang, sourceLang, text, fileList} = req.body;

  let imageIncludeText = ''
  if (size(fileList)) {
    const {text} = await generateText({
      model: model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `请提取所有图片中 **${targetLang}** 语言所有词或字，请直接输出[单词,单词...]，不要输出其他图中没有的文字内容` },
            ...fileList.map((image:string) => {
              return {
              type: 'image',
              image,
              }
            })
          ],
        },
      ],
    });
    imageIncludeText = text
  }

  const { object:{wordArray:wordArr} } = await generateObject({
    model: model,
    schema: z.object({
      wordArray:z.array(z.string())
    }),
    mode:"json",
    prompt: `请在这个段文本中提取 **${targetLang}** 语言所有词或字，请不要输出**非${targetLang}** :
    ${imageIncludeText}
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