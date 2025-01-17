import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');
  const [extractedData, setExtractedData] = useState(null);

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
      console.log(res.data.message);
      console.log(res.data.data);
      console.log(res.data);
      setResponse(res.data.message); // Set the response message
      setExtractedData(res.data.data); // Set the extracted text
    } catch (error) {
      console.error('Error uploading file:', error);
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
          {extractedData && (
            <div>
              <h4 className='font-bold'>Extracted Text:</h4>
              <pre className='bg-gray-100 p-2 rounded'>{extractedData}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
