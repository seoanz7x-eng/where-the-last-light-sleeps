(() => {
  'use strict';

  const ripples = {
    'take-clapper': {
      next: "As the bell that was removed shakes in the wind, Isol reads the direction of the reef through its shaking. The bell damaged as a warning became a small compass to guard the next route.",
      ending: "The dock bell was left without a weight, but the metal was long used as a marker to indicate the direction of the last rescue ship.",
      effect: 'chart',
      effectLabel: "The bell first announces the direction of the reef by shaking."
    },
    'leave-bell': {
      next: "Rowan rings the bell it left behind once at dawn. An empty ship hears the sound and sends a fuel tank. The preserved object returns the strength to leave this time.",
      ending: "The wet bell rang once a year even if there was no one to return, and the waiting became not an alarm but a rite of remembrance.",
      effect: 'fuel',
      effectLabel: "Increase steering limits with spare fuel sent by Rowan."
    },
    'answer-code': {
      next: "The two signals you sent back are answered by a third light from the land side. Someone alive, albeit weak, is listening to this passage.",
      ending: "The two alarms at 4 a.m. became the coastal rescue team's unofficial greeting signal. Even when calls were not expected to be answered, someone answered them.",
      effect: 'fuel',
      effectLabel: "After hearing the reply, the rescue boat follows along for a short section."
    },
    'record-code': {
      next: "When the intervals written down without responding are overlapped with Isol's observation table, the exact time when the fog thins is revealed. Silence was not a turning away, but a record of preparing a safer answer.",
      ending: "The periodic table you left behind became a standard record for later navigators to navigate through the dawn fog.",
      effect: 'chart',
      effectLabel: "The recorded period shows the first steering when the fog opens."
    },
    'preserve-lunchbox': {
      next: "Traces of the tide breaking twice were found in the salt crystals of the sealed lunch box. One person's lunch testifies to a more accurate track record than the time of the accident.",
      ending: "The dented lunch box was placed closer to the family table than in the museum glass cabinet. Nameless evidence brought back one person's ordinary morning.",
      effect: 'chart',
      effectLabel: "Salt lines in the insulation reveal the hidden direction of the current."
    },
    'use-insulation': {
      next: "Thanks to the insulation removed, the receiver survives all night. Brief refueling coordinates are heard among the noise, and one person's lunch becomes another's return time.",
      ending: "The lunch box lost its original form, but the recording of the receiver that survived as a piece was played the longest during rescue team training.",
      effect: 'fuel',
      effectLabel: "The surviving receiver locates a nearby supply buoy."
    },
    'trace-marks': {
      next: "It is revealed that the recovered chalk powder is the same as the powder from the lighthouse stairs. Even after the accident, someone marked the route between the sea and the island.",
      ending: "The chalk line was erased, but the captured trajectory was officially recorded as the final safe route manually created by the missing people.",
      effect: 'chart',
      effectLabel: "The angle of the chalk line indicates a safety channel behind the door."
    },
    'prioritize-live-signal': {
      next: "The chalk that I gave up was erased by the waves, but at the signal I followed, a cold hand grabbed the railing. The rescued voice directly tells you the next night's supply location.",
      ending: "There were blank spaces left in the data. Next to the blank space, the sentence “One person returned instead of the record” was written.",
      effect: 'fuel',
      effectLabel: "The rescued navigator shares the remaining fuel."
    },
    'keep-medicine-sample': {
      next: "The manufacturing number of one pill left behind matches the record of supplies delivered to the infirmary after the accident. For the first time, the time Mare has survived is a date, not an estimate.",
      ending: "One pill proved her sister's survival, and the foundation created a maritime medicine tracking system based on that record.",
      effect: 'chart',
      effectLabel: "The drug number indicates the actual route of the medical vessel."
    },
    'send-all-medicine': {
      next: "Warm steam rises for the first time in the window of the village clinic. The healed person illuminates the narrow waterway with a flashlight, and the medicine does not serve as evidence, but instead becomes a path.",
      ending: "The source of the medicine was never proven, but the child whose fever came down that night grew up to become a rescue team doctor.",
      effect: 'fuel',
      effectLabel: "The recovered clinician brings the supply ship to port."
    },
    'press-rowan-now': {
      next: "Raon chokes back tears and says that the empty checkbox was where he wrote down “the last person he saw.” A prematurely opened wound hurts, but it corrects one false coordinate in a distress report.",
      ending: "Raon hated the question that day for a long time, but later wrote in his testimony that “even the unprepared truth was the truth.”",
      effect: 'chart',
      effectLabel: "The corrected coordinates erase one false buoy from the map."
    },
    'let-rowan-breathe': {
      next: "As the night you waited for passes, Raon plays the last measure of the score first. The beat played instead of words exactly overlaps with the lifeboat return signal.",
      ending: "Raon testified at his own pace, and his slow testimony protected other survivors' right to remain silent.",
      effect: 'fuel',
      effectLabel: "A rescue boat to the beat of Raon stays by your side for a while."
    },
    'restart-pump': {
      next: "The torn photo has lost its face, but the name tags of three people in the cabin saved by the pump come to mind. When we even record what was thrown away, the cost of rescue comes out in numbers.",
      ending: "Family photos were not restored. Instead, the family's name remained on the first page of the rescue equipment checklist and was read every time.",
      effect: 'fuel',
      effectLabel: "The revived pump lightens the hull and reduces fuel consumption."
    },
    'recover-photo': {
      next: "When you carefully remove the overlapping photo, the Siren's emergency waterway appears on the back. The water is full because of the stopped pump, but a forgotten face shows the way.",
      ending: "The restored photo was returned to a family, and the waterway on the back completed the last route missing from the accident report.",
      effect: 'chart',
      effectLabel: "The lines on the back of the photo show the winding path between the reefs."
    },
    'clean-recording': {
      next: "From the voice that clears the noise, it becomes clear that “the eastern door is unlocked.” One clean sentence resolves the contradictions in old structural records.",
      ending: "The refined recordings became court records, but the experts also kept the deleted noises separately. With the note that clarity is not everything.",
      effect: 'chart',
      effectLabel: "A refined voice announces the status of a locked door in advance."
    },
    'broadcast-voice': {
      next: "Several boats hear the original sound mixed with noise and respond from different positions. The coordinates are blurry, but many people recognize the same voice and send their remaining fuel little by little.",
      ending: "The imperfect voices were worn down as they were copied hundreds of times, but the replies from people who recognized someone were also preserved.",
      effect: 'fuel',
      effectLabel: "The ships that responded sent small fuel containers one after another."
    },
    'publish-reflection': {
      next: "When the record containing the memory reflection was released, a reply was received offering to distinguish the mixed part from the actual video. Doubt does not destroy the record, but makes it more elaborate.",
      ending: "The report was released without hiding its errors and illusions. People believed it not because it was perfect, but because it showed signs of modification.",
      effect: 'chart',
      effectLabel: "External verification clears the direction of false signals."
    },
    'keep-channel-open': {
      next: "A short vital signal comes into the channel that was left open without a reflex being expressed. A person's breathing does not stop during the time the truth is postponed.",
      ending: "The hidden records were later made public and were criticized. However, the person saved by the open channel at the time testified to that delay with the rest of his life.",
      effect: 'fuel',
      effectLabel: "A rescue boat in an open channel shares a tank of fuel."
    },
    'catalog-empty-life': {
      next: "When I make a list of receipts and table marks, the life radius of a person who did not exist in the orchard comes to mind like a map. Even an empty life has coordinates.",
      ending: "The person whose name was not found was recorded as “the person who bought bread every Thursday.” Small habits last longer than anonymity.",
      effect: 'chart',
      effectLabel: "The living radius creates shallow waterways that were not on the map."
    },
    'answer-rhythm': {
      next: "Orchard Yuri answers with a warm beat when the bell rings in the order of the receipt. Following the sound, a small supply box rises from between the tree roots.",
      ending: "It was not revealed whose life it was. However, the bell rang with the same rhythm every year, and the villagers could miss him without knowing it.",
      effect: 'fuel',
      effectLabel: "The rhythm of the answer awakens hidden emergency supplies."
    },
    'send-verified-coordinate': {
      next: "The rescue ship that went to the confirmed distant coordinates was late, but found exactly one person. The nearby signal has disappeared, and both saved and missed spots remain on your map.",
      ending: "Official coordinates returned one person to his family. Although the records were accurate, the task of finding erased names continued to be left to others.",
      effect: 'chart',
      effectLabel: "The confirmed coordinates fix the first safe direction in the storm."
    },
    'send-near-coordinate': {
      next: "Only an empty life jacket is found at the coordinates near the erased name. However, with the emergency fuel inside, two other search ships survive another night.",
      ending: "I never knew who I was trying to find. The empty vest was not a failure, but a choice that led to a longer search.",
      effect: 'fuel',
      effectLabel: "Emergency fuel from empty life jackets increases search time."
    },
    'split-bell-calls': {
      next: "Two different signals do not give complete confidence in either side. Instead, the two groups learn each other's location and meet in the middle to share fuel and lists.",
      ending: "The decision to split a one-time signal was less efficient, but it served as an opportunity for the two rescue teams to create joint search rules instead of competition.",
      effect: 'fuel',
      effectLabel: "The two rescue teams combine fuel and accompany the storm section."
    },
    'double-harbor-call': {
      next: "Two return signals force the lifeboats to gather towards the dock. The voices of the distant sea become blurred, but the passage inside the harbor becomes clear.",
      ending: "More lifeboats returned that day and further searches were delayed. The record lists success and delay on the same line.",
      effect: 'chart',
      effectLabel: "A concentrated homing signal marks all harbor-side reefs."
    },
    'write-provisional-name': {
      next: "When a question mark is left next to a tentative name, other records gather around it. Names that acknowledge that they may be wrong actually invite the most verification.",
      ending: "The name was later modified. The question mark on the original record was not erased, showing that finding one person was a process of rewriting several times.",
      effect: 'chart',
      effectLabel: "Records linked to the provisional name reveal the final false buoy."
    },
    'title-by-actions': {
      next: "After reading the actions left instead of names, several people responded that they remembered the same person with different nicknames. One vacancy emerges as the center of many relationships.",
      ending: "In the end, the legal name was not found, but the title “The person who carried the two children first” was placed at the top of the rescue principle, not at the bottom of the list.",
      effect: 'fuel',
      effectLabel: "Those who remembered the action send the last supplies."
    },
    'separate-source-tracks': {
      next: "One waveform divided by source reveals that the time of the knock on the infirmary door and the alarm on deck did not overlap. The chorus is reduced, but the order of responsibility becomes clear.",
      ending: "The separate records became the core of the investigative report. The erased waveforms were not discarded but kept together under the name “Unreadable.”",
      effect: 'chart',
      effectLabel: "Separated waveforms first show the sequence of events within the storm."
    },
    'preserve-whole-chorus': {
      next: "When the entire chorus is played again, the same breathing sound is repeated between different voices. I don't know the source, but the time when multiple ships were alive at the same time becomes longer.",
      ending: "The indecipherable chorus was played verbatim in the final room of the memorial. The visitor couldn't pick one voice and make him the hero.",
      effect: 'fuel',
      effectLabel: "Several ships recognize the chorus and reveal their final route together."
    }
  };

  const broadcast = [
    {
      id: 'address',
      title: "Last Broadcast 1 · Recipient",
      pages: [
        "The storm has stopped, but the transmitter is still alive. One broadcast heads towards both the island of memory and the shore of the living.",
        "The first sentence determines who is being addressed. Calling someone out by name may exclude someone, and calling everyone out may obscure one person's face."
      ],
      choices: [
        { id: 'address-names', label: "The twenty-seven confirmed names are called in order.", stat: 'truth', line: "To the confirmed names and the blank spaces that have not yet been confirmed.", result: "The silence between names also becomes part of the broadcast. The list does not pretend to be complete." },
        { id: 'address-survivors', label: "To those who lived after that day", stat: 'mercy', line: "To everyone who went on to live life after that day.", result: "The receiver focuses on the days following the accident, not the time of the accident." },
        { id: 'address-island', label: "I speak to this island that holds me captive", stat: null, line: "To the island that held me captive for seven years.", result: "The lighthouse walls rumble low. Memory becomes the first recipient." }
      ]
    },
    {
      id: 'truth',
      title: "Final Broadcast 2 · Sentences not to be hidden",
      pages: [
        "The report seeks to frame Mira as either a hero or a victim. However, the hand holding the steering wheel also had a trembling feeling that it wanted to live.",
        "Depending on what sentence you leave, people will remember the event differently."
      ],
      choices: [
        { id: 'truth-failure', label: "Wrong judgments and late decisions are also revealed.", stat: 'truth', line: "We were late, we were wrong, but we still tried to save each other.", result: "The captain's silence and Mira's choice do not hold each other accountable within the same sentence." },
        { id: 'truth-desire', label: "Mira also says he wanted to live until the end", stat: 'mercy', line: "The person who gave up the last seat also wanted to live until the end.", result: "Sacrifice comes back not as a myth of a person who wants to die, but as a choice made in fear." },
        { id: 'truth-uncertain', label: "Leave parts that cannot be confirmed as is.", stat: null, line: "We will not pretend to know what we do not know.", result: "Noise does not go away. This time I don't call it a failure." }
      ]
    },
    {
      id: 'promise',
      title: "Final broadcast 3 · To the next person",
      pages: [
        "Memory is a tool to preserve the past, but it is also a promise to prevent the next accident.",
        "No one can protect everything. So a promise must be a sentence that sets out what you will not give up."
      ],
      choices: [
        { id: 'promise-open-records', label: "All records and revision history are disclosed.", stat: 'truth', line: "The records will be made public, including any traces of modifications.", result: "The cracks in the lens allow light to pass through without disappearing. Trust is built from repairs, not from a flawless surface." },
        { id: 'promise-gentle-witness', label: "Promise to wait until you are ready to testify.", stat: 'mercy', line: "I will protect my silence even when I am not ready to speak as testimony.", result: "The transmitter’s input light blinks slowly. People who don't respond don't disappear from the channel." },
        { id: 'promise-open-channel', label: "Keep the channel open for future replies", stat: null, line: "I will not close the channel even after this broadcast ends.", result: "A noise like an unborn reply comes from a very distant place." }
      ]
    },
    {
      id: 'signoff',
      title: "Final Broadcast 4 · Last Signature",
      pages: [
        "A call sign is required at the end of the broadcast. A name brings a person back, but it can also entrust all cases to one person.",
        "Mira takes the mic. This time, the island does not speak for us."
      ],
      choices: [
        { id: 'signoff-mira', label: "“First Mate Mira Bell, end transmission.”", stat: 'truth', line: "First Mate Mira Bell. Take responsibility for this record and complete the transmission.", result: "Your name is placed in the same place as your name tag and your voice. Don't hide, but don't carry all the weight alone." },
        { id: 'signoff-together', label: "Bringing together those who survived and those who left", stat: 'mercy', line: "In the name of both those who remain and those who have departed, I conclude my transmission.", result: "Several voices say the last two words together behind you. No one becomes background noise." },
        { id: 'signoff-dawn', label: "Instead of signing, leave “Channel open at dawn”", stat: null, line: "The dawn channel is open.", result: "Instead of an ending note, a short atmospheric sound is left. The ending is not a closed sentence, but a place for the next person to come in." }
      ]
    }
  ];

  const stormOutcomes = {
    climax_power_pump_lens: {
      aftermath: "A pump drains the foundation and Lens calls a rescue boat. However, the breath in the infirmary turns white, and Mare lays down three patients under one blanket.",
      ending: "The lighthouse survived, but the aftereffects of hypothermia remained. Later structural regulations listed heating power along the same lines as signaling equipment."
    },
    climax_power_heat_lens: {
      aftermath: "The body temperature and rotation of the lens in the infirmary are maintained, but the ink spreads like black water on the floor of the recording room. A living person and a disappearing document cross the same night.",
      ending: "The patients survived and some of the official records were lost forever. The report did not fill in the blanks with estimates."
    },
    climax_power_pump_heat: {
      aftermath: "While pumps and heating wires protect people and buildings, the open sea becomes completely dark. The rescue ship's lights pass once in the distance and return late.",
      ending: "The people inside the lighthouse held on, but rescue from the open sea was late. The new equipment adds a low-power indicator light that does not turn off under any circumstances."
    },
    climax_infirmary_breached: {
      aftermath: "Patients are taken out beyond the cut hinge, but the rooftop stairs fill with water first. The two voices heard at the end of the hallway take a detour to another window.",
      ending: "Patients in the infirmary came out on time, and residents in the hallway crossed a more dangerous path. It was also recorded whose rescue was “first.”"
    },
    climax_infirmary_flooded: {
      aftermath: "The pressure is released and the door opens, but the medicine bottle and medical records float in the seawater. People get out and the paper that proves their status gets wet.",
      ending: "People were rescued, but most of their medical records were lost. Afterwards, the compensation process was slow, and survivors' oral statements were accepted as official evidence."
    },
    climax_roof_first: {
      aftermath: "The rooftop passage opens first and people climb up in the rain. Inside the infirmary, Mare is counting the pulse of an unconscious patient with his fingertips.",
      ending: "The people on the rooftop were quickly rescued, and one patient underwent lengthy rehabilitation. The evacuation order table has been changed to read by status rather than floor."
    },
    climax_boats_vulnerable_first: {
      aftermath: "Two ships carrying children and patients exit the darkness first. At the lighthouse, there are fewer hands to fix the engine, and those who remain learn unfamiliar tasks from each other.",
      ending: "The weakest survived first, but subsequent rescue was slow. Survivors did not hide the delay and testified together about the reasons for their choice."
    },
    climax_boats_mixed_crews: {
      aftermath: "Two ships that share generations and technologies fill in each other's shortcomings. However, the separated families only look at the lights of the other ship in the fog.",
      ending: "Both ships returned and the separated families were reunited at dawn. Afterwards, the risk of relationship separation was also written on the lifeboat schedule."
    },
    climax_boats_all_launched: {
      aftermath: "The third boat tilts as if it would be overturned by a large wave, and Mira's shoulder hits the railing. Still, there is no one left waiting under the lighthouse.",
      ending: "All the passengers boarded the ship, but Mira remained in the lighthouse, unable to fully raise one arm for the rest of his life. A regulation was created to record rescue personnel and rescuers' bodies in the same statistics."
    },
    climax_beacon_route: {
      aftermath: "The lens repeats only the safe numbers. Rescue boats arrive quickly, but it is not known beyond the sea who remains at the lighthouse and what orders have been cleared.",
      ending: "The rescue was quick, but the responsible investigation was late. Several years later, survivors gathered to testify again about the missing order."
    },
    climax_beacon_roster: {
      aftermath: "The light accurately transmits the number of people and the extent of their injuries. The coast prepares the necessary stretchers, but the lifeboats must find their way between the reefs on their own.",
      ending: "The medical response was accurate and the risk of the route increased. The list traces life after injury to ensure that living people are not just numbers."
    },
    climax_beacon_order: {
      aftermath: "Cleared orders and approval signs are stamped in the sky. The survey channel is immediately opened, but nearby rescue vessels are again asked which channel to enter.",
      ending: "Responsibility was revealed early and rescue was late. The report noted in the first paragraph that justice and speed of rescue were not the same options."
    },
    climax_mira_evacuated: {
      aftermath: "The coordinates of Mira are reached and a rescue boat turns around. Raon holds the record box with his injured hand, and you continue to turn the lens next to him.",
      ending: "Mira became a living witness, and the aftereffects were left at the hands of Raon. The two did not forgive each other for their choices and instead recorded them together."
    },
    climax_rowan_evacuated: {
      aftermath: "Raon is taken out in a rescue boat and looks towards the lighthouse until the end. Mira laughs with his arms around your shoulders, and leaves your voice on the recording device.",
      ending: "Raon survived and testified, and Mira's survival was never confirmed. Uncertainty was not erased and became the first question of the memorial."
    },
    climax_archive_sent: {
      aftermath: "Instead of coordinates, records and two people's voices are transmitted over the waves. The rescue boat turns around, but several receivers on the shore light up red at the same time.",
      ending: "The return of the three has not been confirmed. But the transmitted records preserved the full story of the accident and the fact that they called each other to the end."
    }
  };

  window.FIVE_STAR_UPGRADE = Object.freeze({
    version: 1,
    ripples: Object.freeze(ripples),
    broadcast: Object.freeze(broadcast),
    stormOutcomes: Object.freeze(stormOutcomes)
  });
})();
