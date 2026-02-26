// let mediaRecorder;
// let audioChunks = [];

// const recordBtn = document.getElementById("recordBtn");
// const stopBtn = document.getElementById("stopBtn");
// const fileInput = document.getElementById("fileInput");
// const transcript = document.getElementById("transcript");
// const spinner = document.getElementById("spinner");
// const languageSelector = document.getElementById("language");
// const darkToggle = document.getElementById("darkToggle");
// const audioPlayer = document.getElementById("audioPlayer");
// const downloadBtn = document.getElementById("downloadBtn");

// // Set your backend URL - UPDATE THIS to your backend location
// const BACKEND_URL = "http://localhost:5000/api/transcribe";

// // Initialize WaveSurfer
// const waveform = WaveSurfer.create({
//   container: "#waveform",
//   waveColor: "lightblue",
//   progressColor: "blue",
//   height: 100
// });

// // Toggle Dark Mode
// darkToggle.addEventListener("change", () => {
//   document.body.classList.toggle("dark");
//   document.querySelector(".container").classList.toggle("dark");
// });

// // Start recording
// recordBtn.onclick = async () => {
//   waveform.empty();
//   audioPlayer.classList.add("hidden");
//   downloadBtn.classList.add("hidden");

//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   mediaRecorder = new MediaRecorder(stream);
//   audioChunks = [];

//   mediaRecorder.ondataavailable = event => {
//     audioChunks.push(event.data);
//   };

//   mediaRecorder.onstop = () => {
//     const blob = new Blob(audioChunks, { type: "audio/webm" });
//     const audioURL = URL.createObjectURL(blob);

//     waveform.load(audioURL);
//     audioPlayer.src = audioURL;
//     audioPlayer.classList.remove("hidden");

//     sendAudioToBackend(blob);
//   };

//   mediaRecorder.start();
//   recordBtn.disabled = true;
//   stopBtn.disabled = false;
// };

// // Stop recording
// stopBtn.onclick = () => {
//   mediaRecorder.stop();
//   recordBtn.disabled = false;
//   stopBtn.disabled = true;
// };

// // Upload audio file
// fileInput.onchange = () => {
//   const file = fileInput.files[0];
//   if (!file) return;

//   // Optional: Validate audio type
//   if (!file.type.startsWith("audio/")) {
//     alert("Please upload a valid audio file.");
//     return;
//   }

//   const audioURL = URL.createObjectURL(file);
//   waveform.load(audioURL);
//   audioPlayer.src = audioURL;
//   audioPlayer.classList.remove("hidden");
//   downloadBtn.classList.add("hidden");

//   sendAudioToBackend(file);
// };

// // Send audio to backend for transcription
// async function sendAudioToBackend(audioBlob) {
//   const formData = new FormData();
//   formData.append("audio", audioBlob);
//   formData.append("language", languageSelector.value);

//   transcript.textContent = "Transcribing...";
//   transcript.classList.remove("visible");
//   spinner.classList.remove("hidden");

//   try {
//     const response = await fetch(BACKEND_URL, {
//       method: "POST",
//       body: formData
//     });

//     if (!response.ok) {
//       throw new Error(`Server error: ${response.status}`);
//     }

//     const result = await response.json();
//     console.log("Backend response:", result);

//     transcript.textContent = result.transcription || "No transcription found.";
//     transcript.classList.remove("visible");

//     setTimeout(() => {
//       transcript.classList.add("visible");
//     }, 100);

//     if (result.transcription) {
//       downloadBtn.classList.remove("hidden");
//       setupDownload(result.transcription);
//     }
//   } catch (error) {
//     console.error("Transcription error:", error);
//     transcript.textContent = "Error during transcription. Make sure the backend server is running at " + BACKEND_URL;
//   } finally {
//     spinner.classList.add("hidden");
//   }
// }

// // Download .txt
// function setupDownload(text) {
//   const blob = new Blob([text], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);
//   downloadBtn.href = url;
//   downloadBtn.download = "transcription.txt";
// }


// let mediaRecorder;
// let audioChunks = [];
// let currentAudioBlob = null;

// const recordBtn = document.getElementById("recordBtn");
// const stopBtn = document.getElementById("stopBtn");
// const fileInput = document.getElementById("fileInput");
// const transcript = document.getElementById("transcript");
// const spinner = document.getElementById("spinner");
// const languageSelector = document.getElementById("language");
// const darkToggle = document.getElementById("darkToggle");
// const audioPlayer = document.getElementById("audioPlayer");
// const downloadBtn = document.getElementById("downloadBtn");

// // Backend URL
// const BACKEND_URL = "http://localhost:5000/api/transcribe";

// // Initialize WaveSurfer
// const waveform = WaveSurfer.create({
//   container: "#waveform",
//   waveColor: "lightblue",
//   progressColor: "blue",
//   height: 100
// });

// // Toggle Dark Mode
// darkToggle.addEventListener("change", () => {
//   document.body.classList.toggle("dark");
//   document.querySelector(".container").classList.toggle("dark");
// });

// // Start recording
// recordBtn.onclick = async () => {
//   try {
//     waveform.empty();
//     audioPlayer.classList.add("hidden");
//     downloadBtn.classList.add("hidden");
//     transcript.textContent = "Your transcription will appear here.";
//     transcript.classList.remove("visible");

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     mediaRecorder = new MediaRecorder(stream);
//     audioChunks = [];

//     mediaRecorder.ondataavailable = event => {
//       if (event.data.size > 0) {
//         audioChunks.push(event.data);
//       }
//     };

//     mediaRecorder.onstop = () => {
//       setTimeout(() => {
//         // Stop all tracks to release microphone
//         stream.getTracks().forEach(track => track.stop());

//         currentAudioBlob = new Blob(audioChunks, { type: "audio/webm" });
//         const audioURL = URL.createObjectURL(currentAudioBlob);

//         // Load waveform and audio player
//         waveform.load(audioURL);
//         audioPlayer.src = audioURL;
//         audioPlayer.classList.remove("hidden");

//         sendAudioToBackend(currentAudioBlob);
//       }, 300);
//     };

//     mediaRecorder.start(100); // collect data every 100ms
//     recordBtn.disabled = true;
//     stopBtn.disabled = false;
//     recordBtn.textContent = "Recording...";
//   } catch (err) {
//     alert("Microphone access denied or not available. Please allow microphone access and try again.");
//     console.error("Mic error:", err);
//   }
// };

// // Stop recording
// stopBtn.onclick = () => {
//   if (mediaRecorder && mediaRecorder.state !== "inactive") {
//     mediaRecorder.stop();
//   }
//   recordBtn.disabled = false;
//   stopBtn.disabled = true;
//   recordBtn.textContent = "Start Recording";
// };

// // Upload audio file
// fileInput.onchange = () => {
//   const file = fileInput.files[0];
//   if (!file) return;

//   if (!file.type.startsWith("audio/")) {
//     alert("Please upload a valid audio file.");
//     return;
//   }

//   currentAudioBlob = file;
//   const audioURL = URL.createObjectURL(file);
//   waveform.load(audioURL);
//   audioPlayer.src = audioURL;
//   audioPlayer.classList.remove("hidden");
//   downloadBtn.classList.add("hidden");
//   transcript.textContent = "Your transcription will appear here.";
//   transcript.classList.remove("visible");

//   sendAudioToBackend(file);
// };

// // Send audio to backend for transcription
// async function sendAudioToBackend(audioBlob) {
//   const formData = new FormData();
//   formData.append("audio", audioBlob, "recording.webm");
//   formData.append("language", languageSelector.value);

//   transcript.textContent = "Transcribing... this may take a moment.";
//   spinner.classList.remove("hidden");
//   downloadBtn.classList.add("hidden");

//   try {
//     const response = await fetch(BACKEND_URL, {
//       method: "POST",
//       body: formData
//     });

//     const result = await response.json();
//     console.log("Backend response:", result);

//     if (!response.ok || result.error) {
//       throw new Error(result.error || `Server error: ${response.status}`);
//     }

//     const transcriptionText = result.transcription || "No transcription found.";
//     transcript.textContent = transcriptionText;

//     // Fade in transcript
//     transcript.classList.remove("visible");
//     setTimeout(() => {
//       transcript.classList.add("visible");
//     }, 100);

//     // Show download button only if there's real text
//     if (result.transcription && result.transcription.trim().length > 0) {
//       setupDownload(result.transcription);
//       downloadBtn.classList.remove("hidden");
//     }

//   } catch (error) {
//     console.error("Transcription error:", error);
//     transcript.textContent = "Error: " + error.message + ". Make sure the backend server is running.";
//     transcript.classList.add("visible");
//   } finally {
//     spinner.classList.add("hidden");
//   }
// }

// // Setup download button
// function setupDownload(text) {
//   const blob = new Blob([text], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);

//   // Remove old listener and set new one
//   const newBtn = downloadBtn.cloneNode(true);
//   downloadBtn.parentNode.replaceChild(newBtn, downloadBtn.outerHTML ? newBtn : downloadBtn);

//   downloadBtn.href = url;
//   downloadBtn.download = "transcription.txt";
//   downloadBtn.onclick = null; // clear any old handlers
// }


let mediaRecorder;
let audioChunks = [];
let currentAudioBlob = null;

const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const fileInput = document.getElementById("fileInput");
const transcript = document.getElementById("transcript");
const spinner = document.getElementById("spinner");
const languageSelector = document.getElementById("language");
const darkToggle = document.getElementById("darkToggle");
const audioPlayer = document.getElementById("audioPlayer");
const downloadBtn = document.getElementById("downloadBtn");

// Backend URL
const BACKEND_URL = "http://localhost:5000/api/transcribe";

// Initialize WaveSurfer
const waveform = WaveSurfer.create({
  container: "#waveform",
  waveColor: "lightblue",
  progressColor: "blue",
  height: 100
});

// Toggle Dark Mode
darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  document.querySelector(".container").classList.toggle("dark");
});

// Start recording
recordBtn.onclick = async () => {
  try {
    waveform.empty();
    audioPlayer.classList.add("hidden");
    downloadBtn.classList.add("hidden");
    transcript.textContent = "Your transcription will appear here.";
    transcript.classList.remove("visible");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      setTimeout(() => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        currentAudioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const audioURL = URL.createObjectURL(currentAudioBlob);

        // Load waveform and audio player
        waveform.load(audioURL);
        audioPlayer.src = audioURL;
        audioPlayer.classList.remove("hidden");

        if (currentAudioBlob.size < 10000) {
          transcript.textContent = "Recording too short. Please record at least 3 seconds of audio.";
          transcript.classList.add("visible");
          spinner.classList.add("hidden");
          return;
        }

        sendAudioToBackend(currentAudioBlob);
      }, 300);
    };

    mediaRecorder.start(100); // collect data every 100ms
    recordBtn.disabled = true;
    stopBtn.disabled = true; // prevent stopping for 3 seconds
    recordBtn.textContent = "Recording...";

    setTimeout(() => {
      stopBtn.disabled = false;
    }, 3000);

  } catch (err) {
    alert("Microphone access denied or not available. Please allow microphone access and try again.");
    console.error("Mic error:", err);
  }
};

// Stop recording
stopBtn.onclick = () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  recordBtn.disabled = false;
  stopBtn.disabled = true;
  recordBtn.textContent = "Start Recording";
};

// Upload audio file
fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.type.startsWith("audio/")) {
    alert("Please upload a valid audio file.");
    return;
  }

  currentAudioBlob = file;
  const audioURL = URL.createObjectURL(file);
  waveform.load(audioURL);
  audioPlayer.src = audioURL;
  audioPlayer.classList.remove("hidden");
  downloadBtn.classList.add("hidden");
  transcript.textContent = "Your transcription will appear here.";
  transcript.classList.remove("visible");

  sendAudioToBackend(file);
};

// Send audio to backend for transcription
async function sendAudioToBackend(audioBlob) {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  formData.append("language", languageSelector.value);

  transcript.textContent = "Transcribing... this may take a moment.";
  spinner.classList.remove("hidden");
  downloadBtn.classList.add("hidden");

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: formData
    });

    const result = await response.json();
    console.log("Backend response:", result);

    if (!response.ok || result.error) {
      throw new Error(result.error || `Server error: ${response.status}`);
    }

    const transcriptionText = result.transcription || "No transcription found.";
    transcript.textContent = transcriptionText;

    // Fade in transcript
    transcript.classList.remove("visible");
    setTimeout(() => {
      transcript.classList.add("visible");
    }, 100);

    // Show download button only if there's real text
    if (result.transcription && result.transcription.trim().length > 0) {
      setupDownload(result.transcription);
      downloadBtn.classList.remove("hidden");
    }

  } catch (error) {
    console.error("Transcription error:", error);
    transcript.textContent = "Error: " + error.message + ". Make sure the backend server is running.";
    transcript.classList.add("visible");
  } finally {
    spinner.classList.add("hidden");
  }
}

// Setup download button
function setupDownload(text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const newBtn = downloadBtn.cloneNode(true);
  downloadBtn.parentNode.replaceChild(newBtn, downloadBtn.outerHTML ? newBtn : downloadBtn);

  downloadBtn.href = url;
  downloadBtn.download = "transcription.txt";
  downloadBtn.onclick = null;
}