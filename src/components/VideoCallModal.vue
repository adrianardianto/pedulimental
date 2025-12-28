<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Peer from 'peerjs'
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Copy } from 'lucide-vue-next'

const props = defineProps({
  isVisible: Boolean,
  recipientName: String
})

const emit = defineEmits(['close'])

const localVideo = ref(null)
const remoteVideo = ref(null)
const peer = ref(null)
const myPeerId = ref('')
const targetPeerId = ref('')
const isConnected = ref(false)
const callStatus = ref('Connecting to server...')
const peerError = ref('')

const isAudioEnabled = ref(true)
const isVideoEnabled = ref(true)

let localStream = null
let currentCall = null

const initializePeer = () => {
    // Determine if we are in a secure context (HTTPS or localhost)
    // PeerJS usually needs secure context for WebRTC
    peer.value = new Peer()

    peer.value.on('open', (id) => {
        myPeerId.value = id
        callStatus.value = 'Ready to call'
    })

    peer.value.on('call', (call) => {
        // Answer incoming call automatically or prompt user?
        // For now, let's answer automatically with local stream
        callStatus.value = 'Incoming call...'
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                localStream = stream
                if(localVideo.value) localVideo.value.srcObject = stream
                
                call.answer(stream) // Answer the call with an A/V stream.
                currentCall = call
                
                handleCallStream(call)
            })
            .catch((err) => {
                console.error('Failed to get local stream', err)
                peerError.value = 'Could not access camera/microphone'
            })
    })

    peer.value.on('error', (err) => {
        console.error(err)
        peerError.value = `PeerJS Error: ${err.type}`
    })
}

const handleCallStream = (call) => {
    call.on('stream', (remoteStream) => {
        if(remoteVideo.value) {
            remoteVideo.value.srcObject = remoteStream
            isConnected.value = true
            callStatus.value = 'Connected'
        }
    })

    call.on('close', () => {
        endCallCleanup()
    })
}

const startCall = () => {
    if (!targetPeerId.value) {
        alert('Please enter a target Peer ID')
        return
    }

    callStatus.value = 'Calling...'
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream
            if(localVideo.value) localVideo.value.srcObject = stream

            const call = peer.value.call(targetPeerId.value, stream)
            currentCall = call
            handleCallStream(call)
        })
        .catch((err) => {
            console.error('Failed to get local stream', err)
            peerError.value = 'Could not access camera/microphone'
        })
}

const endCallCleanup = () => {
    if (currentCall) {
        currentCall.close()
    }
    isConnected.value = false
    callStatus.value = 'Call ended'
    if (remoteVideo.value) remoteVideo.value.srcObject = null
}

const toggleAudio = () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0]
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled
            isAudioEnabled.value = audioTrack.enabled
        }
    }
}

const toggleVideo = () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0]
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled
            isVideoEnabled.value = videoTrack.enabled
        }
    }
}

const closeModal = () => {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
    }
    if (peer.value) {
        peer.value.destroy()
    }
    emit('close')
}

const copyToClipboard = () => {
    navigator.clipboard.writeText(myPeerId.value)
    alert('ID copied to clipboard!')
}

onMounted(() => {
    initializePeer()
    
    // Get local preview immediately if desired, or wait for call
    // Let's get it strictly when calling/receiving to save resources, 
    // or maybe shows preview immediately? Let's show preview immediately.
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            localStream = stream
            if(localVideo.value) localVideo.value.srcObject = stream
        })
        .catch(err => {
            console.warn('Init preview failed:', err)
        })
})

onUnmounted(() => {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop())
    }
    if (peer.value) {
        peer.value.destroy()
    }
})

</script>

<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Video Call with {{ recipientName }}</h3>
        <button class="close-btn" @click="closeModal">
            <X :size="24" />
        </button>
      </div>

      <div class="video-container">
        <!-- Remote Video (Large) -->
        <video ref="remoteVideo" class="remote-video" autoplay playsinline></video>
        
        <!-- Local Video (Small Overlay) -->
        <div class="local-video-wrapper">
             <video ref="localVideo" class="local-video" autoplay playsinline muted></video>
        </div>

        <div v-if="!isConnected" class="waiting-message">
            <p>{{ callStatus }}</p>
            <p v-if="peerError" class="error-text">{{ peerError }}</p>
        </div>
      </div>

      <div class="connection-info" v-if="!isConnected">
          <div class="info-group">
            <label>My ID:</label>
            <div class="id-display">
                <span>{{ myPeerId || 'Generating...' }}</span>
                <button @click="copyToClipboard" class="icon-btn" title="Copy ID">
                    <Copy :size="16" />
                </button>
            </div>
          </div>
          <div class="info-group">
            <label>Partner ID:</label>
            <input v-model="targetPeerId" placeholder="Enter ID to call" class="id-input" />
            <button @click="startCall" class="call-btn">Call</button>
          </div>
          <p class="hint">Open this page in another tab/device to test calls.</p>
      </div>

      <div class="controls">
          <button class="control-btn" :class="{ 'off': !isAudioEnabled }" @click="toggleAudio">
              <Mic v-if="isAudioEnabled" :size="24" />
              <MicOff v-else :size="24" />
          </button>
          
          <button class="control-btn end-call" @click="closeModal">
              <PhoneOff :size="24" />
          </button>

          <button class="control-btn" :class="{ 'off': !isVideoEnabled }" @click="toggleVideo">
              <Video v-if="isVideoEnabled" :size="24" />
              <VideoOff v-else :size="24" />
          </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: #1e293b;
  width: 90%;
  max-width: 800px;
  max-height: 90vh; /* Prevent overflow */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #334155;
  color: white;
  background: #1e293b;
  z-index: 10;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #334155;
  color: white;
}

.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1; /* Allow it to fill space if flex container */
  overflow: hidden;
}

.remote-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.local-video-wrapper {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 160px;
  aspect-ratio: 16/9;
  background: black;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.2);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 10;
}

.local-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1); /* Mirror effect */
}

.waiting-message {
  position: absolute;
  color: white;
  text-align: center;
  background: rgba(0,0,0,0.6);
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 300px;
}

.error-text {
  color: #ef4444;
  font-size: 0.9em;
  margin-top: 5px;
}

.connection-info {
  background: #334155;
  padding: 15px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.info-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.id-display {
  background: #1e293b;
  padding: 6px 12px;
  border-radius: 6px;
  font-family: monospace;
  display: flex;
  align-items: center;
  gap: 8px;
}

.id-input {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  width: 200px;
  background: #f1f5f9;
  color: #0f172a;
}

.call-btn {
  padding: 8px 16px;
  background: #5AB2A8;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.call-btn:hover {
  background: #4a9e95;
}

.icon-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  padding: 4px;
}

.icon-btn:hover {
  color: white;
}

.hint {
  font-size: 12px;
  color: #cbd5e1;
  margin: 0;
  text-align: center;
}

.controls {
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
  background: #1e293b;
  border-top: 1px solid #334155;
}

.control-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: #334155;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.control-btn:hover {
  background: #475569;
  transform: translateY(-2px);
}

.control-btn.off {
  background: #ef4444;
  color: white;
}

.control-btn.end-call {
  background: #ef4444;
  width: 60px;
  height: 60px;
}

.control-btn.end-call:hover {
  background: #dc2626;
}

/* Base Responsive */
@media (max-width: 640px) {
  .modal-content {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }

  .modal-header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
      border-bottom: none;
      z-index: 20;
      padding-top: env(safe-area-inset-top); /* Handle notch */
  }

  .modal-header h3 {
      font-size: 1.1rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }

  .video-container {
    height: 100%; /* Fill screen on mobile */
    aspect-ratio: auto;
  }

  .remote-video {
    object-fit: cover; /* Ensure it covers full screen */
  }

  .local-video-wrapper {
    width: 100px;
    bottom: 110px; /* Above controls */
    right: 16px;
    border-radius: 8px;
  }

  /* Make connection info overlay on global space or push content up? 
     For 'Connecting' state, it's fine to cover video. 
     For 'Connected' state, we hide it anyway. 
  */
  .connection-info {
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      border-radius: 12px;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(8px);
      z-index: 15;
  }
  
  .info-group {
      flex-direction: column;
      width: 100%;
      align-items: stretch;
  }

  .id-input {
      width: 100%;
  }

  .controls {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-bottom: max(20px, env(safe-area-inset-bottom));
      background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
      border-top: none;
      z-index: 20;
  }

  .waiting-message {
      z-index: 5;
  }
}
</style>
