import { createContext, useState } from "react";
import main from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index,nextWord) => {
        setTimeout(function() {
            setResultData(prev=>prev+nextWord);
        }, 10*index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    const onSent = async (prompt) => {
        console.log("Calling onSent...");

        try {
            
            setResultData("");
            setLoading(true);
            setShowResult(true);
            let answer;
            if(prompt !== undefined){
                answer = await main(prompt);
                setRecentPrompt(prompt);
            } else {
                setPrevPrompts(prev=>[...prev,input]);
                setRecentPrompt(input);
                answer = await main(input);
            }
            setRecentPrompt(input);
            setPrevPrompts(prev=>[...prev,input])
            const result = await main(input);
            let resultArray = result.split("**");
            let newArray = "";
            for(let i=0;i< resultArray.length;i++){
                if(i%2 !== 1 || i === 0){
                    newArray += resultArray[i];
                } else {
                    newArray += "<b>"+resultArray[i]+"</b>";
                }
            }
            let newArray2 = newArray.split("*").join("</br>");
            let newArray3 = newArray2.split(" ");
            for(let i=0;i<newArray3.length;i++){
                const nextWord = newArray3[i];
                delayPara(i,nextWord+" ");
            }
            

            setLoading(false);
            setInput("");


            console.log("FINAL RESULT:", result);
        } catch (error) {
            console.error("onSent error:", error);
        }
    };


    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;