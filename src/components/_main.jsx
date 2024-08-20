import axios from "axios";
import { useState } from "react";

export const MainComponent = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [sourceLang, setSourceLang] = useState('PT'); 
    const [targetLang, setTargetLang] = useState('EN'); 
    const apiKey = import.meta.env.VITE_API_KEY;

    const handleTranslate = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('https://api-free.deepl.com/v2/translate', new URLSearchParams({
                auth_key: apiKey,
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const translated = response.data.translations[0].text;
            setTranslatedText(translated);
            speakText(translated);
        } catch (err) {
            setError("Não foi possível traduzir o texto. Verifique a sua conexão ou a chave da API.");
            console.error(err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window){
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLang === 'PT' ? 'pt-BR' : 'en-US';
            window.speechSynthesis.speak(utterance);
        } else {
            console.error("Reconhecimento de voz não suportado neste navegador.");
            setError("Reconhecimento de voz não suportado neste navegador.");
        }
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window){
            const recognition = new window.webkitSpeechRecognition();
            recognition.lang = sourceLang === 'PT' ? 'pt-BR' : 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const result = event.results[0][0].transcript;
                setText(result);
                handleTranslate();
            };

            recognition.onerror = (event) => {
                console.error("Erro ao reconhecer a fala: " + event.error);
                setError("Erro ao reconhecer a fala.");
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            setIsListening(true);
            recognition.start();
        } else {
            console.error("Reconhecimento de voz não suportado.");
            setError("Reconhecimento de voz não suportado.");
        }
    };

    return (
        <main className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
            <div className="mb-6">
                <label htmlFor="source-lang" className="block text-gray-700 mb-2">Idioma de origem:</label>
                <select
                    id="source-lang"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                >   
                    <option value="PT">Português</option>
                    <option value="EN">Inglês</option>
                </select>
            </div>
            
            <div className="mb-6">
                <label htmlFor="target-lang" className="block text-gray-700 mb-2">Idioma de destino:</label>
                <select
                    id="target-lang"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="EN">Inglês</option>
                    <option value="PT">Português</option>
                </select>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="block w-full border border-gray-300 rounded-lg p-3 text-gray-700 mb-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o texto para traduzir"
                    aria-label="Digite o texto para traduzir"
                />
            </div>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleTranslate}
                    className={`flex-1 py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-300`}
                    disabled={loading}
                    aria-live="polite"
                >
                    {loading ? 'Convertendo...' : 'Converter'}
                </button>
                <button
                    onClick={startListening}
                    className={`flex-1 py-2 px-4 rounded-lg text-white ${isListening ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} transition duration-300`}
                    disabled={isListening}
                    aria-label={isListening ? 'Ouvindo...' : 'Falar'}
                >
                    {isListening ? 'Ouvindo...' : 'Falar'}
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {translatedText && (
                <p className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 text-green-900 font-bold">{translatedText}</p>
            )}
        </main>
    );
};
