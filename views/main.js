let stream=null,
    audio=null,
    mixedstream=null,
    chunks= [],
    recorder=null,
    startButton=null,
    stopButton=null,
    downloadButton=null,
    recordedvideo=null;
    async function setupStream(){
        try{
            stream = await navigator.mediaDevices.getDisplayMedia({

              video: true  
            });
            audio =await navigator.mediaDevices.getUserMedia({
                audio :{
                    echoCancellation :true,
                    noiseSuppression : true,
                    sampleRate :44100
                }
            });
            setupVideoFeedback();
        } catch(err){
            console.error(err);
        }
    }
    function setupVideoFeedback(){
      if(stream){
          const video=document.querySelector('.video-feedback');
          video.srcObject =stream;
          video.play();
      }else {
   console.warn('no stream available');
      }
    }
async function startRecording(){
    await setupStream();
    if(stream && audio){
     mixedstream= new MediaStream([
         ...stream.getTracks(),
         ...audio.getTracks()
        ]);
        recorder=new MediaRecorder(mixedstream);
        recorder.ondataavailable= handelDataAvailable;
        recorder.onstop= hnadelStop;
        recorder.start(200);

        startButton.disabled=true;
        stopButton.disabled=false;

        console.log('recording has started...');
    }else{
        console.warn('no stream available');
    }
}
function handelDataAvailable(e){
 chunks.push(e.data);
}

function stopRecording(){
    recorder.stop();
    startButton.disabled=false;
    stopButton.disabled=true;
    console.log('recording has stopped...');
}

function hnadelStop(e){
 const blob = new Blob(chunks,{
     type:'video/mp4' 
 })
 chunks=[];
 downloadButton.href= URL.createObjectURL(blob);
 downloadButton.download='video.=.mp4';
 downloadButton.disabled=false;

 recordedvideo.src = URL.createObjectURL(blob);
 recordedvideo.load();
 recordedvideo.onloadeddata = () =>{
     recordedvideo.play();
     const  rc=document.querySelector(".recorded-video-wrap");
     rc.classList.remove("hidden");
     rc.scrollIntoView({behavior:"smooth" ,block:"start"});
 }
 stream.getTracks().forEach(track => track.stop());
 audio.getTracks().forEach(track => track.stop());

 console.log('recording has been saved...');
}
   window.addEventListener('load',() =>{
    startButton = document.querySelector('.start-recording');
    stopButton = document.querySelector('.stop-recording');
    downloadButton = document.querySelector('.download-video');
    recordedvideo = document.querySelector('.recorded-video');

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click',stopRecording);
   }) 