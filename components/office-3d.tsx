"use client";

import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, CheckCircle2, ClipboardList, DoorOpen, LoaderCircle, MessageSquare, Send, ShieldCheck, UserRound, X } from "lucide-react";

const staff = [
  { id:"operations", name:"Director de operaciones", role:"COO · Dirección general", area:"Dirección", color:"#70d8d0", mission:"Coordina los departamentos, convierte objetivos en planes y supervisa el avance de Transport AI.", duties:["Planificar objetivos y prioridades","Distribuir trabajo entre especialistas","Detectar bloqueos y dependencias","Preparar informes de dirección"], tools:["Planificación","Coordinación","Seguimiento"] },
  { id:"sales", name:"Director comercial", role:"Ventas · Desarrollo de negocio", area:"Comercial", color:"#e5bd78", mission:"Busca oportunidades reales, prepara estrategias de venta y ayuda a convertir prospectos en clientes.", duties:["Definir clientes objetivo","Preparar mensajes comerciales","Calificar oportunidades","Crear propuestas y seguimientos"], tools:["Prospección","Propuestas","Negociación"] },
  { id:"marketing", name:"Marketing", role:"Marca · Comunicación", area:"Marketing", color:"#c59af0", mission:"Construye la marca Transport AI y prepara contenido y campañas coherentes.", duties:["Calendario de contenidos","Mensajes y posicionamiento","Ideas de campañas","Medición y análisis"], tools:["Copywriting","Marca","Campañas"] },
  { id:"relations", name:"Relaciones comerciales", role:"Cuentas · Seguimiento", area:"Clientes", color:"#86b8ed", mission:"Mantiene el contexto de cada cliente y prepara comunicaciones y seguimientos.", duties:["Registrar necesidades de clientes","Preparar seguimientos","Resumir reuniones","Detectar oportunidades"], tools:["Seguimiento","Atención","CRM"] },
  { id:"engineering", name:"Ingeniero de software", role:"Desarrollo · Sistemas", area:"Tecnología", color:"#71c6a2", mission:"Diseña y desarrolla aplicaciones, APIs, automatizaciones e integraciones.", duties:["Diseñar arquitectura","Desarrollar software","Investigar integraciones","Probar y documentar"], tools:["Next.js","TypeScript","APIs"] },
  { id:"design", name:"Diseñador creativo", role:"Diseño · Experiencia", area:"Creatividad", color:"#ed9bb5", mission:"Diseña experiencias visuales profesionales, diferenciadas y fáciles de usar.", duties:["Diseño UI/UX","Identidad visual","Presentaciones","Prototipos"], tools:["UI/UX","Diseño","Prototipado"] },
  { id:"research", name:"Analista de investigación", role:"Mercado · Inteligencia", area:"Investigación", color:"#8bc7d8", mission:"Investiga mercados, competidores y herramientas para reducir la incertidumbre.", duties:["Análisis de mercado","Comparativas de proveedores","Verificación de información","Informes de investigación"], tools:["Investigación","Análisis","Informes"] },
  { id:"finance", name:"Administración y finanzas", role:"Finanzas · Control", area:"Administración", color:"#d8c17e", mission:"Controla costes, presupuestos y documentación económica.", duties:["Presupuestos","Costes y márgenes","Previsión de caja","Organización documental"], tools:["Presupuestos","Costes","Control"] },
  { id:"security", name:"Seguridad y calidad", role:"Auditoría · Protección", area:"Seguridad", color:"#a6b4c8", mission:"Revisa seguridad, privacidad, permisos, calidad y riesgos de cada proyecto.", duties:["Revisar privacidad y permisos","Auditar entregables","Definir pruebas de calidad","Detectar riesgos"], tools:["Seguridad","QA","Privacidad"] }
] as const;

function Desk({color,selected}:{color:string;selected:boolean}) {
  return <group>
    <mesh position={[0,.76,-.38]} castShadow receiveShadow><boxGeometry args={[2.05,.13,1.05]}/><meshStandardMaterial color="#8b6849" roughness={.42}/></mesh>
    <mesh position={[0,.68,-.38]}><boxGeometry args={[1.9,.035,.92]}/><meshStandardMaterial color="#b28a61" roughness={.55}/></mesh>
    {[[-.88,.36,-.78],[.88,.36,-.78],[-.88,.36,.02],[.88,.36,.02]].map((p:any,i:number)=><mesh key={i} position={p}><boxGeometry args={[.075,.72,.075]}/><meshStandardMaterial color="#333b40" metalness={.65} roughness={.3}/></mesh>)}
    <mesh position={[0,1.13,-.68]} castShadow><boxGeometry args={[.92,.58,.075]}/><meshStandardMaterial color="#111a20" metalness={.35} roughness={.25}/></mesh>
    <mesh position={[0,1.13,-.635]}><planeGeometry args={[.82,.47]}/><meshStandardMaterial color={selected?"#285c5a":"#29434a"} emissive={color} emissiveIntensity={selected ? 0.22 : 0.08} roughness={.35}/></mesh>
    <mesh position={[0,.84,-.63]}><boxGeometry args={[.11,.12,.11]}/><meshStandardMaterial color="#68777a" metalness={.7}/></mesh>
    <mesh position={[0,.83,-.34]}><boxGeometry args={[.68,.025,.22]}/><meshStandardMaterial color="#20292d" roughness={.7}/></mesh>
    <mesh position={[.67,.84,-.28]}><cylinderGeometry args={[.075,.075,.1,18]}/><meshStandardMaterial color="#d8ded8"/></mesh>
    <mesh position={[-.72,.9,-.58]}><cylinderGeometry args={[.085,.07,.22,16]}/><meshStandardMaterial color="#405d52"/></mesh>
    <mesh position={[-.72,1.04,-.58]}><sphereGeometry args={[.12,10,8]}/><meshStandardMaterial color="#6f9b76" roughness={.8}/></mesh>
    <mesh position={[0,.91,.18]}><boxGeometry args={[.5,.025,.12]}/><meshStandardMaterial color="#293238"/></mesh>
  </group>;
}

function OfficeChair({position=[0,0,0]}:{position?:[number,number,number]}) {
  return <group position={position}>
    <mesh position={[0,.56,0]} castShadow><boxGeometry args={[.82,.16,.78]}/><meshStandardMaterial color="#252d32" roughness={.78}/></mesh>
    <mesh position={[0,1.03,.34]} castShadow><boxGeometry args={[.78,.9,.13]}/><meshStandardMaterial color="#303a40" roughness={.82}/></mesh>
    <mesh position={[0,.39,0]}><cylinderGeometry args={[.075,.09,.28,12]}/><meshStandardMaterial color="#7e898b" metalness={.75}/></mesh>
    {Array.from({length:5},(_,i)=>{const a=i*Math.PI*2/5;return <group key={i} rotation={[0,a,0]}><mesh position={[.28,.18,0]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.025,.025,.48,8]}/><meshStandardMaterial color="#687477" metalness={.7}/></mesh><mesh position={[.49,.1,0]}><sphereGeometry args={[.09,10,8]}/><meshStandardMaterial color="#252d32"/></mesh></group>;})}
  </group>;
}

function Plant({position,scale=1}:{position:[number,number,number];scale?:number}) {
  return <group position={position} scale={scale}>
    <mesh position={[0,.25,0]}><cylinderGeometry args={[.22,.17,.48,16]}/><meshStandardMaterial color="#a58a6c" roughness={.85}/></mesh>
    {Array.from({length:7},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.16,.67+(i%3)*.1,Math.cos(i*2.4)*.16]} rotation={[.2, i*1.2, Math.sin(i)*.35]}><sphereGeometry args={[.13,10,8]}/><meshStandardMaterial color={i%2?"#47785e":"#638d69"} roughness={.9}/></mesh>)}
  </group>;
}

function GlassPartition({position,size}:{position:[number,number,number];size:[number,number,number]}) {
  return <group position={position}>
    <mesh castShadow><boxGeometry args={size}/><meshPhysicalMaterial color="#b9d8d8" transparent opacity={.18} roughness={.12} metalness={.25} transmission={.12}/></mesh>
    <mesh position={[-size[0]/2,0,0]}><boxGeometry args={[.055,size[1],.07]}/><meshStandardMaterial color="#39484b" metalness={.75} roughness={.28}/></mesh>
    <mesh position={[size[0]/2,0,0]}><boxGeometry args={[.055,size[1],.07]}/><meshStandardMaterial color="#39484b" metalness={.75} roughness={.28}/></mesh>
    <mesh position={[0,-size[1]/2,0]}><boxGeometry args={[size[0],.06,.08]}/><meshStandardMaterial color="#39484b" metalness={.75}/></mesh>
    <mesh position={[0,size[1]/2,0]}><boxGeometry args={[size[0],.06,.08]}/><meshStandardMaterial color="#39484b" metalness={.75}/></mesh>
  </group>;
}

function OfficeRoom({position,agentIndex,selected,onSelect,label}:{position:[number,number,number];agentIndex:number;selected:boolean;onSelect:(i:number)=>void;label:string}) {
  const person = staff[agentIndex];
  return <group position={position} onClick={(e)=>{e.stopPropagation();onSelect(agentIndex);}}>
    <mesh position={[0,.06,0]} receiveShadow><boxGeometry args={[7.5,.12,5.7]}/><meshStandardMaterial color={selected?"#c8c0b0":"#a9a79d"} roughness={.88}/></mesh>
    <mesh position={[0,.13,0]}><boxGeometry args={[7.25,.035,5.45]}/><meshStandardMaterial color="#c9c5b9" roughness={.92}/></mesh>
    <GlassPartition position={[0,1.48,-2.79]} size={[7.5,2.85,.07]}/>
    <GlassPartition position={[-3.69,1.48,0]} size={[5.65,2.85,.07]}/>
    <GlassPartition position={[3.69,1.48,0]} size={[5.65,2.85,.07]}/>
    <GlassPartition position={[-2.05,1.48,2.79]} size={[3.35,2.85,.07]}/>
    <GlassPartition position={[2.05,1.48,2.79]} size={[3.35,2.85,.07]}/>
    <mesh position={[0,1.48,-2.72]}><boxGeometry args={[2.2,.035,.025]}/><meshStandardMaterial color={person.color} emissive={person.color} emissiveIntensity={.3}/></mesh>
    <group position={[0,0,-.55]}><Desk color={person.color} selected={selected}/></group>
    <OfficeChair position={[0,0,1.1]}/>
    <mesh position={[0,2.94,-.1]}><boxGeometry args={[2.6,.055,1.15]}/><meshStandardMaterial color="#f2e9d7" emissive="#e5d4b5" emissiveIntensity={.45}/></mesh>
    <mesh position={[0,2.9,-.1]}><boxGeometry args={[2.2,.025,.8]}/><meshStandardMaterial color="#fff5dc" emissive="#fff0cc" emissiveIntensity={.35}/></mesh>
    <Plant position={[-2.95,.15,-2.15]} scale={.8}/>
    <Html position={[0,3.45,0]} center distanceFactor={13} style={{pointerEvents:"none"}}>
      <div style={{background:"#172326ed",border:"1px solid "+(selected?person.color:"#718080"),borderRadius:7,padding:"7px 12px",color:"#f4f3ec",fontSize:10,letterSpacing:".08em",whiteSpace:"nowrap",boxShadow:"0 8px 22px #0005"}}>{label.toUpperCase()}</div>
    </Html>
    {selected&&<mesh position={[0,.2,2.84]}><boxGeometry args={[1.4,.045,.06]}/><meshStandardMaterial color={person.color} emissive={person.color} emissiveIntensity={.8}/></mesh>}
  </group>;
}

function Reception({position}:{position:[number,number,number]}) {
  return <group position={position}>
    <mesh position={[0,.62,0]} castShadow><boxGeometry args={[4.2,1.15,1.15]}/><meshStandardMaterial color="#343f3e" roughness={.42}/></mesh>
    <mesh position={[0,1.2,.05]}><boxGeometry args={[4.05,.055,1.08]}/><meshStandardMaterial color="#a9845d" roughness={.35}/></mesh>
    <mesh position={[0,.64,.59]}><boxGeometry args={[3.8,.72,.035]}/><meshStandardMaterial color="#536b66" metalness={.25}/></mesh>
    <Html position={[0,.68,.63]} center distanceFactor={11} style={{pointerEvents:"none"}}><div style={{color:"#f3f1e8",fontSize:12,letterSpacing:3,fontWeight:600,whiteSpace:"nowrap"}}>TRANSPORT AI</div></Html>
  </group>;
}

function ConferenceRoom({position}:{position:[number,number,number]}) {
  return <group position={position}>
    <mesh position={[0,.1,0]}><boxGeometry args={[7.2,.18,4.2]}/><meshStandardMaterial color="#c8c2b5" roughness={.9}/></mesh>
    <mesh position={[0,.76,0]} castShadow><boxGeometry args={[3.6,.14,1.5]}/><meshStandardMaterial color="#775b42" roughness={.4}/></mesh>
    {[[-1.3,.4,-.72],[1.3,.4,-.72],[-1.3,.4,.72],[1.3,.4,.72],[-2.1,.4,0],[2.1,.4,0]].map((p:any,i:number)=><group key={i} position={p}><mesh><boxGeometry args={[.58,.72,.58]}/><meshStandardMaterial color="#303a3d" roughness={.8}/></mesh><mesh position={[0,.42,-.19]}><boxGeometry args={[.58,.12,.18]}/><meshStandardMaterial color="#303a3d"/></mesh></group>)}
    <mesh position={[0,1.55,-1.85]}><boxGeometry args={[2.8,1.45,.06]}/><meshStandardMaterial color="#1d3032" emissive="#173f40" emissiveIntensity={.18}/></mesh>
    <Plant position={[-3,.12,-1.5]} scale={.9}/>
  </group>;
}

function BuildingScene({selected,onSelect}:{selected:number;onSelect:(i:number)=>void}) {
  const columns=[-8.1,0,8.1];
  const rows=[-7.35,-.35,6.65];
  return <>
    <color attach="background" args={["#151c1b"]}/>
    <fog attach="fog" args={["#151c1b",34,62]}/>
    <ambientLight intensity={.72}/>
    <hemisphereLight args={["#f4eee1","#53605a",1.05]}/>
    <directionalLight position={[10,22,14]} intensity={2.15} castShadow shadow-mapSize={[1024,1024]} shadow-camera-far={55}/>
    <pointLight position={[-9,5,9]} intensity={28} color="#f0d5a6" distance={22}/>
    <pointLight position={[10,5,9]} intensity={22} color="#a5c8c2" distance={20}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.32,0]} receiveShadow><planeGeometry args={[46,44]}/><meshStandardMaterial color="#202927" roughness={.96}/></mesh>
    <mesh position={[0,-.04,0]} receiveShadow castShadow><boxGeometry args={[28,.48,30]}/><meshStandardMaterial color="#5a625c" roughness={.82}/></mesh>
    <mesh position={[0,.22,0]} receiveShadow><boxGeometry args={[27.6,.08,29.6]}/><meshStandardMaterial color="#b5b0a4" roughness={.82}/></mesh>
    <mesh position={[0,1.75,-14.75]} castShadow><boxGeometry args={[27.6,3.2,.22]}/><meshStandardMaterial color="#303d3a" roughness={.8}/></mesh>
    <mesh position={[-13.75,1.75,0]} castShadow><boxGeometry args={[.22,3.2,29.5]}/><meshStandardMaterial color="#303d3a" roughness={.8}/></mesh>
    <mesh position={[13.75,1.75,0]} castShadow><boxGeometry args={[.22,3.2,29.5]}/><meshStandardMaterial color="#303d3a" roughness={.8}/></mesh>
    <GlassPartition position={[0,1.75,14.72]} size={[27.5,3.2,.1]}/>
    <mesh position={[0,.3,0]}><boxGeometry args={[.035,.03,28.8]}/><meshStandardMaterial color="#8c897f"/></mesh>
    {columns.map((x,i)=>rows.map((z,j)=><OfficeRoom key={staff[i+j*3].id} position={[x,.3,z]} agentIndex={i+j*3} selected={selected===i+j*3} onSelect={onSelect} label={staff[i+j*3].area}/>))}
    <Reception position={[-7.5,.3,11.6]}/>
    <ConferenceRoom position={[7.1,.3,11.4]}/>
    <group position={[0,.3,12.4]}>
      <mesh position={[0,.35,0]} castShadow><boxGeometry args={[3.2,.7,1.05]}/><meshStandardMaterial color="#59645d" roughness={.85}/></mesh>
      <mesh position={[0,.72,-.15]}><boxGeometry args={[3.15,.08,.9]}/><meshStandardMaterial color="#b49a78" roughness={.55}/></mesh>
      {[-.9,0,.9].map((x)=><mesh key={x} position={[x,.83,-.15]}><boxGeometry args={[.12,.12,.12]}/><meshStandardMaterial color="#d4c7b2"/></mesh>)}
    </group>
    <Plant position={[-12,.3,12]} scale={1.5}/>
    <Plant position={[12,.3,12]} scale={1.5}/>
    <Html position={[0,2.6,-14.4]} center distanceFactor={18} style={{pointerEvents:"none"}}><div style={{fontSize:13,letterSpacing:".32em",fontWeight:700,color:"#e9e5d9",whiteSpace:"nowrap",textShadow:"0 2px 12px #000"}}>TRANSPORT AI <span style={{color:"#8eb7a7"}}>·</span> HEADQUARTERS</div></Html>
    <OrbitControls makeDefault minDistance={18} maxDistance={48} maxPolarAngle={Math.PI/2.03} target={[0,1,0]} enableDamping dampingFactor={.08}/>
  </>;
}

type Task = { id:string | number; title:string; owner:string; priority:"Alta"|"Media"|"Baja"; done:boolean; createdAt?:string };
type ChatLine = { role:"user"|"assistant"; content:string };

function Desk({color,selected}:{color:string;selected:boolean}) {
  return <group>
    <mesh position={[0,.58,0]} castShadow><boxGeometry args={[1.15,.12,.72]} /><meshStandardMaterial color={selected ? "#315b60" : "#273847"} /></mesh>
    {[[-.46,.28,-.26],[.46,.28,-.26],[-.46,.28,.26],[.46,.28,.26]].map((p:any,i:number)=><mesh key={i} position={p}><boxGeometry args={[.06,.52,.06]} /><meshStandardMaterial color="#687c8b" /></mesh>)}
    <mesh position={[0,.91,-.18]} castShadow><boxGeometry args={[.43,.42,.055]} /><meshStandardMaterial color="#101b27" /></mesh>
    <mesh position={[0,.91,-.145]}><planeGeometry args={[.36,.34]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.22} /></mesh>
    <mesh position={[.34,.69,.12]}><cylinderGeometry args={[.075,.075,.07,16]} /><meshStandardMaterial color="#5d9a78" /></mesh>
  </group>;
}

function OfficeRoom({position,agentIndex,selected,onSelect,label}:{position:[number,number,number];agentIndex:number;selected:boolean;onSelect:(i:number)=>void;label:string}) {
  const person = staff[agentIndex];
  return <group position={position} onClick={(e)=>{e.stopPropagation();onSelect(agentIndex);}}>
    <mesh position={[0,.08,0]} receiveShadow><boxGeometry args={[4.15,.16,3.55]} /><meshStandardMaterial color={selected ? "#31565a" : "#263847"} /></mesh>
    <mesh position={[0,1.65,-1.73]} castShadow><boxGeometry args={[4.15,3.15,.12]} /><meshStandardMaterial color="#344b59" roughness={.8} /></mesh>
    <mesh position={[-2.02,1.65,0]} castShadow><boxGeometry args={[.12,3.15,3.55]} /><meshStandardMaterial color="#344b59" roughness={.8} /></mesh>
    <mesh position={[2.02,1.65,0]} castShadow><boxGeometry args={[.12,3.15,3.55]} /><meshStandardMaterial color="#344b59" roughness={.8} /></mesh>
    <mesh position={[0,2.25,-1.65]}><boxGeometry args={[2.8,.75,.035]} /><meshStandardMaterial color={person.color} transparent opacity={.2} metalness={.3} /></mesh>
    <mesh position={[0,3.25,0]}><boxGeometry args={[4.1,.07,3.5]} /><meshStandardMaterial color="#5b6c78" transparent opacity={.25} /></mesh>
    <group position={[0,0,.25]}><Desk color={person.color} selected={selected}/></group>
    <Html position={[0,3.7,0]} center distanceFactor={11} style={{pointerEvents:"none"}}>
      <div style={{background:"#0c1822ee",border:"1px solid "+person.color,borderRadius:8,padding:"6px 10px",color:"#f0f6fa",fontSize:10,whiteSpace:"nowrap",boxShadow:"0 5px 18px #0008"}}>{label}</div>
    </Html>
    {selected && <mesh position={[0,.18,1.76]}><boxGeometry args={[1.25,.06,.06]} /><meshStandardMaterial color={person.color} emissive={person.color} emissiveIntensity={.7}/></mesh>}
  </group>;
}

function BuildingScene({selected,onSelect}:{selected:number;onSelect:(i:number)=>void}) {
  return <>
    <color attach="background" args={["#0b141d"]}/>
    <fog attach="fog" args={["#0b141d",24,48]}/>
    <ambientLight intensity={1.1}/>
    <directionalLight position={[12,20,12]} intensity={2.1} castShadow shadow-mapSize={[1024,1024]}/>
    <pointLight position={[-10,8,-8]} intensity={55} color="#53c8c0" distance={28}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.3,0]} receiveShadow><planeGeometry args={[40,34]}/><meshStandardMaterial color="#111b24"/></mesh>
    <gridHelper args={[40,40,"#2b414c","#1b2b36"]} position={[0,-.28,0]}/>
    <mesh position={[0,.0,0]} receiveShadow castShadow><boxGeometry args={[20,.45,14]}/><meshStandardMaterial color="#273744"/></mesh>
    <mesh position={[0,4.5,0]} castShadow><boxGeometry args={[20,.35,14]}/><meshStandardMaterial color="#394c59"/></mesh>
    <mesh position={[0,8.95,0]} castShadow><boxGeometry args={[20,.35,14]}/><meshStandardMaterial color="#394c59"/></mesh>
    {[-9.8,9.8].map(x=><mesh key={x} position={[x,4.45,0]} castShadow><boxGeometry args={[.35,8.7,14]}/><meshStandardMaterial color="#455b68"/></mesh>)}
    <mesh position={[0,4.45,-6.8]} castShadow><boxGeometry args={[19.5,8.7,.35]}/><meshStandardMaterial color="#455b68"/></mesh>
    {[-6,-2,2,6].map(x=><mesh key={x} position={[x,4.45,6.8]}><boxGeometry args={[3.6,8.2,.09]}/><meshStandardMaterial color="#6fa9b5" transparent opacity={.2} metalness={.45} roughness={.18}/></mesh>)}
    {[-9,9].map(x=>[-6,0,6].map(z=><mesh key={x+"-"+z} position={[x,4.45,z]} castShadow><boxGeometry args={[.42,8.7,.42]}/><meshStandardMaterial color="#647985"/></mesh>))}
    <mesh position={[0,2.2,0]}><boxGeometry args={[19.2,.12,13.2]}/><meshStandardMaterial color="#1a2a36"/></mesh>
    <mesh position={[0,6.7,0]}><boxGeometry args={[19.2,.12,13.2]}/><meshStandardMaterial color="#1a2a36"/></mesh>
    {staff.slice(0,4).map((a,i)=><OfficeRoom key={a.id} position={[-7.1+(i%2)*7.1, .25, -4.2+Math.floor(i/2)*7.2]} agentIndex={i} selected={selected===i} onSelect={onSelect} label={a.area}/>)}
    {staff.slice(4).map((a,i)=><OfficeRoom key={a.id} position={[-7.1+(i%2)*7.1, 4.75, -4.2+Math.floor(i/3)*7.2]} agentIndex={i+4} selected={selected===i+4} onSelect={onSelect} label={a.area}/>)}
    <group position={[6.8,.25,-3.5]}>
      <mesh position={[0,.58,0]} castShadow><boxGeometry args={[2.8,1.05,.72]}/><meshStandardMaterial color="#31535a"/></mesh>
      <mesh position={[0,1.15,-.18]}><boxGeometry args={[2.35,.05,.03]}/><meshStandardMaterial color="#70d8d0" emissive="#287d7a" emissiveIntensity={.45}/></mesh>
      <Html position={[0,2.1,0]} center distanceFactor={12} style={{pointerEvents:"none"}}><div style={{color:"#dce9ef",fontSize:11,letterSpacing:2,whiteSpace:"nowrap",textShadow:"0 2px 6px #000"}}>RECEPCIÓN</div></Html>
    </group>
    <group position={[6.8,.25,3.4]}>
      <mesh position={[0,.48,0]} castShadow><boxGeometry args={[2.5,.12,1.6]}/><meshStandardMaterial color="#657b86"/></mesh>
      {[-1,1].map(x=>[-.95,.95].map(z=><mesh key={x+"-"+z} position={[x,.24,z]}><cylinderGeometry args={[.07,.07,.45,12]}/><meshStandardMaterial color="#455b68"/></mesh>))}
      <Html position={[0,1.5,0]} center distanceFactor={12} style={{pointerEvents:"none"}}><div style={{color:"#dce9ef",fontSize:11,letterSpacing:2,whiteSpace:"nowrap",textShadow:"0 2px 6px #000"}}>SALA DE REUNIONES</div></Html>
    </group>
    <group position={[0,0,8.3]}>
      <mesh position={[0,.1,0]} castShadow><boxGeometry args={[6,.2,2.2]}/><meshStandardMaterial color="#465c68"/></mesh>
      {[-2.5,2.5].map(x=><mesh key={x} position={[x,1.7,-.7]} castShadow><boxGeometry args={[.18,3.4,.18]}/><meshStandardMaterial color="#607783"/></mesh>)}
      <mesh position={[0,3.35,-.7]}><boxGeometry args={[5.2,.18,.2]}/><meshStandardMaterial color="#70d8d0" emissive="#287d7a" emissiveIntensity={.35}/></mesh>
      <mesh position={[0,1.65,-.72]}><boxGeometry args={[5.1,3.1,.06]}/><meshStandardMaterial color="#7db7c4" transparent opacity={.12} metalness={.5}/></mesh>
    </group>
    <OrbitControls makeDefault minDistance={12} maxDistance={38} maxPolarAngle={Math.PI/2.02} target={[0,4,0]}/>
  </>;
}

export default function Office3D() {
  const [selected,setSelected] = useState(0);
  const [view,setView] = useState<"building"|"rooms"|"workspace">("building");
  const [tab,setTab] = useState<"profile"|"chat"|"tasks">("profile");
  const [tasks,setTasks] = useState<Task[]>([]);
  const [taskTitle,setTaskTitle] = useState("");
  const [chat,setChat] = useState<Record<string,ChatLine[]>>({});
  const [message,setMessage] = useState("");
  const [sending,setSending] = useState(false);
  const [error,setError] = useState("");
  const [model,setModel] = useState("");
  const [loaded,setLoaded] = useState(false);
  const agent = staff[selected];
  const agentTasks = useMemo(()=>tasks.filter(t=>t.owner===agent.name),[tasks,agent.id]);
  const lines = chat[agent.id] || [];

  useEffect(()=>{
    try {
      const savedTasks=localStorage.getItem("transport-ai-dashboard-tasks");
      const savedChat=localStorage.getItem("transport-ai-office-chat");
      if(savedTasks) setTasks(JSON.parse(savedTasks));
      if(savedChat) setChat(JSON.parse(savedChat));
    } catch {}
    setLoaded(true);
  },[]);
  useEffect(()=>{if(loaded)localStorage.setItem("transport-ai-dashboard-tasks",JSON.stringify(tasks));},[tasks,loaded]);
  useEffect(()=>{if(loaded)localStorage.setItem("transport-ai-office-chat",JSON.stringify(chat));},[chat,loaded]);

  function enterRoom(index:number) { setSelected(index); setView("workspace"); setTab("profile"); setError(""); }
  function addTask() {
    if(!taskTitle.trim()) return;
    setTasks(current=>[{id:crypto.randomUUID(),title:taskTitle.trim(),owner:agent.name,priority:"Media",done:false,createdAt:new Date().toISOString()},...current]);
    setTaskTitle("");
    setTab("tasks");
  }
  async function sendMessage() {
    if (!message.trim() || sending) return;
    const userMessage = message.trim();
    const history = lines.slice(-8);
    setChat(current => ({ ...current, [agent.id]: [...(current[agent.id] || []), { role: "user", content: userMessage }] }));
    setMessage("");
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: agent.id, message: userMessage, history })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "El servidor local no ha podido generar una respuesta.");
      const reply = typeof data.reply === "string" ? data.reply : "";
      if (!reply) throw new Error("El modelo local ha devuelto una respuesta vacía.");
      const modelName = data.model || "Modelo local";
      setChat(current => ({ ...current, [agent.id]: [...(current[agent.id] || []), { role: "assistant", content: reply }] }));
      setModel(modelName);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de conexión");
    } finally {
      setSending(false);
    }
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div><div className="eyebrow">Sede corporativa · Transport AI</div><h1 className="page-title">Edificio central</h1><p className="subtle">Entra en cada departamento y trabaja directamente con sus agentes especializados.</p></div>
      <span className="pill pill-ready"><span className="dot"/>Edificio 3D interactivo</span>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button className={view==="building"?"action-button":"ghost-button"} onClick={()=>setView("building")}><Building2 size={14}/>Edificio 3D</button>
      <button className={view==="rooms"?"action-button":"ghost-button"} onClick={()=>setView("rooms")}><DoorOpen size={14}/>Departamentos</button>
      {view==="workspace"&&<button className="ghost-button" onClick={()=>setView("rooms")}><ArrowLeft size={14}/>Volver a oficinas</button>}
    </div>
    {view==="building"&&<div className="panel overflow-hidden">
      <div style={{height:"min(65vh,650px)",minHeight:440}}>
        <Canvas shadows camera={{position:[19,17,22],fov:38}} dpr={[1,1.25]}><BuildingScene selected={selected} onSelect={enterRoom}/></Canvas>
      </div>
      <div className="px-4 py-3 border-t flex flex-wrap justify-between gap-2 text-[10px] text-slate-500" style={{borderColor:"var(--line)"}}><span>Arrastra para girar · Rueda para acercar · Pulsa en un despacho para entrar</span><span>2 plantas · 9 despachos · 1 sede</span></div>
    </div>}
    {view==="rooms"&&<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {staff.map((person,index)=><article key={person.id} className="panel p-4">
        <div className="flex items-center gap-3"><div className="avatar" style={{background:person.color+"22",color:person.color}}><UserRound size={18}/></div><div className="min-w-0"><div className="text-sm font-semibold">{person.name}</div><div className="text-[10px] text-slate-500 mt-1">{person.role}</div></div></div>
        <p className="text-xs text-slate-500 leading-relaxed mt-3 min-h-[40px]">{person.mission}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{borderColor:"var(--line)"}}><span className="text-[10px] text-slate-500">{tasks.filter(t=>t.owner===person.name&&!t.done).length} tareas pendientes</span><button className="action-button !py-2 !px-3" onClick={()=>enterRoom(index)}>Entrar en despacho <DoorOpen size={13}/></button></div>
      </article>)}
    </div>}
    {view==="workspace"&&<div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,.78fr)] gap-4">
      <section className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3"><div className="avatar" style={{width:54,height:54,background:agent.color+"22",color:agent.color}}><UserRound size={22}/></div><div><div className="eyebrow">{agent.area} · Despacho privado</div><h2 className="text-lg font-semibold mt-1">{agent.name}</h2><div className="text-xs text-slate-500 mt-1">{agent.role}</div></div></div>
          <button className="ghost-button !p-2" onClick={()=>setView("rooms")} aria-label="Cerrar despacho"><X size={16}/></button>
        </div>
        <div className="flex gap-2 mt-6 border-b pb-3" style={{borderColor:"var(--line)"}}>
          <button className={tab==="profile"?"action-button":"ghost-button"} onClick={()=>setTab("profile")}><UserRound size={13}/>Perfil</button>
          <button className={tab==="chat"?"action-button":"ghost-button"} onClick={()=>setTab("chat")}><MessageSquare size={13}/>Hablar con el agente</button>
          <button className={tab==="tasks"?"action-button":"ghost-button"} onClick={()=>setTab("tasks")}><ClipboardList size={13}/>Tareas ({agentTasks.length})</button>
        </div>
        {tab==="profile"&&<div className="pt-5 space-y-5">
          <div><div className="text-xs font-semibold mb-2">Misión del puesto</div><p className="text-sm leading-relaxed text-slate-400">{agent.mission}</p></div>
          <div><div className="text-xs font-semibold mb-3">Responsabilidades</div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{agent.duties.map(d=><div key={d} className="rounded-lg p-3 text-xs text-slate-300 flex gap-2" style={{background:"rgba(255,255,255,.025)",border:"1px solid var(--line)"}}><CheckCircle2 size={14} style={{color:agent.color,flexShrink:0}}/>{d}</div>)}</div></div>
          <div><div className="text-xs font-semibold mb-3">Especialidades</div><div className="flex flex-wrap gap-2">{agent.tools.map(t=><span key={t} className="pill pill-idle">{t}</span>)}</div></div>
          <div className="rounded-lg p-3 flex gap-2 text-xs text-slate-400" style={{background:"rgba(98,213,208,.05)",border:"1px solid rgba(98,213,208,.12)"}}><ShieldCheck size={15} className="text-teal-300 shrink-0"/>Este agente prepara trabajo y propuestas. No envía mensajes, realiza pagos ni modifica sistemas externos por su cuenta.</div>
          <div className="flex flex-wrap gap-2"><button className="action-button" onClick={()=>setTab("chat")}><MessageSquare size={14}/>Dar una instrucción</button><button className="ghost-button" onClick={()=>setTab("tasks")}><ClipboardList size={14}/>Asignar una tarea</button></div>
        </div>}
        {tab==="chat"&&<div className="pt-4">
          <div className="rounded-lg p-3 mb-3 text-[11px] text-slate-400" style={{background:"rgba(98,213,208,.05)"}}>Conversación privada con {agent.name}. Requiere un servidor local compatible con la API de OpenAI activo en este equipo.</div>
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {lines.length===0&&<div className="text-center py-10 text-xs text-slate-500">Todavía no hay mensajes. Escribe una instrucción para empezar.</div>}
            {lines.map((line,i)=><div key={i} className={"rounded-xl p-3 text-xs leading-relaxed whitespace-pre-wrap "+(line.role==="user"?"ml-8 text-slate-100":"mr-5 text-slate-300")} style={{background:line.role==="user"?"rgba(98,213,208,.12)":"rgba(255,255,255,.04)",border:"1px solid var(--line)"}}><div className="text-[9px] uppercase tracking-wider text-slate-500 mb-2">{line.role==="user"?"Tú":agent.name}</div>{line.content}</div>)}
          </div>
          {error&&<div className="mt-3 text-xs text-amber-300 rounded-lg p-3" style={{background:"rgba(218,171,85,.08)"}}>{error}</div>}
          <div className="flex gap-2 mt-4"><textarea className="input-dark min-h-[76px] resize-y" placeholder={"Escribe una instrucción para "+agent.name+"..."} value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}}/><button className="action-button self-end !px-3 !py-3" disabled={sending||!message.trim()} onClick={sendMessage}>{sending?<LoaderCircle size={15} className="animate-spin"/>:<Send size={15}/>}</button></div>
          <div className="text-[10px] text-slate-600 mt-2">{model?"Modelo activo: "+model:"Modelo local configurado · Sin API de pago"}</div>
        </div>}
        {tab==="tasks"&&<div className="pt-5">
          <div className="text-sm font-semibold mb-1">Bandeja de trabajo</div><p className="text-xs text-slate-500 mb-4">Asigna trabajo a este especialista. Las tareas se guardan en este navegador.</p>
          <div className="flex gap-2"><input className="input-dark" placeholder="Nueva tarea o entregable..." value={taskTitle} onChange={e=>setTaskTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTask()}/><button className="action-button !px-3" onClick={addTask} disabled={!taskTitle.trim()}><Send size={14}/></button></div>
          <div className="mt-4">{agentTasks.map(task=><div key={task.id} className="task-row"><input type="checkbox" className="task-check" checked={task.done} onChange={()=>setTasks(current=>current.map(t=>t.id===task.id?{...t,done:!t.done}:t))}/><span className={"text-xs flex-1 "+(task.done?"line-through text-slate-600":"text-slate-200")}>{task.title}</span><span className="text-[9px] text-slate-600">{task.done?"Hecha":"Pendiente"}</span></div>)}</div>
          {agentTasks.length===0&&<div className="text-xs text-slate-500 text-center py-8">Este trabajador todavía no tiene tareas asignadas.</div>}
        </div>}
      </section>
      <aside className="space-y-4">
        <div className="panel p-5"><div className="text-sm font-semibold">Estado del despacho</div><div className="flex items-center justify-between mt-4"><span className="text-xs text-slate-500">Tareas pendientes</span><span className="text-lg font-semibold">{agentTasks.filter(t=>!t.done).length}</span></div><div className="flex items-center justify-between mt-3"><span className="text-xs text-slate-500">Tareas completadas</span><span className="text-lg font-semibold">{agentTasks.filter(t=>t.done).length}</span></div><div className="flex items-center justify-between mt-3"><span className="text-xs text-slate-500">Mensajes guardados</span><span className="text-lg font-semibold">{lines.length}</span></div></div>
        <div className="panel p-5"><div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={15} className="text-teal-300"/>Permisos del agente</div><p className="text-xs text-slate-500 leading-relaxed mt-3">Puede analizar instrucciones, redactar, investigar con la información que le facilites y preparar entregables. No tiene acceso automático a correo, WhatsApp, bancos, clientes ni repositorios.</p></div>
        <div className="panel p-5"><div className="text-sm font-semibold mb-2">Acceso rápido al equipo</div><div className="space-y-1">{staff.map((person,index)=><button key={person.id} onClick={()=>enterRoom(index)} className="w-full flex items-center gap-2 rounded-lg p-2 text-left hover:bg-white/5"><span className="w-2 h-2 rounded-full" style={{background:person.color}}/><span className="text-xs text-slate-300 flex-1">{person.name}</span>{selected===index&&<span className="text-[9px] text-teal-300">Abierto</span>}</button>)}</div></div>
      </aside>
    </div>}
    <p className="text-[10px] text-slate-600">La actividad y las tareas se guardan localmente en este navegador. Para que los agentes respondan, ejecuta la aplicación y GPT4All en el mismo ordenador; una web alojada en Vercel no puede conectarse directamente a tu Mac.</p>
  </div>;
}
