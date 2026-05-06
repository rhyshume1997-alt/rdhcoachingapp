import { useState, useEffect, useRef, useMemo } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

(() => { try { const l=document.createElement("link"); l.rel="stylesheet"; l.href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,700&display=swap"; document.head.appendChild(l); } catch(e){} })();

const C = {
  bg:"#09090E", dark2:"#0F0F16", dark3:"#15151E", dark4:"#1C1C28", mid:"#252535",
  blue:"#5271FF", purple:"#C46BE4", gold:"#AB8B00", pink:"#F8CAFF", white:"#FDFDFD",
  muted:"#7777A0", sub:"#4A4A68", green:"#22C55E", red:"#EF4444",
  grad:"linear-gradient(135deg,#5271FF 0%,#C46BE4 100%)",
};
const glass=(a=0.04)=>`rgba(255,255,255,${a})`;
const border=(a=0.08)=>`1px solid rgba(255,255,255,${a})`;
const glow=(col,s=20)=>`0 0 ${s}px ${col}22`;
const FONT="'DM Sans', sans-serif";
const COACH_PIN="RDH2025";

const Icon=({d,size=18,color="currentColor",fill="none",strokeWidth=1.5,style={}})=>(
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}}>
    {Array.isArray(d)?d.map((p,i)=><path key={i} d={p}/>):<path d={d}/>}
  </svg>
);
const Icons={
  home:"M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z M9 21V12h6v9",
  dumbbell:["M6.5 6.5h2m7 0h2M6.5 17.5h2m7 0h2","M2 12h4m12 0h4","M6 9.5V6.5a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1H7a1 1 0 01-1-1V9.5z","M14 9.5V6.5a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1h-2a1 1 0 01-1-1V9.5z"],
  calendar:"M8 2v3m8-3v3M3.5 8.5h17M4 5h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z M8 13h.01M12 13h.01M16 13h.01",
  check:"M4 12.5L9 17.5l11-11",
  checkBox:["M4 12.5L9 17.5l11-11","M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z"],
  chart:"M3 17l4.5-5 4 3.5 5-7 4.5 4M3 21h18",
  people:["M16 11a4 4 0 10-8 0","M17 20c0-2.21-2.239-4-5-4s-5 1.79-5 4","M19 8a3 3 0 110-6","M21 20c0-1.657-1.343-3-3-3"],
  clipboard:"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2 M9 12h6M9 16h4",
  logout:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  back:"M19 12H5m0 0l7 7m-7-7l7-7",
  plus:"M12 5v14M5 12h14", minus:"M5 12h14",
  trash:"M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  search:"M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  clock:"M12 22a10 10 0 100-20 10 10 0 000 20z M12 6v6l4 2",
  bolt:"M13 2L4.5 13.5H12L11 22l8.5-11.5H13L13 2z",
  photo:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  lock:"M12 14v3m0 3h3m-3 0H9M5 10V7a7 7 0 0114 0v3M3 10h18a1 1 0 011 1v9a1 1 0 01-1 1H3a1 1 0 01-1-1v-9a1 1 0 011-1z",
  weight:"M12 3a2 2 0 100 4 2 2 0 000-4z M7 7h10l2 14H5L7 7z",
  note:"M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5 M14 3h7v7M10 14L21 3",
  chevronR:"M9 18l6-6-6-6",
  food:"M18 8h1a4 4 0 010 8h-1 M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z M6 1v3M10 1v3M14 1v3",
  trophy:"M8 21h8m-4-4v4M6 3H4v4a4 4 0 008 0V3H6zm12 0h-2v4a4 4 0 01-8 0",
  crown:"M2 20h20M4 20l2-8 5 3 1-6 1 6 5-3 2 8",
  target:"M12 22a10 10 0 100-20 10 10 0 000 20z M12 18a6 6 0 100-12 6 6 0 000 12z M12 14a2 2 0 100-4 2 2 0 000 4z",
  flame:"M12 2s-5 4-5 9a5 5 0 0010 0c0-5-5-9-5-9z",
  run:"M13 4a1 1 0 100-2 1 1 0 000 2z M5.5 16l2-6m11 6l-4-7-3 4-3-2",
  tier:"M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  steps:"M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12",
  water:"M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
  sleep:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  sparkle:"M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z",
  medal:"M12 15a6 6 0 100-12 6 6 0 000 12z M8.21 13.89L7 23l5-3 5 3-1.21-9.12",
};

// Tiers
const TIERS = {
  foundation:  {id:"foundation",  name:"The Foundation",  color:"#6B7280", icon:"tier", desc:"Building consistent habits and fundamentals."},
  standard:    {id:"standard",    name:"The Standard",    color:"#7777A0", icon:"tier", desc:"Weekly accountability and routine."},
  performer:   {id:"performer",   name:"The Performer",   color:"#5271FF", icon:"tier", desc:"Performance-focused with detailed nutrition."},
  self_leader: {id:"self_leader", name:"The Self-Leader", color:"#C46BE4", icon:"tier", desc:"High autonomy with coach oversight."},
  peak:        {id:"peak",        name:"Peak Protocol",   color:"#AB8B00", icon:"crown",desc:"Elite-level: physical, psychological, lifestyle."},
};
const TIER_ORDER=["foundation","standard","performer","self_leader","peak"];

// Tier habits
const TIER_HABITS={
  foundation:[{id:"tf1",name:"Log weight",icon:"weight"},{id:"tf2",name:"Log sleep",icon:"sleep"},{id:"tf3",name:"Hit steps goal",icon:"steps"},{id:"tf4",name:"Train today",icon:"dumbbell"},{id:"tf5",name:"Check stress",icon:"star"},{id:"tf6",name:"Log mood",icon:"sparkle"},{id:"tf7",name:"One win today",icon:"flame"}],
  standard:[{id:"ts1",name:"Train today",icon:"dumbbell"},{id:"ts2",name:"Log weight",icon:"weight"},{id:"ts3",name:"Log sleep",icon:"sleep"},{id:"ts4",name:"Hit steps goal",icon:"steps"},{id:"ts5",name:"Hit fluid target",icon:"water"},{id:"ts6",name:"Log mood",icon:"sparkle"},{id:"ts7",name:"Note challenge",icon:"note"}],
  performer:[{id:"tp1",name:"Log weight",icon:"weight"},{id:"tp2",name:"Train today",icon:"dumbbell"},{id:"tp3",name:"Hit steps goal",icon:"steps"},{id:"tp4",name:"Hit calorie target",icon:"food"},{id:"tp5",name:"Hit protein target",icon:"bolt"},{id:"tp6",name:"Log gym performance",icon:"chart"},{id:"tp7",name:"Win + adjustment",icon:"note"}],
  self_leader:[{id:"sl1",name:"Log weight",icon:"weight"},{id:"sl2",name:"Log sleep",icon:"sleep"},{id:"sl3",name:"Hit steps goal",icon:"steps"},{id:"sl4",name:"Adherence to plan",icon:"checkBox"},{id:"sl5",name:"Hit protein target",icon:"bolt"},{id:"sl6",name:"Log macros",icon:"food"},{id:"sl7",name:"Tomorrow's decision",icon:"note"}],
  peak:[{id:"pk1",name:"Log weight",icon:"weight"},{id:"pk2",name:"Log sleep",icon:"sleep"},{id:"pk3",name:"Hit steps goal",icon:"steps"},{id:"pk4",name:"Training prescribed",icon:"dumbbell"},{id:"pk5",name:"Hit calorie target",icon:"food"},{id:"pk6",name:"Hit protein target",icon:"bolt"},{id:"pk7",name:"Self-talk check-in",icon:"sparkle"},{id:"pk8",name:"Body image check-in",icon:"star"}],
};

// Form helpers
const SELECT_FIELD=(id,label,options)=>({id,label,type:"select",options});
const NUM_FIELD=(id,label,unit="",placeholder="")=>({id,label,type:"number",unit,placeholder});
const TEXT_FIELD=(id,label,placeholder="",optional=false)=>({id,label,type:"text",placeholder,optional});
const AREA_FIELD=(id,label,placeholder="",optional=true)=>({id,label,type:"textarea",placeholder,optional});
const BOOL_FIELD=(id,label)=>({id,label,type:"select",options:["Yes","No"]});
const SCALE_FIELD=(id,label,min=1,max=10)=>({id,label,type:"scale",min,max});
const DAYS_FIELD=(id,label)=>({id,label,type:"days"});
const PHOTO_FIELD=()=>({id:"photos",label:"Progress Photos",type:"photos",optional:true});

const TIER_FORMS={
  foundation:{
    daily:[NUM_FIELD("weight","Weight","lbs"),NUM_FIELD("sleep","Sleep last night","hrs","e.g. 7.5"),NUM_FIELD("steps","Steps"),BOOL_FIELD("trained","Trained today?"),SELECT_FIELD("stress","Stress levels?",["Low","Medium","High"]),SCALE_FIELD("hunger","Hunger? (10=extreme)",1,10),SELECT_FIELD("mood","Overall mood?",["Happy","Decent","Low"]),AREA_FIELD("win","One thing you did well today?","e.g. Hit all meals on time",false)],
    weekly:[SELECT_FIELD("weekFeel","How did the week feel overall?",["Happy","Decent","Low"]),TEXT_FIELD("gymWin","Biggest gym win?","e.g. New squat PB",false),TEXT_FIELD("lifeWin","Biggest life win?","e.g. Slept well all week",false),SELECT_FIELD("workoutFeel","How did workouts feel?",["Easy","Manageable","Challenging","Tough but got it done"]),SELECT_FIELD("blocker","Anything get in the way?",["Training","Nutrition","Life"]),SELECT_FIELD("stress","Stress this week?",["Low","Medium","High"]),SELECT_FIELD("bodyFeel","How do you feel about your body?",["Proud","In the middle","Struggling"]),AREA_FIELD("commit","One behaviour you're locking in next week","",false),SELECT_FIELD("confidence","Confidence in progress?",["Confident","Very confident","Still finding my feet"]),PHOTO_FIELD()],
  },
  standard:{
    daily:[BOOL_FIELD("trained","Trained today?"),NUM_FIELD("weight","Weight","lbs"),NUM_FIELD("sleep","Sleep","hrs"),NUM_FIELD("steps","Steps"),NUM_FIELD("fluids","Fluid intake","litres"),SELECT_FIELD("mood","Overall mood?",["Happy","Decent","Low"]),SCALE_FIELD("hunger","Hunger? (10=extreme)",1,10),AREA_FIELD("challenge","What challenged your routine?","Optional",true)],
    weekly:[SELECT_FIELD("weekFeel","How did the week feel?",["Great","Decent","Tough"]),SELECT_FIELD("trainConsistency","Training consistency?",["100%","80%","60%","Less than 50%"]),SELECT_FIELD("steps","Steps goal?",["On target","Mostly","Off target"]),SELECT_FIELD("sleep","Sleep quality?",["Good","Mixed","Poor"]),SELECT_FIELD("stress","Stress?",["Low","Medium","High"]),TEXT_FIELD("wentWell","What went well to repeat?","",false),AREA_FIELD("gotInWay","What got in the way - is it a pattern?","",false),TEXT_FIELD("lockIn","One behaviour locking in next week","",false),SELECT_FIELD("confidence","Confidence?",["Very confident","Confident","Not confident yet - and that is okay"]),PHOTO_FIELD()],
  },
  performer:{
    daily:[NUM_FIELD("weight","Weight","lbs"),BOOL_FIELD("trained","Trained today?"),NUM_FIELD("steps","Steps"),NUM_FIELD("calories","Calories","kcal"),NUM_FIELD("protein","Protein","g"),SELECT_FIELD("gymPerf","Gym performance?",["Fantastic","Decent","Poor"]),SCALE_FIELD("hunger","Hunger?",1,10),SCALE_FIELD("stress","Stress?",1,10),SELECT_FIELD("digestion","Digestion?",["Good","Okay","Off"]),AREA_FIELD("winAdjust","Win today + one adjustment tomorrow","",false)],
    weekly:[TEXT_FIELD("bigWin","Biggest win this week?","",false),SELECT_FIELD("weekFeel","Week overall?",["Strong","Steady","Struggled"]),SELECT_FIELD("strength","Strength?",["Stronger","Same","Slightly off"]),AREA_FIELD("trigger","If off - what was the trigger?","Optional",true),SELECT_FIELD("cals","Calories on target?",["Nailed it","Close","Off"]),SELECT_FIELD("hunger","Hunger levels?",["Low","Medium","High"]),SELECT_FIELD("recovery","Recovery?",["Well recovered","Mixed","Accumulated"]),AREA_FIELD("adjustment","ONE thing adjusting next week and why","",false),SELECT_FIELD("confidence","Confidence?",["Very confident","Confident","Need a check-in chat"]),PHOTO_FIELD()],
  },
  self_leader:{
    daily:[NUM_FIELD("weight","Weight","lbs"),NUM_FIELD("sleep","Sleep","hrs"),NUM_FIELD("steps","Steps"),SELECT_FIELD("stress","Stress?",["Low","Medium","High"]),SCALE_FIELD("hunger","Hunger?",1,10),SELECT_FIELD("digestion","Digestion?",["Good","Okay","Off"]),SELECT_FIELD("adherence","Adherence?",["On plan","Mostly","Off"]),NUM_FIELD("protein","Protein","g"),NUM_FIELD("calories","Calories","kcal"),TEXT_FIELD("highlight","Performance highlight today?","",true),AREA_FIELD("tmrw","One decision for tomorrow based on today","",false)],
    weekly:[TEXT_FIELD("highlight","Performance highlight this week?","",false),SELECT_FIELD("recovery","Recovery quality?",["Excellent","Good","Okay","Poor"]),TEXT_FIELD("recoveryDriver","What drove it?","",false),SELECT_FIELD("adherence","Adherence to plan?",["Fully","Mostly","Off"]),AREA_FIELD("decision","If off - decision made, would you again?","Optional",true),SELECT_FIELD("nutrition","Nutrition accuracy?",["On point (>80%)","Close (~60%)","Needs work (<50%)"]),TEXT_FIELD("improved","What improved vs last week?","",false),SCALE_FIELD("sustainable","How sustainable is your plan? (1=burning out, 10=forever)",1,10),AREA_FIELD("coachFocus","Where do you need my eyes most this week?","",false),PHOTO_FIELD()],
  },
  peak:{
    daily:[NUM_FIELD("weight","Weight","lbs"),NUM_FIELD("sleep","Sleep","hrs"),NUM_FIELD("steps","Steps"),BOOL_FIELD("trained","Training complete as prescribed?"),NUM_FIELD("calories","Calories","kcal"),NUM_FIELD("protein","Protein","g"),SELECT_FIELD("energy","Energy?",["High","Moderate","Low","Crashing"]),SELECT_FIELD("stress","Stress?",["Low","Medium","High"]),SCALE_FIELD("hunger","Hunger?",1,10),SELECT_FIELD("digestion","Digestion?",["Good","Okay","Off"]),SELECT_FIELD("mood","Mood?",["Positive","Neutral","Down"]),SELECT_FIELD("selfTalk","Self-talk today?",["Mostly Positive","Neutral","Quite Harsh"]),SELECT_FIELD("bodyFeel","Body image today?",["Positive","Neutral","Negative"]),AREA_FIELD("deviations","Any deviations? What and why?","Optional",true),AREA_FIELD("hardest","Hardest thing managed today?","",false)],
    weekly:[DAYS_FIELD("daysOnPlan","Days fully on plan?"),SELECT_FIELD("training","Training/cardio/steps as prescribed?",["Yes","Partially","No"]),AREA_FIELD("trainingWhy","If no - why?","Optional",true),SELECT_FIELD("nutrition","Nutrition accuracy?",["On point (>90%)","Small deviations","Significantly off"]),NUM_FIELD("sleep","Avg sleep per night","hrs"),SELECT_FIELD("energy","Energy?",["High","Moderate","Low","Crashing"]),SELECT_FIELD("digestion","Digestion?",["Normal","Inconsistent","Poor"]),SELECT_FIELD("retention","Bloating/water retention?",["Recovered","Lingering","Accumulating"]),SELECT_FIELD("selfTalk","Self-talk this week?",["Mostly Positive","Neutral","Quite Harsh"]),SELECT_FIELD("bodyImage","Body image?",["Positive","Neutral","Negative"]),AREA_FIELD("bodyImageNote","Tell me more if negative:","Optional",true),BOOL_FIELD("restrict","Urge to restrict or do extra cardio?"),AREA_FIELD("restrictWhy","If yes - what triggered it?","Optional",true),AREA_FIELD("hardest","Hardest thing to stick to?","",false),AREA_FIELD("unsustainable","Anything unsustainable? (blank if no)","Optional",true),PHOTO_FIELD()],
  },
};

const MEAL_SLOTS=["Breakfast","Mid Morning","Lunch","Pre-Workout","Dinner","Evening Snack"];
const CONTENT_CATS=["General","Nutrition","Training","Mindset","Recovery","Check-In Guide"];

const PHASE_TYPES=[
  {id:"FAT LOSS",           label:"Fat Loss",          goal:"DEFICIT",     color:"#EF4444", defaultRol:1.0},
  {id:"MAINTENANCE",        label:"Maintenance",        goal:"MAINTENANCE", color:"#F59E0B", defaultRol:0},
  {id:"METABOLIC IMPROVEMENT", label:"Met. Improvement", goal:"MAINTENANCE", color:"#F97316", defaultRol:0},
  {id:"IMPROVEMENT",        label:"Improvement",        goal:"SURPLUS",     color:"#3B82F6", defaultRol:0.35},
  {id:"PEAK WEEK",          label:"Peak Week",           goal:"PEAK",        color:"#8B5CF6", defaultRol:0},
  {id:"DIET BREAK",         label:"Diet Break",          goal:"MAINTENANCE", color:"#10B981", defaultRol:0},
];
const phaseColor=id=>PHASE_TYPES.find(p=>p.id===id)?.color||"#7777A0";

// Psychological rewards
const VOLUME_REFS=[{kg:100,name:"a small piano section"},{kg:500,name:"a baby horse"},{kg:1000,name:"a small car"},{kg:2000,name:"a VW Golf"},{kg:3000,name:"a Range Rover"},{kg:5000,name:"an elephant"},{kg:10000,name:"a double-decker bus"},{kg:20000,name:"a humpback whale"}];
const getVolumeRef=kg=>{let r=null;for(const ref of VOLUME_REFS){if(kg>=ref.kg)r=ref;}return r;};
const WEIGHT_REFS=[{kg:0.5,desc:"a can of beans"},{kg:1,desc:"a bag of sugar"},{kg:2,desc:"two bags of flour"},{kg:5,desc:"a bowling ball"},{kg:7,desc:"a car tyre"},{kg:10,desc:"a large bag of dog food"},{kg:15,desc:"a microwave"},{kg:20,desc:"a large suitcase"},{kg:30,desc:"a small child"}];
const getWeightRef=kg=>{let r=null;for(const ref of WEIGHT_REFS){if(kg>=ref.kg)r=ref;}return r;};
const PB_MESSAGES=["New personal best. That weight didn't exist in your world before today.","PB locked in. Your ceiling just became someone else's goal.","That's a record. You just got stronger than you've ever been.","Personal best. The version of you from last month can't touch this.","New record set. This is what consistent effort looks like."];
const STREAK_MSGS={3:"Three days in. Consistency is a decision, not a feeling.",7:"Seven days. One full week of standards being met.",14:"Fourteen days. Two weeks of showing up.",21:"Three weeks. Habits are forming.",30:"30 days. One month of discipline. This is who you are now.",60:"60 days. Two months in. Elite consistency.",90:"90 days. This is not a phase. This is your life."};

// Exercise categories
const CATS=["All","Chest","Back","Shoulders","Biceps","Triceps","Legs","Core","Cardio"];
const EQUIPS=["Barbell","Dumbbell","Cable","Machine","Bodyweight","Other"];
const CAT_COLOR={Chest:"#5271FF",Back:"#C46BE4",Shoulders:"#AB8B00",Biceps:"#22C55E",Triceps:"#EF4444",Legs:"#FF6B6B",Core:"#4ECDC4",Cardio:"#F8CAFF"};

const BASE_EX=[
  // ── CHEST ──────────────────────────────────────────────────────────────────
  {id:"e1",name:"Bench Press",cat:"Chest",equip:"Barbell",muscles:"Chest - Triceps - Front Delts"},
  {id:"e2",name:"Incline Bench Press",cat:"Chest",equip:"Barbell",muscles:"Upper Chest - Triceps"},
  {id:"e3",name:"Dumbbell Incline Chest Press",cat:"Chest",equip:"Dumbbell",muscles:"Upper Chest - Triceps"},
  {id:"e4",name:"Low Incline Dumbbell Press",cat:"Chest",equip:"Dumbbell",muscles:"Mid Chest - Triceps"},
  {id:"e5",name:"Cable Chest Press",cat:"Chest",equip:"Cable",muscles:"Chest - Triceps"},
  {id:"e6",name:"Cuffed Cable Fly",cat:"Chest",equip:"Cable",muscles:"Chest"},
  {id:"e7",name:"Incline Cuffed Cable Fly",cat:"Chest",equip:"Cable",muscles:"Upper Chest"},
  {id:"e8",name:"Pin Loaded Chest Press",cat:"Chest",equip:"Machine",muscles:"Chest - Triceps"},
  {id:"e9",name:"Prime Lying Chest Press",cat:"Chest",equip:"Machine",muscles:"Chest"},
  {id:"e10",name:"Pin Loaded Pec Dec",cat:"Chest",equip:"Machine",muscles:"Chest"},
  {id:"e11",name:"Hammer Strength Incline Chest Press",cat:"Chest",equip:"Machine",muscles:"Upper Chest"},
  {id:"e12",name:"Smith Machine Chest Press",cat:"Chest",equip:"Machine",muscles:"Chest - Triceps"},
  {id:"e13",name:"Incline Smith Machine Chest Press",cat:"Chest",equip:"Machine",muscles:"Upper Chest"},
  {id:"e14",name:"High Incline Smith Press",cat:"Chest",equip:"Machine",muscles:"Upper Chest"},
  {id:"e15",name:"Push Up",cat:"Chest",equip:"Bodyweight",muscles:"Chest - Triceps"},
  {id:"e16",name:"Dips",cat:"Chest",equip:"Bodyweight",muscles:"Chest - Triceps"},
  // ── BACK ───────────────────────────────────────────────────────────────────
  {id:"e20",name:"Deadlift",cat:"Back",equip:"Barbell",muscles:"Lower Back - Hamstrings - Traps"},
  {id:"e21",name:"Bent Over Barbell Row",cat:"Back",equip:"Barbell",muscles:"Mid Back - Lats - Biceps"},
  {id:"e22",name:"T Bar Row",cat:"Back",equip:"Barbell",muscles:"Upper Back - Lats"},
  {id:"e23",name:"Pull Ups",cat:"Back",equip:"Bodyweight",muscles:"Lats - Biceps"},
  {id:"e24",name:"Straight Bar Lat Pulldown",cat:"Back",equip:"Cable",muscles:"Lats - Biceps"},
  {id:"e25",name:"Pin Loaded Neutral Lat Pulldown",cat:"Back",equip:"Machine",muscles:"Lats - Biceps"},
  {id:"e26",name:"Neutral Grip Lat Pulldown",cat:"Back",equip:"Cable",muscles:"Lats - Biceps"},
  {id:"e27",name:"Single Arm Cable Lat Pulldown",cat:"Back",equip:"Cable",muscles:"Lats"},
  {id:"e28",name:"Plate Loaded Single Arm Lat Pulldown",cat:"Back",equip:"Machine",muscles:"Lats"},
  {id:"e29",name:"Single Arm Pin Loaded Lat Biased Row",cat:"Back",equip:"Machine",muscles:"Lats"},
  {id:"e30",name:"D Handle Cable Row (Lat Biased)",cat:"Back",equip:"Cable",muscles:"Lats - Mid Back"},
  {id:"e31",name:"D Handle Cable Upper Back Row",cat:"Back",equip:"Cable",muscles:"Upper Back - Traps"},
  {id:"e32",name:"Incline Cable Pullover",cat:"Back",equip:"Cable",muscles:"Lats - Serratus"},
  {id:"e33",name:"Long Rope Cable Lat Pullover",cat:"Back",equip:"Cable",muscles:"Lats"},
  {id:"e34",name:"Plate Loaded Low Row",cat:"Back",equip:"Machine",muscles:"Mid Back - Lats"},
  {id:"e35",name:"Plate Loaded Single Arm Row",cat:"Back",equip:"Machine",muscles:"Lats - Mid Back"},
  {id:"e36",name:"Prime Plate Loaded Upper Back Row",cat:"Back",equip:"Machine",muscles:"Upper Back - Traps"},
  {id:"e37",name:"Single Arm Nautilus Lat Biased Row",cat:"Back",equip:"Machine",muscles:"Lats"},
  {id:"e38",name:"Hammer Strength Single Arm Thoracic Lat Row",cat:"Back",equip:"Machine",muscles:"Lats - Upper Back"},
  {id:"e39",name:"Chest Supported Dumbbell Row",cat:"Back",equip:"Dumbbell",muscles:"Mid Back - Lats"},
  // ── SHOULDERS ──────────────────────────────────────────────────────────────
  {id:"e40",name:"Overhead Press",cat:"Shoulders",equip:"Barbell",muscles:"Front Delts - Side Delts"},
  {id:"e41",name:"Smith Machine Shoulder Press",cat:"Shoulders",equip:"Machine",muscles:"Front Delts - Side Delts"},
  {id:"e42",name:"Cybex Plate Loaded Shoulder Press",cat:"Shoulders",equip:"Machine",muscles:"Front Delts - Side Delts"},
  {id:"e43",name:"Chest Supported Dumbbell Lateral Raise",cat:"Shoulders",equip:"Dumbbell",muscles:"Side Delts"},
  {id:"e44",name:"Lying Cable Cuffed Lateral Raise",cat:"Shoulders",equip:"Cable",muscles:"Side Delts"},
  {id:"e45",name:"Single Arm Cable Cuffed Lateral Raise",cat:"Shoulders",equip:"Cable",muscles:"Side Delts"},
  {id:"e46",name:"Standing Pin Loaded Lateral Raise",cat:"Shoulders",equip:"Machine",muscles:"Side Delts"},
  {id:"e47",name:"Behind The Back Cable Lateral Raise",cat:"Shoulders",equip:"Cable",muscles:"Side Delts"},
  {id:"e48",name:"Cuffed Cable Rear Delt Fly",cat:"Shoulders",equip:"Cable",muscles:"Rear Delts"},
  {id:"e49",name:"Pin Loaded Rear Delt Fly",cat:"Shoulders",equip:"Machine",muscles:"Rear Delts"},
  {id:"e50",name:"Face Pull",cat:"Shoulders",equip:"Cable",muscles:"Rear Delts - External Rotators"},
  // ── BICEPS ─────────────────────────────────────────────────────────────────
  {id:"e55",name:"Barbell Curl",cat:"Biceps",equip:"Barbell",muscles:"Biceps"},
  {id:"e56",name:"Dumbbell Hammer Curl",cat:"Biceps",equip:"Dumbbell",muscles:"Biceps - Brachialis"},
  {id:"e57",name:"Incline Dumbbell Curl",cat:"Biceps",equip:"Dumbbell",muscles:"Biceps - Long Head"},
  {id:"e58",name:"Behind The Body Cable Curl",cat:"Biceps",equip:"Cable",muscles:"Biceps - Long Head"},
  {id:"e59",name:"Standing EZ Bar Cable Curl",cat:"Biceps",equip:"Cable",muscles:"Biceps"},
  {id:"e60",name:"Single Arm Cable Preacher Curl",cat:"Biceps",equip:"Cable",muscles:"Biceps - Short Head"},
  {id:"e61",name:"Single Arm Pin Loaded Preacher Curl",cat:"Biceps",equip:"Machine",muscles:"Biceps"},
  {id:"e62",name:"Plate Loaded Preacher Curl",cat:"Biceps",equip:"Machine",muscles:"Biceps - Short Head"},
  // ── TRICEPS ────────────────────────────────────────────────────────────────
  {id:"e65",name:"Tricep Pushdown",cat:"Triceps",equip:"Cable",muscles:"Triceps"},
  {id:"e66",name:"Long Rope Tricep Extension",cat:"Triceps",equip:"Cable",muscles:"Triceps - Long Head"},
  {id:"e67",name:"Long Rope Overhead Tricep Extension",cat:"Triceps",equip:"Cable",muscles:"Triceps - Long Head"},
  {id:"e68",name:"Over Shoulder Cable Tricep Extension",cat:"Triceps",equip:"Cable",muscles:"Triceps"},
  {id:"e69",name:"Cable Cross Body Tricep Extension",cat:"Triceps",equip:"Cable",muscles:"Triceps - Lateral Head"},
  {id:"e70",name:"Skull Crusher",cat:"Triceps",equip:"Barbell",muscles:"Triceps"},
  {id:"e71",name:"Dumbbell Skull Crushers",cat:"Triceps",equip:"Dumbbell",muscles:"Triceps"},
  {id:"e72",name:"Single Arm Cuffed Overhead Tricep Extension",cat:"Triceps",equip:"Cable",muscles:"Triceps - Long Head"},
  {id:"e73",name:"Pin Loaded Tricep Extension",cat:"Triceps",equip:"Machine",muscles:"Triceps"},
  {id:"e74",name:"Plate Loaded Tricep Dip",cat:"Triceps",equip:"Machine",muscles:"Triceps - Chest"},
  // ── LEGS ───────────────────────────────────────────────────────────────────
  {id:"e80",name:"Squat",cat:"Legs",equip:"Barbell",muscles:"Quads - Glutes - Hamstrings"},
  {id:"e81",name:"Smith Machine Squat",cat:"Legs",equip:"Machine",muscles:"Quads - Glutes"},
  {id:"e82",name:"Pendulum Squat",cat:"Legs",equip:"Machine",muscles:"Quads - Glutes"},
  {id:"e83",name:"Reverse Banded Hack Squat",cat:"Legs",equip:"Machine",muscles:"Quads"},
  {id:"e84",name:"45 Degree Leg Press",cat:"Legs",equip:"Machine",muscles:"Quads - Glutes"},
  {id:"e85",name:"Pin Loaded Leg Press",cat:"Legs",equip:"Machine",muscles:"Quads - Glutes"},
  {id:"e86",name:"Pin Loaded Single Leg Leg Press",cat:"Legs",equip:"Machine",muscles:"Quads - Glutes"},
  {id:"e87",name:"Single Leg Leg Press (Quad Biased)",cat:"Legs",equip:"Machine",muscles:"Quads"},
  {id:"e88",name:"Dumbbell Bulgarian Split Squats",cat:"Legs",equip:"Dumbbell",muscles:"Quads - Glutes"},
  {id:"e89",name:"Prime Leg Extension",cat:"Legs",equip:"Machine",muscles:"Quads"},
  {id:"e90",name:"Pin Loaded Leg Extension",cat:"Legs",equip:"Machine",muscles:"Quads"},
  {id:"e91",name:"Barbell Hip Thrust",cat:"Legs",equip:"Barbell",muscles:"Glutes - Hamstrings"},
  {id:"e92",name:"Plate Loaded Hip Thrust",cat:"Legs",equip:"Machine",muscles:"Glutes - Hamstrings"},
  {id:"e93",name:"Smith Machine Hip Thrust",cat:"Legs",equip:"Machine",muscles:"Glutes - Hamstrings"},
  {id:"e94",name:"45 Degree Hip Extension",cat:"Legs",equip:"Machine",muscles:"Glutes - Spinal Erectors"},
  {id:"e95",name:"Barbell Romanian Deadlift",cat:"Legs",equip:"Barbell",muscles:"Hamstrings - Glutes"},
  {id:"e96",name:"Dumbbell Romanian Deadlift",cat:"Legs",equip:"Dumbbell",muscles:"Hamstrings - Glutes"},
  {id:"e97",name:"Stiff Leg Deadlift",cat:"Legs",equip:"Barbell",muscles:"Hamstrings - Glutes - Lower Back"},
  {id:"e98",name:"Pin Loaded Lying Hamstring Curl",cat:"Legs",equip:"Machine",muscles:"Hamstrings"},
  {id:"e99",name:"Plate Loaded Seated Hamstring Curl",cat:"Legs",equip:"Machine",muscles:"Hamstrings"},
  {id:"e100",name:"Pin Loaded Adductor",cat:"Legs",equip:"Machine",muscles:"Adductors - Inner Thigh"},
  {id:"e101",name:"Seated Calf Raise",cat:"Legs",equip:"Machine",muscles:"Soleus - Calves"},
  {id:"e102",name:"Standing Calf Raise",cat:"Legs",equip:"Machine",muscles:"Gastrocnemius - Calves"},
  {id:"e103",name:"Calf Press on Pin Loaded Leg Press",cat:"Legs",equip:"Machine",muscles:"Calves"},
  // ── CORE ───────────────────────────────────────────────────────────────────
  {id:"e110",name:"Cable Ab Crunch",cat:"Core",equip:"Cable",muscles:"Abs"},
  {id:"e111",name:"Machine Ab Crunch",cat:"Core",equip:"Machine",muscles:"Abs"},
  {id:"e112",name:"Hanging Leg Raise",cat:"Core",equip:"Bodyweight",muscles:"Abs - Hip Flexors"},
  {id:"e113",name:"Plank",cat:"Core",equip:"Bodyweight",muscles:"Core - Abs"},
  {id:"e114",name:"Ab Wheel Rollout",cat:"Core",equip:"Other",muscles:"Abs - Lats"},
  // ── CARDIO ─────────────────────────────────────────────────────────────────
  {id:"e120",name:"Ski Erg",cat:"Cardio",equip:"Machine",muscles:"Full Body - Lats - Core"},
  {id:"e121",name:"Rowing Machine",cat:"Cardio",equip:"Machine",muscles:"Full Body - Back - Legs"},
  {id:"e122",name:"Assault Bike",cat:"Cardio",equip:"Machine",muscles:"Full Body"},
  {id:"e123",name:"Treadmill",cat:"Cardio",equip:"Machine",muscles:"Lower Body - Cardiovascular"},
  {id:"e124",name:"Burpees",cat:"Cardio",equip:"Bodyweight",muscles:"Full Body"},
  {id:"e125",name:"Box Jumps",cat:"Cardio",equip:"Other",muscles:"Quads - Glutes - Calves"},
  {id:"e126",name:"Battle Ropes",cat:"Cardio",equip:"Other",muscles:"Shoulders - Core - Cardiovascular"},
  {id:"e127",name:"Sled Push",cat:"Cardio",equip:"Other",muscles:"Quads - Glutes - Calves"},
  {id:"e128",name:"Farmer Carries",cat:"Cardio",equip:"Dumbbell",muscles:"Full Body - Grip - Core"},
  {id:"e129",name:"Kettlebell Swings",cat:"Cardio",equip:"Other",muscles:"Glutes - Hamstrings - Core"},
  {id:"e130",name:"Jump Rope",cat:"Cardio",equip:"Other",muscles:"Calves - Cardiovascular"},
];

const FOOD_DB=[
{"n": "Aldi 5% Fat Skinny Beef Meatballs (12)", "por": "3 Meatballs", "p": 17.0, "c": 3.5, "f": 3.7, "cal": 115},
{"n": "Aldi Basa Lemon & Herb Fillets", "por": "310g", "p": 23.0, "c": 13.0, "f": 9.7, "cal": 231},
{"n": "Aldi Bramwells Golden Breadcrumbs", "por": "50g", "p": 5.4, "c": 37.0, "f": 0.6, "cal": 175},
{"n": "Aldi Specially Selected Halloumi Burgers", "por": "70g", "p": 12.0, "c": 5.1, "f": 15.0, "cal": 203},
{"n": "Alpro Coconut Milk", "por": "100 ml", "p": 0.1, "c": 2.7, "f": 0.9, "cal": 19},
{"n": "Alpro Unsweetened Almond Milk", "por": "100 ml", "p": 0.1, "c": 2.7, "f": 0.9, "cal": 19},
{"n": "Amoy Straight to Wok Medium Noodles", "por": "150g", "p": 9.6, "c": 41.0, "f": 2.1, "cal": 221},
{"n": "Amoy Straight to Wok Singapore Noodles", "por": "150g", "p": 9.6, "c": 33.0, "f": 3.3, "cal": 200},
{"n": "Arla BOB Skimmed Milk (Yellow Top)", "por": "100ml", "p": 4.6, "c": 4.9, "f": 0.4, "cal": 42},
{"n": "Arla Protein Yogurt (1 pot)", "por": "200 grams", "p": 20.0, "c": 13.0, "f": 0.4, "cal": 136},
{"n": "Asda 30% Less Fat Sour Cream & Chive", "por": "50g", "p": 2.0, "c": 3.5, "f": 4.2, "cal": 60},
{"n": "Asda Grated Cheese", "por": "30 grams", "p": 9.3, "c": 0.0, "f": 8.7, "cal": 116},
{"n": "Asda Smoked Ham Slices", "por": "2 slices", "p": 7.0, "c": 0.6, "f": 0.6, "cal": 36},
{"n": "Asda Southern Fried Chicken Mini Fillets", "por": "100 grams", "p": 19.0, "c": 13.0, "f": 10.0, "cal": 218},
{"n": "Asda Spanish Chorizo", "por": "40 grams", "p": 8.8, "c": 1.5, "f": 12.8, "cal": 156},
{"n": "Asda Sweet Chilli Turkey Burger", "por": "100g", "p": 24.0, "c": 5.5, "f": 7.9, "cal": 189},
{"n": "Asparagus", "por": "100 grams", "p": 2.9, "c": 4.1, "f": 0.6, "cal": 33},
{"n": "Aunt Bessie Crispy Homestyle Chips", "por": "100g", "p": 2.8, "c": 23.0, "f": 5.1, "cal": 149},
{"n": "Aunt Bessie Crispy Mini Roasties", "por": "100g", "p": 2.4, "c": 22.0, "f": 3.9, "cal": 133},
{"n": "Aunt Bessie Yorkshire Puddings (12)", "por": "Per Pudding", "p": 1.4, "c": 7.1, "f": 1.5, "cal": 48},
{"n": "Avocado", "por": "100 grams", "p": 1.9, "c": 1.9, "f": 19.5, "cal": 191},
{"n": "Babybel", "por": "20g", "p": 4.6, "c": 0.0, "f": 4.8, "cal": 62},
{"n": "Beansprouts", "por": "100g", "p": 2.5, "c": 2.1, "f": 2.8, "cal": 44},
{"n": "Birds Eye Cod Fish Fingers", "por": "4 Fingers", "p": 14.0, "c": 24.0, "f": 10.0, "cal": 242},
{"n": "Birds Eye Potato Waffle", "por": "58g", "p": 1.3, "c": 13.0, "f": 3.9, "cal": 92},
{"n": "Biscoff Spread", "por": "20g", "p": 0.6, "c": 11.4, "f": 7.6, "cal": 116},
{"n": "Blue Dragon Light Coconut Milk", "por": "100ml", "p": 0.7, "c": 1.6, "f": 7.0, "cal": 72},
{"n": "Blue Dragon Stir Fry Sauce - Katsu", "por": "120g", "p": 1.2, "c": 18.0, "f": 5.4, "cal": 125},
{"n": "Blue Dragon Stir Fry Sauce - Sticky Teriyaki", "por": "120g", "p": 1.3, "c": 26.9, "f": 0.2, "cal": 115},
{"n": "Blueberries", "por": "100 grams", "p": 0.6, "c": 6.9, "f": 0.2, "cal": 32},
{"n": "Cashew Nuts", "por": "10 grams", "p": 2.0, "c": 2.2, "f": 4.5, "cal": 57},
{"n": "Cathedral Light Cheese Slice", "por": "1 Slice", "p": 6.0, "c": 0.0, "f": 4.0, "cal": 60},
{"n": "Cheddar", "por": "30g", "p": 7.6, "c": 0.0, "f": 10.5, "cal": 125},
{"n": "Cheddar - 30% less fat", "por": "30g", "p": 8.3, "c": 0.9, "f": 6.7, "cal": 97},
{"n": "Chicken Breast", "por": "100 grams", "p": 23.2, "c": 0.0, "f": 1.1, "cal": 103},
{"n": "Chocolate Snack A Jack", "por": "1 Rice Cake", "p": 0.9, "c": 12.2, "f": 1.1, "cal": 62},
{"n": "Chorizo", "por": "30g", "p": 7.2, "c": 0.7, "f": 9.7, "cal": 119},
{"n": "Coco Pops", "por": "100 grams", "p": 6.1, "c": 81.0, "f": 3.2, "cal": 377},
{"n": "Creme Fraiche", "por": "30ml", "p": 0.6, "c": 0.6, "f": 9.3, "cal": 88},
{"n": "Crucials Burger Sauce", "por": "15g", "p": 0.1, "c": 1.7, "f": 4.1, "cal": 44},
{"n": "Crumpet", "por": "1 Crumpet", "p": 2.9, "c": 18.7, "f": 0.4, "cal": 90},
{"n": "Crunchy Nut Cornflakes", "por": "100 grams", "p": 5.9, "c": 82.5, "f": 4.9, "cal": 398},
{"n": "Curly Wurly Chocolate Bar", "por": "1 Bar", "p": 0.9, "c": 18.0, "f": 4.5, "cal": 116},
{"n": "De Cecco Linguine", "por": "60g", "p": 7.8, "c": 42.1, "f": 0.9, "cal": 208},
{"n": "Dessicated Coconut", "por": "5g", "p": 0.3, "c": 0.3, "f": 3.1, "cal": 30},
{"n": "Dolmio Pasta Sauce", "por": "100 grams", "p": 1.3, "c": 6.5, "f": 0.7, "cal": 38},
{"n": "Doritos Salsa Dip", "por": "30g", "p": 0.4, "c": 2.0, "f": 0.0, "cal": 10},
{"n": "Dr Oetker Momenti Salami Calabrese", "por": "Per Pizza", "p": 17.7, "c": 54.0, "f": 16.2, "cal": 433},
{"n": "Dr Oetker Momenti Tomato & Mozz Pizza", "por": "Per Pizza", "p": 15.5, "c": 54.6, "f": 14.9, "cal": 414},
{"n": "Egg Whites", "por": "100 grams", "p": 10.9, "c": 0.8, "f": 0.0, "cal": 47},
{"n": "Fage Total 0% Yoghurt", "por": "100 grams", "p": 10.3, "c": 3.0, "f": 0.0, "cal": 53},
{"n": "Farmfoods Cooked Chicken Fillet Skewers", "por": "100g", "p": 18.2, "c": 4.9, "f": 2.9, "cal": 118},
{"n": "Farmfoods Hot and Spicy Mini Chicken Fillets", "por": "100g", "p": 20.0, "c": 4.0, "f": 1.6, "cal": 110},
{"n": "Farmfoods Takeaway Crispy Shredded Chicken", "por": "100g", "p": 18.4, "c": 18.8, "f": 15.8, "cal": 291},
{"n": "Farmfoods Takeaway Hot & Spicy Chicken Tenders (12 pack)", "por": "100g", "p": 16.0, "c": 14.4, "f": 9.1, "cal": 204},
{"n": "Fibre Bar One Bar", "por": "24 grams", "p": 1.2, "c": 11.3, "f": 3.0, "cal": 77},
{"n": "Fillet Steak", "por": "170g", "p": 35.5, "c": 0.0, "f": 13.4, "cal": 263},
{"n": "Frozen MIxed Berries", "por": "100 grams", "p": 0.9, "c": 6.9, "f": 0.2, "cal": 33},
{"n": "Fulfil Chocolate Hazelnut Whip Bar (Small)", "por": "40g", "p": 14.8, "c": 10.8, "f": 7.2, "cal": 167},
{"n": "Fusilli Pasta", "por": "75g", "p": 9.3, "c": 54.0, "f": 1.2, "cal": 264},
{"n": "Garlic Bread Slices", "por": "1 slice", "p": 1.9, "c": 12.0, "f": 3.5, "cal": 87},
{"n": "Grahams White Choc & Raspberry Ripple Ice Cream", "por": "200ml", "p": 9.0, "c": 17.4, "f": 6.2, "cal": 161},
{"n": "Grenade Protein Bar", "por": "1 Bar", "p": 20.0, "c": 19.0, "f": 12.0, "cal": 264},
{"n": "Halloumi Cheese", "por": "40g", "p": 9.6, "c": 0.7, "f": 9.4, "cal": 126},
{"n": "Halo Top Ice Cream  - Sea Salt Caramel", "por": "200ml", "p": 8.4, "c": 28.0, "f": 4.0, "cal": 182},
{"n": "Happy Egg - Egg Whites", "por": "100g", "p": 10.8, "c": 0.0, "f": 0.0, "cal": 43},
{"n": "Hartleys Jelly", "por": "175 grams", "p": 0.0, "c": 0.4, "f": 0.0, "cal": 2},
{"n": "Hartleys Strawberry Seedless Jam", "por": "15g", "p": 0.1, "c": 9.1, "f": 0.1, "cal": 38},
{"n": "Heck Chicken Burger", "por": "1 Burger", "p": 21.1, "c": 1.6, "f": 3.3, "cal": 121},
{"n": "Heck Chicken Sausages", "por": "1 Sausage", "p": 6.3, "c": 0.4, "f": 1.1, "cal": 37},
{"n": "Heinz Baked Beans", "por": "200g", "p": 9.5, "c": 25.8, "f": 0.4, "cal": 145},
{"n": "Hellmans Light Mayo", "por": "30 grams", "p": 1.0, "c": 1.8, "f": 7.8, "cal": 81},
{"n": "Honey", "por": "15g", "p": 0.1, "c": 12.2, "f": 0.1, "cal": 50},
{"n": "John West Tuna Chunks in brine", "por": "100g ", "p": 27.0, "c": 0.0, "f": 0.5, "cal": 112},
{"n": "Kelloggs Rice Crispy Square Bar (marshmallow)", "por": "1 Bar", "p": 0.8, "c": 21.0, "f": 3.4, "cal": 118},
{"n": "King Prawns", "por": "100 grams", "p": 13.5, "c": 0.1, "f": 0.1, "cal": 55},
{"n": "Kingsmill Golden Pancakes ( 6 pack)", "por": "Per Pancake", "p": 1.7, "c": 13.9, "f": 1.3, "cal": 74},
{"n": "Koka Original Chicken Instant Noodles", "por": "70g", "p": 7.4, "c": 40.0, "f": 13.2, "cal": 308},
{"n": "Kvarg Yogurt", "por": "150 grams", "p": 17.0, "c": 5.1, "f": 0.3, "cal": 91},
{"n": "Large Whole Egg", "por": "1 Egg", "p": 6.0, "c": 0.0, "f": 5.0, "cal": 69},
{"n": "Leerdammer Light Dutch Cheese Slice", "por": "20g", "p": 5.9, "c": 0.0, "f": 3.2, "cal": 52},
{"n": "Lidl Bacon Medallion", "por": "1 Medallion", "p": 5.5, "c": 0.0, "f": 0.5, "cal": 26},
{"n": "Lidl Bakery Sandwich Baguette", "por": "1 Baguette", "p": 10.3, "c": 70.7, "f": 1.4, "cal": 337},
{"n": "Lidl Salmon Fillet", "por": "100 grams", "p": 19.4, "c": 0.0, "f": 13.1, "cal": 196},
{"n": "Lidl Skinny Steak Sausage", "por": "55 grams (grilled)", "p": 9.5, "c": 5.0, "f": 2.4, "cal": 80},
{"n": "Light & Free Raspberry Skyr", "por": "150g", "p": 13.8, "c": 5.6, "f": 0.8, "cal": 85},
{"n": "Light & Free Strawberry 0% Fat & 0% Added Sugar Yogurt", "por": "115 grams", "p": 4.6, "c": 7.9, "f": 0.1, "cal": 51},
{"n": "Light Philadelphia Cream Cheese", "por": "50 grams", "p": 1.0, "c": 0.5, "f": 1.7, "cal": 21},
{"n": "Lindt 70% Dark Chocolate", "por": "1 Square", "p": 0.8, "c": 3.4, "f": 4.1, "cal": 54},
{"n": "Lotus Biscoff Biscuit", "por": "7.8g", "p": 0.4, "c": 6.0, "f": 1.5, "cal": 39},
{"n": "Malcolm Allan - Little bit lighter Steak Sausage (links)", "por": "1 Link", "p": 7.0, "c": 4.9, "f": 1.2, "cal": 58},
{"n": "Mash Direct - Carrot & Parsnip", "por": "100g", "p": 1.0, "c": 8.6, "f": 0.6, "cal": 44},
{"n": "Mash Direct - Mashed Potato", "por": "100g", "p": 1.8, "c": 13.7, "f": 2.5, "cal": 84},
{"n": "Mash Direct Mashed Potato", "por": "200g", "p": 3.6, "c": 27.4, "f": 5.0, "cal": 169},
{"n": "Mattesons Turkey Rashers", "por": "1 Rasher", "p": 7.4, "c": 0.1, "f": 0.4, "cal": 34},
{"n": "Mayflower Curry Sauce", "por": "100 grams", "p": 1.1, "c": 8.3, "f": 3.8, "cal": 72},
{"n": "McCain Micro Chips", "por": "1 box", "p": 2.4, "c": 27.6, "f": 4.7, "cal": 162},
{"n": "McCains 5% Oven Chips", "por": "100 grams (frozen)", "p": 2.1, "c": 22.3, "f": 3.3, "cal": 127},
{"n": "McGhee's Potato Scone", "por": "1 scone", "p": 1.1, "c": 13.7, "f": 0.3, "cal": 62},
{"n": "Medium Banana", "por": "1 Banana", "p": 1.1, "c": 20.6, "f": 0.3, "cal": 90},
{"n": "Mission Deli Wrap", "por": "1 Wrap", "p": 5.1, "c": 25.5, "f": 5.1, "cal": 168},
{"n": "Mozzarella", "por": "30g", "p": 6.8, "c": 0.9, "f": 6.4, "cal": 88},
{"n": "Nando's Perinaise", "por": "15g", "p": 0.0, "c": 1.9, "f": 4.2, "cal": 45},
{"n": "New York Bagel", "por": "90 grams", "p": 9.1, "c": 45.0, "f": 1.1, "cal": 226},
{"n": "Nutella B Ready", "por": "1 bar", "p": 1.6, "c": 13.4, "f": 5.9, "cal": 113},
{"n": "Nutella Spread", "por": "20g", "p": 1.3, "c": 11.5, "f": 6.2, "cal": 107},
{"n": "Onion", "por": "100 grams", "p": 1.3, "c": 7.8, "f": 0.2, "cal": 38},
{"n": "Panko Breadcrumbs - Blue Dragon", "por": "30g", "p": 2.3, "c": 14.1, "f": 1.6, "cal": 80},
{"n": "Parmesan", "por": "30g", "p": 9.7, "c": 0.0, "f": 8.9, "cal": 119},
{"n": "Peanut Butter - Whole Earth Smooth", "por": "15g", "p": 3.9, "c": 1.4, "f": 8.2, "cal": 95},
{"n": "Peanut Hottie Peanut Butter Powder", "por": "12 grams", "p": 4.9, "c": 4.7, "f": 1.3, "cal": 50},
{"n": "Penn State Baked Pretzels", "por": "30g", "p": 3.0, "c": 22.8, "f": 1.4, "cal": 116},
{"n": "Peppers", "por": "100 grams", "p": 1.0, "c": 4.8, "f": 0.3, "cal": 26},
{"n": "Philadelphia - Garlic & Herb", "por": "30g", "p": 2.2, "c": 1.6, "f": 3.0, "cal": 42},
{"n": "Philadelphia Light - Original", "por": "30g", "p": 2.2, "c": 1.6, "f": 3.3, "cal": 45},
{"n": "Philadelphia Lightest - Garlic & Herb", "por": "30g", "p": 3.3, "c": 1.5, "f": 0.8, "cal": 26},
{"n": "Philadelphia Lightest- Original", "por": "30g", "p": 3.3, "c": 1.6, "f": 0.8, "cal": 27},
{"n": "Pink Lady Apple", "por": "1 Apple", "p": 0.4, "c": 19.1, "f": 0.2, "cal": 80},
{"n": "Pistachios", "por": "30g", "p": 5.4, "c": 2.5, "f": 16.6, "cal": 181},
{"n": "Pitted Cherries", "por": "100 grams", "p": 0.9, "c": 11.5, "f": 0.1, "cal": 50},
{"n": "Plain Flour", "por": "50g", "p": 5.0, "c": 35.2, "f": 0.6, "cal": 166},
{"n": "Porky Lights Sausage", "por": "1 Sausage", "p": 11.0, "c": 3.8, "f": 4.7, "cal": 102},
{"n": "Porridge Oats", "por": "100 grams", "p": 12.1, "c": 56.1, "f": 8.4, "cal": 348},
{"n": "Porridge Oats (50g)", "por": "50 grams", "p": 6.5, "c": 28.0, "f": 4.2, "cal": 176},
{"n": "Romaine Lettuce Leaves", "por": "100 grams", "p": 0.8, "c": 0.8, "f": 0.5, "cal": 11},
{"n": "Sacla Classic Basil Pesto", "por": "47.5g", "p": 2.3, "c": 3.1, "f": 21.2, "cal": 212},
{"n": "Sacla Sun Dried Tomato Pesto", "por": "47.5g", "p": 2.0, "c": 3.8, "f": 12.9, "cal": 139},
{"n": "Self Raising Flour", "por": "50g", "p": 4.9, "c": 34.7, "f": 0.6, "cal": 164},
{"n": "Semi Skimmed Milk", "por": "200ml", "p": 6.8, "c": 9.8, "f": 3.0, "cal": 93},
{"n": "Sharwood Egg Noodles", "por": "125 grams", "p": 7.5, "c": 43.8, "f": 1.2, "cal": 216},
{"n": "Skinless Chicken Thighs", "por": "100 grams", "p": 18.3, "c": 0.0, "f": 9.8, "cal": 161},
{"n": "Skinny Food Chocolate Spread", "por": "20g", "p": 1.0, "c": 10.6, "f": 7.6, "cal": 115},
{"n": "Skinny Whip - Strawberry & Chocolate", "por": "1 Bar", "p": 0.9, "c": 16.0, "f": 2.3, "cal": 88},
{"n": "Spaghetti", "por": "75 grams ", "p": 9.4, "c": 54.8, "f": 1.1, "cal": 267},
{"n": "Spinach", "por": "25 grams", "p": 0.7, "c": 0.4, "f": 0.2, "cal": 6},
{"n": "Starbucks Latte - Full", "por": "Tall", "p": 9.2, "c": 14.1, "f": 9.6, "cal": 180},
{"n": "Starbucks Latte - Skimmed Milk", "por": "Tall", "p": 9.8, "c": 15.2, "f": 0.2, "cal": 102},
{"n": "Strawberries", "por": "100 grams", "p": 0.8, "c": 6.0, "f": 0.1, "cal": 28},
{"n": "Streamline Reduced Sugar Jam", "por": "15g", "p": 0.1, "c": 6.4, "f": 0.1, "cal": 27},
{"n": "Sweet Potato", "por": "100 grams", "p": 1.2, "c": 21.3, "f": 0.3, "cal": 93},
{"n": "Tagliatelle (Uncooked)", "por": "100 grams", "p": 11.1, "c": 71.2, "f": 1.3, "cal": 341},
{"n": "Tesco Brioche Bun", "por": "1 Bun", "p": 6.1, "c": 33.8, "f": 4.5, "cal": 200},
{"n": "Tesco Clear Honey", "por": "10 grams", "p": 0.0, "c": 8.1, "f": 0.0, "cal": 32},
{"n": "Tesco Crumbed Ham Slices", "por": "25g", "p": 5.6, "c": 0.3, "f": 0.5, "cal": 28},
{"n": "Tesco Feta", "por": "30g", "p": 5.1, "c": 0.3, "f": 6.9, "cal": 84},
{"n": "Tesco Finest Beef & Herb Meatballs (12)", "por": "4 Meatballs", "p": 19.6, "c": 1.3, "f": 11.2, "cal": 184},
{"n": "Tesco finest jumbo king prawns", "por": "87.5g", "p": 13.8, "c": 0.3, "f": 0.4, "cal": 60},
{"n": "Tesco Guacamole - 163g chilled", "por": "41g", "p": 0.8, "c": 1.4, "f": 8.0, "cal": 81},
{"n": "Tesco Hot Smoked Salmon Fillets", "por": "1 Fillet", "p": 20.2, "c": 1.0, "f": 13.9, "cal": 210},
{"n": "Tesco Lightly Salted Rice Cake", "por": "1 rice cake", "p": 0.5, "c": 5.4, "f": 0.2, "cal": 25},
{"n": "Tesco Microwave Jasmine Rice", "por": "1 Pack", "p": 8.4, "c": 86.0, "f": 3.2, "cal": 406},
{"n": "Tesco Reduced Fat Green Pesto", "por": "48g", "p": 1.3, "c": 1.8, "f": 9.7, "cal": 100},
{"n": "Tesco Reduced Fat Red Pesto", "por": "48g", "p": 2.3, "c": 4.0, "f": 10.6, "cal": 121},
{"n": "Tesco Reduced Sugar Strawberry Jam", "por": "30 grams", "p": 0.1, "c": 13.3, "f": 0.1, "cal": 54},
{"n": "Tesco Scottish Oats", "por": "50g", "p": 5.2, "c": 30.2, "f": 4.0, "cal": 178},
{"n": "Tesco Soured Cream and Chive Dip", "por": "50g", "p": 1.0, "c": 3.0, "f": 11.0, "cal": 115},
{"n": "Tesco Super Berry Granola", "por": "20g", "p": 2.3, "c": 13.3, "f": 2.6, "cal": 86},
{"n": "Tesco Tomato and Mascarpone Sauce", "por": "100 grams", "p": 2.7, "c": 5.3, "f": 6.5, "cal": 90},
{"n": "Tesco Turkey Bacon Rashers", "por": "2 rashers", "p": 17.2, "c": 1.0, "f": 0.9, "cal": 81},
{"n": "Tesco Turkey Burger", "por": "1 patty", "p": 18.6, "c": 6.7, "f": 3.8, "cal": 135},
{"n": "Tilda Microwave Basmati Rice", "por": "1 Pack", "p": 8.8, "c": 76.8, "f": 6.6, "cal": 402},
{"n": "Tilda Microwave Coconut, Chilli and Lime", "por": "125g", "p": 3.0, "c": 26.8, "f": 7.5, "cal": 187},
{"n": "Tinned Butter Beans", "por": "100 grams drained", "p": 7.2, "c": 15.6, "f": 0.5, "cal": 96},
{"n": "Tinned Cannellini Beans", "por": "100 grams drained", "p": 7.0, "c": 15.2, "f": 0.4, "cal": 92},
{"n": "Tinned chopped tomatoes", "por": "200g", "p": 2.8, "c": 8.0, "f": 0.4, "cal": 47},
{"n": "Tinned Tuna In Brine", "por": "100 grams", "p": 27.0, "c": 0.0, "f": 0.5, "cal": 112},
{"n": "Tomato & Herb Bagel Thin", "por": "1 bagel", "p": 5.0, "c": 21.9, "f": 0.7, "cal": 114},
{"n": "UFit Strawberry Protein Drink", "por": "310ml", "p": 22.3, "c": 10.5, "f": 0.3, "cal": 134},
{"n": "Veetee Thai Jasmine Rice - Duo Pot", "por": "140g", "p": 4.2, "c": 43.8, "f": 2.8, "cal": 217},
{"n": "Vivera Shawarma Kebab", "por": "175 grams", "p": 26.2, "c": 9.3, "f": 12.1, "cal": 251},
{"n": "Warburtons Sandwich Thins", "por": "1 Thin", "p": 4.0, "c": 18.1, "f": 1.1, "cal": 98},
{"n": "Warburtons Thin Bagels (cinnamon&raisin)", "por": "1 Bagel", "p": 4.9, "c": 25.9, "f": 0.6, "cal": 129},
{"n": "Warburtons Thin Bagels (plain)", "por": "1 Bagel", "p": 5.0, "c": 25.0, "f": 0.7, "cal": 126},
{"n": "Warbutons Toastie White Bread 800g", "por": "Slice - 47.4g", "p": 4.3, "c": 22.0, "f": 0.9, "cal": 113},
{"n": "Watermelon", "por": "100 grams", "p": 0.4, "c": 6.9, "f": 0.3, "cal": 32},
{"n": "We Hae Meat Skinny Steak Slice", "por": "65g", "p": 10.0, "c": 5.0, "f": 2.7, "cal": 84},
{"n": "Weetabix Minis Chocolate Chip", "por": "40g", "p": 3.9, "c": 28.4, "f": 2.2, "cal": 149},
{"n": "Weetabix Original", "por": "Per 2", "p": 4.5, "c": 25.8, "f": 0.8, "cal": 128},
{"n": "Weetos", "por": "50 grams", "p": 4.2, "c": 37.5, "f": 2.1, "cal": 186},
{"n": "Weight Watchers Wrap", "por": "1 Wrap", "p": 3.3, "c": 22.1, "f": 0.8, "cal": 109},
{"n": "Whey Protein", "por": "1 Scoop", "p": 25.0, "c": 0.5, "f": 0.5, "cal": 106},
{"n": "White Bread", "por": "1 Slice", "p": 4.0, "c": 16.5, "f": 0.9, "cal": 90},
{"n": "White Potato", "por": "100 grams", "p": 2.1, "c": 17.2, "f": 0.2, "cal": 79},
{"n": "Whole Earth Peanut Butter", "por": "30 grams", "p": 7.9, "c": 2.8, "f": 16.3, "cal": 190},
{"n": "Wholemeal Bread", "por": "1 Slice", "p": 4.2, "c": 15.1, "f": 1.5, "cal": 91},
{"n": "Wholemeal Pitta", "por": "58 grams", "p": 5.6, "c": 26.8, "f": 0.7, "cal": 136},
{"n": "Yeo Valley Super Thick Kerned Yogurt - Natural", "por": "170g", "p": 17.0, "c": 5.9, "f": 0.9, "cal": 100},
{"n": "Youngs Gastro Lightly Dusted Sea Salt and Pepper Basa Fillets", "por": "310g", "p": 22.2, "c": 15.8, "f": 12.1, "cal": 261},
{"n": "2% Lean Turkey Mince", "por": "100 grams", "p": 25.4, "c": 0.2, "f": 1.3, "cal": 114},
{"n": "5% Lean Beef Mince", "por": "100 grams", "p": 31.0, "c": 0.5, "f": 4.7, "cal": 168},
{"n": "Butter", "por": "100 grams", "p": 0.5, "c": 0.6, "f": 75.0, "cal": 679},
{"n": "Skimmed milk 1% fat Tesco", "por": "100ml", "p": 4.0, "c": 4.0, "f": 0.1, "cal": 33},
{"n": "cheese 3%", "por": "200", "p": 5.0, "c": 25.0, "f": 9.0, "cal": 201},
{"n": "Lemon sole", "por": "100", "p": 21.5, "c": 0.0, "f": 0.6, "cal": 91},
{"n": "Cod", "por": "100", "p": 23.0, "c": 0.0, "f": 0.9, "cal": 100}
];


// ── STORAGE - Supabase backend (any device, any browser) ─────────────────────
const SB_URL="https://qkaajbgxpftauwsdevtl.supabase.co";
const SB_KEY="sb_publishable_G7HEdGZvwon44jVO8YhJ5w_grM1c10e";
const SB_HEADERS={"apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Content-Type":"application/json"};

const sbFetch=async(method,key,value)=>{
  const base=SB_URL+"/rest/v1/app_data";
  if(method==="GET"){
    const r=await fetch(base+"?key=eq."+encodeURIComponent(key)+"&select=value",{headers:SB_HEADERS});
    const d=await r.json();
    return d&&d.length>0?d[0].value:null;
  }
  if(method==="UPSERT"){
    await fetch(base,{method:"POST",headers:{...SB_HEADERS,Prefer:"resolution=merge-duplicates"},body:JSON.stringify({key,value,updated_at:new Date().toISOString()})});
  }
  if(method==="DELETE"){
    await fetch(base+"?key=eq."+encodeURIComponent(key),{method:"DELETE",headers:SB_HEADERS});
  }
};

const db={
  get:async(k,s=false)=>{
    // Session is device-local only
    if(k==="rdh:session"){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}}
    try{return await sbFetch("GET",k);}catch{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}}
  },
  set:async(k,v,s=false)=>{
    if(k==="rdh:session"){try{localStorage.setItem(k,JSON.stringify(v));}catch{}return;}
    // Skip storing base64 photos in DB - photos go via WhatsApp
    if(k.includes(":photo:")){try{localStorage.setItem(k,JSON.stringify(v));}catch{}return;}
    try{await sbFetch("UPSERT",k,v);}catch{}
    // Mirror to localStorage as offline fallback
    try{localStorage.setItem(k,JSON.stringify(v));}catch{}
  },
  del:async(k,s=false)=>{
    if(k==="rdh:session"){try{localStorage.removeItem(k);}catch{}return;}
    try{await sbFetch("DELETE",k);}catch{}
    try{localStorage.removeItem(k);}catch{}
  },
};
const cKey=(id,k)=>`rdh:c:${id}:${k}`;

// ── UTILS ──────────────────────────────────────────────────────────────────────
const toDay=()=>new Date().toISOString().split("T")[0];
const uid=()=>Math.random().toString(36).slice(2,10);
const fmtDate=d=>new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
const fmtShort=d=>new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const epley=(w,r)=>r<=0?0:r===1?parseFloat(w):parseFloat(w)*(1+parseFloat(r)/30);
const weekDates=()=>{const d=new Date(),day=d.getDay(),mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));return Array.from({length:7},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().split("T")[0];});};
const getStreak=(log,n)=>{if(!n)return 0;let s=0;const d=new Date();while(s<365){const k=d.toISOString().split("T")[0];if(!(log[k]?.length))break;s++;d.setDate(d.getDate()-1);}return s;};
const resizeImg=(url,maxW=800)=>new Promise(res=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas"),sc=Math.min(1,maxW/img.width);c.width=img.width*sc;c.height=img.height*sc;c.getContext("2d").drawImage(img,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",0.72));};img.src=url;});

// ── PRIMITIVES ─────────────────────────────────────────────────────────────────
const Toast=({msg,show})=>{
  if(!show)return null;
  return <div style={{position:"fixed",bottom:100,left:"50%",transform:"translateX(-50%)",zIndex:99999,background:C.green,color:"#fff",padding:"10px 22px",borderRadius:999,fontSize:13,fontWeight:700,boxShadow:"0 4px 20px rgba(0,0,0,0.3)",animation:"fadeIn 0.2s ease",whiteSpace:"nowrap",letterSpacing:"0.02em"}}>
    {msg}
  </div>;
};

const useToast=()=>{
  const [toast,setToast]=useState({msg:"",show:false});
  const show=(msg="Saved")=>{setToast({msg,show:true});setTimeout(()=>setToast({msg:"",show:false}),1800);};
  return{toast,show};
};

const GlobalStyle=()=>(<style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;} body,*{font-family:'DM Sans',sans-serif;} ::-webkit-scrollbar{display:none;} input,select,textarea{color:#FDFDFD;background:transparent;} input[type=number]::-webkit-inner-spin-button{opacity:0;} ::placeholder{color:#4A4A68;} select option{background:#15151E;} @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .fade-in{animation:fadeIn 0.22s ease both;} input[type=range]{accent-color:#5271FF;width:100%;}`}</style>);

const Card=({children,style={},onClick})=>(<div onClick={onClick} style={{background:glass(0.035),border:border(0.09),borderRadius:20,padding:18,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",cursor:onClick?"pointer":"default",boxShadow:"0 4px 24px rgba(0,0,0,0.35)",transition:"all 0.2s ease",...style}}>{children}</div>);

const Btn=({children,onClick,variant="primary",style={},disabled=false,icon})=>{
  const vs={primary:{background:C.grad,color:C.white,boxShadow:`0 4px 18px ${C.blue}30`},secondary:{background:glass(0.07),border:border(0.12),color:C.white},ghost:{background:"transparent",color:C.muted,border:border(0.07)},danger:{background:`${C.red}20`,color:C.red,border:`1px solid ${C.red}40`},success:{background:`${C.green}20`,color:C.green,border:`1px solid ${C.green}40`}};
  return <button disabled={disabled} onClick={onClick} style={{border:"none",borderRadius:14,padding:"11px 18px",fontWeight:600,fontSize:14,fontFamily:FONT,cursor:disabled?"not-allowed":"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7,opacity:disabled?0.4:1,transition:"all 0.18s ease",letterSpacing:"0.01em",...vs[variant],...style}}>{icon&&<Icon d={Icons[icon]} size={15} color="currentColor"/>}{children}</button>;
};

const Input=({value,onChange,placeholder,type="text",style={}})=>(<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:glass(0.06),border:border(0.12),borderRadius:12,padding:"11px 16px",color:C.white,fontSize:14,outline:"none",width:"100%",fontFamily:FONT,...style}}/>);
const Sel=({value,onChange,options,style={}})=>(<select value={value} onChange={e=>onChange(e.target.value)} style={{background:C.dark3,border:border(0.12),borderRadius:12,padding:"11px 16px",color:C.white,fontSize:14,outline:"none",width:"100%",fontFamily:FONT,...style}}>{options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}</select>);

const Modal=({open,onClose,title,children})=>{
  if(!open)return null;
  return <div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.78)",backdropFilter:"blur(4px)",display:"flex",alignItems:"flex-end",justifyContent:"center"}}><div style={{background:C.dark2,borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"90vh",overflowY:"auto",padding:24,borderTop:border(0.12),boxShadow:"0 -8px 60px rgba(0,0,0,0.6)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><span style={{fontSize:17,fontWeight:700,color:C.white,letterSpacing:"-0.02em"}}>{title}</span><button onClick={onClose} style={{background:glass(0.08),border:border(0.1),color:C.muted,width:30,height:30,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d="M18 6L6 18M6 6l12 12" size={14} color={C.muted}/></button></div>{children}</div></div>;
};

const Pill=({label,active,onClick,color})=>(<button onClick={onClick} style={{flexShrink:0,padding:"6px 14px",borderRadius:999,fontFamily:FONT,fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.15s",background:active?(color||C.blue):glass(0.05),color:active?C.white:C.muted,border:active?"1px solid transparent":border(0.09)}}>{label}</button>);
const Label=({children})=>(<div style={{fontSize:10,color:C.sub,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:7,display:"block"}}>{children}</div>);
const PageHead=({title,sub,right})=>(<div style={{padding:"52px 20px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}><div><div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em",lineHeight:1.1}}>{title}</div>{sub&&<div style={{fontSize:12,color:C.muted,marginTop:3}}>{sub}</div>}</div>{right}</div>);
const Divider=()=>(<div style={{height:1,background:`linear-gradient(90deg,transparent,${glass(0.15)},transparent)`,margin:"4px 0"}}/>);

const Ring=({value,size=80,stroke=6,color=C.blue})=>{
  const r=(size-stroke)/2,circ=2*Math.PI*r,dash=(value/100)*circ;
  return <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
    <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} stroke={C.dark4} strokeWidth={stroke} fill="none"/><circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dasharray 0.5s"}}/></svg>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:size>60?15:11,fontWeight:700,color:C.white}}>{value}%</span></div>
  </div>;
};

// RDH Logo badge — uses actual brand logo
const RDH_LOGO="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAQABAADASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAEHAgYIBQQD/8QAXhABAAEDAgIFBQcMDQkHBAMBAAECAwQFEQYSByExQVETYXGBkRQVFyIyodIIIyQ2UpKTlKKxs9MWMzVCRVVicnN0grLRNFNWY4OEo6TBJSZDRFTD40ZkdcJl4fDi/8QAHAEBAAEFAQEAAAAAAAAAAAAAAAYCAwQFBwEI/8QAQhEBAAECAwMICAQFAwMFAQAAAAECAwQFEQYhMRITQVFhcZHRFBYiUoGhscEVMlPwNULS4fEzNHJDorIjYoKSwiT/2gAMAwEAAhEDEQA/AOMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//9k=";
const RDHBadge=({size=36})=>(<div style={{width:size,height:size,borderRadius:Math.round(size*0.28),overflow:"hidden",flexShrink:0,background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}><img src={RDH_LOGO} alt="RDH Coaching" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>);

const TierBadge=({tier="foundation",size="sm"})=>{
  const t=TIERS[tier]||TIERS.foundation;
  const pad=size==="sm"?"3px 8px":"5px 12px",fs=size==="sm"?10:12;
  return <span style={{background:`${t.color}20`,color:t.color,border:`1px solid ${t.color}40`,borderRadius:999,padding:pad,fontSize:fs,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",display:"inline-flex",alignItems:"center",gap:4}}><Icon d={Icons[t.icon]||Icons.tier} size={fs} color={t.color}/>{t.name}</span>;
};

const StreakCalendar=({checkInLog})=>{
  const days=[],today=new Date();
  for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const key=d.toISOString().split("T")[0];const done=!!(checkInLog&&checkInLog[key]);const isToday=i===0;days.push({key,done,isToday,label:d.toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2).toUpperCase(),day:d.getDate()});}
  return <div style={{display:"flex",gap:5,alignItems:"center"}}>{days.map(d=><div key={d.key} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><div style={{width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:d.done?(d.isToday?C.blue:`${C.green}20`):d.isToday?glass(0.1):glass(0.04),border:d.done?(d.isToday?`1px solid ${C.blue}80`:`1px solid ${C.green}40`):d.isToday?`1.5px solid ${C.blue}60`:border(0.08)}}>{d.done?<Icon d={Icons.check} size={14} color={d.isToday?C.white:C.green}/>:<span style={{fontSize:11,fontWeight:d.isToday?700:400,color:d.isToday?C.white:C.sub}}>{d.day}</span>}</div><span style={{fontSize:9,color:d.isToday?C.blue:C.sub,fontWeight:d.isToday?700:400}}>{d.label}</span></div>)}</div>;
};

// ── TREND CHARTS component - shared between client home and coach overview ─────
const TrendCharts=({workouts,checkInLog,mealPlans})=>{
  const today=toDay();
  const week=weekDates();
  const ttStyle={borderRadius:8,background:C.dark3,border:`1px solid ${C.dark4}`,fontSize:11,color:C.white};

  // Sessions this week
  const sessionsByDay=week.map(d=>{const wos=workouts.filter(w=>w.date?.split("T")[0]===d);return{d:new Date(d).toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2),v:wos.length,date:d};});
  const wkSessions=sessionsByDay.reduce((a,x)=>a+x.v,0);

  // Calorie & macro adherence from check-ins
  const trainTarget=mealPlans?.training?.targets||{calories:0,protein:0,carbs:0,fat:0};
  const calData=week.map(d=>{
    const ci=checkInLog?.[d];
    const logged=parseFloat(ci?.daily?.calories||ci?.calories||0);
    const target=trainTarget.calories||0;
    const pct=target>0&&logged>0?Math.min(150,Math.round(logged/target*100)):0;
    return{d:new Date(d).toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2),pct,logged,target};
  });
  const avgCalPct=calData.filter(d=>d.pct>0).reduce((a,d,_,arr)=>a+d.pct/arr.length,0);

  // Protein adherence
  const proteinData=week.map(d=>{
    const ci=checkInLog?.[d];
    const logged=parseFloat(ci?.daily?.protein||ci?.protein||0);
    const target=trainTarget.protein||0;
    const pct=target>0&&logged>0?Math.min(150,Math.round(logged/target*100)):0;
    return{d:new Date(d).toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2),pct};
  });

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {/* Sessions bar */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div><div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Sessions This Week</div><div style={{fontSize:22,fontWeight:700,color:C.blue}}>{wkSessions} <span style={{fontSize:12,fontWeight:400,color:C.muted}}>sessions</span></div></div>
          <Icon d={Icons.dumbbell} size={20} color={C.blue}/>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"flex-end",height:48}}>
          {sessionsByDay.map((d,i)=>{
            const isToday=d.date===today;
            return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{width:"100%",height:d.v>0?36:6,background:d.v>0?C.blue:C.dark4,borderRadius:4,transition:"height 0.4s",opacity:isToday?1:0.75}}/>
              <div style={{fontSize:9,color:isToday?C.blue:C.sub,fontWeight:isToday?700:400}}>{d.d}</div>
            </div>;
          })}
        </div>
      </Card>

      {/* Calorie + Protein rings */}
      {trainTarget.calories>0&&(
        <Card style={{padding:"14px 16px"}}>
          <div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>Nutrition Adherence - This Week</div>
          <div style={{display:"flex",gap:16,justifyContent:"space-around",alignItems:"center"}}>
            <div style={{textAlign:"center"}}>
              <Ring value={Math.round(avgCalPct)} size={68} stroke={6} color={avgCalPct>=90?C.green:avgCalPct>=70?C.gold:C.red}/>
              <div style={{fontSize:10,color:C.muted,marginTop:5}}>Calories avg</div>
            </div>
            <div style={{flex:1}}>
              {[["Calories",calData,C.blue],["Protein",proteinData,C.purple]].map(([label,data,color])=>(
                <div key={label} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,color:C.muted}}>{label}</span><span style={{fontSize:10,color:C.white,fontWeight:600}}>{Math.round(data.filter(d=>d.pct>0).reduce((a,d,_,arr)=>a+d.pct/arr.length,0))||0}%</span></div>
                  <div style={{height:4,background:C.dark4,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,Math.round(data.filter(d=>d.pct>0).reduce((a,d,_,arr)=>a+d.pct/arr.length,0)||0))}%`,background:color,borderRadius:2,transition:"width 0.4s"}}/></div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// ── REWARD MODAL ─────────────────────────────────────────────────────────────
function RewardModal({reward,onClose}){
  if(!reward)return null;
  return <div style={{position:"fixed",inset:0,zIndex:99999,background:"rgba(0,0,0,0.88)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.dark3,borderRadius:28,padding:28,maxWidth:340,width:"100%",border:border(0.12),boxShadow:`0 0 60px ${reward.color||C.blue}30`,textAlign:"center"}} className="fade-in">
      <div style={{width:80,height:80,borderRadius:"50%",background:`${reward.color||C.blue}15`,border:`2px solid ${reward.color||C.blue}40`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",boxShadow:`0 0 30px ${reward.color||C.blue}25`}}><Icon d={Icons[reward.icon]||Icons.trophy} size={36} color={reward.color||C.blue}/></div>
      <div style={{fontSize:10,color:reward.color||C.blue,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:8}}>{reward.tag||"ACHIEVEMENT UNLOCKED"}</div>
      <div style={{fontSize:22,fontWeight:700,color:C.white,letterSpacing:"-0.03em",lineHeight:1.2,marginBottom:10}}>{reward.title}</div>
      {reward.body&&<div style={{fontSize:14,color:C.muted,lineHeight:1.6,marginBottom:16}}>{reward.body}</div>}
      {reward.stat&&<div style={{background:`${reward.color||C.blue}12`,border:`1px solid ${reward.color||C.blue}25`,borderRadius:16,padding:"12px 16px",marginBottom:20}}><div style={{fontSize:28,fontWeight:700,color:reward.color||C.blue}}>{reward.stat}</div>{reward.statLabel&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{reward.statLabel}</div>}</div>}
      <Btn onClick={onClose} style={{width:"100%",justifyContent:"center",padding:14,background:reward.color||C.blue}} icon="check">Got it</Btn>
    </div>
  </div>;
}
const buildWorkoutReward=(workout,allWorkouts,orms)=>{
  const vol=workout.exercises.reduce((a,ex)=>a+ex.sets.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0);
  const pbs=[];workout.exercises.forEach(ex=>{ex.sets.forEach(s=>{const est=epley(s.weight,s.reps);const prev=orms[ex.exId||ex.name]||0;if(est>prev&&est>0)pbs.push({name:ex.name,est:est.toFixed(1),weight:s.weight,reps:s.reps});});});
  if(pbs.length>0){const pb=pbs[0];return{type:"pb",icon:"trophy",color:C.gold,tag:"PERSONAL BEST",title:`New ${pb.name} PB`,body:PB_MESSAGES[Math.floor(Math.random()*PB_MESSAGES.length)],stat:`${pb.weight}kg x ${pb.reps}`,statLabel:`Est. 1RM: ${pb.est}kg`};}
  const ref=getVolumeRef(vol);
  if(ref&&vol>0)return{type:"volume",icon:"bolt",color:C.blue,tag:"SESSION COMPLETE",title:"Serious work done",body:`You moved ${vol.toLocaleString()}kg this session.`,stat:`= ${ref.name}`,statLabel:"real-world equivalent"};
  return{type:"complete",icon:"check",color:C.green,tag:"SESSION COMPLETE",title:"Workout logged",body:"Consistent effort compounds. See you next time."};
};
const buildWeightReward=(lostKg)=>{const ref=getWeightRef(lostKg);if(!ref||lostKg<0.5)return null;return{type:"milestone",icon:"medal",color:C.purple,tag:"WEIGHT MILESTONE",title:`${lostKg.toFixed(1)}kg down`,body:"Your trend is heading in the right direction.",stat:`= ${ref.desc}`,statLabel:"you've dropped the equivalent of"};};
const buildStreakReward=(streak)=>{const msg=STREAK_MSGS[streak]||null;if(!msg)return null;return{type:"streak",icon:"flame",color:"#FF7E00",tag:`${streak} DAY STREAK`,title:"Streak milestone",body:msg};};


// ── AUTH ──────────────────────────────────────────────────────────────────────
function useAuth(){
  const genCode=()=>Math.random().toString(36).slice(2,8).toUpperCase();
  const createInvite=async(clientName)=>{const code=genCode();const invites=(await db.get("rdh:invites",true))||[];invites.push({code,clientName,used:false,createdAt:toDay()});await db.set("rdh:invites",invites,true);return code;};
  const validateInvite=async(code)=>{const invites=(await db.get("rdh:invites",true))||[];return invites.find(i=>i.code===code&&!i.used);};
  const markUsed=async(code)=>{const invites=(await db.get("rdh:invites",true))||[];await db.set("rdh:invites",invites.map(i=>i.code===code?{...i,used:true}:i),true);};
  const registerClient=async(email,name,code)=>{const clients=(await db.get("rdh:clients",true))||[];const id=email.toLowerCase().replace(/[^a-z0-9]/g,"_")+"-"+uid().slice(0,4);const client={id,name,email:email.toLowerCase(),joinedDate:toDay(),programmeId:null,coachNote:"",tier:"foundation"};clients.push(client);await db.set("rdh:clients",clients,true);await markUsed(code);return client;};
  const findByEmail=async(email)=>{const clients=(await db.get("rdh:clients",true))||[];return clients.find(c=>c.email===email.toLowerCase());};
  return{createInvite,validateInvite,registerClient,findByEmail};
}

// ── INVITE MANAGER (coach) ────────────────────────────────────────────────────
function InviteManager(){
  const [invites,setInvites]=useState([]);const [open,setOpen]=useState(false);const [newName,setNewName]=useState("");const auth=useAuth();
  useEffect(()=>{if(open)db.get("rdh:invites",true).then(i=>setInvites(i||[]));},  [open]);
  const generate=async()=>{const code=await auth.createInvite(newName.trim()||"New Client");const updated=[...invites,{code,clientName:newName.trim()||"New Client",used:false,createdAt:toDay()}];setInvites(updated);setNewName("");};
  const del=async(code)=>{const inv=(await db.get("rdh:invites",true)||[]).filter(i=>i.code!==code);db.set("rdh:invites",inv,true);setInvites(inv);};
  const unused=invites.filter(i=>!i.used),used=invites.filter(i=>i.used);
  return <div style={{padding:"0 20px 8px"}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:glass(0.05),border:border(0.1),borderRadius:14,padding:"12px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:FONT,marginBottom:open?8:0}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><Icon d={Icons.lock} size={16} color={C.blue}/><span style={{fontSize:13,fontWeight:600,color:C.white}}>Invite Codes</span>{unused.length>0&&<span style={{fontSize:10,background:`${C.blue}25`,color:C.blue,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{unused.length} active</span>}</div>
      <Icon d={Icons.chevronR} size={14} color={C.sub} style={{transform:open?"rotate(90deg)":"none",transition:"transform 0.2s"}}/>
    </button>
    {open&&<Card style={{marginBottom:8}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}><Input value={newName} onChange={setNewName} placeholder="Client name (optional)" style={{flex:1}}/><Btn onClick={generate} style={{padding:"10px 14px",flexShrink:0}} icon="plus">Generate</Btn></div>
      {unused.map(i=><div key={i.code} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:glass(0.04),borderRadius:11,marginBottom:6,border:border(0.09)}}>
        <div><div style={{fontSize:18,fontWeight:700,color:C.blue,letterSpacing:4,fontFamily:"monospace"}}>{i.code}</div>{i.clientName&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>For: {i.clientName}</div>}</div>
        <button onClick={()=>del(i.code)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon d={Icons.trash} size={14} color={C.sub}/></button>
      </div>)}
      {used.slice(-3).map(i=><div key={i.code} style={{fontSize:11,color:C.sub,padding:"3px 0"}}>v {i.code} - {i.clientName}</div>)}
      {invites.length===0&&<div style={{fontSize:12,color:C.sub,textAlign:"center",padding:"8px 0"}}>No codes yet.</div>}
    </Card>}
  </div>;
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [view,setView]=useState("main");
  const [loginEmail,setLoginEmail]=useState("");
  const [newName,setNewName]=useState(""); const [newEmail,setNewEmail]=useState(""); const [inviteCode,setInviteCode]=useState("");
  const [pin,setPin]=useState(""); const [pinErr,setPinErr]=useState(false); const [err,setErr]=useState("");
  const [loading,setLoading]=useState(true);
  const auth=useAuth();
  useEffect(()=>setLoading(false),[]);

  const loginClient=async()=>{const email=loginEmail.trim().toLowerCase();if(!email){setErr("Enter your email address.");return;}const client=await auth.findByEmail(email);if(!client){setErr("No account found for this email.");return;}db.set("rdh:session",{view:"client",clientId:client.id,clientName:client.name},false);onLogin("client",client.id,client.name);};
  const registerClient=async()=>{const name=newName.trim(),email=newEmail.trim().toLowerCase(),code=inviteCode.trim().toUpperCase();if(!name||!email||!code){setErr("Fill in all fields.");return;}const inv=await auth.validateInvite(code);if(!inv){setErr("Invite code invalid or already used.");return;}const existing=await auth.findByEmail(email);if(existing){setErr("Email already registered. Sign in.");return;}const client=await auth.registerClient(email,name,code);db.set("rdh:session",{view:"client",clientId:client.id,clientName:client.name},false);onLogin("client",client.id,client.name);};
  const submitPin=()=>{if(pin===COACH_PIN){db.set("rdh:session",{view:"coach"},false);onLogin("coach",null,null);}else{setPinErr(true);setPin("");}};

  if(loading)return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><GlobalStyle/><RDHBadge size={56}/></div>;

  return <div style={{background:`radial-gradient(ellipse at 20% 20%,${C.blue}18 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,${C.purple}12 0%,transparent 50%),${C.bg}`,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:C.white,fontFamily:FONT,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px"}}>
    <GlobalStyle/>
    <div style={{width:"100%",maxWidth:360}}>
      <div style={{textAlign:"center",marginBottom:44}}>
        <div style={{margin:"0 auto 16px",display:"flex",justifyContent:"center"}}><RDHBadge size={64}/></div>
        <div style={{fontSize:28,fontWeight:700,letterSpacing:"-0.05em",color:C.white}}>RDH Coaching</div>
        <div style={{fontSize:12,color:C.muted,marginTop:6,letterSpacing:"0.04em"}}>Science-led. Results-guaranteed.</div>
      </div>
      {err&&<div style={{color:C.red,fontSize:12,textAlign:"center",marginBottom:12,padding:"9px 14px",background:`${C.red}15`,borderRadius:10}}>{err}</div>}
      {view==="main"&&<div style={{display:"flex",flexDirection:"column",gap:12}} className="fade-in">
        <Btn onClick={()=>{setErr("");setView("select");}} style={{width:"100%",padding:16,fontSize:16,borderRadius:18,justifyContent:"center"}}>Enter as Client</Btn>
        <Btn onClick={()=>setView("pin")} variant="secondary" style={{width:"100%",padding:14,fontSize:14,borderRadius:18,justifyContent:"center"}} icon="lock">Coach Portal</Btn>
      </div>}
      {view==="select"&&<div className="fade-in">
        <div style={{fontSize:18,fontWeight:700,marginBottom:6,textAlign:"center",letterSpacing:"-0.03em"}}>Sign In</div>
        <div style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:18}}>Enter your registered email</div>
        <Input value={loginEmail} onChange={v=>{setLoginEmail(v);setErr("");}} placeholder="your@email.com" type="email" style={{marginBottom:12}}/>
        <Btn onClick={loginClient} style={{width:"100%",padding:14,justifyContent:"center"}} disabled={!loginEmail.trim()}>Sign In</Btn>
        <div style={{display:"flex",alignItems:"center",gap:8,margin:"18px 0 12px"}}><div style={{flex:1,height:1,background:C.dark4}}/><span style={{fontSize:11,color:C.sub,whiteSpace:"nowrap"}}>New to RDH?</span><div style={{flex:1,height:1,background:C.dark4}}/></div>
        <Btn onClick={()=>{setErr("");setView("new");}} variant="secondary" style={{width:"100%",justifyContent:"center",padding:13}} icon="plus">Register with Invite Code</Btn>
        <button onClick={()=>setView("main")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginTop:14,width:"100%",textAlign:"center",fontFamily:FONT}}>Back</button>
      </div>}
      {view==="new"&&<div className="fade-in">
        <div style={{fontSize:18,fontWeight:700,marginBottom:4,textAlign:"center",letterSpacing:"-0.03em"}}>Create Account</div>
        <div style={{fontSize:12,color:C.muted,textAlign:"center",marginBottom:16}}>You need an invite code from your coach</div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
          <Input value={newName} onChange={v=>{setNewName(v);setErr("");}} placeholder="Your full name"/>
          <Input value={newEmail} onChange={v=>{setNewEmail(v);setErr("");}} placeholder="your@email.com" type="email"/>
          <Input value={inviteCode} onChange={v=>{setInviteCode(v.toUpperCase().replace(/[^A-Z0-9]/g,""));setErr("");}} placeholder="INVITE CODE" style={{letterSpacing:5,textAlign:"center",fontSize:18,fontWeight:700}}/>
        </div>
        <Btn onClick={registerClient} style={{width:"100%",padding:14,justifyContent:"center"}} disabled={!newName.trim()||!newEmail.trim()||inviteCode.length<4}>Create Account</Btn>
        <button onClick={()=>setView("select")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginTop:14,width:"100%",textAlign:"center",fontFamily:FONT}}>Back to Sign In</button>
      </div>}
      {view==="pin"&&<div className="fade-in">
        <div style={{fontSize:18,fontWeight:700,marginBottom:6,textAlign:"center"}}>Coach Access</div>
        <Input value={pin} onChange={v=>{setPin(v);setPinErr(false);}} type="password" placeholder="******" style={{marginBottom:8,textAlign:"center",fontSize:24,letterSpacing:6}}/>
        {pinErr&&<div style={{color:C.red,fontSize:12,textAlign:"center",marginBottom:8}}>Incorrect PIN</div>}
        <Btn onClick={submitPin} style={{width:"100%",padding:14,justifyContent:"center"}}>Enter</Btn>
        <button onClick={()=>setView("main")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,marginTop:14,width:"100%",textAlign:"center",fontFamily:FONT}}>Back</button>
      </div>}
    </div>
  </div>;
}


// ── EXERCISE LIBRARY ──────────────────────────────────────────────────────────
function ExLib({exercises,setExercises,onPick}){
  const [q,setQ]=useState(""); const [cat,setCat]=useState("All"); const [editing,setEditing]=useState(null);
  const list=exercises.filter(e=>(cat==="All"||e.cat===cat)&&(e.name.toLowerCase().includes(q.toLowerCase())||e.muscles.toLowerCase().includes(q.toLowerCase())));
  const saveEx=form=>{if(editing==="new")setExercises(p=>[...p,{...form,id:`cx-${uid()}`,custom:true}]);else setExercises(p=>p.map(e=>e.id===editing.id?{...e,...form}:e));setEditing(null);};
  return <div>
    {!onPick&&<PageHead title="Library" sub={`${exercises.length} exercises`} right={<Btn onClick={()=>setEditing("new")} style={{padding:"8px 14px",fontSize:13}} icon="plus">Add</Btn>}/>}
    {onPick&&<div style={{padding:"16px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}><span style={{fontSize:17,fontWeight:700,color:C.white}}>Add Exercise</span><Btn onClick={()=>setEditing("new")} variant="secondary" style={{padding:"7px 12px",fontSize:12}} icon="plus">New</Btn></div>}
    <div style={{padding:"10px 20px 8px"}}><Input value={q} onChange={setQ} placeholder="Search exercises..."/></div>
    <div style={{padding:"0 20px 10px",display:"flex",gap:6,overflowX:"auto"}}>{CATS.map(c=><Pill key={c} label={c} active={cat===c} onClick={()=>setCat(c)} color={CAT_COLOR[c]}/>)}</div>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:onPick?20:90}}>
      {list.map(ex=><Card key={ex.id} onClick={onPick?()=>onPick(ex):undefined} style={{padding:"14px 16px",cursor:onPick?"pointer":"default"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:600,fontSize:14,color:C.white}}>{ex.name}</span>{ex.custom&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.purple}25`,color:C.purple,fontWeight:700}}>CUSTOM</span>}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:`${CAT_COLOR[ex.cat]||C.blue}20`,color:CAT_COLOR[ex.cat]||C.blue,fontWeight:600}}>{ex.cat}</span><span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:glass(0.06),color:C.muted,border:border(0.08)}}>{ex.equip}</span></div>
            <div style={{fontSize:11,color:C.sub,marginTop:5}}>{ex.muscles}</div>
          </div>
          <div style={{display:"flex",gap:5,marginLeft:8}}>
            {ex.videoUrl&&<a href={ex.videoUrl} target="_blank" rel="noreferrer" onClick={ev=>ev.stopPropagation()} style={{background:`${C.red}20`,border:`1px solid ${C.red}30`,color:C.red,width:32,height:32,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}><Icon d={Icons.run} size={13} color={C.red}/></a>}
            <button onClick={ev=>{ev.stopPropagation();setEditing(ex);}} style={{background:glass(0.07),border:border(0.1),color:C.muted,width:32,height:32,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.edit} size={13} color={C.muted}/></button>
            {ex.custom&&<button onClick={ev=>{ev.stopPropagation();setExercises(p=>p.filter(e=>e.id!==ex.id));}} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:4}}><Icon d={Icons.trash} size={13} color={C.sub}/></button>}
          </div>
        </div>
      </Card>)}
      {list.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:C.sub,fontSize:13}}>No exercises found</div>}
    </div>
    <Modal open={!!editing} onClose={()=>setEditing(null)} title={editing==="new"?"New Exercise":`Edit: ${editing?.name||""}`}>
      <ExForm ex={editing==="new"?null:editing} onSave={saveEx} onClose={()=>setEditing(null)}/>
    </Modal>
  </div>;
}
function ExForm({ex,onSave,onClose}){
  const [f,setF]=useState({name:ex?.name||"",cat:ex?.cat||"Chest",equip:ex?.equip||"Barbell",muscles:ex?.muscles||"",videoUrl:ex?.videoUrl||""});
  return <div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div><Label>Name *</Label><Input value={f.name} onChange={v=>setF(p=>({...p,name:v}))} placeholder="Exercise name"/></div>
    <div><Label>Category</Label><Sel value={f.cat} onChange={v=>setF(p=>({...p,cat:v}))} options={CATS.filter(c=>c!=="All")}/></div>
    <div><Label>Equipment</Label><Sel value={f.equip} onChange={v=>setF(p=>({...p,equip:v}))} options={EQUIPS}/></div>
    <div><Label>Muscles</Label><Input value={f.muscles} onChange={v=>setF(p=>({...p,muscles:v}))} placeholder="e.g. Quads  -  Glutes"/></div>
    <div><Label>Video URL (YouTube/Vimeo)</Label><Input value={f.videoUrl} onChange={v=>setF(p=>({...p,videoUrl:v}))} placeholder="https://youtube.com/watch?v=..."/></div>
    <div style={{display:"flex",gap:8}}><Btn onClick={onClose} variant="secondary" style={{flex:1,justifyContent:"center"}}>Cancel</Btn><Btn onClick={()=>f.name.trim()&&onSave(f)} style={{flex:1,justifyContent:"center"}} disabled={!f.name.trim()}>Save</Btn></div>
  </div>;
}


const WORKOUT_TEMPLATES=[
  {name:"Push Day",exercises:[
    {exId:"e1",name:"Bench Press",cat:"Chest",sets:[{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false}]},
    {exId:"e13",name:"Incline Smith Machine Chest Press",cat:"Chest",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e6",name:"Cuffed Cable Fly",cat:"Chest",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e42",name:"Smith Machine Shoulder Press",cat:"Shoulders",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e44",name:"Lying Cable Cuffed Lateral Raise",cat:"Shoulders",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
    {exId:"e67",name:"Long Rope Overhead Tricep Extension",cat:"Triceps",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e66",name:"Long Rope Tricep Extension",cat:"Triceps",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
  ]},
  {name:"Pull Day",exercises:[
    {exId:"e20",name:"Deadlift",cat:"Back",sets:[{weight:"",reps:"5",done:false},{weight:"",reps:"5",done:false},{weight:"",reps:"5",done:false}]},
    {exId:"e24",name:"Straight Bar Lat Pulldown",cat:"Back",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e34",name:"Plate Loaded Low Row",cat:"Back",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e32",name:"Incline Cable Pullover",cat:"Back",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e48",name:"Cuffed Cable Rear Delt Fly",cat:"Shoulders",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
    {exId:"e58",name:"Behind The Body Cable Curl",cat:"Biceps",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e60",name:"Single Arm Cable Preacher Curl",cat:"Biceps",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
  ]},
  {name:"Leg Day",exercises:[
    {exId:"e83",name:"Reverse Banded Hack Squat",cat:"Legs",sets:[{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false}]},
    {exId:"e84",name:"45 Degree Leg Press",cat:"Legs",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e91",name:"Barbell Hip Thrust",cat:"Legs",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e95",name:"Barbell Romanian Deadlift",cat:"Legs",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e98",name:"Pin Loaded Lying Hamstring Curl",cat:"Legs",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e89",name:"Prime Leg Extension",cat:"Legs",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e101",name:"Seated Calf Raise",cat:"Legs",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
  ]},
  {name:"Upper Body",exercises:[
    {exId:"e3",name:"Dumbbell Incline Chest Press",cat:"Chest",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e21",name:"Bent Over Barbell Row",cat:"Back",sets:[{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false}]},
    {exId:"e40",name:"Overhead Press",cat:"Shoulders",sets:[{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false}]},
    {exId:"e23",name:"Pull Ups",cat:"Back",sets:[{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false},{weight:"",reps:"8",done:false}]},
    {exId:"e43",name:"Chest Supported Dumbbell Lateral Raise",cat:"Shoulders",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
    {exId:"e55",name:"Barbell Curl",cat:"Biceps",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e70",name:"Skull Crusher",cat:"Triceps",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
  ]},
  {name:"Lower Body",exercises:[
    {exId:"e80",name:"Squat",cat:"Legs",sets:[{weight:"",reps:"5",done:false},{weight:"",reps:"5",done:false},{weight:"",reps:"5",done:false},{weight:"",reps:"5",done:false}]},
    {exId:"e88",name:"Dumbbell Bulgarian Split Squats",cat:"Legs",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e94",name:"45 Degree Hip Extension",cat:"Legs",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e97",name:"Stiff Leg Deadlift",cat:"Legs",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e99",name:"Plate Loaded Seated Hamstring Curl",cat:"Legs",sets:[{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false},{weight:"",reps:"12",done:false}]},
    {exId:"e100",name:"Pin Loaded Adductor",cat:"Legs",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
    {exId:"e103",name:"Calf Press on Pin Loaded Leg Press",cat:"Legs",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
  ]},
  {name:"Conditioning",exercises:[
    {exId:"e120",name:"Ski Erg",cat:"Cardio",sets:[{weight:"5",reps:"mins",done:false},{weight:"5",reps:"mins",done:false},{weight:"5",reps:"mins",done:false}]},
    {exId:"e121",name:"Rowing Machine",cat:"Cardio",sets:[{weight:"500",reps:"m",done:false},{weight:"500",reps:"m",done:false},{weight:"500",reps:"m",done:false}]},
    {exId:"e124",name:"Burpees",cat:"Cardio",sets:[{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false},{weight:"",reps:"15",done:false}]},
    {exId:"e122",name:"Assault Bike",cat:"Cardio",sets:[{weight:"",reps:"30 secs",done:false},{weight:"",reps:"30 secs",done:false},{weight:"",reps:"30 secs",done:false}]},
    {exId:"e129",name:"Kettlebell Swings",cat:"Cardio",sets:[{weight:"",reps:"20",done:false},{weight:"",reps:"20",done:false},{weight:"",reps:"20",done:false}]},
    {exId:"e125",name:"Box Jumps",cat:"Cardio",sets:[{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false},{weight:"",reps:"10",done:false}]},
    {exId:"e127",name:"Sled Push",cat:"Cardio",sets:[{weight:"",reps:"20m",done:false},{weight:"",reps:"20m",done:false},{weight:"",reps:"20m",done:false}]},
  ]},
];

// ── WORKOUT LOGGER ────────────────────────────────────────────────────────────
function WorkoutLogger({workouts,setWorkouts,onWorkoutSave,exercises,setExercises,programmes,clientProgrammeId,orms:extOrms={}}){
  const [view,setView]=useState("history"); const [active,setActive]=useState(null); const [elapsed,setElapsed]=useState(0); const [pickEx,setPickEx]=useState(false); const [openId,setOpenId]=useState(null);
  const orms=useMemo(()=>{const m={};workouts.forEach(w=>w.exercises.forEach(ex=>{ex.sets.forEach(s=>{const v=epley(s.weight,s.reps);if(v>0&&(!m[ex.exId||ex.name]||v>m[ex.exId||ex.name]))m[ex.exId||ex.name]=v;});}));return{...m,...extOrms};},[workouts,extOrms]);
  useEffect(()=>{if(view!=="active")return;const t=setInterval(()=>setElapsed(e=>e+1),1000);return()=>clearInterval(t);},[view]);
  const fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const lastSets=(exId,name)=>{for(let i=workouts.length-1;i>=0;i--){const ex=workouts[i].exercises.find(e=>(exId&&e.exId===exId)||e.name===name);if(ex)return ex.sets;}return null;};
  const start=prog=>{const exs=prog?prog.exercises.map(pe=>{const ex=exercises.find(e=>e.id===pe.exId)||{name:pe.exId,cat:"Other",id:pe.exId};return{exId:ex.id,name:ex.name,cat:ex.cat,sets:Array.from({length:pe.sets||3},()=>({weight:"",reps:pe.reps||"",done:false}))};}):[];setActive({name:prog?.name||"Workout",exercises:exs});setElapsed(0);setView("active");};
  const addEx=ex=>{setActive(a=>({...a,exercises:[...a.exercises,{exId:ex.id,name:ex.name,cat:ex.cat,sets:[{weight:"",reps:"",done:false}]}]}));setPickEx(false);};
  const addSet=ei=>setActive(a=>{const es=[...a.exercises],last=es[ei].sets.at(-1);es[ei]={...es[ei],sets:[...es[ei].sets,{weight:last.weight,reps:last.reps,done:false}]};return{...a,exercises:es};});
  const updSet=(ei,si,k,v)=>setActive(a=>{const es=[...a.exercises],ss=[...es[ei].sets];ss[si]={...ss[si],[k]:v};es[ei]={...es[ei],sets:ss};return{...a,exercises:es};});
  const togSet=(ei,si)=>setActive(a=>{const es=[...a.exercises],ss=[...es[ei].sets];ss[si]={...ss[si],done:!ss[si].done};es[ei]={...es[ei],sets:ss};return{...a,exercises:es};});
  const remEx=ei=>setActive(a=>({...a,exercises:a.exercises.filter((_,i)=>i!==ei)}));
  const [savedMsg,setSavedMsg]=useState(false);
  const finish=()=>{const w={id:uid(),name:active.name,date:new Date().toISOString(),duration:Math.round(elapsed/60),exercises:active.exercises};if(onWorkoutSave)onWorkoutSave(w);else setWorkouts(p=>[...p,w]);setSavedMsg(true);setTimeout(()=>setSavedMsg(false),1800);setView("history");setActive(null);setElapsed(0);};
  const assignedProg=programmes?.find(p=>p.id===clientProgrammeId);

  if(pickEx)return <div><div style={{padding:"18px 20px 0",display:"flex",alignItems:"center",gap:12}}><button onClick={()=>setPickEx(false)} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button><span style={{fontSize:18,fontWeight:700,color:C.white}}>Pick Exercise</span></div><ExLib exercises={exercises} setExercises={setExercises} onPick={addEx}/></div>;

  if(view==="active"){
    const total=active.exercises.reduce((a,ex)=>a+ex.sets.length,0),done=active.exercises.reduce((a,ex)=>a+ex.sets.filter(s=>s.done).length,0),pct=total>0?done/total:0;
    return <div>
      <div style={{padding:"20px 20px 16px",background:`linear-gradient(135deg,${C.dark3},${C.dark2})`,borderBottom:border(0.1)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div><input value={active.name} onChange={e=>setActive(a=>({...a,name:e.target.value}))} style={{background:"none",border:"none",color:C.white,fontSize:20,fontWeight:700,outline:"none",padding:0,fontFamily:FONT,width:210}}/><div style={{fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:5,marginTop:2}}><Icon d={Icons.clock} size={12} color={C.muted}/>{fmt(elapsed)}</div></div>
          <Btn onClick={finish} variant="success" style={{padding:"10px 18px",fontSize:13}} icon="check">Finish</Btn>
        </div>
        <div style={{display:"flex",gap:12,marginBottom:8}}><span style={{fontSize:12,color:C.muted}}><b style={{color:C.white}}>{active.exercises.length}</b> exercises</span><span style={{fontSize:12,color:C.muted}}><b style={{color:C.white}}>{done}/{total}</b> sets</span></div>
        <div style={{background:C.dark4,borderRadius:4,height:3,overflow:"hidden"}}><div style={{background:C.grad,height:"100%",width:`${pct*100}%`,borderRadius:4,transition:"width 0.3s"}}/></div>
      </div>
      <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
        {active.exercises.map((ex,ei)=>{
          const last=lastSets(ex.exId,ex.name),exOrm=orms[ex.exId||ex.name]||0;
          return <Card key={ei}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <div><div style={{fontWeight:600,fontSize:15,color:C.white}}>{ex.name}</div><div style={{fontSize:11,color:C.sub}}>{ex.cat}</div></div>
              <button onClick={()=>remEx(ei)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon d={Icons.trash} size={15} color={C.sub}/></button>
            </div>
            {last&&<div style={{background:glass(0.04),borderRadius:10,padding:"7px 12px",marginBottom:8,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",border:border(0.07)}}><span style={{fontSize:10,color:C.gold,fontWeight:700}}>LAST TIME</span>{last.slice(0,3).map((s,i)=><span key={i} style={{fontSize:11,color:C.muted}}>{s.weight||"-"}kgx{s.reps||"-"}</span>)}</div>}
            <div style={{display:"grid",gridTemplateColumns:"26px 1fr 1fr 52px 36px",gap:5,marginBottom:5}}>{["SET","KG","REPS","%1RM",""].map((h,i)=><div key={i} style={{fontSize:9,color:C.sub,fontWeight:700,letterSpacing:"0.08em",textAlign:"center"}}>{h}</div>)}</div>
            {ex.sets.map((set,si)=>{const curr=epley(set.weight,set.reps),pct=exOrm>0&&curr>0?Math.round(parseFloat(set.weight)/exOrm*100):null;return <div key={si} style={{display:"grid",gridTemplateColumns:"26px 1fr 1fr 52px 36px",gap:5,marginBottom:5,alignItems:"center",opacity:set.done?0.45:1}}>
              <div style={{fontSize:11,color:C.sub,textAlign:"center",fontWeight:600}}>{si+1}</div>
              <input value={set.weight} onChange={e=>updSet(ei,si,"weight",e.target.value)} placeholder="0" type="number" style={{background:glass(0.06),border:border(0.1),borderRadius:9,padding:"8px 4px",color:C.white,fontSize:14,textAlign:"center",outline:"none",width:"100%",fontFamily:FONT}}/>
              <input value={set.reps} onChange={e=>updSet(ei,si,"reps",e.target.value)} placeholder="0" type="number" style={{background:glass(0.06),border:border(0.1),borderRadius:9,padding:"8px 4px",color:C.white,fontSize:14,textAlign:"center",outline:"none",width:"100%",fontFamily:FONT}}/>
              <div style={{fontSize:10,color:pct?(pct>=85?C.green:pct>=70?C.gold:C.muted):C.sub,textAlign:"center",fontWeight:700}}>{pct?`${pct}%`:"-"}</div>
              <button onClick={()=>togSet(ei,si)} style={{width:34,height:34,borderRadius:10,border:`1px solid ${set.done?C.green+"60":border(0.12)}`,background:set.done?`${C.green}20`:glass(0.05),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{set.done&&<Icon d={Icons.check} size={14} color={C.green}/>}</button>
            </div>;})}
            <button onClick={()=>addSet(ei)} style={{width:"100%",background:"none",border:`1px dashed ${C.dark4}`,borderRadius:10,padding:"8px 0",color:C.sub,fontSize:12,cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon d={Icons.plus} size={12} color={C.sub}/>Add set</button>
          </Card>;
        })}
        <Btn onClick={()=>setPickEx(true)} variant="secondary" style={{width:"100%",padding:14,justifyContent:"center"}} icon="plus">Add Exercise</Btn>
      </div>
    </div>;
  }

  return <div>
    <Toast msg="Workout saved!" show={savedMsg}/>
    <PageHead title="Workouts" sub={`${workouts.length} sessions`} right={<Btn onClick={()=>start(null)} style={{padding:"9px 16px",fontSize:13}} icon="bolt">Start</Btn>}/>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
      {assignedProg&&<Card style={{background:`linear-gradient(135deg,${C.blue}18,${C.purple}12)`,border:`1px solid ${C.blue}30`}}>
        <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.1em",marginBottom:5}}>YOUR PROGRAMME</div>
        <div style={{fontWeight:700,fontSize:16,color:C.white,marginBottom:3}}>{assignedProg.name}</div>
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>{assignedProg.goal}  -  {assignedProg.days?.length||0} days</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{(assignedProg.days||[]).map((day,i)=><Btn key={i} onClick={()=>start(day)} variant="secondary" style={{padding:"8px 14px",fontSize:12}} icon="bolt">{day.name}</Btn>)}</div>
      </Card>}
      {[...workouts].reverse().map(w=>{const open=openId===w.id;const vol=w.exercises.reduce((a,ex)=>a+ex.sets.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0);return <Card key={w.id} onClick={()=>setOpenId(open?null:w.id)} style={{border:open?`1px solid ${C.blue}40`:border(0.09)}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
          <div><div style={{fontWeight:600,fontSize:15,color:C.white}}>{w.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmtDate(w.date)}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:700,color:C.blue}}>{w.duration||"-"}<span style={{fontSize:11,color:C.muted}}> min</span></div><div style={{fontSize:11,color:C.sub}}>{w.exercises?.length||0} ex</div></div>
        </div>
        {!open&&<div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>{w.exercises.slice(0,4).map((ex,i)=><span key={i} style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:glass(0.06),color:C.muted,border:border(0.08)}}>{ex.name}</span>)}</div>}
        {open&&<div style={{marginTop:12,paddingTop:12}}>
          <Divider/>{vol>0&&<div style={{fontSize:12,color:C.blue,marginBottom:10,fontWeight:600}}>Volume: {vol.toLocaleString()}kg</div>}
          {w.exercises.map((ex,i)=>{const eOrm=Math.max(...ex.sets.map(s=>epley(s.weight,s.reps)).filter(v=>v>0),0);return <div key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontWeight:600,fontSize:13,color:C.white}}>{ex.name}</span>{eOrm>0&&<span style={{fontSize:11,color:C.purple,fontWeight:600}}>Est. 1RM {eOrm.toFixed(1)}kg</span>}</div>
            {ex.sets.map((s,j)=>{const p=eOrm>0&&s.weight?Math.round(parseFloat(s.weight)/eOrm*100):null;return <div key={j} style={{display:"flex",gap:10,fontSize:12,color:C.muted,marginBottom:2,alignItems:"center"}}><span style={{color:C.sub,fontWeight:600,minWidth:36}}>Set {j+1}</span><span>{s.weight||"-"}kgx{s.reps||"-"}</span>{p&&<span style={{color:p>=85?C.green:C.gold}}>{p}%</span>}{s.done&&<Icon d={Icons.check} size={11} color={C.green}/>}</div>;})}</div>;
          })}
          <Btn onClick={e=>{e.stopPropagation();if(window.confirm("Delete this workout? This cannot be undone.")){{setWorkouts(p=>p.filter(x=>x.id!==w.id));setOpenId(null);}}}} variant="danger" style={{width:"100%",padding:"9px 0",marginTop:6,fontSize:12,justifyContent:"center"}} icon="trash">Delete</Btn>
        </div>}
      </Card>;})}
      {/* Templates section */}
      <div style={{fontSize:10,color:C.sub,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6,marginTop:4}}>Quick Start Templates</div>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,marginBottom:8}}>
        {WORKOUT_TEMPLATES.map((t,i)=><button key={i} onClick={()=>{setActive({name:t.name,exercises:t.exercises.map(e=>({...e,sets:e.sets.map(s=>({...s}))}))});setElapsed(0);setView("active");}} style={{flexShrink:0,padding:"9px 16px",borderRadius:12,background:glass(0.06),border:border(0.1),color:C.white,cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:600,whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:6}}><Icon d={Icons.bolt} size={12} color={C.gold}/>{t.name}</button>)}
      </div>
      {workouts.length===0&&<div style={{textAlign:"center",padding:"40px 20px"}}><div style={{width:60,height:60,borderRadius:20,background:glass(0.05),border:border(0.1),display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Icon d={Icons.dumbbell} size={28} color={C.sub}/></div><div style={{fontWeight:700,fontSize:18,color:C.white,marginBottom:8}}>No sessions yet</div><div style={{color:C.muted,marginBottom:20,fontSize:14}}>Every rep counts. Start your first session.</div><Btn onClick={()=>start(null)} style={{justifyContent:"center"}} icon="bolt">Start Workout</Btn></div>}
    </div>
  </div>;
}


function CheckInPage({clientId, workouts, habits, habitLog, metrics, setMetrics, onReward, tier="foundation"}) {
  const today = toDay();
  const [checkInLog, setCheckInLog] = useState({});
  const [formView, setFormView] = useState("hub"); // hub | daily | weekly
  const [answers, setAnswers] = useState({});
  const [ready, setReady] = useState(false);
  const [savedToast,setSavedToast]=useState(false);
  const todayEntry = checkInLog[today];
  const todayDailyDone = !!(todayEntry?.daily);
  const todayWeeklyDone = !!(todayEntry?.weekly);

  // Which day of week is it? Sunday = show weekly prompt
  const dayOfWeek = new Date().getDay();
  const isWeeklyDay = dayOfWeek === 0; // Sunday
  const streak = ready ? getStreak({...checkInLog,...Object.fromEntries(Object.entries(checkInLog).map(([k,v])=>[k,v.daily||v.weekly?[1]:[]]))},1) : 0;

  useEffect(()=>{
    db.get(cKey(clientId,"checkin-log"),true).then(l=>{
      setCheckInLog(l||{});
      setReady(true);
    });
  },[clientId]);

  const tierForms = TIER_FORMS[tier] || TIER_FORMS.foundation;
  const wkDone = workouts.filter(w=>(Date.now()-new Date(w.date))/864e5<=7).length;
  const habDone = (habitLog[today]||[]).length;

  const setA = (id,val) => setAnswers(p=>({...p,[id]:val}));

  const submitForm = async(type) => {
    const entry = answers;
    // Save metrics if weight provided
    if(entry.weight){
      const firstW = metrics[0]?.weight;
      // Convert lbs to kg for internal storage
      const weightKg = parseFloat(entry.weight)*0.453592;
      const newM = {id:uid(),date:today,weight:weightKg.toFixed(1),...entry};
      const newMetrics = [...metrics,newM];
      setMetrics(newMetrics);
      db.set(cKey(clientId,"metrics"),newMetrics,true);
      if(firstW){
        const lostKg = parseFloat(firstW)-(weightKg);
        if(lostKg>0.5) onReward(buildWeightReward(lostKg));
      }
    }
    const updated = {...checkInLog,[today]:{...checkInLog[today],[type]:{...entry,submittedAt:new Date().toISOString()}}};
    setCheckInLog(updated);
    db.set(cKey(clientId,"checkin-log"),updated,true);
    // Streak reward
    const allDays = Object.keys(updated).filter(k=>updated[k]?.daily||updated[k]?.weekly);
    const strk = allDays.length;
    const r = buildStreakReward(strk);
    if(r) onReward(r);
    setAnswers({});
    setFormView("hub");
    setSavedToast(true);setTimeout(()=>setSavedToast(false),1800);
  };

  // Renders a single form field
  const renderField = (field) => {
    const val = answers[field.id]||"";
    const setVal = v => setA(field.id,v);
    const labelStyle = {fontSize:11,color:C.sub,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7,display:"block"};
    const condHide = field.showIf && answers[field.showIf.id]!==field.showIf.val;
    if(condHide) return null;
    if(field.type==="photos") return(
      <div key={field.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.dark4}`}}>
        <span style={labelStyle}>{field.label}</span>
        <div style={{fontSize:12,color:C.muted,padding:"10px 14px",background:glass(0.04),borderRadius:10,border:border(0.08)}}>
          <Icon d={Icons.photo} size={14} color={C.muted} style={{display:"inline",marginRight:6}}/>
          Go to Stats -> Photos tab to attach your progress photos.
        </div>
      </div>
    );
    if(field.type==="select") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label}</span>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {field.options.map(o=>{
            const active=val===o;
            return <button key={o} onClick={()=>setVal(o)} style={{padding:"8px 14px",borderRadius:10,border:`1.5px solid ${active?C.blue:C.dark4}`,background:active?`${C.blue}20`:glass(0.04),color:active?C.blue:C.muted,fontSize:12,fontWeight:active?700:500,cursor:"pointer",fontFamily:FONT,transition:"all 0.15s"}}>{o}</button>;
          })}
        </div>
      </div>
    );
    if(field.type==="number") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label}{field.unit&&<span style={{color:C.sub,marginLeft:4,textTransform:"lowercase",letterSpacing:0}}>({field.unit})</span>}</span>
        <div style={{position:"relative"}}>
          <Input value={val} onChange={setVal} type="number" placeholder={field.placeholder||"-"} style={{paddingRight:field.unit?44:16}}/>
          {field.unit&&<span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:11,color:C.sub,fontWeight:600,pointerEvents:"none"}}>{field.unit}</span>}
        </div>
      </div>
    );
    if(field.type==="text") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label}</span>
        <Input value={val} onChange={setVal} placeholder={field.placeholder||""}/>
      </div>
    );
    if(field.type==="textarea") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label}{field.optional&&<span style={{color:C.sub,marginLeft:4,fontWeight:400,fontSize:10,letterSpacing:0,textTransform:"none"}}>(optional)</span>}</span>
        <textarea value={val} onChange={e=>setVal(e.target.value)} placeholder={field.placeholder||""} style={{width:"100%",minHeight:72,background:glass(0.05),border:border(0.1),borderRadius:12,padding:"10px 14px",color:C.white,fontSize:13,outline:"none",resize:"none",fontFamily:FONT,boxSizing:"border-box",lineHeight:1.55}}/>
      </div>
    );
    if(field.type==="scale") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label} <span style={{color:C.blue,fontWeight:700}}>{val||field.min}</span></span>
        <input type="range" min={field.min} max={field.max} value={val||field.min} onChange={e=>setVal(e.target.value)} style={{width:"100%",accentColor:C.blue}}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.sub,marginTop:3}}>
          <span>{field.min}</span><span>{field.max}</span>
        </div>
      </div>
    );
    if(field.type==="days") return(
      <div key={field.id} style={{marginBottom:14}}>
        <span style={labelStyle}>{field.label}</span>
        <div style={{display:"flex",gap:6}}>
          {[1,2,3,4,5,6,7].map(d=>{
            const active=parseInt(val||0)>=d;
            return <button key={d} onClick={()=>setVal(d.toString())} style={{flex:1,padding:"10px 0",borderRadius:9,border:`1.5px solid ${active?C.blue:C.dark4}`,background:active?`${C.blue}20`:glass(0.04),color:active?C.blue:C.muted,fontSize:13,fontWeight:active?700:500,cursor:"pointer",fontFamily:FONT}}>{d}</button>;
          })}
        </div>
      </div>
    );
    return null;
  };

  // ── DAILY FORM VIEW ──────────────────────────────────────────────────────────
  if(formView==="daily") return(
    <div>
      <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>{setFormView("hub");setAnswers({});}} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon d={Icons.back} size={16} color={C.white}/>
        </button>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Daily Check-In</div>
          <div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>
            {TIERS[tier]?.name||"Daily"}
          </div>
        </div>
        <TierBadge tier={tier} style={{marginLeft:"auto"}}/>
      </div>
      <div style={{padding:"14px 20px",paddingBottom:100}}>
        <Card>
          {(tierForms.daily||[]).map(f=>renderField(f))}
          <div style={{borderTop:`1px solid ${C.dark4}`,paddingTop:14,marginTop:4}}>
            <Btn onClick={()=>submitForm("daily")} style={{width:"100%",justifyContent:"center",padding:15,fontSize:15}} icon="check">
              Submit Check-In
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );

  // ── WEEKLY FORM VIEW ─────────────────────────────────────────────────────────
  if(formView==="weekly") return(
    <div>
      <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>{setFormView("hub");setAnswers({});}} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Icon d={Icons.back} size={16} color={C.white}/>
        </button>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase"}}>Weekly Check-In</div>
          <div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>
            {TIERS[tier]?.name||"Weekly"}
          </div>
        </div>
        <TierBadge tier={tier} style={{marginLeft:"auto"}}/>
      </div>
      <div style={{padding:"14px 20px",paddingBottom:100}}>
        <Card>
          {(tierForms.weekly||[]).map(f=>renderField(f))}
          <div style={{borderTop:`1px solid ${C.dark4}`,paddingTop:14,marginTop:4}}>
            <Btn onClick={()=>submitForm("weekly")} style={{width:"100%",justifyContent:"center",padding:15,fontSize:15}} icon="check">
              Submit Weekly Review
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );

  // ── HUB VIEW ─────────────────────────────────────────────────────────────────
  const [showHistory,setShowHistory]=useState(false);
  if(showHistory) return <CheckInHistory clientId={clientId} tier={tier} onBack={()=>setShowHistory(false)}/>;

  return(
    <div>
      <Toast msg="Check-in submitted!" show={savedToast}/>
      <div style={{background:`linear-gradient(160deg,${C.gold}22 0%,${C.purple}10 100%)`,padding:"52px 20px 20px",marginBottom:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Check In</div>
            <div style={{fontSize:28,fontWeight:700,color:C.white,letterSpacing:"-0.04em",lineHeight:1}}>Daily Standards</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <TierBadge tier={tier}/>
            <button onClick={()=>setShowHistory(true)} style={{background:glass(0.08),border:border(0.1),color:C.muted,borderRadius:10,padding:"5px 12px",cursor:"pointer",fontFamily:FONT,fontSize:11,fontWeight:600,display:"flex",alignItems:"center",gap:4}}><Icon d={Icons.clock} size={11} color={C.muted}/>History</button>
          </div>
        </div>
      </div>
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>

        {/* Streak card */}
        <Card style={{background:`linear-gradient(135deg,${C.dark4},${C.dark3})`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div>
              <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>
                {ready&&Object.keys(checkInLog).length>0?`${Object.keys(checkInLog).length} DAY STREAK`:"START YOUR STREAK"}
              </div>
              <div style={{fontSize:17,fontWeight:700,color:C.white,letterSpacing:"-0.02em"}}>
                {ready&&Object.keys(checkInLog).length>0?`${Object.keys(checkInLog).length} days of showing up`:"Check in today"}
              </div>
            </div>
            <div style={{width:46,height:46,borderRadius:14,background:`${C.gold}20`,border:`1px solid ${C.gold}40`,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon d={Icons.flame} size={22} color={C.gold}/>
            </div>
          </div>
          <StreakCalendar checkInLog={Object.fromEntries(Object.entries(checkInLog).map(([k,v])=>[k,v.daily||v.weekly?true:false]))}/>
        </Card>

        {/* Daily CTA */}
        {!todayDailyDone?(
          <button onClick={()=>{setAnswers({});setFormView("daily");}} style={{width:"100%",background:C.grad,border:"none",borderRadius:18,padding:"18px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:`0 4px 20px ${C.blue}30`}}>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>Daily Check-In</div>
              <div style={{fontSize:17,fontWeight:700,color:C.white,letterSpacing:"-0.02em"}}>Your check-in is today</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:3}}>{TIERS[tier]?.name}  -  {(tierForms.daily||[]).filter(f=>f.type!=="photos").length} questions</div>
            </div>
            <Icon d={Icons.chevronR} size={22} color={C.white}/>
          </button>
        ):(
          <Card style={{border:`1px solid ${C.green}30`,background:`${C.green}08`,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:11,background:`${C.green}22`,border:`1px solid ${C.green}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon d={Icons.check} size={18} color={C.green}/>
              </div>
              <div>
                <div style={{fontWeight:700,color:C.white,fontSize:14}}>Daily check-in done</div>
                <div style={{fontSize:11,color:C.muted,marginTop:1}}>Effort is being tracked. Now we make it translate.</div>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly CTA */}
        {!todayWeeklyDone?(
          <Card style={{border:border(0.1),padding:"15px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Weekly Review</div>
                <div style={{fontWeight:600,fontSize:14,color:C.white}}>Submit your week to the coach</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>{TIERS[tier]?.name}  -  {(tierForms.weekly||[]).filter(f=>f.type!=="photos").length} questions</div>
              </div>
              <Btn onClick={()=>{setAnswers({});setFormView("weekly");}} variant="secondary" style={{padding:"9px 16px",fontSize:12}}>Start</Btn>
            </div>
          </Card>
        ):(
          <Card style={{border:`1px solid ${C.purple}30`,background:`${C.purple}08`,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:11,background:`${C.purple}22`,border:`1px solid ${C.purple}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon d={Icons.check} size={18} color={C.purple}/>
              </div>
              <div>
                <div style={{fontWeight:700,color:C.white,fontSize:14}}>Weekly review submitted</div>
                <div style={{fontSize:11,color:C.muted,marginTop:1}}>Your coach will review this and respond.</div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <Card style={{padding:"14px 16px"}}>
            <div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Sessions</div>
            <div style={{fontSize:24,fontWeight:700,color:C.blue}}>{wkDone}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>this week</div>
          </Card>
          <Card style={{padding:"14px 16px"}}>
            <div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Check-Ins</div>
            <div style={{fontSize:24,fontWeight:700,color:C.gold}}>{Object.keys(checkInLog).length}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:2}}>all time</div>
          </Card>
        </div>

        {/* Recent submissions */}
        {Object.keys(checkInLog).length>0&&(
          <div>
            <Label>Recent Check-Ins</Label>
            {Object.entries(checkInLog).slice(-4).reverse().map(([date,ci])=>{
              const hasDaily=!!ci.daily, hasWeekly=!!ci.weekly;
              return(
                <div key={date} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.dark4}`}}>
                  <div style={{width:32,height:32,borderRadius:10,background:`${C.green}18`,border:`1px solid ${C.green}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon d={Icons.check} size={13} color={C.green}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.white}}>{fmtDate(date)}</div>
                    <div style={{display:"flex",gap:4,marginTop:3}}>
                      {hasDaily&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:`${C.blue}20`,color:C.blue,fontWeight:700,letterSpacing:"0.06em"}}>DAILY</span>}
                      {hasWeekly&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:4,background:`${C.purple}20`,color:C.purple,fontWeight:700,letterSpacing:"0.06em"}}>WEEKLY</span>}
                    </div>
                    {ci.daily?.weight&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{ci.daily.weight} lbs{ci.daily.energy?`  -  Energy: ${ci.daily.energy}`:""}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// CONTENT LIBRARY - Coach adds resources; clients see what matches their tier
// ─────────────────────────────────────────────────────────────────────────────
function ContentLibrary({isCoach=false, clientTier="foundation", onBack}) {
  const [resources, setResources] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({title:"",type:"link",url:"",body:"",category:"General",tiers:["foundation","standard","performer","self_leader","peak"]});

  useEffect(()=>{
    db.get("rdh:content",true).then(r=>{setResources(r||[]);setReady(true);});
  },[]);

  const save = async() => {
    if(!form.title.trim()) return;
    const item = {...form, id:uid(), createdAt:toDay()};
    let updated;
    if(editing){updated=resources.map(r=>r.id===editing.id?{...item,id:editing.id}:r);}
    else{updated=[...resources,item];}
    setResources(updated);
    db.set("rdh:content",updated,true);
    setForm({title:"",type:"link",url:"",body:"",category:"General",tiers:["foundation","standard","performer","self_leader","peak"]});
    setAdding(false); setEditing(null);
  };

  const del = (id) => {
    const updated=resources.filter(r=>r.id!==id);
    setResources(updated);
    db.set("rdh:content",updated,true);
  };

  const toggleTier = (t) => setForm(p=>({...p,tiers:p.tiers.includes(t)?p.tiers.filter(x=>x!==t):[...p.tiers,t]}));

  // Clients only see resources for their tier
  const visible = isCoach
    ? resources
    : resources.filter(r=>!r.tiers||r.tiers.includes(clientTier));

  const filtered = filterCat==="All" ? visible : visible.filter(r=>r.category===filterCat);
  const cats = ["All",...CONTENT_CATS];

  const typeIcon = (t) => t==="video"?Icons.run:t==="text"?Icons.clipboard:Icons.note;
  const typeColor = (t) => t==="video"?C.red:t==="text"?C.purple:C.blue;

  const showForm = adding || !!editing;

  return (
    <div>
      <div style={{padding:"52px 20px 16px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>{isCoach?"Coach":"Resources"}</div>
          <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>Content Library</div>
        </div>
        {isCoach&&!showForm&&<Btn onClick={()=>{setForm({title:"",type:"link",url:"",body:"",category:"General",tiers:["foundation","standard","performer","self_leader","peak"]});setAdding(true);}} style={{padding:"9px 16px",fontSize:13}} icon="plus">Add</Btn>}
      </div>

      {/* Add / Edit Form */}
      {showForm&&(
        <div style={{padding:"0 20px 20px"}}>
          <Card>
            <div style={{fontWeight:700,fontSize:16,color:C.white,marginBottom:16,letterSpacing:"-0.02em"}}>{editing?"Edit Resource":"New Resource"}</div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div><Label>Title *</Label><Input value={form.title} onChange={v=>setForm(p=>({...p,title:v}))} placeholder="e.g. How to hit protein on rest days"/></div>
              <div>
                <Label>Type</Label>
                <div style={{display:"flex",gap:6}}>
                  {[["link","Link"],["text","Text/Note"],["video","Video"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setForm(p=>({...p,type:v}))} style={{flex:1,padding:"9px 0",borderRadius:11,border:`1.5px solid ${form.type===v?C.blue:C.dark4}`,background:form.type===v?`${C.blue}20`:glass(0.04),color:form.type===v?C.blue:C.muted,fontSize:12,fontWeight:form.type===v?700:500,cursor:"pointer",fontFamily:FONT}}>{l}</button>
                  ))}
                </div>
              </div>
              {(form.type==="link"||form.type==="video")&&<div><Label>URL</Label><Input value={form.url} onChange={v=>setForm(p=>({...p,url:v}))} placeholder="https://..."/></div>}
              <div><Label>Content / Description</Label>
                <textarea value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} placeholder="Add notes, context, or the full text content here..." style={{width:"100%",minHeight:90,background:glass(0.05),border:border(0.1),borderRadius:12,padding:"10px 14px",color:C.white,fontSize:13,outline:"none",resize:"none",fontFamily:FONT,boxSizing:"border-box",lineHeight:1.55}}/>
              </div>
              <div>
                <Label>Category</Label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {CONTENT_CATS.map(c=><button key={c} onClick={()=>setForm(p=>({...p,category:c}))} style={{padding:"6px 12px",borderRadius:9,border:`1.5px solid ${form.category===c?C.purple:C.dark4}`,background:form.category===c?`${C.purple}20`:glass(0.04),color:form.category===c?C.purple:C.muted,fontSize:11,fontWeight:form.category===c?700:500,cursor:"pointer",fontFamily:FONT}}>{c}</button>)}
                </div>
              </div>
              {isCoach&&<div>
                <Label>Visible to tiers</Label>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {TIER_ORDER.map(t=>{
                    const active=form.tiers.includes(t), tier=TIERS[t];
                    return <button key={t} onClick={()=>toggleTier(t)} style={{padding:"6px 12px",borderRadius:9,border:`1.5px solid ${active?tier.color:C.dark4}`,background:active?`${tier.color}20`:glass(0.04),color:active?tier.color:C.muted,fontSize:11,fontWeight:active?700:500,cursor:"pointer",fontFamily:FONT}}>{tier.name}</button>;
                  })}
                </div>
              </div>}
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <Btn onClick={()=>{setAdding(false);setEditing(null);}} variant="secondary" style={{flex:1,justifyContent:"center"}}>Cancel</Btn>
                <Btn onClick={save} style={{flex:1,justifyContent:"center"}} disabled={!form.title.trim()} icon="check">Save</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Filter pills */}
      {!showForm&&<div style={{padding:"0 20px 12px",display:"flex",gap:6,overflowX:"auto"}}>
        {cats.map(c=><Pill key={c} label={c} active={filterCat===c} onClick={()=>setFilterCat(c)} color={C.purple}/>)}
      </div>}

      {/* Resource list */}
      {!showForm&&<div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
        {filtered.map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",gap:10}}>
              <div style={{width:36,height:36,borderRadius:11,background:`${typeColor(r.type)}18`,border:`1px solid ${typeColor(r.type)}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon d={typeIcon(r.type)} size={16} color={typeColor(r.type)}/>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:C.white,lineHeight:1.2,marginBottom:4}}>{r.title}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:r.body?6:0}}>
                  <span style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:`${C.purple}20`,color:C.purple,fontWeight:600}}>{r.category}</span>
                  {isCoach&&(r.tiers||[]).length<5&&(r.tiers||[]).map(t=><span key={t} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:`${TIERS[t]?.color||C.muted}18`,color:TIERS[t]?.color||C.muted,fontWeight:600}}>{TIERS[t]?.name||t}</span>)}
                </div>
                {r.body&&<div style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{r.body.length>120?r.body.slice(0,120)+"...":r.body}</div>}
                {r.url&&<a href={r.url} target="_blank" rel="noreferrer" style={{fontSize:11,color:C.blue,marginTop:4,display:"block",wordBreak:"break-all"}}>{r.url.length>50?r.url.slice(0,50)+"...":r.url}</a>}
              </div>
              {isCoach&&<div style={{display:"flex",gap:5,flexDirection:"column"}}>
                <button onClick={()=>{setEditing(r);setForm({...r});}} style={{background:glass(0.07),border:border(0.1),color:C.muted,width:30,height:30,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon d={Icons.edit} size={12} color={C.muted}/>
                </button>
                <button onClick={()=>del(r.id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:4}}>
                  <Icon d={Icons.trash} size={12} color={C.sub}/>
                </button>
              </div>}
            </div>
          </Card>
        ))}
        {filtered.length===0&&!showForm&&(
          <div style={{textAlign:"center",padding:"50px 20px",color:C.sub}}>
            <Icon d={Icons.clipboard} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/>
            <div style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:4}}>{isCoach?"No resources yet":"Nothing here yet"}</div>
            <div style={{fontSize:12}}>{isCoach?"Add your first resource above.":"Your coach will add resources here."}</div>
          </div>
        )}
      </div>}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// EMAIL-BASED INVITE AUTH (replaces open name sign-in)
// Coach generates invite codes -> client registers with email + code
// ─────────────────────────────────────────────────────────────────────────────

function NutritionPage({clientId, tier, isCoach}) {
  const [plans, setPlans] = useState({});
  const [view, setView] = useState("view"); // view | build
  const [dayType, setDayType] = useState("training");
  const [editSlot, setEditSlot] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [targets, setTargets] = useState({protein:180,carbs:300,fat:40,calories:2280});
  const [targetView, setTargetView] = useState("training");
  const [ready, setReady] = useState(false);
  const key = isCoach ? `rdh:c:${clientId}:mealplans` : cKey(clientId,"mealplans");

  useEffect(()=>{
    db.get(key,true).then(p=>{
      if(p) setPlans(p);
      else setPlans({
        training:{targets:{protein:180,carbs:300,fat:40,calories:2280},slots:{}},
        non_training:{targets:{protein:180,carbs:175,fat:55,calories:1915},slots:{}}
      });
      setReady(true);
    });
  },[clientId]);

  const save = async(updated) => {
    setPlans(updated);
    db.set(key, updated, true);
  };

  const addFood = (food, slot) => {
    const updated = JSON.parse(JSON.stringify(plans));
    if(!updated[dayType]) updated[dayType] = {targets:{protein:0,carbs:0,fat:0,calories:0},slots:{}};
    if(!updated[dayType].slots[slot]) updated[dayType].slots[slot] = [];
    updated[dayType].slots[slot].push({...food, portions:1, id:uid()});
    save(updated);
    setEditSlot(null); setFoodSearch("");
  };

  const removeFood = (slot, foodId) => {
    const updated = JSON.parse(JSON.stringify(plans));
    updated[dayType].slots[slot] = (updated[dayType].slots[slot]||[]).filter(f=>f.id!==foodId);
    save(updated);
  };

  const updatePortions = (slot, foodId, portions) => {
    const updated = JSON.parse(JSON.stringify(plans));
    updated[dayType].slots[slot] = (updated[dayType].slots[slot]||[]).map(f=>f.id===foodId?{...f,portions:parseFloat(portions)||1}:f);
    save(updated);
  };

  const plan = plans[dayType] || {targets:{protein:0,carbs:0,fat:0,calories:0},slots:{}};
  const allFoods = Object.values(plan.slots||{}).flat();
  const totals = allFoods.reduce((acc,f)=>({
    p:acc.p+(f.p||0)*(f.portions||1), c:acc.c+(f.c||0)*(f.portions||1),
    fat:acc.fat+(f.f||0)*(f.portions||1), cal:acc.cal+(f.cal||0)*(f.portions||1)
  }),{p:0,c:0,fat:0,cal:0});
  const tgt = plan.targets || {protein:0,carbs:0,fat:0,calories:0};
  const filtered = FOOD_DB.filter(f=>f.n.toLowerCase().includes(foodSearch.toLowerCase())).slice(0,40);

  const MacroBar = ({label, actual, target, color}) => {
    const pct = target>0 ? Math.min(100,Math.round(actual/target*100)) : 0;
    return(
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <span style={{fontSize:11,color:C.muted,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>{label}</span>
          <span style={{fontSize:11,color:pct>=90?C.green:C.white,fontWeight:600}}>{Math.round(actual)}g <span style={{color:C.sub}}>/ {target}g</span></span>
        </div>
        <div style={{height:5,background:C.dark4,borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3,transition:"width 0.4s"}}/>
        </div>
      </div>
    );
  };

  if(!ready) return <div style={{padding:"80px 20px",textAlign:"center",color:C.sub}}>Loading...</div>;

  return(
    <div>
      <div style={{padding:"52px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Nutrition</div>
          <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>Meal Plan</div>
        </div>
        <div style={{display:"flex",gap:5}}>
          <Pill label="Training" active={dayType==="training"} onClick={()=>setDayType("training")} color={C.blue}/>
          <Pill label="Rest Day" active={dayType==="non_training"} onClick={()=>setDayType("non_training")} color={C.purple}/>
        </div>
      </div>

      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
        {/* Macro targets */}
        <Card style={{background:`linear-gradient(135deg,${C.dark4},${C.dark3})`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.white}}>Daily Totals</div>
            <div style={{fontSize:20,fontWeight:700,color:C.blue}}>{Math.round(totals.cal)}<span style={{fontSize:11,color:C.muted,fontWeight:400}}> / {tgt.calories} kcal</span></div>
          </div>
          <MacroBar label="Protein" actual={totals.p} target={tgt.protein} color={C.blue}/>
          <MacroBar label="Carbs" actual={totals.c} target={tgt.carbs} color={C.purple}/>
          <MacroBar label="Fat" actual={totals.fat} target={tgt.fat} color={C.gold}/>
          {isCoach&&(
            <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${C.dark4}`}}>
              <div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Edit Targets ({dayType==="training"?"Training":"Rest"})</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["protein","Protein (g)",C.blue],["carbs","Carbs (g)",C.purple],["fat","Fat (g)",C.gold],["calories","Calories",C.green]].map(([k,l])=>(
                  <div key={k}>
                    <div style={{fontSize:10,color:C.sub,marginBottom:3}}>{l}</div>
                    <Input value={plan.targets?.[k]||""} onChange={v=>{const u=JSON.parse(JSON.stringify(plans));if(!u[dayType])u[dayType]={targets:{},slots:{}};u[dayType].targets={...u[dayType].targets,[k]:parseFloat(v)||0};save(u);}} type="number" placeholder="0" style={{padding:"7px 10px",fontSize:13}}/>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Meal slots */}
        {MEAL_SLOTS.map(slot=>{
          const foods = plan.slots?.[slot] || [];
          const slotTotals = foods.reduce((a,f)=>({p:a.p+(f.p||0)*(f.portions||1),c:a.c+(f.c||0)*(f.portions||1),cal:a.cal+(f.cal||0)*(f.portions||1)}),{p:0,c:0,cal:0});
          return(
            <Card key={slot}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:foods.length?12:0}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:C.white}}>{slot}</div>
                  {slotTotals.cal>0&&<div style={{fontSize:11,color:C.muted,marginTop:1}}>{Math.round(slotTotals.p)}g P  -  {Math.round(slotTotals.c)}g C  -  {Math.round(slotTotals.cal)} kcal</div>}
                </div>
                {isCoach&&<button onClick={()=>setEditSlot(slot)} style={{background:`${C.blue}20`,border:`1px solid ${C.blue}30`,color:C.blue,width:30,height:30,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon d={Icons.plus} size={14} color={C.blue}/>
                </button>}
              </div>
              {foods.map(f=>(
                <div key={f.id} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:`1px solid ${C.dark4}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:C.white}}>{f.n}</div>
                    <div style={{fontSize:11,color:C.sub,marginTop:1}}>{f.por}  -  {Math.round(f.p*f.portions)}g P  -  {Math.round(f.c*f.portions)}g C  -  {Math.round(f.cal*f.portions)} kcal</div>
                  </div>
                  {isCoach&&(
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <input value={f.portions} onChange={e=>updatePortions(slot,f.id,e.target.value)} type="number" min="0.5" step="0.5" style={{width:44,background:glass(0.06),border:border(0.1),borderRadius:8,padding:"5px 6px",color:C.white,fontSize:12,textAlign:"center",outline:"none",fontFamily:FONT}}/>
                      <button onClick={()=>removeFood(slot,f.id)} style={{background:"none",border:"none",cursor:"pointer",padding:2}}><Icon d={Icons.trash} size={13} color={C.sub}/></button>
                    </div>
                  )}
                </div>
              ))}
              {foods.length===0&&!isCoach&&<div style={{fontSize:12,color:C.sub,padding:"6px 0"}}>Not set</div>}
            </Card>
          );
        })}
      </div>

      {/* Food picker modal */}
      <Modal open={!!editSlot} onClose={()=>{setEditSlot(null);setFoodSearch("");}} title={`Add food to ${editSlot}`}>
        <Input value={foodSearch} onChange={setFoodSearch} placeholder="Search food database..." style={{marginBottom:12}}/>
        <div style={{maxHeight:"60vh",overflowY:"auto",display:"flex",flexDirection:"column",gap:6}}>
          {filtered.map(f=>(
            <button key={f.n} onClick={()=>addFood(f,editSlot)} style={{background:glass(0.05),border:border(0.09),borderRadius:12,padding:"10px 14px",cursor:"pointer",textAlign:"left",fontFamily:FONT}}>
              <div style={{fontWeight:600,fontSize:13,color:C.white,marginBottom:2}}>{f.n}</div>
              <div style={{fontSize:11,color:C.muted}}>{f.por}  -  {f.p}g P  -  {f.c}g C  -  {f.f}g F  -  {f.cal} kcal</div>
            </button>
          ))}
          {filtered.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:C.sub,fontSize:13}}>No foods found</div>}
        </div>
      </Modal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROADMAP PAGE - Phase-by-phase year plan
// ─────────────────────────────────────────────────────────────────────────────
function RoadmapPage({clientId, isCoach}) {
  const [phases, setPhases] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({phase:"FAT LOSS",goal:"DEFICIT",startDate:"",weeks:4,rol:1,startWeight:"",weeklyGoals:"",notes:""});
  const [ready, setReady] = useState(false);
  const today = toDay();

  const PHASE_TYPES = [
    {id:"FAT LOSS",              label:"Fat Loss",         goal:"DEFICIT",     color:"#EF4444", rol:1.0},
    {id:"MAINTENANCE",           label:"Maintenance",       goal:"MAINTENANCE", color:"#F59E0B", rol:0},
    {id:"METABOLIC IMPROVEMENT", label:"Met. Improvement",  goal:"MAINTENANCE", color:"#F97316", rol:0},
    {id:"IMPROVEMENT",           label:"Improvement",       goal:"SURPLUS",     color:"#3B82F6", rol:-0.35},
    {id:"PEAK WEEK",             label:"Peak Week",          goal:"PEAK",        color:"#8B5CF6", rol:0},
    {id:"DIET BREAK",            label:"Diet Break",         goal:"MAINTENANCE", color:"#10B981", rol:0},
  ];
  const phaseColor = id => PHASE_TYPES.find(p=>p.id===id)?.color||C.muted;

  useEffect(()=>{
    db.get(cKey(clientId,"phasemap"),true).then(r=>{setPhases(r||[]);setReady(true);});
  },[clientId]);

  const savePhases = (updated) => {
    setPhases(updated);
    db.set(cKey(clientId,"phasemap"),updated,true);
  };

  const savePhase = () => {
    if(!form.startDate||!form.startWeight) return;
    const item = {...form, id:editId||uid()};
    savePhases(editId ? phases.map(p=>p.id===editId?item:p) : [...phases,item]);
    setAdding(false); setEditId(null);
    setForm({phase:"FAT LOSS",goal:"DEFICIT",startDate:"",weeks:4,rol:1,startWeight:"",weeklyGoals:"",notes:""});
  };

  // Generate weekly rows from phase blocks (like the Excel)
  const weeklyRows = useMemo(()=>{
    const rows = [];
    const sorted = [...phases].sort((a,b)=>a.startDate.localeCompare(b.startDate));
    sorted.forEach(ph=>{
      const pt = PHASE_TYPES.find(p=>p.id===ph.phase)||PHASE_TYPES[0];
      const startMs = new Date(ph.startDate).getTime();
      const nWeeks = parseInt(ph.weeks)||4;
      const rol = parseFloat(ph.rol)||0;
      const sw = parseFloat(ph.startWeight)||0;
      let currentMonth = "";
      for(let w=0;w<nWeeks;w++){
        const weekDate = new Date(startMs + w*7*864e5);
        const month = weekDate.toLocaleDateString("en-GB",{month:"long"});
        const targetW = sw + (rol>0 ? -w*rol : w*Math.abs(rol));
        rows.push({
          phaseId:ph.id, phase:ph.phase, goal:ph.goal,
          weekDate:weekDate.toISOString().split("T")[0],
          month:month!==currentMonth?month:"",
          targetW:targetW.toFixed(1),
          rol:ph.rol, weeklyGoals:ph.weeklyGoals,
          color:pt.color, isFirst:w===0,
        });
        currentMonth=month;
      }
    });
    return rows;
  },[phases]);

  // Find current week row
  const currentRowIdx = useMemo(()=>{
    let idx=-1;
    weeklyRows.forEach((r,i)=>{if(r.weekDate<=today)idx=i;});
    return idx;
  },[weeklyRows,today]);

  const showForm = adding||!!editId;
  const editingPhase = editId ? phases.find(p=>p.id===editId) : null;

  return(
    <div>
      <div style={{padding:"52px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Training</div>
          <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>Phase Map</div>
        </div>
        {isCoach&&!showForm&&(
          <Btn onClick={()=>{setAdding(true);setEditId(null);setForm({phase:"FAT LOSS",goal:"DEFICIT",startDate:today,weeks:4,rol:1,startWeight:"",weeklyGoals:"",notes:""});}} style={{padding:"9px 16px",fontSize:13}} icon="plus">Add Phase</Btn>
        )}
      </div>

      {/* Phase colour legend */}
      {!showForm&&<div style={{padding:"0 20px 12px",display:"flex",gap:6,flexWrap:"wrap"}}>
        {PHASE_TYPES.map(pt=>(
          <div key={pt.id} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:pt.color,flexShrink:0}}/>
            <span style={{fontSize:10,color:C.sub,fontWeight:500}}>{pt.label}</span>
          </div>
        ))}
      </div>}

      <div style={{padding:"0 20px",paddingBottom:90}}>
        {/* Add/Edit form */}
        {showForm&&(
          <Card style={{marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:14,letterSpacing:"-0.02em"}}>
              {editId?"Edit Phase":"New Phase"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div>
                <Label>Phase Type</Label>
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  {PHASE_TYPES.map(pt=>(
                    <button key={pt.id} onClick={()=>setForm(p=>({...p,phase:pt.id,goal:pt.goal,rol:Math.abs(pt.rol)}))} style={{padding:"9px 14px",borderRadius:11,border:`1.5px solid ${form.phase===pt.id?pt.color:C.dark4}`,background:form.phase===pt.id?`${pt.color}20`:glass(0.04),cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:FONT}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:pt.color,flexShrink:0}}/>
                        <span style={{color:form.phase===pt.id?pt.color:C.muted,fontWeight:form.phase===pt.id?700:500,fontSize:13}}>{pt.label}</span>
                      </div>
                      <span style={{fontSize:10,color:C.sub}}>{pt.goal}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div><Label>Start Date</Label><Input value={form.startDate} onChange={v=>setForm(p=>({...p,startDate:v}))} type="date"/></div>
                <div><Label>Duration (weeks)</Label><Input value={form.weeks} onChange={v=>setForm(p=>({...p,weeks:v}))} type="number" placeholder="e.g. 8"/></div>
                <div><Label>Start Weight (kg)</Label><Input value={form.startWeight} onChange={v=>setForm(p=>({...p,startWeight:v}))} type="number" placeholder="e.g. 82"/></div>
                <div><Label>Rate (kg/week)</Label><Input value={form.rol} onChange={v=>setForm(p=>({...p,rol:v}))} type="number" step="0.1" placeholder="e.g. 1.0"/></div>
              </div>
              <div>
                <Label>Weekly Goals</Label>
                <textarea value={form.weeklyGoals} onChange={e=>setForm(p=>({...p,weeklyGoals:e.target.value}))} placeholder={"* Lock in deficit\n* Complete all cardio and steps\n* Check in on time with photos"} style={{width:"100%",minHeight:90,background:glass(0.05),border:border(0.1),borderRadius:12,padding:"10px 14px",color:C.white,fontSize:13,outline:"none",resize:"none",fontFamily:FONT,boxSizing:"border-box",lineHeight:1.6}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>{setAdding(false);setEditId(null);}} variant="secondary" style={{flex:1,justifyContent:"center"}}>Cancel</Btn>
                <Btn onClick={savePhase} style={{flex:1,justifyContent:"center"}} disabled={!form.startDate||!form.startWeight} icon="check">Save Phase</Btn>
              </div>
            </div>
          </Card>
        )}

        {/* Phase summary bands */}
        {!showForm&&phases.length>0&&(
          <Card style={{marginBottom:12,padding:"12px 14px"}}>
            <div style={{fontSize:11,color:C.sub,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>Year Overview</div>
            <div style={{display:"flex",gap:3,height:28,borderRadius:8,overflow:"hidden"}}>
              {[...phases].sort((a,b)=>a.startDate.localeCompare(b.startDate)).map(ph=>(
                <div key={ph.id} title={`${ph.phase} - ${ph.weeks}wk`} style={{flex:parseInt(ph.weeks)||4,background:phaseColor(ph.phase),display:"flex",alignItems:"center",justifyContent:"center",minWidth:4,cursor:"default"}}>
                  <span style={{fontSize:8,color:"#fff",fontWeight:700,letterSpacing:"0.04em",whiteSpace:"nowrap",overflow:"hidden",padding:"0 2px"}}>{parseInt(ph.weeks)>3?ph.phase.split(" ")[0]:""}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:3,marginTop:4}}>
              {[...phases].sort((a,b)=>a.startDate.localeCompare(b.startDate)).map(ph=>(
                <div key={ph.id} style={{flex:parseInt(ph.weeks)||4,fontSize:8,color:C.sub,textAlign:"center",minWidth:4,overflow:"hidden"}}>{ph.startDate.slice(5)}</div>
              ))}
            </div>
          </Card>
        )}

        {/* Weekly table - matches Excel exactly */}
        {!showForm&&weeklyRows.length>0&&(
          <Card style={{padding:0,overflow:"hidden"}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"52px 1fr 70px 52px",gap:0,background:C.dark4,padding:"8px 14px",borderBottom:`1px solid ${C.mid}`}}>
              {["Date","Phase / Goals","Target","Rate"].map(h=>(
                <div key={h} style={{fontSize:9,color:C.sub,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>{h}</div>
              ))}
            </div>
            <div style={{maxHeight:480,overflowY:"auto"}}>
              {weeklyRows.map((row,i)=>{
                const isCurrent=i===currentRowIdx;
                const goals = (row.weeklyGoals||"").split("*").filter(g=>g.trim()).slice(0,3);
                return(
                  <div key={i}>
                    {/* Month header */}
                    {row.month&&<div style={{padding:"6px 14px",background:C.dark4,borderTop:i>0?`1px solid ${C.mid}`:"none"}}>
                      <span style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase"}}>{row.month}</span>
                    </div>}
                    <div style={{display:"grid",gridTemplateColumns:"52px 1fr 70px 52px",gap:0,padding:"10px 14px",borderTop:`1px solid ${C.dark4}`,background:isCurrent?`${row.color}10`:"transparent",position:"relative"}}>
                      {isCurrent&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:row.color,borderRadius:"0 2px 2px 0"}}/>}
                      {/* Date */}
                      <div>
                        <div style={{fontSize:11,fontWeight:isCurrent?700:500,color:isCurrent?row.color:C.white}}>{fmtShort(row.weekDate)}</div>
                        {isCurrent&&<div style={{fontSize:8,color:row.color,fontWeight:700,letterSpacing:"0.06em"}}>NOW</div>}
                      </div>
                      {/* Phase + Goals */}
                      <div style={{paddingRight:8}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                          <div style={{width:6,height:6,borderRadius:"50%",background:row.color,flexShrink:0}}/>
                          <span style={{fontSize:11,fontWeight:600,color:row.color}}>{row.phase}</span>
                        </div>
                        {goals.length>0&&goals.map((g,gi)=>(
                          <div key={gi} style={{fontSize:10,color:C.muted,lineHeight:1.4,marginBottom:1}}>* {g.trim()}</div>
                        ))}
                      </div>
                      {/* Target */}
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.white}}>{row.targetW}</div>
                        <div style={{fontSize:9,color:C.sub}}>kg</div>
                      </div>
                      {/* Rate */}
                      <div style={{textAlign:"center"}}>
                        <div style={{fontSize:11,fontWeight:600,color:parseFloat(row.rol)>0?C.red:parseFloat(row.rol)<0?C.blue:C.gold}}>{parseFloat(row.rol)>0?"-":parseFloat(row.rol)<0?"+":""}{Math.abs(parseFloat(row.rol)||0)}</div>
                        <div style={{fontSize:9,color:C.sub}}>kg/wk</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {isCoach&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.dark4}`,display:"flex",gap:8,flexWrap:"wrap"}}>
              {phases.map(ph=>(
                <div key={ph.id} style={{display:"flex",gap:4}}>
                  <button onClick={()=>{setEditId(ph.id);setAdding(false);setForm({...ph});}} style={{fontSize:11,color:C.muted,background:glass(0.06),border:border(0.1),borderRadius:7,padding:"4px 9px",cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",gap:4}}>
                    <Icon d={Icons.edit} size={11} color={C.muted}/>{ph.phase.split(" ")[0]}
                  </button>
                  <button onClick={()=>savePhases(phases.filter(p=>p.id!==ph.id))} style={{background:"none",border:"none",cursor:"pointer",padding:"4px"}}><Icon d={Icons.trash} size={11} color={C.sub}/></button>
                </div>
              ))}
            </div>}
          </Card>
        )}

        {!showForm&&phases.length===0&&(
          <div style={{textAlign:"center",padding:"50px 20px",color:C.sub}}>
            <Icon d={Icons.calendar} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/>
            <div style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:4}}>No phases yet</div>
            <div style={{fontSize:12}}>{isCoach?"Add your first phase above.":"Your coach will build your phase map."}</div>
          </div>
        )}
      </div>
    </div>
  );
}




// ── CALENDAR ─────────────────────────────────────────────────────────────────
function CalendarView({workouts,habitLog,habits}){
  const [m,setM]=useState(()=>({y:new Date().getFullYear(),mo:new Date().getMonth()}));
  const [sel,setSel]=useState(null);
  const today=toDay(),dim=new Date(m.y,m.mo+1,0).getDate(),first=(new Date(m.y,m.mo,1).getDay()+6)%7;
  const byDay=useMemo(()=>{const map={};workouts.forEach(w=>{const d=w.date?.split("T")[0];if(d)map[d]=(map[d]||[]).concat(w);});return map;},[workouts]);
  const mStr=`${m.y}-${String(m.mo+1).padStart(2,"0")}`,mWos=workouts.filter(w=>(w.date||"").startsWith(mStr)),mVol=mWos.reduce((a,w)=>a+w.exercises.reduce((b,ex)=>b+ex.sets.reduce((c,s)=>c+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0),0);
  const monthName=new Date(m.y,m.mo,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  return <div>
    <div style={{padding:"52px 20px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>{monthName}</div>
      <div style={{display:"flex",gap:8}}>
        {[["<",()=>setM(p=>{const d=new Date(p.y,p.mo-1);return{y:d.getFullYear(),mo:d.getMonth()};})],[">",()=>setM(p=>{const d=new Date(p.y,p.mo+1);return{y:d.getFullYear(),mo:d.getMonth()};} )]].map(([l,fn])=><button key={l} onClick={fn} style={{background:glass(0.06),border:border(0.1),color:C.white,width:34,height:34,borderRadius:11,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>{l}</button>)}
      </div>
    </div>
    <div style={{padding:"0 20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
      {[{l:"Sessions",v:mWos.length,c:C.blue},{l:"Volume",v:mVol>0?`${(mVol/1000).toFixed(1)}t`:"-",c:C.purple},{l:"Avg/wk",v:(mWos.length/4.3).toFixed(1),c:C.green}].map(s=><Card key={s.l} style={{padding:"12px 14px",textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:C.sub,marginTop:1,letterSpacing:"0.06em",textTransform:"uppercase"}}>{s.l}</div></Card>)}
    </div>
    <div style={{padding:"0 20px",marginBottom:16}}>
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:8}}>{["Mo","Tu","We","Th","Fr","Sa","Su"].map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.sub}}>{d}</div>)}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px 0"}}>
          {Array.from({length:first}).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:dim}).map((_,i)=>{const n=i+1,ds=`${m.y}-${String(m.mo+1).padStart(2,"0")}-${String(n).padStart(2,"0")}`,wos=byDay[ds]||[],isToday=ds===today,isSel=sel===ds;return <div key={n} onClick={()=>setSel(isSel?null:ds)} style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"3px 2px",borderRadius:9,background:isSel?`${C.blue}22`:isToday?glass(0.04):"transparent",cursor:"pointer"}}>
            <div style={{width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:isToday?C.blue:"transparent",color:C.white,fontSize:13,fontWeight:isToday?700:400,border:isSel&&!isToday?`1.5px solid ${C.blue}`:wos.length?"1px solid rgba(255,255,255,0.08)":"none"}}>{n}</div>
            <div style={{display:"flex",gap:2,marginTop:2,height:5}}>{wos.slice(0,2).map((_,di)=><div key={di} style={{width:4,height:4,borderRadius:"50%",background:C.blue}}/>)}</div>
          </div>;})}
        </div>
      </Card>
    </div>
    {sel&&<div style={{padding:"0 20px",paddingBottom:80}} className="fade-in">
      <div style={{fontSize:11,color:C.sub,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{fmtDate(sel)}</div>
      {(byDay[sel]||[]).length>0?(byDay[sel].map(w=><Card key={w.id} style={{marginBottom:10}}><div style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:3}}>{w.name}</div><div style={{fontSize:12,color:C.muted,marginBottom:8}}>{w.duration||"-"} min  -  {w.exercises.length} exercises</div>{w.exercises.map((ex,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:i<w.exercises.length-1?`1px solid ${C.dark4}`:undefined}}><span style={{fontSize:12,fontWeight:500,color:C.white}}>{ex.name}</span><span style={{fontSize:11,color:C.muted}}>{ex.sets.length} sets</span></div>)}</Card>)):(<Card style={{padding:22,textAlign:"center"}}><Icon d={Icons.sleep} size={28} color={C.sub} style={{margin:"0 auto 8px",display:"block"}}/><div style={{fontSize:13,color:C.sub}}>Rest day</div>{(habitLog[sel]||[]).length>0&&<div style={{fontSize:11,marginTop:4,color:C.green}}>{(habitLog[sel]||[]).length} habits completed</div>}</Card>)}
    </div>}
    {!sel&&<div style={{paddingBottom:90}}/>}
  </div>;
}

// ── HABITS ────────────────────────────────────────────────────────────────────
const HABIT_ICONS_LIST=["food","water","dumbbell","sleep","clipboard","steps","flame","bolt","star","chart"];
function Habits({habits,setHabits,habitLog,setHabitLog}){
  const [adding,setAdding]=useState(false); const [tab,setTab]=useState("daily"); const [newH,setNewH]=useState({name:"",icon:"flame"});
  const [viewDate,setViewDate]=useState(toDay());
  const today=toDay();
  const activeDate=viewDate;
  const done=(habitLog[activeDate]||[]),streak=getStreak(habitLog,habits.length),pct=habits.length?Math.round(done.length/habits.length*100):0;
  const week=weekDates(),R=40,circ=2*Math.PI*R,dash=(pct/100)*circ;
  const isToday=activeDate===today;
  const goBack=()=>{const d=new Date(activeDate);d.setDate(d.getDate()-1);setViewDate(d.toISOString().split("T")[0]);};
  const goFwd=()=>{if(!isToday){const d=new Date(activeDate);d.setDate(d.getDate()+1);setViewDate(d.toISOString().split("T")[0]);}};
  const toggle=id=>setHabitLog(p=>{const d=p[activeDate]||[];return{...p,[activeDate]:d.includes(id)?d.filter(x=>x!==id):[...d,id]};});
  return <div>
    <PageHead title="Trackers" sub={`${streak} day streak`} right={<div style={{display:"flex",gap:6}}><Pill label="Daily" active={tab==="daily"} onClick={()=>setTab("daily")}/><Pill label="Weekly" active={tab==="weekly"} onClick={()=>setTab("weekly")}/></div>}/>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
      {tab==="daily"&&<>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{position:"relative",width:90,height:90,flexShrink:0}}>
            <svg width={90} height={90}><circle cx={45} cy={45} r={R} stroke={C.dark4} strokeWidth={7} fill="none"/><circle cx={45} cy={45} r={R} stroke={pct===100?C.green:C.blue} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 45 45)" style={{transition:"stroke-dasharray 0.5s"}}/></svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:18,fontWeight:700,color:C.white,lineHeight:1}}>{pct}%</span><span style={{fontSize:9,color:C.sub,marginTop:1}}>today</span></div>
          </div>
          <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[{l:"Streak",v:`${streak}d`,c:C.gold},{l:"Done",v:`${done.length}/${habits.length}`,c:C.green},{l:"Best",v:`${Math.max(...Object.values(habitLog).map(d=>d?.length||0),0)}`,c:C.purple},{l:"Habits",v:habits.length,c:C.blue}].map(s=><div key={s.l} style={{background:glass(0.05),borderRadius:12,padding:"9px 11px",border:border(0.09)}}><div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:C.sub,fontWeight:500,letterSpacing:"0.05em",textTransform:"uppercase"}}>{s.l}</div></div>)}
          </div>
        </div>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={goBack} style={{background:glass(0.06),border:border(0.1),color:C.white,width:28,height:28,borderRadius:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontSize:14}}>{"<"}</button>
              <span style={{fontWeight:700,fontSize:14,color:isToday?C.white:C.blue}}>{isToday?"Today":fmtShort(activeDate)}</span>
              <button onClick={goFwd} disabled={isToday} style={{background:isToday?glass(0.02):glass(0.06),border:border(0.1),color:isToday?C.sub:C.white,width:28,height:28,borderRadius:9,cursor:isToday?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FONT,fontSize:14,opacity:isToday?0.3:1}}>{">"}</button>
            </div>
            <Btn onClick={()=>setAdding(true)} variant="ghost" style={{padding:"5px 10px",fontSize:12,color:C.blue}} icon="plus">Add</Btn>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {habits.map(h=>{const isDone=done.includes(h.id);return <div key={h.id} onClick={()=>toggle(h.id)} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 13px",borderRadius:14,background:isDone?`${C.green}12`:glass(0.04),border:isDone?`1px solid ${C.green}30`:border(0.08),cursor:"pointer",transition:"all 0.18s"}}>
              <div style={{width:32,height:32,borderRadius:10,background:isDone?`${C.green}25`:glass(0.06),border:isDone?`1px solid ${C.green}40`:border(0.1),display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{isDone?<Icon d={Icons.check} size={15} color={C.green}/>:<Icon d={Icons[h.icon]||Icons.check} size={14} color={C.sub}/>}</div>
              <span style={{fontSize:14,flex:1,color:isDone?C.sub:C.white,textDecoration:isDone?"line-through":"none",fontWeight:isDone?400:500}}>{h.name}</span>
              <button onClick={e=>{e.stopPropagation();setHabits(p=>p.filter(x=>x.id!==h.id));}} style={{background:"none",border:"none",cursor:"pointer",opacity:0.4}}><Icon d={Icons.trash} size={13} color={C.sub}/></button>
            </div>;})}
            {habits.length===0&&<div style={{textAlign:"center",padding:"20px 0",color:C.sub,fontSize:13}}>No habits yet</div>}
          </div>
        </Card>
      </>}
      {tab==="weekly"&&<>
        <Card>
          <div style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:14}}>This Week</div>
          <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80}}>
            {week.map((d,i)=>{const cnt=(habitLog[d]||[]).length,isToday=d===today,h=habits.length?Math.round(cnt/habits.length*100):0;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{width:"100%",background:h>=80?C.green:h>=50?C.blue:C.dark4,borderRadius:4,height:`${Math.max(h,4)}%`,minHeight:4,maxHeight:60,transition:"height 0.4s"}}/><div style={{fontSize:9,color:isToday?C.blue:C.sub,fontWeight:isToday?700:400}}>{new Date(d).toLocaleDateString("en-GB",{weekday:"short"}).slice(0,2)}</div></div>;})}
          </div>
        </Card>
        {week.map((d,i)=>{const cnt=(habitLog[d]||[]).length,isToday=d===today;return <Card key={d} style={{padding:"12px 16px",border:isToday?`1px solid ${C.blue}40`:border(0.09)}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><span style={{fontWeight:600,fontSize:13,color:C.white}}>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span><span style={{fontSize:11,color:C.sub,marginLeft:6}}>{fmtShort(d)}</span>{isToday&&<span style={{fontSize:9,color:C.blue,marginLeft:6,fontWeight:700}}>TODAY</span>}</div>
            <div style={{display:"flex",gap:3}}>{habits.slice(0,6).map(h=>{const done=(habitLog[d]||[]).includes(h.id);return <div key={h.id} style={{width:16,height:16,borderRadius:4,background:done?C.green:C.dark4,display:"flex",alignItems:"center",justifyContent:"center"}}>{done&&<Icon d={Icons.check} size={9} color={C.dark3}/>}</div>;})}</div>
            <span style={{fontSize:13,fontWeight:700,color:cnt===habits.length&&cnt>0?C.green:C.muted}}>{cnt}/{habits.length}</span>
          </div>
        </Card>;})}
      </>}
    </div>
    <Modal open={adding} onClose={()=>setAdding(false)} title="New Habit">
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Input value={newH.name} onChange={v=>setNewH(p=>({...p,name:v}))} placeholder="Habit name..."/>
        <div><Label>Icon</Label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{HABIT_ICONS_LIST.map(k=><button key={k} onClick={()=>setNewH(p=>({...p,icon:k}))} style={{width:42,height:42,borderRadius:12,border:`1.5px solid ${newH.icon===k?C.blue:"transparent"}`,background:newH.icon===k?`${C.blue}20`:glass(0.06),display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Icon d={Icons[k]||Icons.check} size={18} color={newH.icon===k?C.blue:C.sub}/></button>)}</div></div>
        <Btn onClick={()=>{if(newH.name.trim()){setHabits(p=>[...p,{id:`h-${uid()}`,name:newH.name.trim(),icon:newH.icon}]);setNewH({name:"",icon:"flame"});setAdding(false);}}} style={{width:"100%",justifyContent:"center"}} disabled={!newH.name.trim()}>Add Habit</Btn>
      </div>
    </Modal>
  </div>;
}


// ── STATS PAGE ────────────────────────────────────────────────────────────────
function StatsPage({metrics,setMetrics,workouts,photoIds,photoMap,addPhoto,deletePhoto}){
  const [statsTab,setStatsTab]=useState("metrics"); const [chartView,setChartView]=useState("weight"); const [adding,setAdding]=useState(false); const [newM,setNewM]=useState({date:toDay(),weight:"",bodyFat:"",chest:"",waist:"",hips:"",arms:"",thighs:""}); const [fullPhoto,setFullPhoto]=useState(null); const fileRef=useRef(); const [uploading,setUploading]=useState(false);
  const saveCheck=()=>{if(!newM.weight&&!newM.bodyFat)return;setMetrics(p=>[...p,{id:uid(),...newM}]);setNewM({date:toDay(),weight:"",bodyFat:"",chest:"",waist:"",hips:"",arms:"",thighs:""});setAdding(false);};
  const latest=metrics.at(-1),prev=metrics.at(-2),wDiff=latest?.weight&&prev?.weight?(parseFloat(latest.weight)-parseFloat(prev.weight)).toFixed(1):null;
  const chartData=metrics.filter(m=>m.weight).slice(-12).map(m=>({d:m.date.slice(5),v:parseFloat(m.weight)}));
  const measData=metrics.filter(m=>m.chest||m.waist).slice(-8).map(m=>({d:m.date.slice(5),chest:parseFloat(m.chest)||null,waist:parseFloat(m.waist)||null,arms:parseFloat(m.arms)||null,thighs:parseFloat(m.thighs)||null}));
  const weekVol=useMemo(()=>{const map={};workouts.forEach(w=>{const d=new Date(w.date),wk=`W${Math.ceil(d.getDate()/7)} ${d.toLocaleString("en",{month:"short"})}`,v=w.exercises.reduce((a,ex)=>a+ex.sets.reduce((b,s)=>b+(parseFloat(s.weight)||0)*(parseFloat(s.reps)||0),0),0);map[wk]=(map[wk]||0)+v;});return Object.entries(map).slice(-8).map(([w,v])=>({w,v:Math.round(v/1000*10)/10}));},[workouts]);
  const handleUpload=async e=>{const file=e.target.files[0];if(!file)return;setUploading(true);const r=new FileReader();r.onload=async ev=>{const resized=await resizeImg(ev.target.result);addPhoto({id:uid(),data:resized,date:toDay(),cat:"Front",note:""});setUploading(false);};r.readAsDataURL(file);};
  const ttStyle={borderRadius:8,background:C.dark3,border:`1px solid ${C.dark4}`,fontSize:11,color:C.white};
  return <div>
    <div style={{padding:"52px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>Stats</div>
      <div style={{display:"flex",gap:6}}><Pill label="Metrics" active={statsTab==="metrics"} onClick={()=>setStatsTab("metrics")}/><Pill label="Photos" active={statsTab==="photos"} onClick={()=>setStatsTab("photos")} color={C.purple}/></div>
    </div>
    {statsTab==="metrics"&&<div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
      {latest&&<Card style={{background:`linear-gradient(135deg,${C.blue}22,${C.purple}15)`,border:`1px solid ${C.blue}30`}}>
        <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.1em",marginBottom:8}}>LATEST CHECK-IN  -  {fmtDate(latest.date)}</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {latest.weight&&<div style={{flex:1,minWidth:80}}><div style={{fontSize:30,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{latest.weight}<span style={{fontSize:14,fontWeight:400,color:C.muted}}>kg</span></div>{wDiff&&<div style={{fontSize:12,color:parseFloat(wDiff)<0?C.green:C.red,fontWeight:600}}>{parseFloat(wDiff)>0?"+":""}{wDiff}kg</div>}</div>}
          {latest.bodyFat&&<div style={{flex:1,minWidth:80}}><div style={{fontSize:30,fontWeight:700,color:C.purple,letterSpacing:"-0.03em"}}>{latest.bodyFat}<span style={{fontSize:14,fontWeight:400,color:C.muted}}>%</span></div><div style={{fontSize:11,color:C.muted}}>Body Fat</div></div>}
        </div>
      </Card>}
      <Btn onClick={()=>setAdding(true)} style={{width:"100%",justifyContent:"center"}} icon="plus">Log Check-In</Btn>
      {chartData.length>=2&&<Card><div style={{fontWeight:600,fontSize:14,color:C.white,marginBottom:12}}>Weight Trend</div><ResponsiveContainer width="100%" height={140}><AreaChart data={chartData} margin={{top:5,right:0,left:-28,bottom:0}}><defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient></defs><XAxis dataKey="d" stroke={C.dark4} tick={{fontSize:9,fill:C.sub}}/><YAxis stroke={C.dark4} tick={{fontSize:9,fill:C.sub}}/><Tooltip contentStyle={ttStyle} formatter={v=>[`${v}kg`]} labelStyle={{color:C.muted}} itemStyle={{color:C.white}}/><Area type="monotone" dataKey="v" stroke={C.blue} strokeWidth={2} fill="url(#wg)" dot={false}/></AreaChart></ResponsiveContainer></Card>}
      <div style={{fontSize:10,color:C.sub,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:0}}>CHECK-IN HISTORY</div>
      {[...metrics].reverse().map(m=><Card key={m.id} style={{padding:"12px 16px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{fontWeight:600,fontSize:13,color:C.white}}>{fmtDate(m.date)}</span><button onClick={()=>setMetrics(p=>p.filter(x=>x.id!==m.id))} style={{background:"none",border:"none",cursor:"pointer"}}><Icon d={Icons.trash} size={13} color={C.sub}/></button></div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{m.weight&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.blue}20`,color:C.blue}}>{m.weight}kg</span>}{m.bodyFat&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.purple}20`,color:C.purple}}>{m.bodyFat}% BF</span>}{m.chest&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Chest {m.chest}cm</span>}{m.waist&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Waist {m.waist}cm</span>}</div></Card>)}
      {metrics.length===0&&<div style={{textAlign:"center",padding:"30px 0",color:C.sub,fontSize:13}}>No check-ins yet</div>}
    </div>}
    {statsTab==="photos"&&<div style={{padding:"0 20px",paddingBottom:90}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><span style={{fontSize:13,color:C.muted}}>{photoIds.length} photos</span><div><input type="file" accept="image/*" ref={fileRef} onChange={handleUpload} style={{display:"none"}}/><Btn onClick={()=>fileRef.current.click()} variant="secondary" style={{padding:"8px 14px",fontSize:13}} disabled={uploading} icon="photo">{uploading?"Uploading...":"Add Photo"}</Btn></div></div>
      {photoIds.length>0?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{photoIds.map(id=>{const p=photoMap[id];if(!p)return null;return <div key={id} onClick={()=>setFullPhoto(p)} style={{borderRadius:16,overflow:"hidden",cursor:"pointer",position:"relative",aspectRatio:"3/4",background:C.dark3}}><img src={p.data} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.7))",padding:"16px 10px 8px"}}><div style={{fontSize:11,color:C.white,fontWeight:600}}>{p.cat}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>{fmtShort(p.date)}</div></div></div>;})}
      </div>:<div style={{textAlign:"center",padding:"50px 0",color:C.sub}}><Icon d={Icons.photo} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/><div style={{fontSize:13}}>No photos yet</div></div>}
    </div>}
    <Modal open={adding} onClose={()=>setAdding(false)} title="Log Check-In">
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div><Label>Date</Label><Input value={newM.date} onChange={v=>setNewM(n=>({...n,date:v}))} type="date"/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["weight","Weight (kg)"],["bodyFat","Body Fat (%)"],["chest","Chest (cm)"],["waist","Waist (cm)"],["hips","Hips (cm)"],["arms","Arms (cm)"],["thighs","Thighs (cm)"]].map(([k,l])=><div key={k}><Label>{l}</Label><Input value={newM[k]} onChange={v=>setNewM(n=>({...n,[k]:v}))} type="number" placeholder="-"/></div>)}</div>
        <Btn onClick={saveCheck} style={{width:"100%",justifyContent:"center",marginTop:4}}>Save Check-In</Btn>
      </div>
    </Modal>
    {fullPhoto&&<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><img src={fullPhoto.data} alt="" style={{maxWidth:"100%",maxHeight:"78vh",objectFit:"contain",borderRadius:14}}/><div style={{display:"flex",gap:12,marginTop:16}}><Btn onClick={()=>{deletePhoto(fullPhoto.id);setFullPhoto(null);}} variant="danger" style={{padding:"10px 20px"}} icon="trash">Delete</Btn><Btn onClick={()=>setFullPhoto(null)} variant="secondary" style={{padding:"10px 20px"}}>Close</Btn></div></div>}
  </div>;
}


// ── CLIENT CHECK-IN HISTORY ───────────────────────────────────────────────────
function CheckInHistory({clientId,tier,onBack}){
  const [log,setLog]=useState({});
  const [sel,setSel]=useState(null);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    db.get(cKey(clientId,"checkin-log"),true).then(l=>{setLog(l||{});setReady(true);});
  },[clientId]);

  const entries=Object.entries(log).sort((a,b)=>b[0].localeCompare(a[0]));

  if(sel){
    const ci=log[sel]||{};
    const d=ci.daily||{},w=ci.weekly||{};
    return <div>
      <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setSel(null)} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button>
        <div><div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{fmtDate(sel)}</div><div style={{fontSize:11,color:C.muted}}>Check-In Details</div></div>
      </div>
      <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
        {ci.daily&&<Card>
          <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Daily Check-In</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {d.weight&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.blue}20`,color:C.blue}}>{d.weight} lbs</span>}
            {d.sleep&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Sleep: {d.sleep}h</span>}
            {d.steps&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>{parseInt(d.steps).toLocaleString()} steps</span>}
            {d.calories&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.green}20`,color:C.green}}>{d.calories} kcal</span>}
            {d.protein&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.gold}20`,color:C.gold}}>{d.protein}g protein</span>}
            {d.mood&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Mood: {d.mood}</span>}
            {d.energy&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Energy: {d.energy}</span>}
            {d.stress&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Stress: {d.stress}</span>}
            {d.hunger&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Hunger: {d.hunger}/10</span>}
          </div>
          {d.win&&<div style={{fontSize:13,color:C.white,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.gold}}>Win: </b>{d.win}</div>}
          {d.winAdjust&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.blue}}>Win + Adjust: </b>{d.winAdjust}</div>}
          {d.tmrw&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.purple}}>Tomorrow: </b>{d.tmrw}</div>}
          {d.hardest&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.muted}}>Hardest: </b>{d.hardest}</div>}
        </Card>}
        {ci.weekly&&<Card>
          <div style={{fontSize:10,color:C.purple,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>Weekly Review</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {w.weekFeel&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.purple}20`,color:C.purple}}>{w.weekFeel}</span>}
            {w.trainConsistency&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Training: {w.trainConsistency}</span>}
            {w.nutrition&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>{w.nutrition}</span>}
            {w.confidence&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.green}20`,color:C.green}}>{w.confidence}</span>}
            {w.recovery&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>{w.recovery}</span>}
          </div>
          {w.bigWin&&<div style={{fontSize:13,color:C.white,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.gold}}>Big Win: </b>{w.bigWin}</div>}
          {w.highlight&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.blue}}>Highlight: </b>{w.highlight}</div>}
          {w.adjustment&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.purple}}>Adjustment: </b>{w.adjustment}</div>}
          {w.hardest&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.muted}}>Hardest thing: </b>{w.hardest}</div>}
          {w.coachFocus&&<div style={{fontSize:13,color:C.white,marginTop:6,padding:"10px 12px",background:`${C.blue}10`,borderRadius:10,border:`1px solid ${C.blue}30`}}><b style={{color:C.blue}}>Coach focus: </b>{w.coachFocus}</div>}
        </Card>}
      </div>
    </div>;
  }

  return <div>
    <div style={{padding:"52px 20px 12px",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button>
      <div>
        <div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>History</div>
        <div style={{fontSize:22,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>My Check-Ins</div>
      </div>
    </div>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}}>
      {!ready&&<div style={{textAlign:"center",padding:"30px",color:C.muted}}>Loading...</div>}
      {ready&&entries.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:C.sub}}><Icon d={Icons.clipboard} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/><div style={{fontSize:14,color:C.muted}}>No check-ins yet</div></div>}
      {entries.map(([date,ci])=>{
        const hasDaily=!!ci.daily,hasWeekly=!!ci.weekly;
        const d=ci.daily||{};
        return <Card key={date} onClick={()=>setSel(date)} style={{cursor:"pointer",padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:C.white,marginBottom:4}}>{fmtDate(date)}</div>
              <div style={{display:"flex",gap:4}}>
                {hasDaily&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.blue}20`,color:C.blue,fontWeight:700}}>DAILY</span>}
                {hasWeekly&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.purple}20`,color:C.purple,fontWeight:700}}>WEEKLY</span>}
              </div>
              {d.weight&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{d.weight} lbs{d.mood?` - Mood: ${d.mood}`:""}</div>}
            </div>
            <Icon d={Icons.chevronR} size={16} color={C.sub}/>
          </div>
        </Card>;
      })}
    </div>
  </div>;
}


// ── CLIENT HOME ───────────────────────────────────────────────────────────────
function ClientHome({workouts,habits,habitLog,metrics,setTab,name,clientId,tier="foundation",programmes,clientProgId,checkInLog,mealPlans}){
  const today=toDay(),done=(habitLog[today]||[]).length,streak=getStreak(habitLog,habits.length),pct=habits.length?Math.round(done/habits.length*100):0;
  const last=workouts.at(-1),lastW=metrics.at(-1)?.weight,firstW=metrics[0]?.weight,lostKg=firstW&&lastW?(parseFloat(firstW)-parseFloat(lastW)):0;
  const wkWos=workouts.filter(w=>(Date.now()-new Date(w.date))/864e5<=7).length;
  const hr=new Date().getHours(),greeting=hr<12?"Good morning":hr<17?"Good afternoon":"Good evening";
  const assignedProg=programmes?.find(p=>p.id===clientProgId);
  const todayChecked=!!(checkInLog&&checkInLog[today]);
  return <div>
    <div style={{background:`linear-gradient(160deg,${C.blue}22 0%,${C.purple}15 50%,transparent 100%)`,padding:"52px 20px 20px",marginBottom:4}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <RDHBadge size={42}/>
          <div>
            <div style={{fontSize:11,color:C.muted,fontWeight:500,letterSpacing:"0.04em"}}>{greeting}</div>
            <div style={{fontSize:20,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{name||"Athlete"}</div>
          </div>
        </div>
        <TierBadge tier={tier}/>
      </div>
    </div>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
      {/* Streak calendar */}
      <Card style={{background:`linear-gradient(135deg,${C.dark4},${C.dark3})`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div><div style={{fontSize:10,color:C.gold,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2}}>Daily Check In</div>{streak>0&&<div style={{fontSize:13,fontWeight:600,color:C.white}}>{streak} Day Streak</div>}</div>
          <button onClick={()=>setTab("checkin")} style={{background:"none",border:"none",color:C.blue,fontSize:12,cursor:"pointer",fontFamily:FONT,fontWeight:600,display:"flex",alignItems:"center",gap:4}}>View all <Icon d={Icons.chevronR} size={14} color={C.blue}/></button>
        </div>
        <StreakCalendar checkInLog={checkInLog||{}}/>
      </Card>
      {/* Check-in CTA */}
      {!todayChecked?<button onClick={()=>setTab("checkin")} style={{width:"100%",background:C.grad,border:"none",borderRadius:18,padding:"16px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:`0 4px 20px ${C.blue}30`}}>
        <div style={{textAlign:"left"}}><div style={{fontSize:11,color:"rgba(255,255,255,0.7)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2}}>Daily Check-In</div><div style={{fontSize:16,fontWeight:700,color:C.white,letterSpacing:"-0.02em"}}>Your check-in is today</div></div>
        <Icon d={Icons.chevronR} size={20} color={C.white}/>
      </button>:<Card style={{border:`1px solid ${C.green}30`,background:`${C.green}08`,padding:"13px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:34,height:34,borderRadius:11,background:`${C.green}22`,border:`1px solid ${C.green}40`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon d={Icons.check} size={16} color={C.green}/></div><div><div style={{fontWeight:600,color:C.white,fontSize:14}}>Checked in today</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>Strong week overall. Keep the standards consistent.</div></div></div>
      </Card>}
      {/* Next workout */}
      {assignedProg?<Card onClick={()=>setTab("train")} style={{cursor:"pointer"}}>
        <div style={{fontSize:10,color:C.sub,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Your Next Workout</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.06em",marginBottom:2}}>{assignedProg.goal}</div><div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{assignedProg.days?.[0]?.name||assignedProg.name}</div><div style={{fontSize:12,color:C.muted,marginTop:3}}>{assignedProg.days?.[0]?.exercises?.length||0} exercises</div></div><Icon d={Icons.chevronR} size={18} color={C.sub}/></div>
      </Card>:last?<Card onClick={()=>setTab("train")}><div style={{fontSize:10,color:C.sub,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6}}>Last Workout</div><div style={{fontWeight:700,fontSize:16,color:C.white,letterSpacing:"-0.03em"}}>{last.name}</div><div style={{fontSize:12,color:C.muted,marginTop:3}}>{fmtDate(last.date)}  -  {last.exercises?.length||0} exercises</div></Card>:<Card onClick={()=>setTab("train")} style={{cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:10,color:C.sub,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:3}}>Start Training</div><div style={{fontWeight:700,fontSize:16,color:C.white}}>Log your first session</div></div><Icon d={Icons.chevronR} size={18} color={C.sub}/></div></Card>}
      {/* TREND CHARTS - sessions + nutrition adherence */}
      <TrendCharts workouts={workouts} checkInLog={checkInLog} mealPlans={mealPlans}/>
      {/* Habit ring */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Today's Habits</div><div style={{fontSize:22,fontWeight:700,color:pct===100?C.green:C.white}}>{done}/{habits.length} <span style={{fontSize:12,fontWeight:400,color:C.muted}}>completed</span></div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{pct===100?"Perfect day. Standards met.":pct>=60?"More than halfway. Keep going.":"Let's close the day strong."}</div></div>
          <Ring value={pct} size={52} stroke={5} color={pct===100?C.green:C.blue}/>
        </div>
      </Card>
      {/* Weight */}
      {lastW&&<Card style={{padding:"14px 16px"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:10,color:C.sub,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:5}}>Weight</div><div style={{fontSize:22,fontWeight:700,color:C.white}}>{lastW}kg</div>{lostKg>0&&<div style={{fontSize:11,color:C.green,marginTop:2,fontWeight:600}}>{(()=>{const r=getWeightRef(lostKg);return r?`down ${lostKg.toFixed(1)}kg = ${r.desc}`:  `down ${lostKg.toFixed(1)}kg`;})()}</div>}{lostKg<0&&<div style={{fontSize:11,color:C.blue,marginTop:2,fontWeight:600}}>up {Math.abs(lostKg).toFixed(1)}kg added</div>}</div><Icon d={Icons.chart} size={20} color={C.blue}/></div></Card>}
      <Btn onClick={()=>setTab("train")} style={{width:"100%",justifyContent:"center",padding:15,fontSize:15}} icon="bolt">Start Workout</Btn>
    </div>
  </div>;
}

// ── PROGRAMME BUILDER ─────────────────────────────────────────────────────────
function Programmes({programmes,setProgammes,exercises}){
  const [editing,setEditing]=useState(null);
  if(editing)return <ProgForm prog={editing} exercises={exercises} onSave={p=>{setProgammes(prev=>editing.id&&prev.find(x=>x.id===editing.id)?prev.map(x=>x.id===p.id?p:x):[...prev,p]);setEditing(null);}} onBack={()=>setEditing(null)}/>;
  return <div>
    <PageHead title="Programmes" sub={`${programmes.length} created`} right={<Btn onClick={()=>setEditing({id:uid(),name:"New Programme",goal:"Hypertrophy",days:[]})} style={{padding:"8px 14px",fontSize:13}} icon="plus">Create</Btn>}/>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
      {programmes.map(p=><Card key={p.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}><div><div style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:2}}>{p.name}</div><div style={{fontSize:12,color:C.muted}}>{p.goal}  -  {p.days?.length||0} days</div><div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>{(p.days||[]).map((d,i)=><span key={i} style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.purple}20`,color:C.purple,border:`1px solid ${C.purple}30`}}>{d.name}</span>)}</div></div><div style={{display:"flex",gap:6}}><button onClick={()=>setEditing(p)} style={{background:glass(0.07),border:border(0.1),color:C.muted,width:32,height:32,borderRadius:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.edit} size={13} color={C.muted}/></button><button onClick={()=>setProgammes(prev=>prev.filter(x=>x.id!==p.id))} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",padding:4}}><Icon d={Icons.trash} size={13} color={C.sub}/></button></div></div></Card>)}
      {programmes.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:C.sub}}><Icon d={Icons.clipboard} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/><div style={{fontSize:13}}>No programmes yet</div></div>}
    </div>
  </div>;
}
function ProgForm({prog,exercises,onSave,onBack}){
  const [p,setP]=useState(prog); const [pickDay,setPickDay]=useState(null);
  const f=(k,v)=>setP(x=>({...x,[k]:v}));
  const addDay=()=>setP(x=>({...x,days:[...x.days,{name:`Day ${x.days.length+1}`,exercises:[]}]}));
  const remDay=i=>setP(x=>({...x,days:x.days.filter((_,j)=>j!==i)}));
  const updDay=(i,k,v)=>setP(x=>{const d=[...x.days];d[i]={...d[i],[k]:v};return{...x,days:d};});
  const addExToDay=(di,ex)=>setP(x=>{const d=[...x.days];d[di]={...d[di],exercises:[...d[di].exercises,{exId:ex.id,name:ex.name,sets:3,reps:8,pct1rm:75}]};return{...x,days:d};});
  const remExFromDay=(di,ei)=>setP(x=>{const d=[...x.days];d[di]={...d[di],exercises:d[di].exercises.filter((_,j)=>j!==ei)};return{...x,days:d};});
  const updEx=(di,ei,k,v)=>setP(x=>{const d=[...x.days];const es=[...d[di].exercises];es[ei]={...es[ei],[k]:v};d[di]={...d[di],exercises:es};return{...x,days:d};});
  return <div>
    <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}><button onClick={onBack} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button><input value={p.name} onChange={e=>f("name",e.target.value)} style={{background:"none",border:"none",color:C.white,fontSize:20,fontWeight:700,outline:"none",padding:0,flex:1,fontFamily:FONT}}/><Btn onClick={()=>onSave(p)} style={{padding:"8px 16px",fontSize:13}}>Save</Btn></div>
    <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}}>
      <div><Label>Goal</Label><Sel value={p.goal} onChange={v=>f("goal",v)} options={["Hypertrophy","Strength","Fat Loss","Recomp","Endurance","General Fitness"]}/></div>
      {p.days.map((day,di)=><Card key={di}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><input value={day.name} onChange={e=>updDay(di,"name",e.target.value)} style={{background:"none",border:"none",color:C.white,fontSize:15,fontWeight:700,outline:"none",padding:0,fontFamily:FONT}}/><button onClick={()=>remDay(di)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon d={Icons.trash} size={14} color={C.sub}/></button></div>
        {day.exercises.map((ex,ei)=><div key={ei} style={{background:glass(0.05),borderRadius:12,padding:"10px 12px",marginBottom:6,border:border(0.09)}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}><span style={{fontSize:13,fontWeight:600,color:C.white}}>{ex.name}</span><button onClick={()=>remExFromDay(di,ei)} style={{background:"none",border:"none",cursor:"pointer"}}><Icon d={Icons.minus} size={13} color={C.sub}/></button></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>{[["sets","Sets"],["reps","Reps"],["pct1rm","% 1RM"]].map(([k,l])=><div key={k}><div style={{fontSize:9,color:C.sub,marginBottom:3,letterSpacing:"0.06em",textTransform:"uppercase"}}>{l}</div><input value={ex[k]} onChange={e=>updEx(di,ei,k,e.target.value)} type="number" style={{background:glass(0.06),border:border(0.1),borderRadius:9,padding:"7px 8px",color:C.white,fontSize:13,width:"100%",outline:"none",textAlign:"center",fontFamily:FONT}}/></div>)}</div></div>)}
        <button onClick={()=>setPickDay(di)} style={{width:"100%",background:"none",border:`1px dashed ${C.dark4}`,borderRadius:10,padding:"9px 0",color:C.blue,fontSize:12,cursor:"pointer",fontFamily:FONT,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Icon d={Icons.plus} size={12} color={C.blue}/>Add Exercise</button>
      </Card>)}
      <Btn onClick={addDay} variant="secondary" style={{width:"100%",justifyContent:"center",padding:12}} icon="plus">Add Training Day</Btn>
    </div>
    <Modal open={pickDay!==null} onClose={()=>setPickDay(null)} title="Pick Exercise"><div style={{maxHeight:"60vh",overflowY:"auto"}}><ExLib exercises={exercises} setExercises={()=>{}} onPick={ex=>{addExToDay(pickDay,ex);setPickDay(null);}}/></div></Modal>
  </div>;
}


// ── COACH CLIENT DETAIL ───────────────────────────────────────────────────────
function ClientDetail({client,clients,setClients,programmes,onBack,onPreview}){
  const [data,setData]=useState(null); const [tab,setTab]=useState("overview"); const [checkInLog,setCheckInLog]=useState({}); const [mealPlans,setMealPlans]=useState({});
  useEffect(()=>{
    (async()=>{const [w,h,hl,m,ci,mp]=await Promise.all([db.get(cKey(client.id,"workouts"),true),db.get(cKey(client.id,"habits"),true),db.get(cKey(client.id,"habitLog"),true),db.get(cKey(client.id,"metrics"),true),db.get(cKey(client.id,"checkin-log"),true),db.get(cKey(client.id,"mealplans"),true)]);setData({workouts:w||[],habits:h||[],habitLog:hl||{},metrics:m||[]});setCheckInLog(ci||{});setMealPlans(mp||{});})();
  },[client.id]);
  const assign=pid=>{const u=clients.map(c=>c.id===client.id?{...c,programmeId:pid}:c);setClients(u);db.set("rdh:clients",u,true);};
  const assignTier=t=>{const u=clients.map(c=>c.id===client.id?{...c,tier:t}:c);setClients(u);db.set("rdh:clients",u,true);if(TIER_HABITS[t])db.set(cKey(client.id,"habits"),TIER_HABITS[t],true);};
  const saveNote=n=>{const u=clients.map(c=>c.id===client.id?{...c,coachNote:n}:c);setClients(u);db.set("rdh:clients",u,true);};
  const latest=data?.metrics?.at(-1),streak=data?getStreak(data.habitLog,data.habits?.length||0):0,wkWos=data?.workouts?.filter(w=>(Date.now()-new Date(w.date))/864e5<=7).length||0;
  const ttStyle={borderRadius:8,background:C.dark3,border:`1px solid ${C.dark4}`,fontSize:11,color:C.white};
  const activeTier=client.tier||"foundation";

  return <div>
    <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button>
      <div style={{flex:1}}><div style={{fontSize:20,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{client.name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}><TierBadge tier={activeTier}/><span style={{fontSize:11,color:C.muted}}>Joined {fmtDate(client.joinedDate)}</span></div></div>
    </div>
    <div style={{padding:"12px 20px 8px",display:"flex",gap:5,overflowX:"auto",alignItems:"center"}}>
      {["overview","tier","workouts","habits","metrics","nutrition","phasemap","notes"].map(t=><Pill key={t} label={t==="phasemap"?"Phase Map":t==="tier"?"Tier":t.charAt(0).toUpperCase()+t.slice(1)} active={tab===t} onClick={()=>setTab(t)}/>)}
      {onPreview&&<button onClick={onPreview} style={{flexShrink:0,marginLeft:"auto",background:`${C.blue}20`,border:`1px solid ${C.blue}40`,color:C.blue,borderRadius:10,padding:"5px 12px",cursor:"pointer",fontFamily:FONT,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Preview Portal</button>}
    </div>
    {!data&&<div style={{padding:"40px",textAlign:"center",color:C.sub,fontSize:13}}>Loading...</div>}

    {data&&tab==="overview"&&<div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:12,paddingBottom:90}} className="fade-in">
      {/* Quick stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{l:"Streak",v:`${streak}d`,c:C.gold},{l:"This week",v:wkWos,c:C.blue},{l:"Weight",v:latest?.weight?`${latest.weight}kg`:"-",c:C.purple}].map(s=><Card key={s.l} style={{textAlign:"center",padding:"13px 8px"}}><div style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div><div style={{fontSize:10,color:C.sub,marginTop:2,letterSpacing:"0.06em",textTransform:"uppercase"}}>{s.l}</div></Card>)}
      </div>
      {/* Trend charts mini */}
      <TrendCharts workouts={data.workouts} checkInLog={checkInLog} mealPlans={mealPlans}/>
      {/* Programme assign */}
      <Card><Label>Assigned Programme</Label><Sel value={client.programmeId||""} onChange={v=>assign(v||null)} options={[{v:"",l:"None"},...programmes.map(p=>({v:p.id,l:p.name}))]}/></Card>
      {latest&&<Card><Label>Latest Check-In  -  {fmtDate(latest.date)}</Label><div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{[["weight","kg",C.blue],["bodyFat","% BF",C.purple],["chest","cm chest",C.green],["waist","cm waist",C.gold]].map(([k,unit,c])=>latest[k]&&<span key={k} style={{padding:"4px 10px",borderRadius:9,background:`${c}20`,color:c,fontSize:12,fontWeight:600}}>{latest[k]}{unit}</span>)}</div></Card>}
      {data.workouts.at(-1)&&<Card><Label>Last Workout</Label><div style={{fontWeight:700,fontSize:15,color:C.white}}>{data.workouts.at(-1).name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmtDate(data.workouts.at(-1).date)}  -  {data.workouts.at(-1).exercises.length} exercises</div></Card>}
    </div>}

    {tab==="tier"&&<div style={{padding:"12px 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}} className="fade-in">
      <div style={{fontSize:13,color:C.muted,marginBottom:4}}>Select the client's membership tier. This sets their daily/weekly check-in forms and default habits automatically.</div>
      {TIER_ORDER.map(tid=>{const t=TIERS[tid],active=activeTier===tid;return <button key={tid} onClick={()=>assignTier(tid)} style={{width:"100%",padding:"14px 18px",borderRadius:16,border:`2px solid ${active?t.color:C.dark4}`,background:active?`${t.color}18`:glass(0.04),cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all 0.2s"}}>
        <div style={{textAlign:"left"}}><div style={{color:active?t.color:C.white,fontWeight:700,fontSize:14,fontFamily:FONT}}>{t.name}</div><div style={{fontSize:12,color:C.sub,marginTop:2,fontFamily:FONT}}>{t.desc}</div></div>
        {active&&<Icon d={Icons.check} size={18} color={t.color}/>}
      </button>;})}
    </div>}

    {data&&tab==="workouts"&&<div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}} className="fade-in">
      {[...data.workouts].reverse().map(w=><Card key={w.id} style={{padding:"13px 16px"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:14,color:C.white}}>{w.name}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{fmtDate(w.date)}  -  {w.duration||"-"} min</div></div><span style={{fontSize:12,color:C.blue,fontWeight:600}}>{w.exercises.length} ex</span></div><div style={{marginTop:7,display:"flex",gap:4,flexWrap:"wrap"}}>{w.exercises.slice(0,4).map((ex,i)=><span key={i} style={{fontSize:10,padding:"2px 7px",borderRadius:5,background:glass(0.06),color:C.muted,border:border(0.08)}}>{ex.name}</span>)}</div></Card>)}
      {!data.workouts.length&&<div style={{textAlign:"center",padding:"30px 0",color:C.sub,fontSize:13}}>No workouts logged yet</div>}
    </div>}

    {data&&tab==="habits"&&<div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}} className="fade-in">
      <Card><div style={{fontSize:15,fontWeight:700,color:C.white,marginBottom:12}}>Streak: {streak} days</div>
        {data.habits.map(h=>{const last7=weekDates().filter(d=>(data.habitLog[d]||[]).includes(h.id)).length;return <div key={h.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.dark4}`}}><span style={{fontSize:13,color:C.white,fontWeight:500}}>{h.name}</span><div style={{display:"flex",gap:3}}>{weekDates().map(d=><div key={d} style={{width:15,height:15,borderRadius:4,background:(data.habitLog[d]||[]).includes(h.id)?C.green:C.dark4,display:"flex",alignItems:"center",justifyContent:"center"}}>{(data.habitLog[d]||[]).includes(h.id)&&<Icon d={Icons.check} size={9} color={C.dark3}/>}</div>)}</div><span style={{fontSize:11,color:C.muted,minWidth:28,textAlign:"right"}}>{last7}/7</span></div>;})}
      </Card>
    </div>}

    {data&&tab==="metrics"&&<div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}} className="fade-in">
      {data.metrics.length>=2&&<Card><Label>Weight Trend</Label><ResponsiveContainer width="100%" height={100}><AreaChart data={data.metrics.filter(m=>m.weight).slice(-10).map(m=>({d:m.date.slice(5),v:parseFloat(m.weight)}))} margin={{top:5,right:0,left:-28,bottom:0}}><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke={C.blue} strokeWidth={2} fill="url(#cg)" dot={false}/><XAxis dataKey="d" tick={{fontSize:9,fill:C.sub}}/><Tooltip contentStyle={ttStyle} formatter={v=>[`${v}kg`]} labelStyle={{color:C.muted}} itemStyle={{color:C.white}}/></AreaChart></ResponsiveContainer></Card>}
      {[...data.metrics].reverse().map(m=><Card key={m.id} style={{padding:"11px 14px"}}><div style={{fontWeight:600,fontSize:12,color:C.white,marginBottom:5}}>{fmtDate(m.date)}</div><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{m.weight&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:`${C.blue}20`,color:C.blue}}>{m.weight}kg</span>}{m.bodyFat&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:6,background:`${C.purple}20`,color:C.purple}}>{m.bodyFat}% BF</span>}</div></Card>)}
      {!data.metrics.length&&<div style={{textAlign:"center",padding:"30px 0",color:C.sub,fontSize:13}}>No check-ins yet</div>}
    </div>}

    {tab==="nutrition"&&<div className="fade-in"><NutritionPage clientId={client.id} tier={activeTier} isCoach={true}/></div>}
    {tab==="phasemap"&&<div className="fade-in"><RoadmapPage clientId={client.id} isCoach={true}/></div>}
    {data&&tab==="notes"&&<div style={{padding:"12px 20px",paddingBottom:90}} className="fade-in"><textarea value={client.coachNote||""} onChange={e=>saveNote(e.target.value)} placeholder={`Coach notes for ${client.name}...`} style={{width:"100%",minHeight:220,background:glass(0.04),border:border(0.1),borderRadius:16,padding:16,color:C.white,fontSize:14,outline:"none",resize:"vertical",fontFamily:FONT,boxSizing:"border-box",lineHeight:1.6}}/><div style={{fontSize:11,color:C.sub,marginTop:6}}>Auto-saves as you type</div></div>}
  </div>;
}

// ── COACH CHECK-INS VIEW ──────────────────────────────────────────────────────
function CoachCheckIns({clients}){
  const [selClient,setSelClient]=useState(null);
  const [checkIns,setCheckIns]=useState([]);
  const [loading,setLoading]=useState(false);

  const loadCheckIns=async(client)=>{
    setLoading(true);
    setSelClient(client);
    const ci=await db.get(cKey(client.id,"checkin-log"),true);
    setCheckIns(ci?Object.entries(ci).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,30):[]);
    setLoading(false);
  };

  if(selClient) return <div>
    <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={()=>{setSelClient(null);setCheckIns([]);}} style={{background:glass(0.07),border:border(0.1),color:C.white,width:36,height:36,borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.back} size={16} color={C.white}/></button>
      <div><div style={{fontSize:18,fontWeight:700,color:C.white,letterSpacing:"-0.03em"}}>{selClient.name}</div><div style={{fontSize:11,color:C.muted}}>Check-In History</div></div>
      <TierBadge tier={selClient.tier||"foundation"} style={{marginLeft:"auto"}}/>
    </div>
    <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
      {loading&&<div style={{textAlign:"center",padding:"30px",color:C.muted}}>Loading...</div>}
      {!loading&&checkIns.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:C.sub}}><Icon d={Icons.clipboard} size={32} color={C.sub} style={{margin:"0 auto 10px",display:"block"}}/><div style={{fontSize:13}}>No check-ins yet</div></div>}
      {checkIns.map(([date,ci])=>{
        const hasDaily=!!ci.daily,hasWeekly=!!ci.weekly;
        const d=ci.daily||{},w=ci.weekly||{};
        return <Card key={date}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:14,color:C.white}}>{fmtDate(date)}</div>
            <div style={{display:"flex",gap:4}}>
              {hasDaily&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.blue}20`,color:C.blue,fontWeight:700}}>DAILY</span>}
              {hasWeekly&&<span style={{fontSize:9,padding:"2px 7px",borderRadius:5,background:`${C.purple}20`,color:C.purple,fontWeight:700}}>WEEKLY</span>}
            </div>
          </div>
          {hasDaily&&<div style={{marginBottom:hasWeekly?12:0}}>
            <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Daily</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {d.weight&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.blue}15`,color:C.blue}}>{d.weight} lbs</span>}
              {d.sleep&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Sleep {d.sleep}h</span>}
              {d.steps&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>{parseInt(d.steps).toLocaleString()} steps</span>}
              {d.calories&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.green}15`,color:C.green}}>{d.calories} kcal</span>}
              {d.protein&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.gold}15`,color:C.gold}}>{d.protein}g protein</span>}
              {d.mood&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Mood: {d.mood}</span>}
              {d.energy&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Energy: {d.energy}</span>}
              {d.stress&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Stress: {d.stress}</span>}
            </div>
            {d.win&&<div style={{fontSize:12,color:C.white,marginTop:8,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.gold}}>Win: </b>{d.win}</div>}
            {d.winAdjust&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.blue}}>Win + Adjust: </b>{d.winAdjust}</div>}
            {d.deviations&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.red}}>Deviations: </b>{d.deviations}</div>}
          </div>}
          {hasWeekly&&<div style={{borderTop:hasDaily?`1px solid ${C.dark4}`:"none",paddingTop:hasDaily?10:0}}>
            <div style={{fontSize:10,color:C.purple,fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Weekly Review</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
              {w.weekFeel&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.purple}15`,color:C.purple}}>{w.weekFeel}</span>}
              {w.trainConsistency&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Training: {w.trainConsistency}</span>}
              {w.nutrition&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>{w.nutrition}</span>}
              {w.confidence&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:`${C.green}15`,color:C.green}}>{w.confidence}</span>}
              {w.sustainable&&<span style={{fontSize:11,padding:"3px 9px",borderRadius:7,background:glass(0.06),color:C.muted,border:border(0.08)}}>Sustainability: {w.sustainable}/10</span>}
            </div>
            {w.bigWin&&<div style={{fontSize:12,color:C.white,marginTop:4,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.gold}}>Big Win: </b>{w.bigWin}</div>}
            {w.highlight&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.blue}}>Highlight: </b>{w.highlight}</div>}
            {w.adjustment&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.purple}}>Adjustment: </b>{w.adjustment}</div>}
            {w.coachFocus&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:`${C.red}10`,borderRadius:10,border:`1px solid ${C.red}30`}}><b style={{color:C.red}}>Needs eyes: </b>{w.coachFocus}</div>}
            {w.bodyImage&&w.bodyImage==="Negative"&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:`${C.red}10`,borderRadius:10,border:`1px solid ${C.red}30`}}><b style={{color:C.red}}>Body image: </b>Negative{w.bodyImageNote?` - ${w.bodyImageNote}`:""}</div>}
            {w.restrict&&w.restrict==="Yes"&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:`${C.red}10`,borderRadius:10,border:`1px solid ${C.red}30`}}><b style={{color:C.red}}>Restrict urge: </b>Yes{w.restrictWhy?` - ${w.restrictWhy}`:""}</div>}
            {w.hardest&&<div style={{fontSize:12,color:C.white,marginTop:6,padding:"8px 12px",background:glass(0.04),borderRadius:10,border:border(0.08)}}><b style={{color:C.muted}}>Hardest: </b>{w.hardest}</div>}
          </div>}
        </Card>;
      })}
    </div>
  </div>;

  return <div>
    <PageHead title="Check-Ins" sub="All client submissions"/>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:8,paddingBottom:90}}>
      {clients.length===0&&<div style={{textAlign:"center",padding:"60px 20px",color:C.sub}}><Icon d={Icons.clipboard} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/><div style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:6}}>No clients yet</div></div>}
      {clients.map(c=><Card key={c.id} onClick={()=>loadCheckIns(c)} style={{cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><div style={{fontWeight:700,fontSize:15,color:C.white}}>{c.name}</div><TierBadge tier={c.tier||"foundation"}/></div><div style={{fontSize:11,color:C.muted}}>Tap to view check-ins</div></div>
          <Icon d={Icons.chevronR} size={16} color={C.sub}/>
        </div>
      </Card>)}
    </div>
  </div>;
}


// ── COACH APP ─────────────────────────────────────────────────────────────────
function CoachApp({onLogout}){
  const [tab,setTab]=useState("clients"); const [clients,setClients]=useState([]); const [programmes,setProgrammes]=useState([]); const [exercises,setExercises]=useState(BASE_EX); const [selClientId,setSelClientId]=useState(null); const [previewClientId,setPreviewClientId]=useState(null); const [ready,setReady]=useState(false);
  useEffect(()=>{(async()=>{const [cl,pr,ex]=await Promise.all([db.get("rdh:clients",true),db.get("rdh:programmes",true),db.get("rdh:exercises",true)]);if(cl)setClients(cl);if(pr)setProgrammes(pr);setExercises(ex||BASE_EX);setReady(true);})();},[]);
  useEffect(()=>{if(ready)db.set("rdh:programmes",programmes,true);},[programmes,ready]);
  useEffect(()=>{if(ready)db.set("rdh:exercises",exercises,true);},[exercises,ready]);

  const selClient=selClientId?(clients.find(c=>c.id===selClientId)||null):null;

  if(!ready)return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontFamily:FONT}}><GlobalStyle/><div style={{textAlign:"center"}}><RDHBadge size={52} /><div style={{color:C.blue,fontWeight:700,marginTop:12}}>Loading coach portal...</div></div></div>;

  const navItems=[{id:"clients",icon:Icons.people,l:"Clients"},{id:"checkins",icon:Icons.checkBox,l:"Check-Ins"},{id:"programmes",icon:Icons.clipboard,l:"Programmes"},{id:"library",icon:Icons.dumbbell,l:"Library"}];

  const wrap=children=><div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:C.white,fontFamily:FONT}}><GlobalStyle/>{children}<div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(9,9,14,0.92)",backdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.07)",display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,8px)"}}>{navItems.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:"9px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><Icon d={t.icon} size={20} color={tab===t.id?C.blue:C.sub}/><span style={{fontSize:9,fontWeight:tab===t.id?700:500,color:tab===t.id?C.blue:C.sub,letterSpacing:"0.06em",textTransform:"uppercase"}}>{t.l}</span>{tab===t.id&&<div style={{width:18,height:2,borderRadius:2,background:C.blue}}/>}</button>)}<button onClick={onLogout} style={{flex:1,border:"none",background:"none",padding:"9px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><Icon d={Icons.logout} size={20} color={C.sub}/><span style={{fontSize:9,fontWeight:500,color:C.sub,letterSpacing:"0.06em",textTransform:"uppercase"}}>Exit</span></button></div></div>;

  // Client portal preview mode
  if(previewClientId){
    const pc=clients.find(c=>c.id===previewClientId);
    return <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:C.white,fontFamily:FONT}}>
      <GlobalStyle/>
      <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,zIndex:999,background:`${C.dark3}ee`,backdropFilter:"blur(10px)",borderBottom:`1px solid ${C.blue}40`,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>setPreviewClientId(null)} style={{background:`${C.red}20`,border:`1px solid ${C.red}40`,color:C.red,borderRadius:10,padding:"6px 14px",cursor:"pointer",fontFamily:FONT,fontSize:12,fontWeight:700}}>Exit Preview</button>
        <span style={{fontSize:12,color:C.muted}}>Previewing: <b style={{color:C.white}}>{pc?.name}</b></span>
      </div>
      <div style={{paddingTop:52}}>
        <ClientApp clientId={previewClientId} clientName={pc?.name||"Client"} onLogout={()=>setPreviewClientId(null)} isPreview={true}/>
      </div>
    </div>;
  }

  if(selClient)return wrap(<ClientDetail client={selClient} clients={clients} setClients={setClients} programmes={programmes} onBack={()=>setSelClientId(null)} onPreview={()=>setPreviewClientId(selClient.id)}/>);

  if(tab==="clients")return wrap(<div>
    <div style={{padding:"52px 20px 12px",background:`linear-gradient(135deg,${C.dark3},${C.dark2})`}}>
      <div style={{fontSize:10,color:C.blue,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:4}}>Coach Portal</div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}><div style={{fontSize:26,fontWeight:700,color:C.white,letterSpacing:"-0.04em"}}>My Clients</div><span style={{fontSize:12,color:C.muted}}>{clients.length} active</span></div>
    </div>
    <InviteManager/>
    <div style={{padding:"10px 20px",display:"flex",flexDirection:"column",gap:10,paddingBottom:90}}>
      {clients.map(c=><Card key={c.id} onClick={()=>setSelClientId(c.id)} style={{cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}><div style={{fontWeight:700,fontSize:15,color:C.white}}>{c.name}</div><TierBadge tier={c.tier||"foundation"}/></div><div style={{fontSize:11,color:C.muted}}>Joined {fmtDate(c.joinedDate)}</div>{c.programmeId&&<div style={{fontSize:11,color:C.purple,marginTop:2}}>{programmes.find(p=>p.id===c.programmeId)?.name||"Programme assigned"}</div>}</div>
          <Icon d={Icons.chevronR} size={16} color={C.sub}/>
        </div>
        {c.coachNote&&<div style={{fontSize:11,color:C.sub,marginTop:8,padding:"7px 10px",background:glass(0.05),borderRadius:10,border:border(0.08),lineHeight:1.5}}>{c.coachNote.slice(0,80)}{c.coachNote.length>80?"...":""}</div>}
      </Card>)}
      {!clients.length&&<div style={{textAlign:"center",padding:"60px 20px",color:C.sub}}><Icon d={Icons.people} size={36} color={C.sub} style={{margin:"0 auto 12px",display:"block"}}/><div style={{fontSize:14,fontWeight:600,color:C.muted,marginBottom:6}}>No clients yet</div><div style={{fontSize:13}}>Clients appear here once they sign up.</div></div>}
    </div>
  </div>);

  if(tab==="checkins")return wrap(<CoachCheckIns clients={clients}/>);
  if(tab==="programmes")return wrap(<Programmes programmes={programmes} setProgammes={setProgrammes} exercises={exercises}/>);
  if(tab==="library")return wrap(<ExLib exercises={exercises} setExercises={setExercises}/>);
  return wrap(<div/>);
}

// ── CLIENT APP ────────────────────────────────────────────────────────────────
function ClientApp({clientId,clientName,onLogout,isPreview=false}){
  const [tab,setTab]=useState("home"); const [workouts,setWorkouts]=useState([]); const [habits,setHabits]=useState(TIER_HABITS.foundation); const [habitLog,setHabitLog]=useState({}); const [metrics,setMetrics]=useState([]); const [exercises,setExercises]=useState(BASE_EX); const [photoIds,setPhotoIds]=useState([]); const [photoMap,setPhotoMap]=useState({}); const [programmes,setProgrammes]=useState([]); const [clientProgId,setClientProgId]=useState(null); const [tier,setTier]=useState("foundation"); const [reward,setReward]=useState(null); const [orms,setOrms]=useState({}); const [checkInLog,setCheckInLog]=useState({}); const [mealPlans,setMealPlans]=useState({}); const [ready,setReady]=useState(false);

  useEffect(()=>{
    (async()=>{
      const [w,h,hl,m,ex,ids,pr,cl,ci,mp]=await Promise.all([db.get(cKey(clientId,"workouts"),true),db.get(cKey(clientId,"habits"),true),db.get(cKey(clientId,"habitLog"),true),db.get(cKey(clientId,"metrics"),true),db.get("rdh:exercises",true),db.get(cKey(clientId,"photo-ids"),true),db.get("rdh:programmes",true),db.get("rdh:clients",true),db.get(cKey(clientId,"checkin-log"),true),db.get(cKey(clientId,"mealplans"),true)]);
      if(w){setWorkouts(w);const m2={};w.forEach(wo=>wo.exercises.forEach(ex2=>{ex2.sets.forEach(s=>{const v=epley(s.weight,s.reps);if(v>0&&(!m2[ex2.exId||ex2.name]||v>m2[ex2.exId||ex2.name]))m2[ex2.exId||ex2.name]=v;});}));setOrms(m2);}
      if(h)setHabits(h);if(hl)setHabitLog(hl);if(m)setMetrics(m);setExercises(ex||BASE_EX);if(pr)setProgrammes(pr);if(ci)setCheckInLog(ci);if(mp)setMealPlans(mp);
      const me=(cl||[]).find(c=>c.id===clientId);const clientTier=me?.tier||"foundation";setTier(clientTier);if(me?.programmeId)setClientProgId(me.programmeId);
      // If no saved habits OR habits don't match tier defaults, load tier defaults
      if(!h){setHabits(TIER_HABITS[clientTier]||TIER_HABITS.foundation);}
      else{setHabits(h);}
      setReady(true);
    })();
  },[clientId]);

  useEffect(()=>{if(ready)db.set(cKey(clientId,"workouts"),workouts,true);},[workouts,ready]);
  useEffect(()=>{if(ready)db.set(cKey(clientId,"habits"),habits,true);},[habits,ready]);
  useEffect(()=>{if(ready)db.set(cKey(clientId,"habitLog"),habitLog,true);},[habitLog,ready]);
  useEffect(()=>{if(ready)db.set(cKey(clientId,"metrics"),metrics,true);},[metrics,ready]);

  const addPhoto=async p=>{await db.set(cKey(clientId,`photo:${p.id}`),p,true);setPhotoIds(prev=>{const n=[...prev,p.id];db.set(cKey(clientId,"photo-ids"),n,true);return n;});setPhotoMap(prev=>({...prev,[p.id]:p}));};
  const delPhoto=async id=>{await db.del(cKey(clientId,`photo:${id}`),true);setPhotoIds(prev=>{const n=prev.filter(i=>i!==id);db.set(cKey(clientId,"photo-ids"),n,true);return n;});setPhotoMap(prev=>{const m={...prev};delete m[id];return m;});};

  const handleWorkoutSave=w=>{const r=buildWorkoutReward(w,workouts,orms);const m2={...orms};w.exercises.forEach(ex=>{ex.sets.forEach(s=>{const v=epley(s.weight,s.reps);if(v>0&&(!m2[ex.exId||ex.name]||v>m2[ex.exId||ex.name]))m2[ex.exId||ex.name]=v;});});setOrms(m2);setWorkouts(p=>[...p,w]);if(r)setReward(r);};

  if(!ready)return <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",color:C.white,fontFamily:FONT}}><GlobalStyle/><div style={{textAlign:"center"}}><div style={{width:56,height:56,borderRadius:18,background:C.grad,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={Icons.dumbbell} size={26} color={C.white}/></div><div style={{fontSize:18,fontWeight:700,color:C.white}}>RDH Coaching</div><div style={{fontSize:12,color:C.muted,marginTop:4}}>Loading...</div></div></div>;

  const navItems=[{id:"home",icon:Icons.home,l:"Home"},{id:"train",icon:Icons.dumbbell,l:"Train"},{id:"checkin",icon:Icons.clipboard,l:"Check In"},{id:"habits",icon:Icons.checkBox,l:"Habits"},{id:"stats",icon:Icons.chart,l:"Stats"}];

  const renderTab=()=>{switch(tab){
    case"home":    return <ClientHome workouts={workouts} habits={habits} habitLog={habitLog} metrics={metrics} setTab={setTab} name={clientName} clientId={clientId} tier={tier} programmes={programmes} clientProgId={clientProgId} checkInLog={checkInLog} mealPlans={mealPlans}/>;
    case"train":   return <WorkoutLogger workouts={workouts} setWorkouts={setWorkouts} onWorkoutSave={handleWorkoutSave} exercises={exercises} setExercises={setExercises} programmes={programmes} clientProgrammeId={clientProgId} orms={orms}/>;
    case"checkin": return <CheckInPage clientId={clientId} workouts={workouts} habits={habits} habitLog={habitLog} metrics={metrics} setMetrics={setMetrics} onReward={setReward} tier={tier}/>;
    case"habits":  return <Habits habits={habits} setHabits={setHabits} habitLog={habitLog} setHabitLog={setHabitLog}/>;
    case"stats":   return <StatsPage metrics={metrics} setMetrics={setMetrics} workouts={workouts} photoIds={photoIds} photoMap={photoMap} addPhoto={addPhoto} deletePhoto={delPhoto}/>;
    default:return null;
  }};

  return <div style={{background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",color:C.white,fontFamily:FONT,position:"relative",overflowX:"hidden"}}>
    <GlobalStyle/>
    <RewardModal reward={reward} onClose={()=>setReward(null)}/>
    <div style={{paddingBottom:82}}>{renderTab()}</div>
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"rgba(9,9,14,0.92)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(82,113,255,0.12)",display:"flex",zIndex:200,paddingBottom:"env(safe-area-inset-bottom,8px)"}}>
      {navItems.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",background:"none",padding:"9px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><Icon d={t.icon} size={20} color={tab===t.id?C.blue:C.sub}/><span style={{fontSize:9,fontWeight:tab===t.id?700:500,color:tab===t.id?C.blue:C.sub,letterSpacing:"0.06em",textTransform:"uppercase"}}>{t.l}</span>{tab===t.id&&<div style={{width:18,height:2,borderRadius:2,background:C.blue}}/>}</button>)}
      <button onClick={onLogout} style={{flex:1,border:"none",background:"none",padding:"9px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><Icon d={Icons.logout} size={20} color={C.sub}/><span style={{fontSize:9,fontWeight:500,color:C.sub,letterSpacing:"0.06em",textTransform:"uppercase"}}>Exit</span></button>
    </div>
  </div>;
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function RDHApp(){
  const [view,setView]=useState("loading"); const [clientId,setClientId]=useState(null); const [clientName,setClientName]=useState(null);
  useEffect(()=>{db.get("rdh:session",false).then(s=>{if(s?.view==="client"&&s?.clientId){setClientId(s.clientId);setClientName(s.clientName);setView("client");}else if(s?.view==="coach"){setView("coach");}else{setView("login");}});}, []);
  const login=(v,id,name)=>{setClientId(id);setClientName(name);setView(v);};
  const logout=()=>{if(window.confirm("Are you sure you want to exit?")){{db.del("rdh:session",false);setClientId(null);setClientName(null);setView("login");}}};
  if(view==="loading")return <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><GlobalStyle/><RDHBadge size={48}/></div>;
  if(view==="login")return <Login onLogin={login}/>;
  if(view==="coach")return <CoachApp onLogout={logout}/>;
  return <ClientApp clientId={clientId} clientName={clientName} onLogout={logout}/>;
}
