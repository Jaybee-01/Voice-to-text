# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import requests
# import tempfile
# import os
# import time

# app = Flask(__name__)
# CORS(app)

# # 🔑 Replace with your AssemblyAI API key from https://www.assemblyai.com
# ASSEMBLYAI_API_KEY = "d45ea62235ac407898fa6b996ea144b2"

# ASSEMBLYAI_UPLOAD_URL = "https://api.assemblyai.com/v2/upload"
# ASSEMBLYAI_TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript"

# headers = {
#     "authorization": ASSEMBLYAI_API_KEY,
#     "content-type": "application/json"
# }

# @app.route('/api/transcribe', methods=['POST'])
# def transcribe():
#     try:
#         if 'audio' not in request.files:
#             return jsonify({'error': 'No audio file provided'}), 400

#         audio_file = request.files['audio']
#         language = request.form.get('language', 'en')

#         # Step 1: Upload audio to AssemblyAI
#         upload_response = requests.post(
#             ASSEMBLYAI_UPLOAD_URL,
#             headers={"authorization": ASSEMBLYAI_API_KEY},
#             data=audio_file.read()
#         )

#         if upload_response.status_code != 200:
#             return jsonify({'error': 'Failed to upload audio'}), 500

#         audio_url = upload_response.json()["upload_url"]

#         # Step 2: Request transcription
#         transcript_request = {
#             "audio_url": audio_url,
#             "language_code": language
#         }

#         transcript_response = requests.post(
#             ASSEMBLYAI_TRANSCRIPT_URL,
#             json=transcript_request,
#             headers=headers
#         )

#         transcript_id = transcript_response.json()["id"]

#         # Step 3: Poll until transcription is complete
#         polling_url = f"{ASSEMBLYAI_TRANSCRIPT_URL}/{transcript_id}"

#         while True:
#             poll_response = requests.get(polling_url, headers=headers)
#             poll_data = poll_response.json()

#             if poll_data["status"] == "completed":
#                 return jsonify({
#                     'transcription': poll_data["text"],
#                     'language': language
#                 })
#             elif poll_data["status"] == "error":
#                 return jsonify({'error': poll_data.get("error", "Transcription failed")}), 500

#             time.sleep(2)

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500


# @app.route('/health', methods=['GET'])
# def health():
#     return jsonify({'status': 'healthy'}), 200


# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
import os

app = Flask(__name__)
CORS(app)

# 🔑 Replace with your AssemblyAI API key from https://www.assemblyai.com
ASSEMBLYAI_API_KEY = "d45ea62235ac407898fa6b996ea144b2"

UPLOAD_URL = "https://api.assemblyai.com/v2/upload"
TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript"

auth_headers = {
    "authorization": ASSEMBLYAI_API_KEY
}

json_headers = {
    "authorization": ASSEMBLYAI_API_KEY,
    "content-type": "application/json"
}

# AssemblyAI supported language codes
LANGUAGE_MAP = {
    "en": "en",
    "es": "es",
    "fr": "fr",
    "de": "de",
    "ha": "en",  # Hausa not supported - fallback to English
    "yo": "en",  # Yoruba not supported - fallback to English
    "ig": "en",  # Igbo not supported - fallback to English
}

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        language = request.form.get('language', 'en')
        mapped_language = LANGUAGE_MAP.get(language, 'en')

        # Step 1: Upload audio file to AssemblyAI
        print(f"Uploading audio file...")
        upload_response = requests.post(
            UPLOAD_URL,
            headers=auth_headers,
            data=audio_file.read()
        )

        if upload_response.status_code != 200:
            return jsonify({'error': f'Upload failed: {upload_response.text}'}), 500

        audio_url = upload_response.json()["upload_url"]
        print(f"Audio uploaded successfully.")

        # Step 2: Submit transcription request
        transcript_payload = {
            "audio_url": audio_url,
            "language_code": mapped_language,
            "speech_models": ["universal-2"]  # Use universal model for better accuracy across languages
        }

        transcript_response = requests.post(
            TRANSCRIPT_URL,
            json=transcript_payload,
            headers=json_headers
        )

        if transcript_response.status_code != 200:
            return jsonify({'error': f'Transcription request failed: {transcript_response.text}'}), 500

        transcript_id = transcript_response.json()["id"]
        print(f"Transcription started, ID: {transcript_id}")

        # Step 3: Poll for result
        polling_url = f"{TRANSCRIPT_URL}/{transcript_id}"
        max_wait = 120  # max 2 minutes
        waited = 0

        while waited < max_wait:
            poll = requests.get(polling_url, headers=auth_headers)
            poll_data = poll.json()
            status = poll_data.get("status")

            print(f"Status: {status}")

            if status == "completed":
                return jsonify({
                    'transcription': poll_data.get("text", ""),
                    'language': language
                })
            elif status == "error":
                return jsonify({'error': poll_data.get("error", "Transcription failed")}), 500

            time.sleep(3)
            waited += 3

        return jsonify({'error': 'Transcription timed out'}), 500

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)