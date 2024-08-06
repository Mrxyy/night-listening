import React, { useState } from 'react';
import {langData} from "../data/lang";

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
    source: string;
    target: string;
  }[]>([]);

  const handleTextChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSourceText(e.target.value);
  };

  const handleTranslate = () => {
    const words = sourceText.split(/\s+/);
    const pairs = words.map(word => ({ source: word, target: translateWord(word) }));
    setWordPairs(pairs);
  };

  const translateWord = (word: string) => {
    // 简单的模拟翻译
    return word.split('').reverse().join('');
  };

  const [data, setData] = useState(langData);
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">听写应用</h1>

      <div>
        <label htmlFor="OrderNotes" className="sr-only">Order notes</label>
        <div
          className="overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
        >
          <textarea
            id="OrderNotes"
            className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
            placeholder="Enter any additional order notes..."
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

      <div className='flex my-[20px]'>
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
      </div>
        <a
          className="block text-center rounded border border-indigo-600 mx-auto px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
          href="#"
        >
          start
        </a>




      <div className="mt-4">
        {wordPairs.map((pair, index) => (
          <WordPair key={index} sourceWord={pair.source} targetWord={pair.target} />
        ))}
      </div>
    </div>
  );
};

export default Home;

