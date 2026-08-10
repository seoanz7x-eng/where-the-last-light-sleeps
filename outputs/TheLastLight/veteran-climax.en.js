/* Veteran Cut: five-stage storm reconstruction before the final ending choice. */
'use strict';

window.VETERAN_CLIMAX = [
  {
    id: 'storm-01-structure',
    title: "Stage 1 — Tilted structure",
    pages: [
      "As the storm reenactment begins, the walls inside the lighthouse become wet as if they were real. Every time a northwest wave hits the foundation stone, the spiral staircase trembles half a beat later, and old lime dust falls like flour from the ceiling. Mira draws a structural diagram with chalk on the wheelhouse floor. The main generator, drain pump, rotary lens and infirmary heating cable share one old switchboard, and the remaining fuel can only sustain two of the three overnight.",
      "Below the stairs, household items left by the villagers float in the water. Raon's spare gloves, the box of apples that Adele brought every week, the crooked postcards the children wrote to the lighthouse keeper, and the expired milk bottle hit the railing. Turning on the pump will not save these items, but it will slow down the water pressure in the foundation. If the heating wire is saved, the hypothermic patients in the infirmary can survive, but the rescue ships in the open sea cannot see the reef ship because there is not enough power to turn the lens.",
      "Raon steps forward to turn the manual lens, but the palm of his right hand is chafed by the longitudinal cord and is already bleeding. Mira unfolds structural records and says floor cracking is faster than predicted. Both calculations are correct, so they are not compatible with each other. In the middle of the coffee cup marks on the switchboard, there remains an old phrase, “People first,” but it does not now answer which people come first.",
      "As the first big wave covers the window, the entire building tilts towards the sea as much as a finger. If you delay your choice, the automatic circuit breaker will cut off the pump that consumes the most power. Mira folded his hands on the switchboard handle. “This is not a test to guess the past. This time, you must remember what we gave up then.” A glass bottle breaks somewhere in the hallway and the smell of apples mixes with the smell of sea water. Pieces of daily life that once seemed worthless now replace the weight of people on the other side of each circuit."
    ],
    choices: [
      {
        id: 'structure-pump-lens',
        label: "Distributes power to pump and rotating lens",
        stat: 'truth',
        cost: "Loss of heating in infirmary, worsening hypothermic patient",
        flag: 'climax_power_pump_lens',
        result: "The drain pipe roars and spits out black water, and the lens begins to slowly rotate. In the open sea, three response lights come back indicating that the route has been found, but the windows in the infirmary quickly lose steam and become transparent. The nurse must fold the blanket in half, divide it between two people, and decide whose share goes to the patient with the lowest body temperature. The lighthouse has the potential to survive the night, and that capability relies on the body heat of the people behind the door as fuel."
      },
      {
        id: 'structure-heat-lens',
        label: "Save the medical room heating wire and rotating lens.",
        stat: 'mercy',
        cost: "Interrupted drainage, accelerated foundation cracks, and loss of archival records.",
        flag: 'climax_power_heat_lens',
        result: "The red electric wires on the walls of the infirmary come to life, and color gradually returns to the lips of patients. The light from the lens also scans the open sea, but the water under the stairs spills past my knees and into the ledger storage room. The few volumes of original records you've collected over the course of a week dissolve into clouds of ink, names and dates becoming blobs of blue. Instead of keeping today's bodies warm, sentences that hold tomorrow accountable disappear."
      },
      {
        id: 'structure-pump-heat',
        label: "Guard the pump and infirmary heating wire and stop the lens.",
        stat: 'mercy',
        cost: "Loss of signal on open sea route, delay in approach of rescue ship",
        flag: 'climax_power_pump_heat',
        result: "The water goes below the ankles and the tremors in the infirmary subside a little. However, the moment the rotating lens stops, the outside of the window becomes as black as a wall, and the voices of rescue boats asking for the location of the reef overlap on the radio. Raon holds on to the manual handle with bloody hands, but his skin peels off with each turn. In return for ensuring the protection of those inside, those outside must cross a mapless sea."
      }
    ]
  },
  {
    id: 'storm-02-infirmary',
    title: "Stage 2 — Locked door in the infirmary",
    pages: [
      "The second memory takes place in the infirmary hallway. The fire door is stuck at an angle to the door frame due to pressure, and from inside, the sound of tapping with a metal cup creates a steady beat. The key ring next to the door is empty. There is a key with coral thread on the floor, but this key fits the lock on the rooftop emergency ladder, not the infirmary.",
      "Inside the door are three patients who cannot walk and a nurse. At the end of the hallway, there are six residents who were injured coming down the stairs, and upstairs, the lens axis is overheated and there is a metallic smell. You can open the door by cutting off the hinges with an ax, but in the meantime, there is no one to extend the rooftop ladder. If you open the pressure valve, the door is released, but cold sea water enters the floor of the infirmary. If you go to the roof with the ladder key, there will be a passage for the rescue boat, but no one will hear the knocking on the door for a while.",
      "Mira says he was at the door that day. However, in the memory, Mira is simultaneously writing down the lifeboat list in the wheelhouse, so the two scenes overlap like glass. When asked which one was real, he replies, “Both were things I had to do, so the memory made me do both.” Raon picks up the coral-colored thread and mutters that the traces of saving people and the traces of locking the door can come from the same clothes.",
      "The tapping suddenly stops and then starts again at a slower beat. The nurse informs the patients of their remaining consciousness using a cup. One of the hallway residents tries to take the ax away, saying that his child is inside the door, while another shouts that if they don't open the rooftop ladder, they will all be trapped. Whatever you choose, someone will remember it for abandonment, not rescue. A small paper crane gets wet and unfolds in the water that flows out from under the door. On the back, three foods I want to eat when I am discharged from the hospital are written, preventing the life to be judged from remaining an abstract number of patients."
    ],
    choices: [
      {
        id: 'infirmary-break-door',
        label: "Cut the hinges with an ax and open the infirmary.",
        stat: 'mercy',
        cost: "Rooftop escape route opening delayed, some corridor residents isolated",
        flag: 'climax_infirmary_breached',
        result: "Mira and you take turns striking the axe, and the hinge is torn on the eighth hit. Three patients are alive, but there are only two stretchers, so the nurse has to drag the most critically ill person to the floor under a blanket. In the meantime, the rooftop ladder remains collapsed, and two residents at the end of the hallway are stranded on the other side of the collapsed stairs. The life inside the door has a face, but the voices moving away from the hallway are recorded only as numbers."
      },
      {
        id: 'infirmary-release-pressure',
        label: "Open the pressure valve and let in seawater along with the door.",
        stat: 'truth',
        cost: "Risk of patient hypothermia, submersion of medications and medical records",
        flag: 'climax_infirmary_flooded',
        result: "When I turn the valve, water explodes to knee height and the pressure in the door frame is released. Everyone manages to get out the door, but the medicine drawer and patient records float up and are swept down the stairs. The nurse orders the patient who can walk to give up the stretcher and use someone else to support him. Instead of having a wide escape route, the weakest people pay with their bodies the subsequent cold and lack of medical treatment."
      },
      {
        id: 'infirmary-open-roof-first',
        label: "Pick up the ladder key and open the rooftop passage first.",
        stat: 'truth',
        cost: "Delay in infirmary rescue, one patient losing consciousness",
        flag: 'climax_roof_first',
        result: "As Raon and I run to the rooftop and open the ladder, the rescue boat's searchlight illuminates the building for the first time. The residents of the hallway go up one by one, and all six breathe the outside air. When they return to the infirmary, the tapping has decreased from three beats to two beats, and the youngest patient no longer opens his eyes. The rescue team immediately begins providing first aid, but it is not confirmed even after the ending whether he will wake up."
      }
    ]
  },
  {
    id: 'storm-03-lifeboats',
    title: "Stage 3 — Three lifeboats",
    pages: [
      "There are three lifeboats hanging on the deck, but only two can be fully lowered. The first boat has an engine but only half a tank of fuel, and the second boat only has oars but has a strong hull. The third one can carry many people, but the rope on the right side splits and there is a possibility that it will tip over the moment it is put down. The dock bell is drowned out by the sound of the storm and cannot distinguish between a return signal and an evacuation signal.",
      "The list lists infirmary patients and children first, followed by the names of lighthouse engineers, fishermen, and out-of-country rescue teams. However, the actual line is different from the list. People who can walk have to carry the stretcher, the technician to fix the engine is the last to arrive, and two children are hiding under blankets that they said they wouldn't fall off. If the capacity is filled only with numbers, the boat will float but there will be no hands to row, and if function is given priority, the weakest people will be pushed back again.",
      "Mira claims that he can get down if he holds on to the third tablet. If he does so, there is a good chance he will go below deck with the ship and never return. Raon can drive an engine boat, but that leaves fewer people at the lighthouse to manually operate the bell and lens. Two people tell each other that their share is cheaper, and only you know that they are both lying.",
      "The sailing window between waves is ninety seconds. There is no time to explain to everyone the reasons for their selection, and making the list public could cause the line to collapse. Hiding will maintain order, but those who survive will have to guess for the rest of their lives who stayed and why. This decision not only determines who is brought on board the ship, but also what truth is conveyed to those who remain. Someone takes an apple, cuts it into three pieces, and places them in each pear's food bag. It is such a small preparation that it has no effect on the rescue, but we do not give up as long as we believe that all three ships will return."
    ],
    choices: [
      {
        id: 'lifeboats-vulnerable-first',
        label: "Prioritizing patients and children, only two safe ships are set sail.",
        stat: 'mercy',
        cost: "Retention of technicians and lighthouse personnel, reduced follow-up rescue capacity",
        flag: 'climax_boats_vulnerable_first',
        result: "Stretchers and children are tied to the center of the engine boat, and guardians and nurses are placed in the rowboat. The two ships are heavy and sink low, but they overcome the first wave wall. On the deck, technicians and fishermen, including Raon, are left, and there are not enough people to hold on to broken lenses and pumps with their bare hands, but there is no fuel or time to move the next boat. The decision to save the weakest first becomes an order to those who remain to endure danger longer because they are stronger."
      },
      {
        id: 'lifeboats-capability-mix',
        label: "Patients, children, and technicians are mixed in each ship to divide the chances of survival.",
        stat: 'truth',
        cost: "Separation of family and care relationships, loss of professional personnel in the event of a boat accident",
        flag: 'climax_boats_mixed_crews',
        result: "Rewrite the list and assign to each boat who will row, who will be treated, and who will be protected. The ship's chances of survival increase, but the two children in the blanket are torn apart by different emotions, and the mother cannot ride on either side. When one of the ships on the route is pushed out of communication range, the remaining people cannot tell which light their family is at. Rationally distributed risks do not equally share sorrow."
      },
      {
        id: 'lifeboats-risk-third',
        label: "Accept Mira's suggestion and go down to the third boat and pick everyone up.",
        stat: 'mercy',
        cost: "Risk of serious injury to Mira, possible third overthrow, vacuum in command of the lighthouse.",
        flag: 'climax_boats_all_launched',
        result: "Mira wraps a split rope around his waist and balances it with his body weight. The moment the third chisel touches the surface, the rope breaks, causing him to hit the railing hard and be unable to move his right shoulder. The ship does not capsize and carries every last person on board, but Mira remains by your side without being able to board the ship. The fact that no one was removed from the list remains, along with the fact that one person's body was used as an unofficial fourth rope."
      }
    ]
  },
  {
    id: 'storm-04-beacon',
    title: "Step 4 — The Name the Lighthouse Will Say",
    pages: [
      "As the lifeboats head towards the reef ship, the rotating lens gears engage for the last time. The automatic signal has stopped, and the manual shutter can only send one of three types of messages to the end. These are the coordinates of a safety channel, the exact number of people remaining in the infirmary and on deck, or the original text of a rescue order deleted the day before the storm. The first saves people at sea, the second determines the rescue order inside the lighthouse, and the third reveals who delayed the evacuation.",
      "The deleted original text has an approval code of Mira and an alternate number of Raon. Just looking at the sentence, it looks like the two people blocked the infirmary door and postponed the departure of the lifeboat. However, in the ledgers and recordings you collected, there is also evidence that the order was a measure to slow the inflow of sea water and send stretchers to patients who could not walk. Short signals do not carry context. If you send facts, misunderstandings will follow, and if you wait for context, the person receiving the facts may die.",
      "Raon tells you to send your number first. If people can only move by blaming one person, they will play that role. Mira objects and says that if they only send them to safety water, the survivors can read the records later. However, the archives may already have been flooded, and there is no guarantee that the copies you have will be intact after the storm.",
      "Every time you pull the shutter handle, the metal heats up and warms your palm. To send a full sentence, you have to repeat the same action dozens of times, and if you miss it, the signal will have a different meaning. On the other side of the sea, the faint lights of three ships appear at different speeds. All it takes is one lens turn to decide for whom the lighthouse should speak the truth. On the first day, a dried ledger blows in the wind and passes in front of the lens, momentarily blocking the light. It is said that the insignificant unfinished business of two bottles of milk and a can of fever reducer lingers longer than the huge rescue order, and that responsibility begins at the moment of failure to continue life."
    ],
    choices: [
      {
        id: 'beacon-safe-route',
        label: "Write all light to safe channel coordinates",
        stat: 'mercy',
        cost: "Abandonment of remaining personnel and transmission of deletion orders, delay in establishing responsibility",
        flag: 'climax_beacon_route',
        result: "Short and long flashes of light draw a line between the reefs, and two lifeboats immediately orient themselves. The third boat only receives the end of the signal and turns toward the far side, but at least it is far away from the rock. Since the number of people inside the lighthouse and the deletion order are not communicated outside, the rescue team determines that the building is empty and delays their approach. Your light gave the truth that most people needed now, but silenced the existence of those who remained within."
      },
      {
        id: 'beacon-roster',
        label: "Send accurate information on remaining personnel and injuries.",
        stat: 'truth',
        cost: "Loss of lifeboat route guidance, continued concealment of deletion orders",
        flag: 'climax_beacon_roster',
        result: "The shutter seamlessly transmits the number of people on each floor, the number of injured people, and the number of stretchers remaining. A rescue ship turns its bow toward the lighthouse, and patients in the infirmary receive specific rescue orders. However, the lifeboats are unable to find a safe waterway and are scattered across different waves, and the lights of one boat are not visible for a long time. In return for accurately stating the number, the location of the ships that left with their names on board can be guessed."
      },
      {
        id: 'beacon-deleted-order',
        label: "Transmit the original text of the deleted command and the acknowledgment code.",
        stat: 'truth',
        cost: "Immediately giving up rescue information, hastily focusing responsibility on Mira and Raon",
        flag: 'climax_beacon_order',
        result: "The signs Mira and Raon repeat in the night sky and the radio outside goes completely silent for a moment. An investigation channel is soon opened and an order to preserve records is issued, but the rescue team slows down the approach to confirm the facts. Raon rings the bell once each time his number is displayed, and Mira does not take his hands off the handle until the end. The truth does not disappear, but arrives before the context, making the two people suspects rather than rescuers."
      }
    ]
  },
  {
    id: 'storm-05-keepers',
    title: "Step 5 — Mira and Raon remain",
    pages: [
      "As the eye of the storm covers the lighthouse, all sound briefly stops. Only you, Mira, and Raon remain in the tilted wheelhouse, and the water on the floor gently shakes at your feet. The last rescue boat can carry one more person, but two people are needed to carry the stretcher to the railing. Mira is holding his injured shoulder on the third lifeboat rope, and Raon's right hand is not bent because he turned the manual lens.",
      "The emergency transmitter only has one battery left. You can send the coordinates of one person to board the rescue boat, send a bundle of records collected over the course of a week, or give up transmitting and record the voices of both people in their entirety. Sending coordinates increases the likelihood of one person leaving, while sending records allows people outside to reconstruct events, but lowers the room's chances of survival. If you leave your voice, no one will get immediate help tonight.",
      "Mira no longer hides the possibility that he is a being created from memory. He says, “Even if I wasn’t there, it doesn’t mean the choices I made didn’t exist.” Raon hears this and replies that he has lived a life indebted to Mira, whether he actually drove the ship or his face was created from the memories of many people. Rather than proof of existence, the impact they have on each other fills the room.",
      "At that time, the infirmary door rings three times again from downstairs, and the horn of the returning lifeboat is heard once from the sea. Who's behind the door and which ship returns depends on the power, ship, and signal you choose, but in all cases the rescue is imperfect. Mira and Raon each ask to send the other person for different reasons. No one says they are worth more, so your decisions are lost in calculation. There are exactly three cups of cooled barley tea left next to the steering wheel. No one remembers who prepared the glass before the storm, but the three take a sip before making a decision, engraving the still-living present into their bodies."
    ],
    choices: [
      {
        id: 'keepers-send-mira',
        label: "Send the coordinates of Mira and stay in the lighthouse with Raon",
        stat: 'truth',
        cost: "Delay in treatment of Raon's hand, giving up part of record and rescue opportunity for player",
        flag: 'climax_mira_evacuated',
        result: "Raon and you pick up the stretcher and load Mira into the last rescue boat. Mira insists on burning the record bag before himself until the end, but as the ship moves away, he signals twice on the first day with his uninjured hand. Returning to the lighthouse, Raon wraps the bell rope around his arm with his unbending fingers and waits for the next wave. Living testimony remains to investigate whether Mira existed, and Raon's hand, which made that testimony possible, may not be able to fully move again."
      },
      {
        id: 'keepers-send-rowan',
        label: "Send the coordinates of Raon and stay at the lighthouse with Mira",
        stat: 'mercy',
        cost: "Mira's shoulder treatment abandoned, survival of player and Mira uncertain",
        flag: 'climax_rowan_evacuated',
        result: "Mira supports Raon's body with one arm and you place his bloody hand inside his coat. As the rescue boat leaves, Raon says, “I will make barley tea tomorrow,” without asking Mira whether it is true or a memory. Mira cries for the first time in front of that ordinary promise, and looks into the lens that stopped after the ship disappeared. There are people left outside to continue the memories, but the storm will decide whether tomorrow comes to Mira and you."
      },
      {
        id: 'keepers-send-archive',
        label: "Instead of coordinates, records and two people's voices are transmitted.",
        stat: 'truth',
        cost: "Immediately giving up any chance of rescue, all three remained in the lighthouse.",
        flag: 'climax_archive_sent',
        result: "Mira and Raon take turns telling the transmitter what they did and did not do. You distinguish between sentences that are confirmed to be facts and sentences that are only memories, and at the end you do not hide the fact that even that distinction failed. Ships in the open sea that received the records begin to calculate the lighthouse coordinates only after the signal ends. The three share a bottle of barley tea for three cups in a dark wheelhouse, and become the only ones to prove themselves to each other until rescue comes."
      }
    ]
  }
];
