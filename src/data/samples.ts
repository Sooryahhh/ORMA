import type { Deck } from "../types.js";

export const SAMPLE_TEXTS = {
  en: `Transport layer protocols: TCP and UDP

The transport layer sits above the network layer and gives applications a way to talk to each other across a network. The two protocols that dominate it are TCP and UDP, and they make opposite trade-offs.

TCP is connection oriented. Before any data moves, the two ends complete a three-way handshake: the client sends SYN, the server replies SYN-ACK, and the client answers ACK. Once established, TCP numbers every byte it sends. The receiver acknowledges what has arrived, and anything unacknowledged after a timeout is retransmitted. This gives reliable, in-order delivery. TCP also manages flow control through a sliding receive window, so a fast sender cannot overwhelm a slow receiver, and congestion control through slow start and congestion avoidance, so senders back off when the network drops packets. All of this costs time and header space: a TCP header is twenty bytes minimum.

UDP does almost none of that. It is connectionless, has an eight byte header, and offers no acknowledgements, no retransmission, no ordering and no congestion control. A datagram either arrives or it does not. That sounds useless until you consider live video, voice calls, online games and DNS lookups, where a late packet is worth less than a lost one. Retransmitting a video frame that should have been displayed forty milliseconds ago only makes the stall longer.

The practical rule: use TCP when every byte must arrive and order matters, such as file transfer, email and web pages. Use UDP when timeliness beats completeness, or when the application handles reliability itself. QUIC, which underlies HTTP/3, is an example of the latter: it runs on top of UDP and rebuilds reliability and congestion control in user space.`,

  ml: `പ്രകാശസംശ്ലേഷണം

സസ്യങ്ങൾ സൂര്യപ്രകാശം ഉപയോഗിച്ച് സ്വന്തം ആഹാരം ഉണ്ടാക്കുന്ന പ്രക്രിയയാണ് പ്രകാശസംശ്ലേഷണം. ഈ പ്രക്രിയ നടക്കുന്നത് ഇലകളിലെ കോശങ്ങളിൽ ഉള്ള ഹരിതകണങ്ങളിലാണ്. ഹരിതകണങ്ങളിൽ ഉള്ള ഹരിതകം എന്ന പച്ച വർണ്ണവസ്തുവാണ് സൂര്യപ്രകാശം ആഗിരണം ചെയ്യുന്നത്.

വേരുകൾ മണ്ണിൽ നിന്ന് വലിച്ചെടുക്കുന്ന ജലവും, ഇലകളിലെ ആസ്യരന്ധ്രങ്ങളിലൂടെ അകത്തേക്ക് കടക്കുന്ന കാർബൺ ഡൈ ഓക്സൈഡും ആണ് അസംസ്കൃത വസ്തുക്കൾ. സൂര്യപ്രകാശത്തിന്റെ സാന്നിധ്യത്തിൽ ഇവ ചേർന്ന് ഗ്ലൂക്കോസ് എന്ന പഞ്ചസാര ഉണ്ടാകുന്നു. ഒപ്പം ഓക്സിജൻ പുറത്തേക്ക് വിടുന്നു. ഈ ഓക്സിജൻ ആണ് മറ്റ് ജീവികളുടെ ശ്വസനത്തിന് ആധാരം.

പ്രകാശസംശ്ലേഷണത്തിന് രണ്ട് ഘട്ടങ്ങളുണ്ട്. ആദ്യത്തേത് പ്രകാശഘട്ടം. ഇതിൽ സൂര്യപ്രകാശം ഉപയോഗിച്ച് ജലതന്മാത്ര വിഘടിക്കുകയും ഓക്സിജൻ സ്വതന്ത്രമാവുകയും ചെയ്യുന്നു. രണ്ടാമത്തേത് ഇരുൾഘട്ടം. ഇതിന് നേരിട്ട് പ്രകാശം ആവശ്യമില്ല. ഇവിടെ കാർബൺ ഡൈ ഓക്സൈഡ് സ്വാംശീകരിച്ച് ഗ്ലൂക്കോസ് ഉണ്ടാക്കുന്നു.

ഉണ്ടാകുന്ന ഗ്ലൂക്കോസ് അന്നജമായി മാറ്റി സസ്യം സംഭരിക്കുന്നു. പ്രകാശത്തിന്റെ തീവ്രത, കാർബൺ ഡൈ ഓക്സൈഡിന്റെ അളവ്, താപനില എന്നിവ പ്രകാശസംശ്ലേഷണത്തിന്റെ വേഗതയെ സ്വാധീനിക്കുന്ന ഘടകങ്ങളാണ്.`
};

export const DEMO_DECK: Deck = {
  id: "demo-photosynthesis",
  lang: "ml",
  ts: Date.now() - 3600000,
  title: "പ്രകാശസംശ്ലേഷണം",
  title_en: "Photosynthesis & Plant Respiration",
  summary: [
    "സൂര്യപ്രകാശം ഉപയോഗിച്ച് സസ്യങ്ങൾ സ്വന്തം ആഹാരം ഉണ്ടാക്കുന്ന പ്രക്രിയയാണ് പ്രകാശസംശ്ലേഷണം.",
    "ഇലയിലെ ഹരിതകണങ്ങളിലെ ഹരിതകമാണ് പ്രകാശം ആഗിരണം ചെയ്യുന്നത്.",
    "ജലവും കാർബൺ ഡൈ ഓക്സൈഡും ചേർന്ന് ഗ്ലൂക്കോസ് ഉണ്ടാകുന്നു, ഒപ്പം ഓക്സിജൻ പുറത്തുവിടുന്നു.",
    "പ്രകാശഘട്ടത്തിൽ ജലം വിഘടിച്ച് ഓക്സിജൻ പുറത്തുവരുന്നു; ഇരുൾഘട്ടത്തിൽ കാർബൺ ഡൈ ഓക്സൈഡ് സ്വാംശീകരിക്കുന്നു.",
    "പ്രകാശതീവ്രത, CO₂ അളവ്, താപനില എന്നിവയാണ് പ്രവർത്തനവേഗതയെ നിയന്ത്രിക്കുന്ന മൂന്ന് പ്രധാന ഘടകങ്ങൾ."
  ],
  summary_en: [
    "Photosynthesis is the fundamental biochemical process whereby autotrophic plants synthesize glucose using sunlight.",
    "Chlorophyll pigment situated within the chloroplast thylakoids absorbs the incoming solar photons.",
    "Water taken from the root system combines with carbon dioxide absorbed through the stomata to generate glucose and byproduct oxygen.",
    "The light-dependent phase photolyzes water molecules to release free oxygen; the dark phase fixes CO₂ into carbohydrate sugars.",
    "Light intensity, carbon dioxide concentration, and ambient temperature directly dictate the enzymatic rate of reaction."
  ],
  audio_script: "പ്രകാശസംശ്ലേഷണം എന്നത് സസ്യങ്ങൾ സൂര്യപ്രകാശം ഉപയോഗിച്ച് ആഹാരം ഉണ്ടാക്കുന്ന പ്രക്രിയയാണ്. ഇലയിലെ ഹരിതകണങ്ങളിൽ ഉള്ള ഹരിതകം സൂര്യപ്രകാശം ആഗിരണം ചെയ്യുന്നു. വേരുകൾ വലിച്ചെടുക്കുന്ന ജലവും ആസ്യരന്ധ്രങ്ങളിലൂടെ കടക്കുന്ന കാർബൺ ഡൈ ഓക്സൈഡും ചേർന്ന് ഗ്ലൂക്കോസ് ഉണ്ടാകുന്നു, ഓക്സിജൻ പുറത്തേക്ക് വിടുന്നു. ഇതിന് രണ്ട് ഘട്ടങ്ങളുണ്ട്: പ്രകാശഘട്ടവും ഇരുൾഘട്ടവും. പ്രകാശഘട്ടത്തിൽ സൂര്യപ്രകാശം ജലതന്മാത്രയെ വിഘടിപ്പിക്കുന്നു, ഓക്സിജൻ സ്വതന്ത്രമാകുന്നു. ഇരുൾഘട്ടത്തിൽ കാർബൺ ഡൈ ഓക്സൈഡ് സ്വാംശീകരിച്ച് ഗ്ലൂക്കോസ് ഉണ്ടാക്കുന്നു. ഉണ്ടാകുന്ന ഗ്ലൂക്കോസ് അന്നജമായി സംഭരിക്കുന്നു. പ്രകാശത്തിന്റെ തീവ്രത, കാർബൺ ഡൈ ഓക്സൈഡിന്റെ അളവ്, താപനില എന്നിവയാണ് വേഗതയെ നിയന്ത്രിക്കുന്ന ഘടകങ്ങൾ. പരീക്ഷയ്ക്ക് ഈ മൂന്ന് ഘടകങ്ങളും രണ്ട് ഘട്ടങ്ങളുടെ പേരും നിർബന്ധമായും ഓർത്തുവയ്ക്കുക.",
  audio_script_en: "Photosynthesis is the fundamental process through which green plants convert light energy into chemical nourishment. Chlorophyll housed within chloroplasts absorbs sunlight. Water absorbed by the root system combines with carbon dioxide entering through leaf stomata to yield glucose and oxygen. The process unfolds across two key phases: the light-dependent phase, which photolyzes water molecules and releases oxygen, and the dark phase (Calvin cycle), which enzymatically fixes carbon dioxide into energetic sugars. The surplus glucose is subsequently stored as starch. For your exams, keep three reaction-rate factors in mind: ambient temperature, solar light intensity, and carbon dioxide concentration.",
  terms: [
    {
      term: "ഹരിതകം",
      term_en: "Chlorophyll",
      meaning: "സൂര്യപ്രകാശം ആഗിരണം ചെയ്യുന്ന പച്ച വർണ്ണവസ്തു.",
      meaning_en: "The green photosynthetic pigment responsible for light absorption."
    },
    {
      term: "ഹരിതകണം",
      term_en: "Chloroplast",
      meaning: "പ്രകാശസംശ്ലേഷണം നടക്കുന്ന ഇലകളിലെ കോശാംഗം.",
      meaning_en: "The plant cell organelle that conducts photosynthesis."
    },
    {
      term: "ആസ്യരന്ധ്രം",
      term_en: "Stoma",
      meaning: "ഇലയിലെ സുഷിരം, ഇതിലൂടെ വാതക കൈമാറ്റം നടക്കുന്നു.",
      meaning_en: "Microscopic epidermal pores regulating gaseous exchange."
    },
    {
      term: "പ്രകാശഘട്ടം",
      term_en: "Light Phase",
      meaning: "ജലതന്മാത്ര വിഘടിച്ച് ഓക്സിജൻ സ്വതന്ത്രമാകുന്ന ഘട്ടം.",
      meaning_en: "Photolysis stage where water splits and releases oxygen."
    },
    {
      term: "ഇരുൾഘട്ടം",
      term_en: "Dark Phase",
      meaning: "കാർബൺ ഡൈ ഓക്സൈഡ് സ്വാംശീകരിച്ച് ഗ്ലൂക്കോസ് ഉണ്ടാക്കുന്ന ഘട്ടം.",
      meaning_en: "Light-independent phase where CO₂ is fixed into glucose."
    },
    {
      term: "അന്നജം",
      term_en: "Starch",
      meaning: "സസ്യം ഗ്ലൂക്കോസ് മാറ്റി സംഭരിക്കുന്ന രൂപം.",
      meaning_en: "The polymeric carbohydrate in which excess glucose is stored."
    }
  ],
  quiz: [
    {
      q: "പ്രകാശസംശ്ലേഷണം പ്രധാനമായും നടക്കുന്നത് സസ്യകോശത്തിലെ ഏത് ഭാഗത്താണ്?",
      q_en: "Where does photosynthesis primarily take place in the plant cell?",
      options: [
        "ഹരിതകണങ്ങളിൽ (Chloroplasts)",
        "മൈറ്റോകോൺഡ്രിയയിൽ (Mitochondria)",
        "കോശസ്തരത്തിൽ (Cell Membrane)",
        "റൈബോസോമുകളിൽ (Ribosomes)"
      ],
      options_en: [
        "Inside chloroplasts",
        "Inside mitochondria",
        "At the cell membrane",
        "On ribosomes"
      ],
      answer: 0,
      why: "ഹരിതകം എന്ന വർണ്ണവസ്തു ഹരിതകണങ്ങളിലാണ് അടങ്ങിയിരിക്കുന്നത്. അവിടെയാണ് പ്രകാശസംശ്ലേഷണ പ്രക്രിയ മുഴുവൻ നടക്കുന്നത്.",
      why_en: "Photosynthetic pigments reside within chloroplast thylakoids, where the entire reaction takes place."
    },
    {
      q: "പ്രകാശഘട്ടത്തിൽ സ്വതന്ത്രമാക്കപ്പെടുന്ന ഓക്സിജൻ ഉത്ഭവിക്കുന്നത് എന്തിൽ നിന്നാണ്?",
      q_en: "In the light phase, what is the source of the released oxygen gas?",
      options: [
        "കാർബൺ ഡൈ ഓക്സൈഡിൽ നിന്ന്",
        "ജലതന്മാത്രയുടെ വിഘടനത്തിൽ നിന്ന്",
        "ഗ്ലൂക്കോസിൽ നിന്ന്",
        "മണ്ണിലെ നൈട്രേറ്റുകളിൽ നിന്ന്"
      ],
      options_en: [
        "From atmospheric carbon dioxide",
        "From the photolytic splitting of water",
        "From glucose degradation",
        "From soil nitrates"
      ],
      answer: 1,
      why: "പ്രകാശഘട്ടത്തിൽ സൗരോർജ്ജം ഉപയോഗിച്ച് ജലതന്മാത്ര വിഘടിക്കുമ്പോഴാണ് (Photolysis) ഓക്സിജൻ ഉണ്ടാകുന്നത്.",
      why_en: "Water molecules are photolyzed during the light-dependent reactions, liberating molecular oxygen."
    },
    {
      q: "ഇരുൾഘട്ടത്തെ സംബന്ധിച്ച് ശരിയായ പ്രസ്താവന ഏതാണ്?",
      q_en: "Which statement correctly describes the dark phase?",
      options: [
        "ഇത് രാത്രിയിൽ മാത്രമേ നടക്കുകയുള്ളൂ",
        "ഈ ഘട്ടത്തിൽ ഓക്സിജൻ സ്വതന്ത്രമാകുന്നു",
        "ഇതിന് നേരിട്ട് സൂര്യപ്രകാശം ആവശ്യമില്ല",
        "ഹരിതകം ഇല്ലാത്ത വേരുകളിലാണ് ഇത് നടക്കുന്നത്"
      ],
      options_en: [
        "It can strictly only operate at night",
        "It releases free oxygen gas",
        "It does not directly require solar light",
        "It takes place entirely in subterranean roots"
      ],
      answer: 2,
      why: "ഇരുൾഘട്ടത്തിന് (Dark Phase) നേരിട്ട് സൂര്യപ്രകാശം ആവശ്യമില്ല എന്നതിനാലാണ് അങ്ങനെ വിളിക്കുന്നത്. ഇതിൽ CO₂ സ്വാംശീകരിച്ച് ഗ്ലൂക്കോസ് നിർമ്മിക്കപ്പെടുന്നു.",
      why_en: "The dark phase is enzymatically driven and light-independent; it fixes CO₂ into glucose."
    },
    {
      q: "പ്രകാശസംശ്ലേഷണത്തിന്റെ അസംസ്കൃത വസ്തുക്കൾ (Raw materials) ഏതൊക്കെയാണ്?",
      q_en: "What are the raw input materials for photosynthesis?",
      options: [
        "ഗ്ലൂക്കോസും ഓക്സിജനും",
        "ജലവും ഓക്സിജനും",
        "ജലവും കാർബൺ ഡൈ ഓക്സൈഡും",
        "അന്നജവും കാർബൺ ഡൈ ഓക്സൈഡും"
      ],
      options_en: [
        "Glucose and oxygen",
        "Water and oxygen",
        "Water and carbon dioxide",
        "Starch and carbon dioxide"
      ],
      answer: 2,
      why: "മണ്ണിൽ നിന്നുള്ള ജലവും അന്തരീക്ഷത്തിൽ നിന്നുള്ള കാർബൺ ഡൈ ഓക്സൈഡുമാണ് അസംസ്കൃത വസ്തുക്കൾ. ഗ്ലൂക്കോസും ഓക്സിജനും ഉൽപ്പന്നങ്ങളാണ്.",
      why_en: "Water from the soil and CO₂ from air are inputs; glucose and oxygen are products."
    },
    {
      q: "സസ്യങ്ങൾ അധികമുള്ള ഗ്ലൂക്കോസ് ഏത് രൂപത്തിലാണ് സംഭരിക്കുന്നത്?",
      q_en: "In what structural form do plants store synthesized glucose?",
      options: [
        "ഹരിതകമായി മാറ്റി",
        "അന്നജമായി മാറ്റി (Starch)",
        "ഓക്സിജനായി മാറ്റി",
        "മാറ്റമില്ലാതെ ഗ്ലൂക്കോസായി തന്നെ"
      ],
      options_en: [
        "Converted into chlorophyll",
        "Converted into starch polymer",
        "Converted into oxygen gas",
        "Stored directly as unchanged glucose"
      ],
      answer: 1,
      why: "ഉണ്ടാകുന്ന ഗ്ലൂക്കോസ് എളുപ്പത്തിൽ അലിഞ്ഞുപോകാതിരിക്കാൻ അന്നജം (Starch) എന്ന സങ്കീർണ്ണ കാർബോഹൈഡ്രേറ്റ് ആയി മാറ്റി സൂക്ഷിക്കുന്നു.",
      why_en: "Glucose is polymerized into insoluble starch for long-term physiological energy storage."
    },
    {
      q: "താഴെ പറയുന്നതിൽ പ്രകാശസംശ്ലേഷണത്തിന്റെ നിരക്കിനെ സ്വാധീനിക്കാത്ത ഘടകം ഏതാണ്?",
      q_en: "Which of the following does NOT influence the photosynthetic reaction rate?",
      options: [
        "പ്രകാശത്തിന്റെ തീവ്രത (Light intensity)",
        "കാർബൺ ഡൈ ഓക്സൈഡിന്റെ അളവ് (CO₂ level)",
        "മണ്ണിന്റെ ഉപരിതല നിറം (Soil surface color)",
        "അന്തരീക്ഷ താപനില (Ambient temperature)"
      ],
      options_en: [
        "Incident light intensity",
        "Carbon dioxide concentration",
        "Soil surface pigment color",
        "Ambient temperature"
      ],
      answer: 2,
      why: "പ്രകാശതീവ്രത, CO₂ അളവ്, താപനില എന്നിവയാണ് വേഗതയെ സ്വാധീനിക്കുന്ന മൂന്ന് ഘടകങ്ങൾ. മണ്ണിന്റെ നിറം ഇതിനെ ബാധിക്കുന്നില്ല.",
      why_en: "Light intensity, CO₂ level, and temperature directly modulate enzymatic rates; soil color has no chemical bearing."
    }
  ],
  cards: [
    {
      front: "ഹരിതകം (Chlorophyll) എന്നാൽ എന്ത്?",
      front_en: "What is Chlorophyll?",
      back: "സൂര്യപ്രകാശം ആഗിരണം ചെയ്യുന്ന ഇലകളിലെ പച്ച വർണ്ണവസ്തു.",
      back_en: "The light-absorbing green pigment embedded in chloroplasts."
    },
    {
      front: "പ്രകാശസംശ്ലേഷണത്തിലെ അസംസ്കൃത വസ്തുക്കൾ ഏവ?",
      front_en: "What are the raw materials of photosynthesis?",
      back: "ജലം + കാർബൺ ഡൈ ഓക്സൈഡ് (Water + CO₂)",
      back_en: "Water (H₂O) absorbed by roots and Carbon Dioxide (CO₂) absorbed by leaves."
    },
    {
      front: "പ്രകാശസംശ്ലേഷണ ഉൽപ്പന്നങ്ങൾ (Products) ഏതൊക്കെ?",
      front_en: "What are the primary products?",
      back: "ഗ്ലൂക്കോസ് + ഓക്സിജൻ (Glucose + O₂)",
      back_en: "Glucose sugars for plant nutrition + Molecular oxygen byproduct."
    },
    {
      front: "ഓക്സിജൻ പുറത്തുവരുന്നത് ഏത് ഘട്ടത്തിലാണ്?",
      front_en: "In which stage is oxygen released?",
      back: "പ്രകാശഘട്ടത്തിൽ — ജലതന്മാത്ര വിഘടിക്കുമ്പോൾ (Photolysis).",
      back_en: "Light phase — through the photolytic splitting of water."
    },
    {
      front: "ഇരുൾഘട്ടത്തിൽ നടക്കുന്ന പ്രധാന പ്രവർത്തനം എന്ത്?",
      front_en: "What occurs during the dark phase?",
      back: "കാർബൺ ഡൈ ഓക്സൈഡ് സ്വാംശീകരിച്ച് ഗ്ലൂക്കോസ് ഉണ്ടാക്കുന്നു.",
      back_en: "Carbon fixation — synthesizing energetic glucose from CO₂."
    },
    {
      front: "ആസ്യരന്ധ്രങ്ങളുടെ (Stomata) ധർമ്മം എന്താണ്?",
      front_en: "What is the function of stomata?",
      back: "വാതക കൈമാറ്റം — CO₂ അകത്തേക്ക് എടുക്കുക, O₂ പുറത്തേക്ക് വിടുക.",
      back_en: "Microscopic epidermal apertures facilitating gas and vapor exchange."
    },
    {
      front: "സസ്യങ്ങളിൽ ഗ്ലൂക്കോസ് സൂക്ഷിക്കുന്ന രൂപം ഏത്?",
      front_en: "What is the stored form of glucose in plants?",
      back: "അന്നജം (Starch).",
      back_en: "Starch (complex insoluble polysaccharide)."
    },
    {
      front: "വേഗതയെ സ്വാധീനിക്കുന്ന 3 പ്രധാന ഘടകങ്ങൾ ഏവ?",
      front_en: "Name 3 rate-limiting factors for photosynthesis.",
      back: "പ്രകാശതീവ്രത, കാർബൺ ഡൈ ഓക്സൈഡിന്റെ അളവ്, താപനില.",
      back_en: "Solar light intensity, atmospheric CO₂ concentration, and ambient temperature."
    }
  ]
};
