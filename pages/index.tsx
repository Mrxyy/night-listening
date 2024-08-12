import React, { useCallback, useEffect, useRef, useState } from 'react';
import { langData } from "../data/lang";
import axios from 'axios';
import { get, map, max, merge, set, size, words } from 'lodash';
import { CloseOutline, PlayOutline, ScanningOutline } from 'antd-mobile-icons';
import { Button, ErrorBlock, ImageUploadItem, List, Popover } from 'antd-mobile';
import ImagePicker from '@/components/ImagePicker';
import ManualOpenPhoto from '@/components/ImagePicker';

const WordPair = ({ sourceWord, targetWord }: { sourceWord: string, targetWord: string }) => {
  return (
    <div className="flex justify-between p-2">
      <span>{sourceWord}</span>
      <span>{targetWord}</span>
    </div>
  );
};

function splitAndFormat(text: string) {
  // 分割字符串为单个字符数组
  const charArray = text.split('');

  // 使用逗号连接字符数组并返回结果
  return charArray.join(', ');
}

const Home = () => {
  const [wordPairs, setWordPairs] = useState<{
    source?: string;
    target?: string;
  }>({});
  const textRef = useRef();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([])
  const [start, setStart] = useState(false)
  const handleTranslate = async () => {
    setStart(true)
    const res = { ...wordPairs }
    if (get(textRef.current, "value") || fileList.length) {
    const res =  axios.post("/api/getWord", {
        targetLang: selectedValue,
        sourceLang: selectedTargetValue,
        text: get(textRef.current, "value", ''),
        fileList: fileList.map(({ url }) => url)
      })
      res.catch(()=>{
        setStart(false)
      })
      const { data } = await res;
      merge(res, data)
    }
    setIndex(0);
    roundRef.current = 1
    setWordPairs(res);
    setStart(false)
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
  const audioElRef = useRef<any>()
  const [activeWord, setActiveWord] = useState<string>('');
  recordRef.current = { selectedValue, selectedTargetValue }

  useEffect(() => {
    const keys = Object.keys(wordPairs);
    const values = Object.values(wordPairs);
    const { selectedValue, selectedTargetValue } = recordRef.current;
    const round = roundRef.current;
    const audioEl = audioElRef.current;
    if (isLoop) {
      const map: any = speechMapRef.current
      const fn = async () => {
        const word = keys[index]
        if (round === 1) {
          let url = map[word];
          if (!url) {
            const { data } = await axios.post("/api/getWordSpeech", {
              text: word,
              lang: selectedValue
            })
            url = map[word] = data.result_audio_url
          }
          setAudioUrl(url)
        } else if (round === 2) {
          const word = values[index]
          let url = map[word];
          if (!url) {
            const { data } = await axios.post("/api/getWordSpeech", {
              text: word,
              lang: selectedTargetValue
            })
            url = map[word] = data.result_audio_url
          }
          setAudioUrl(url)
        }
        else if (round === 3) {
          const sWord = keys[index]
          const tWord = values[index]
          let url = map[`${sWord}-${tWord}`];
          if (!url) {
            const { data } = await axios.post("/api/getWordSpeech", {
              text: `${sWord},${splitAndFormat(sWord)},${tWord}`,
              lang: selectedTargetValue
            })
            url = map[`${sWord}-${tWord}`] = data.result_audio_url
          }
          setAudioUrl(url)
        }
        setActiveWord(word);
        audioEl.addEventListener('loadedmetadata', function fn() {
          const duration = audioEl.duration * 2 * 1000;
          setTimeout(() => {
            setIndex((prevIndex) => {
              if (prevIndex + 1 < keys.length) {
                return prevIndex + 1;
              } else {
                roundRef.current = (round % 3) + 1
                return 0;
              }
            });
            audioEl.removeEventListener('loadedmetadata', fn);
          }, max([duration, 5000]))
        })
      }
      fn()
    }
  }, [index, wordPairs, isLoop])

  return (
    <div className="container mx-auto p-4">
      <div className='flex mb-4 items-center'>
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

      <div>
        <div
          className="overflow-hidden rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          style={{
            boxShadow: "0 0 20px 2px rgb(222 222 222)"
          }}
        >
          <textarea
            ref={textRef as any}
            className={`w-full resize-none border-none align-top focus:ring-0 sm:text-sm ${!size(wordPairs) ? "min-h-[30vh]" : ''}`}
            placeholder="Enter any additional order notes..."
            onBlurCapture={(e) => {
              e.preventDefault()
              e.target.scrollIntoView()
              window.scrollTo(0, -20);
              return false;
            }}
          ></textarea>
          <div className="flex items-center justify-end gap-2 bg-white p-3">
            <ManualOpenPhoto fileList={fileList as any} setFileList={setFileList} />
          </div>
        </div>
      </div>

      <div className='my-4 flex items-end gap-2'>
        <Button
          className="block w-full"
          color='primary'
          loading={start}
          onClick={handleTranslate}
        >
          start
        </Button>
        {size(wordPairs) ? <div>
          <Button
            className="block w-full"
            size="mini"
            onClick={() => {
              setWordPairs({})
              setIndex(0);
              roundRef.current = 1
              setLoop(false)
            }}
          >
            clear
          </Button>
        </div> : null}
      </div>

      <div>
        <div className="mt-4 overflow-y-auto" ref={(el) => {
          if (el) {
            const { top } = el!.getBoundingClientRect();
            set(el, "style.height", `calc(100vh - ${top}px - 75px)`)
          }
        }}>
          {size(wordPairs) ? <List>
            {map(wordPairs, (targetWord: string, sourceWord: string) => (
              <List.Item
                className={`${activeWord === sourceWord ? "!bg-slate-100" : ''}`}
                extra={
                  <Popover
                    content={<Button color="primary" size="mini" onClick={() => {
                      setWordPairs((wordPairs: any) => {
                        delete wordPairs[sourceWord]
                        return { ...wordPairs };
                      })
                    }}>确认</Button>}
                    trigger='click'
                    placement="bottomRight"
                  >
                    <Button disabled={isLoop} fill='none' color="danger"><CloseOutline /></Button>
                  </Popover>
                }
                key={sourceWord}
              >
                <WordPair key={sourceWord} sourceWord={sourceWord} targetWord={targetWord} />
              </List.Item>

            ))}
          </List> : <ErrorBlock
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            className="h-full flex flex-col pt-4 items-center"
            description="输入文字或扫描图片获取数据"
            title="'暂无数据'"
          />}
        </div>
      </div>
      <div className='flex justify-between fixed bottom-0 w-full left-0 px-4 py-4 bg-white'>
        <div className="relative">
          <audio ref={audioElRef} src={AudioUrl} controls autoPlay onCanPlay={() => {
            audioElRef.current.playbackRate = roundRef.current === 3 ? 0.7 : 1
          }} />
          <div className="absolute inset-0" />
        </div>
        <Button
          shape="rounded"
          color="primary"
          fill={isLoop ? "outline" : undefined}
          disabled={!size(wordPairs)}
          onClick={() => {
            setLoop(!isLoop)
          }}
        >
          {isLoop ? <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1466" width="20" height="20"><path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM320 320h128v384H320V320z m256 0h128v384H576V320z" fill="var(--color)" p-id="1467"></path></svg> : <PlayOutline />}
        </Button>
      </div>
    </div>
  );
};

export default Home;

