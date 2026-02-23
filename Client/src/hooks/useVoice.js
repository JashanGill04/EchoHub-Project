

export const useVoice= ()=>{

let remoteStream;
let peerConnection;

const call=async()=>{
 const stream=await navigator.mediaDevices.getUserMedia({
    audio:true,
 });
   lo.srcObject=stream;
}


    return{

    };
};