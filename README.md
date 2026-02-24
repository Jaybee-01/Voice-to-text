# Speech-to-Text Web Application

A complete speech-to-text transcription application with recording and file upload capabilities.

## Project Structure
```
speech-to-text-app/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── scripts.js
├── backend/
│   ├── app.py
│   └── requirements.txt
└── README.md
```

## Quick Start Guide

### Option 1: Run Backend Locally (Recommended for Development)

#### Prerequisites
- Python 3.8 or higher
- Node.js (optional, for local server)
- FFmpeg installed on your system

#### Install FFmpeg
**Windows:**
```bash
# Using chocolatey
choco install ffmpeg

# Or download from https://ffmpeg.org/download.html
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv

# Activate it:
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Run the Flask server:**
```bash
python app.py
```

The backend will start on `http://localhost:5000`

#### Frontend Setup

1. **Update the backend URL in scripts.js:**
```javascript
const BACKEND_URL = "http://localhost:5000/api/transcribe";
```

2. **Run a local server for the frontend:**

**Option A - Python:**
```bash
cd frontend
python -m http.server 8000
```

**Option B - Node.js:**
```bash
cd frontend
npx http-server -p 8000
```

**Option C - VS Code:**
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

3. **Open browser:**
Navigate to `http://localhost:8000`

---

### Option 2: Deploy on Hugging Face Spaces

#### Create a Hugging Face Space

1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose "Gradio" as SDK
4. Upload this backend code:

```python
import gradio as gr
import whisper

# Load Whisper model
model = whisper.load_model("base")

def transcribe_audio(audio, language):
    # Transcribe the audio
    result = model.transcribe(audio, language=language)
    return result["text"]

# Create Gradio interface
demo = gr.Interface(
    fn=transcribe_audio,
    inputs=[
        gr.Audio(type="filepath", label="Upload Audio"),
        gr.Dropdown(
            choices=["en", "es", "fr", "de", "ha", "yo", "ig"],
            value="en",
            label="Language"
        )
    ],
    outputs=gr.Textbox(label="Transcription"),
    title="Speech-to-Text Transcription",
    description="Upload audio to get transcription"
)

if __name__ == "__main__":
    demo.launch()
```

5. Get your Space URL (e.g., `https://yourusername-speech-to-text.hf.space`)
6. Update frontend `BACKEND_URL` to use the Gradio API endpoint

---

### Option 3: Use Existing Hugging Face API

You can use Hugging Face's Inference API:

1. **Get API Token:**
   - Sign up at https://huggingface.co
   - Go to Settings → Access Tokens
   - Create a new token

2. **Update frontend code:**

```javascript
const HF_API_TOKEN = "your_token_here";
const HF_API_URL = "https://api-inference.huggingface.co/models/openai/whisper-base";

async function sendAudioToBackend(audioBlob) {
  const formData = new FormData();
  formData.append("file", audioBlob);

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_TOKEN}`
      },
      body: audioBlob
    });

    const result = await response.json();
    transcript.textContent = result.text || "No transcription found.";
    
  } catch (error) {
    console.error("Transcription error:", error);
    transcript.textContent = "Error during transcription.";
  }
}
```

---

## Features

✅ **Record Audio** - Capture audio directly from microphone
✅ **Upload Files** - Support for various audio formats
✅ **Multiple Languages** - English, Spanish, French, German, Hausa, Yoruba, Igbo
✅ **Waveform Visualization** - Visual feedback during recording
✅ **Dark Mode** - Toggle between light and dark themes
✅ **Download Transcription** - Save transcripts as .txt files

---

## Troubleshooting

### Common Issues

**1. CORS Errors:**
- Make sure Flask-CORS is installed
- Backend must include `CORS(app)`

**2. Audio not recording:**
- Grant microphone permissions in browser
- Check browser console for errors

**3. Transcription fails:**
- Ensure FFmpeg is installed
- Check audio file format is supported
- Verify backend is running

**4. Model loading is slow:**
- First run downloads the Whisper model (~150MB for base)
- Subsequent runs will be faster

---

## Model Options

Whisper offers different model sizes:

| Model  | Size | Speed | Accuracy |
|--------|------|-------|----------|
| tiny   | 39M  | Fast  | Basic    |
| base   | 74M  | Good  | Good     |
| small  | 244M | OK    | Better   |
| medium | 769M | Slow  | Great    |
| large  | 1550M| Slowest| Best   |

To change model, edit `app.py`:
```python
model = whisper.load_model("small")  # Change here
```

---

## Production Deployment

For production, consider:

1. **Using Gunicorn** instead of Flask development server:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

2. **Adding rate limiting** to prevent abuse
3. **Using a task queue** (Celery) for longer transcriptions
4. **Deploying to cloud** (Heroku, AWS, Google Cloud, etc.)

---

## License

MIT License - Feel free to use and modify!

## Credits

Created by Abdulbasit Yusuf
Powered by OpenAI Whisper
