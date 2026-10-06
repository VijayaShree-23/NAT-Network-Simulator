const source=document.getElementById("source");
const send=document.getElementById("send");
const pause=document.getElementById("pause");
const reset=document.getElementById("reset");
const network=document.getElementById("network");
const status=document.getElementById("status");
const src=document.getElementById("src");
const translated=document.getElementById("translated");
const direction=document.getElementById("direction");
const explain=document.getElementById("explain");
const table=document.getElementById("table");
const step=document.getElementById("step");
const stepBoxes=[...document.querySelectorAll(".steps div")];

const pcPorts={"192.168.1.10":5000,"192.168.1.11":5001,"192.168.1.12":5002,"192.168.1.13":5003};
const mappings=new Map();
const timers=new Set();
const PAT_IP="50.1.1.1";
let nextPort=40001, packetNo=0, paused=false;

function getMapping(ip){
  if(!mappings.has(ip)){
    mappings.set(ip,{localPort:pcPorts[ip],globalIp:PAT_IP,globalPort:nextPort++});
  }
  return mappings.get(ip);
}

function renderTable(active){
  if(!mappings.size){
    table.innerHTML='<tr><td colspan="4">No active translations</td></tr>';
    return;
  }
  table.innerHTML="";
  mappings.forEach((m,ip)=>{
    const tr=document.createElement("tr");
    const local=ip+":"+m.localPort;
    const global=m.globalIp+":"+m.globalPort;
    tr.innerHTML="<td>"+local+"</td><td>"+global+"</td><td>11.1.1.2:80</td><td>"+(ip===active?"<b style='color:#16a34a'>ACTIVE</b>":"READY")+"</td>";
    table.appendChild(tr);
  });
}

function later(fn,ms){
  const t=setTimeout(()=>{timers.delete(t);fn();},ms);
  timers.add(t);
}

function setStep(i){
  stepBoxes.forEach((box,n)=>box.classList.toggle("active",n===i));
  step.textContent="Step "+(i+1)+" / 7";
}

function packetFlow(ip,m,id){
  const local=ip+":"+m.localPort;
  const global=m.globalIp+":"+m.globalPort;
  const el=document.createElement("div");
  el.className="dynamic";
  el.textContent="📦";
  el.style.left="9%"; el.style.top="69%";
  network.appendChild(el);

  const seq=[
    ["9%","69%","Packet #"+id+" created at "+local+".",local+" is the inside-local flow."],
    ["27%","48%","Packet #"+id+" reaches Switch0.","The switch forwards the frame toward Router0, the private LAN gateway."],
    ["35%","20%","Packet #"+id+" reaches NAT Router0.","NAT translates the private source. PAT represents the flow as "+global+"."],
    ["66%","20%","Packet #"+id+" crosses the ISP.","The external flow is "+global+" → 11.1.1.2:80."],
    ["82%","69%","Packet #"+id+" reaches Server0.","The public server receives the request and sends a simulated response."],
    ["35%","20%","Packet #"+id+" returns through NAT.","Router0 reverses "+global+" → "+local+" and forwards the response inward."],
    ["9%","69%","Packet #"+id+" delivered to "+local+".","The round trip is complete."]
  ];

  let i=0;
  function next(){
    if(paused){later(next,120);return;}
    const s=seq[i];
    el.style.left=s[0];el.style.top=s[1];
    status.textContent=s[2];
    explain.textContent=s[3];
    src.textContent=local;
    translated.textContent=global;
    direction.textContent=i>=5?"RETURN PATH":"OUTBOUND";
    setStep(i);
    renderTable(i<6?ip:null);
    i++;
    if(i<seq.length){later(next,900);}
    else{
      direction.textContent="COMPLETE";
      status.textContent="Packet #"+id+" complete — NAT/PAT mapping preserved.";
      later(()=>el.remove(),700);
    }
  }
  next();
}

send.addEventListener("click",()=>{
  const ip=source.value,m=getMapping(ip);
  packetNo++;
  src.textContent=ip+":"+m.localPort;
  translated.textContent=m.globalIp+":"+m.globalPort;
  direction.textContent="OUTBOUND";
  status.textContent="Preparing packet #"+packetNo+" from "+ip+"...";
  renderTable(ip);
  packetFlow(ip,m,packetNo);
});

pause.addEventListener("click",()=>{
  paused=!paused;
  pause.textContent=paused?"▶ Resume":"Ⅱ Pause";
});

reset.addEventListener("click",()=>{
  timers.forEach(clearTimeout);timers.clear();
  document.querySelectorAll(".dynamic").forEach(x=>x.remove());
  mappings.clear();nextPort=40001;packetNo=0;paused=false;
  pause.textContent="Ⅱ Pause";
  status.textContent="Ready — select a PC and send one packet.";
  src.textContent="—";translated.textContent="—";direction.textContent="IDLE";
  explain.textContent="NAT changes the private source address before the packet crosses the external network.";
  setStep(0);renderTable(null);
});

source.addEventListener("change",()=>{
  status.textContent="Ready — "+source.options[source.selectedIndex].text+" selected.";
});

renderTable(null);
