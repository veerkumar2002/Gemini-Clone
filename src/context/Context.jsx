import { createContext, useState } from "react";
import run from "../Config/gemini";
export const Context = createContext();
const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPromt, setRecentPromt] = useState("");
  const [prevPromt, setPrevPromt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };
  const newChat=()=>{
    setLoading(false)
    setShowResult(false)
  }
  const onSent = async (promt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true)
    let response1;
    
    if(promt !== undefined){
      
      response1 = await run(promt);
      setRecentPromt(promt)
    }
    else{
      setPrevPromt(prev=>[...prev,input])
      setRecentPromt(input)
      response1 = await run(input);
    }
    setRecentPromt(input);
    setPrevPromt(prev=>[...prev,input])
    const response = await run(input);
    let responseArray = response.split("**");
    let newResponse="";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<br>" + responseArray[i] + "</br>";
      }
    }
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false);
    setInput("");
  };
  const contextValue = {
    prevPromt,
    setPrevPromt,
    onSent,
    setRecentPromt,
    recentPromt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;