import React, {useState} from 'react';
import './ImageDetection.css';

function FileUpload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [result, setResult] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(null);
        setImageUrl('');
        setResult('');
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(file);
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            setImageUrl('');
            alert('Please select an image file.');
        }
    };

    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.prediction) {
                setResult(data.prediction);
                console.log('Image uploaded successfully.', data.prediction);
            } else {
                console.error('Image upload failed.');
            }
        }
        // Implement upload logic here
        // alert('File uploaded successfully!');

    };

    return (
            <div className="file-upload-container">
                <input type="file" id="file-upload" className="input-file" accept="image/*"
                       onChange={handleFileChange}/>
                <label htmlFor="file-upload" className="file-upload-label">Choose Image</label>
                {selectedFile && imageUrl && (
                    <div>
                        <img src={imageUrl} alt="Uploaded" className="uploaded-image"/>
                    </div>
                )}
                <div className="result-container">
                    {result && (
                        <div className="result">Result is {result}</div>
                    )}
                </div>
                <button className="upload-button" onClick={handleUpload}>Upload</button>
            </div>

    );
}

export default FileUpload;
