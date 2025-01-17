import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatbotResponse, setChatbotResponse] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
      setResponse(res.data.message); // Set the response message
      setExtractedData(res.data.data); // Set the extracted text
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleQuestionSubmit = async (event) => {
    event.preventDefault();
    if (!question || !extractedData) return;

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP__GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Based on the following extracted data: "${extractedData}", answer the question: "${question}"`,
                },
              ],
            },
          ],
        }
      );

      // Log the response to check if it's coming back correctly
      console.log('Gemini API Response:', res.data);

      // Access the bot message from the response
      const botMessage = res.data.candidates[0].content.parts[0].text;
      setChatbotResponse(botMessage); // Set the chatbot response
    } catch (error) {
      console.error('Error fetching response from Gemini API:', error);
    }
  };

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Upload PDF File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='file'
          accept='application/pdf'
          onChange={handleFileChange}
        />
        <button
          type='submit'
          className='bg-blue-500 text-white px-4 py-2 rounded ml-2'
        >
          Upload
        </button>
      </form>
      {response && (
        <div className='mt-4'>
          <h3 className='font-bold'>Response:</h3>
          <p>{response}</p>
          {/* {extractedData && (
            <div>
              <h4 className='font-bold'>Extracted Text:</h4>
              <p className='bg-gray-100 p-2 rounded'>{extractedData}</p>
            </div>
          )} */}
        </div>
      )}
      {extractedData && (
        <div className='mt-4'>
          <h3 className='font-bold'>Ask a Question:</h3>
          <form onSubmit={handleQuestionSubmit}>
            <input
              type='text'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className='border rounded p-2 w-[80%]'
              placeholder='Type your question...'
            />
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded ml-2 w-[10%]'
            >
              Ask
            </button>
          </form>
          {chatbotResponse && (
            <div className='mt-2'>
              <h4 className='font-bold'>Chatbot Response:</h4>
              <p className='bg-gray-100 p-2 rounded'>{chatbotResponse}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
