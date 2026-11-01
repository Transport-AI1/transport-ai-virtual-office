"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";

const agents = [
  { name: "Director de operaciones", area: "Dirección", color: "#70d8d0" },
  { name: "Director comercial", area: "Comercial", color: "#e5bd78" },
  { name: "Marketing", area: "Marketing", color: "#c59af0" },
  { name: "Relaciones comerciales", area: "Clientes", color: "#86b8ed" },
  { name: "Ingeniero de software", area: "Tecnología", color: "#71c6a2" },
  { name: "Diseñador creativo", area: "Creatividad", color: "#ed9bb5" },
  { name: "Analista de investigación", area: "Investigación", color: "#8bc7d8" },
  { name: "Administración y finanzas", area: "Administración", color: "#d8c17e" },
  { name: "Seguridad y calidad", area: "Seguridad", color: "#a6b4c8" },
];

function Desk({ x, z, index, selected, onSelect }: any) {
  const color = agents[index].color;
  return <group position={[x, 0, z]} onClick={(e) => { e.stopPropagation(); onSelect(index); }}>
    <mesh position={[0, 0.58, 0]} castShadow><boxGeometry args={[1.35, 0.13, 0.8]} /><meshStandardMaterial color={selected ? "#315b60" : "#263847"} /></mesh>
    {[[-.55,.28,-.29],[.55,.28,-.29],[-.55,.28,.29],[.55,.28,.29]].map((p:any,i:number)=><mesh key={i} position={p}><boxGeometry args={[.07,.55,.07]} /><meshStandardMaterial color="#607382" /></mesh>)}
    <mesh position={[0, .98, -.22]} castShadow><boxGeometry args={[.53,.55,.07]} /><meshStandardMaterial color="#101b27" /></mesh>
    <mesh position={[0,.98,-.18]}><planeGeometry args={[.45,.46]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.3} /></mesh>
    <mesh position={[.38,.7,.12]}><cylinderGeometry args={[.1,.1,.08,16]} /><meshStandardMaterial color="#579a78" /></mesh>
  </group>;
}

function Label({ children, position }: any) {
  return <mesh position={position}><boxGeometry args={[2.6,.04,.04]} /><meshStandardMaterial color="#64cfc8" emissive="#287d7a" emissiveIntensity={.4} /></mesh>;
}

function Scene({ selected, onSelect }: any) {
  return <>
    <ambientLight intensity={1.25} />
    <directionalLight position={[7,12,8]} intensity={2.1} castShadow />
    <pointLight position={[-7,4,-5]} intensity={35} color="#48bcb4" distance={18} />
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.06,0]} receiveShadow><planeGeometry args={[19,14]} /><meshStandardMaterial color="#15232f" /></mesh>
    <gridHelper args={[19,38,"#2c4350","#203341"]} position={[0,.005,0]} />
    {agents.map((a,i)=><Desk key={i} x={-6+(i%3)*6} z={-2.4+Math.floor(i/3)*2.5} index={i} selected={selected===i} onSelect={onSelect} />)}
    <mesh position={[-6.5,.5,-5]} castShadow><boxGeometry args={[3.5,1,2]} /><meshStandardMaterial color="#31525a" /></mesh>
    <mesh position={[0,.22,-5]} castShadow><cylinderGeometry args={[1.3,1.3,.4,32]} /><meshStandardMaterial color="#657d89" /></mesh>
    <mesh position={[6.5,.65,-5]} castShadow><boxGeometry args={[3.3,1.3,2]} /><meshStandardMaterial color="#3b344e" /></mesh>
    <mesh position={[-6.5,.08,4.2]}><boxGeometry args={[4.3,.16,3.3]} /><meshStandardMaterial color="#253847" /></mesh>
    <mesh position={[0,.08,4.2]}><boxGeometry args={[5.3,.16,3.3]} /><meshStandardMaterial color="#253847" /></mesh>
    <mesh position={[6.5,.08,4.2]}><boxGeometry args={[4.3,.16,3.3]} /><meshStandardMaterial color="#253847" /></mesh>
    <OrbitControls makeDefault minDistance={9} maxDistance={27} maxPolarAngle={1.48} target={[0,0,0]} />
  </>;
}

export default function Office3D() {
  const [selected,setSelected] = useState(0);
  const agent = agents[selected];
  return <div className="space-y-4">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><div className="eyebrow">Entorno tridimensional</div><h1 className="page-title">La oficina de Transport AI</h1><p className="subtle">Gira la cámara, acércate y selecciona los puestos de cada agente.</p></div><span className="pill pill-ready"><span className="dot" />3D interactivo</span></div>
    <div className="panel overflow-hidden" style={{height:"min(68vh,680px)",minHeight:440}}>
      <Canvas shadows camera={{position:[13,13,16],fov:42}} dpr={[1,1.5]}>
        <color attach="background" args={["#0b131c"]} />
        <fog attach="fog" args={["#0b131c",19,34]} />
        <Scene selected={selected} onSelect={setSelected} />
      </Canvas>
      <div className="px-4 py-3 text-[10px] text-slate-500">Arrastra para girar · Rueda para acercar · Haz clic en un puesto para seleccionar al agente</div>
    </div>
    <div className="panel p-4 flex items-center gap-3">
      <div className="avatar" style={{background:agent.color+"22",color:agent.color,width:46,height:46}}>{String(selected+1).padStart(2,"0")}</div>
      <div><div className="text-[10px] text-slate-500 uppercase tracking-widest">Puesto seleccionado</div><div className="text-sm font-semibold mt-1">{agent.name}</div><div className="text-xs text-slate-500 mt-1">{agent.area}</div></div>
      <div className="ml-auto text-right"><div className="text-sm font-semibold">9 puestos</div><div className="text-xs text-slate-500">6 áreas de trabajo</div></div>
    </div>
    <p className="text-[10px] text-slate-600">Primera versión del espacio 3D. Los agentes todavía no trabajan de forma autónoma.</p>
  </div>;
}
