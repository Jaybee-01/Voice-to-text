from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load Whisper model (you can choose: tiny, base, small, medium, large)
# Start with 'base' for good balance between speed and accuracy
model = whisper.load_model("base")

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    try:
        # Get the audio file and language from the request
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        language = request.form.get('language', 'en')
        
        # Save audio to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_audio:
            audio_file.save(temp_audio.name)
            temp_path = temp_audio.name
        
        # Transcribe using Whisper
        result = model.transcribe(temp_path, language=language)
        
        # Clean up temporary file
        os.unlink(temp_path)
        
        return jsonify({
            'transcription': result['text'],
            'language': language
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)