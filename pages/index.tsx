import React, { useCallback, useEffect, useRef, useState } from 'react';
import {langData} from "../data/lang";
import axios from 'axios';
import { map } from 'lodash';

const WordPair = ({ sourceWord, targetWord }: { sourceWord: string, targetWord: string }) => {
  return (
    <div className="flex justify-between p-2 border-b">
      <span>{sourceWord}</span>
      <span>{targetWord}</span>
    </div>
  );
};

const Home = () => {
  const [sourceText, setSourceText] = useState('');
  const [wordPairs, setWordPairs] = useState<{
    source?: string;
    target?: string;
  }>({});
  const textRef = useRef();
  const handleTextChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSourceText(e.target.value);
  };

  const handleTranslate = async () => {
    const {data} =  await axios.post("/api/getWord", {
      targetLang: selectedValue,
      sourceLang: selectedTargetValue,
      text:textRef.current?.value
    })
    setIndex(0);
    roundRef.current = 1
    setWordPairs(data);
  };

  const [index, setIndex] = useState(0);
  const [AudioUrl, setAudioUrl] = useState('');
  const [isLoop, setLoop] = useState(false);
  const speechMapRef = useRef({});
  const roundRef = useRef(1);
  const [data, setData] = useState(langData);
  const [selectedValue, setSelectedValue] = useState("en-US-JennyNeural");
  const [selectedTargetValue, setSelectedTargetValue] = useState("zh-CN-XiaoxiaoNeural");
  const recordRef = useRef<any>({})
  recordRef.current = { selectedValue, selectedTargetValue }

  useEffect(() => {
    const keys = Object.keys(wordPairs);
    const values = Object.values(wordPairs);
    const { selectedValue, selectedTargetValue } = recordRef.current;
    const round = roundRef.current;
    if (isLoop) {
      const map:any = speechMapRef.current
      const fn = async ()=>{
        if (round === 1) {
        const word = keys[index]
        let url = map[word];
        if (!url) {
          const {data} = await axios.post("/api/getWordSpeech", {
              text: word,
              lang:selectedValue
            })
          url = map[word] = data.result_audio_url
        }
        setAudioUrl(url)
      } else if (round === 2) {
        const word = values[index]
        let url = map[word];
        if (!url) {
          const {data} = await axios.post("/api/getWordSpeech", {
              text: word,
              lang:selectedTargetValue
            })
          url = map[word] = data.result_audio_url
        }
        setAudioUrl(url)
      }
      //   else if (round === 3) {
      // }
      setTimeout(() => {
        setIndex((prevIndex) => {
          if (prevIndex + 1 < keys.length) {
            return prevIndex + 1;
          } else {
              roundRef.current = (round % 2) + 1
              return 0;
          }
        });
      },5000)
      }
      fn()
    }
  },[index,wordPairs,isLoop])






  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">听写应用</h1>

      <div>
        <label htmlFor="OrderNotes" className="sr-only">Order notes</label>
        <div
          className="overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <textarea
            ref={textRef}
            className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
            placeholder="Enter any additional order notes..."
            value={`- financial
    - 金融
- autoMate
    - 自动化
- Retrieval
    - 检索
- trick
    - 📝 技巧
- fancy
    - 📝 花哨
- similar
    - 📝 相似的
- relevant
    - 📝 relevant - 相关
- cheaper
    - 📝 便宜的- cheaper
- slightly
    - 📝 slight-稍微
- feedback
    - 📝 反馈- feedback
- construction
    - 📝 construation-建筑
- Calculate
    - 📝 calculate-计算
- distances
    - 📝 A distant distance
- interests
    - 📝 [无]
    **interest**
    [英语] · /ˈɪntrəst/
    [n.] [兴趣；爱好；利息；利益]
    [v.] [使感兴趣；引起……的关注]
    
    |复数|过去式|现在分词|过去分词|
    |---|---|---|---|
    |interests|interested|interesting|interested|
    
    1. (be interested in)(对……感兴趣)
       - I'm interested in music. (我对音乐感兴趣。)
    2. (have an interest in)(在……方面有兴趣)
       - He has an interest in history. (他对历史有兴趣。)
    3. (the public interest)(公共利益)
       - We should protect the public interest. (我们应该保护公共利益。)
- anniversary
    - 📝 anniversary-纪念日
- virtually
    - 📝 virtuall y
- drastically
    - 📝 大幅度- drastically
- continuity
    - 📝 连续性- continuity
- eligible
    - 合格
- receive
    - 接受
- revenue
    - 收入
- chapter
    - 章节- chapter`}
          ></textarea>

          <div className="flex items-center justify-end gap-2 bg-white p-3">
            <button
              type="button"
              className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-600"
            >
              clear
            </button>

            <button
              type="button"
              className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              file
            </button>
          </div>

        </div>
      </div>

      <div className='flex my-[20px] items-center'>
        <div className="w-full max-w-xs mx-auto">
          <select
            name="HeadlineAct"
            id="HeadlineAct"
            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
            value={selectedValue}
            onChange={e => setSelectedValue(e.target.value)}
          >
            <option value="">Please select</option>
            {data.map((group, groupIdx) => (
              <optgroup key={groupIdx} label={group.label}>
                {group.options.map((option, optionIdx) => (
                  <option key={optionIdx} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <svg className='w-[80px]' focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path></svg>
        <div className="w-full max-w-xs mx-auto">
          <select
            name="HeadlineAct"
            id="HeadlineAct"
            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
            value={selectedTargetValue}
            onChange={e => setSelectedTargetValue(e.target.value)}
          >
            <option value="">Please select</option>
            {data.map((group, groupIdx) => (
              <optgroup key={groupIdx} label={group.label}>
                {group.options.map((option, optionIdx) => (
                  <option key={optionIdx} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
        <div
          className="block text-center rounded border border-indigo-600 mx-auto px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
          onClick={handleTranslate}
        >
          start
        </div>

      <div className="mt-4">
        {map(wordPairs,(targetWord, sourceWord) => (
          <WordPair key={sourceWord} sourceWord={sourceWord} targetWord={targetWord} />
        ))}
      </div>
      <audio className="my-[20px]" src={AudioUrl} controls autoPlay />
      <div
        className="block text-center rounded border border-indigo-600 mx-auto px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
        onClick={() => {
          setLoop(!isLoop)
        }}
        >
          loop
        </div>
    </div>
  );
};

export default Home;

