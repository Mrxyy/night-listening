import { NextApiResponse } from "next";
import { NextApiRequest } from "next";



export default async function getWordSpeech(req: NextApiRequest, res: NextApiResponse) {
  const {text,lang} = req.body;
  const data = await fetch("https://luvvoice.xyz/text_to_speech", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en,zh-CN;q=0.9,zh;q=0.8",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://luvvoice.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": `text=${text}&language_code=${lang}`,
  "method": "POST"
  });
  return  res.json(await data.json())
}