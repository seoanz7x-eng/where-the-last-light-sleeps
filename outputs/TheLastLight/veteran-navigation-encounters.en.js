/* Veteran Cut: signal encounters layered onto the seven navigation boards. */
'use strict';

window.NAVIGATION_ENCOUNTERS = [
  {
    day: 1,
    signalId: 'harbor-bell',
    title: "bell sound of wet tenon",
    pages: [
      "The brass bell hanging from the buoy rang one beat later than the waves. Inside, there is a salt-covered ration ledger, and under today's date it is written that two bottles of milk and a can of fever reducer have not yet been delivered. Someone prepared a very ordinary breakfast right before the disaster.",
      "You can reinforce the lighthouse's warning sound by removing the bell, but dockers use this sound every day to guess the time of return. The ink on the ledger has smudged and the final signature is unreadable. The only thing that is certain is not the name, but the errand someone had to run."
    ],
    choices: [
      {
        id: 'take-clapper',
        label: "The weight of the bell is removed and used as a warning device.",
        stat: 'truth',
        result: "When the pendulum was separated, the bell swung with its mouth open. The lighthouse's warning sound may reach further, but the dock has lost one familiar homing signal. The sentence “I will wait even if it is late” appears in the corner of the ledger."
      },
      {
        id: 'leave-bell',
        label: "Leave the bell and only keep the ledger dried.",
        stat: 'mercy',
        result: "The wet ledger was placed inside the cloak and the bell was tied in its original knot. The metallic sound continues, albeit faintly, and a flashlight answers from a distant dock. Instead, the lighthouse's warning device must survive with temporary parts until tonight."
      }
    ]
  },
  {
    day: 1,
    signalId: 'dawn-code',
    title: "Twice at four in the morning",
    pages: [
      "A short and long light is repeated twice from the receiver under the railing. It is too personal to be a rescue protocol, and resembles the early morning signal used by old fishermen to notify their families that they are “alive.” Next to the signal, a bottle of cooled barley tea and a half-folded market receipt float.",
      "The receipt says apples, matches, and children's socks. Instead of asking for help, the caller is repeating a promise to someone. If you respond now, you can expose the route, and if you remain silent, the person you promised will be waiting again today."
    ],
    choices: [
      {
        id: 'answer-code',
        label: "Respond twice at equal intervals",
        stat: 'mercy',
        result: "When I covered the flashlight twice, the signal continued for a long time in the distance and then turned off. We didn't get the coordinates, but someone got a reason to stop waiting. In return, an unfamiliar searchlight on the southern horizon briefly scans this direction."
      },
      {
        id: 'record-code',
        label: "Does not respond, only records period and direction",
        stat: 'truth',
        result: "When the interval is adjusted to the second hand, it is revealed that the signal is not coming from the dock but from the open sea. The record will narrow down tomorrow's route. However, the last two flashes of light go unanswered and sink into the dawn fog."
      }
    ]
  },
  {
    day: 2,
    signalId: 'west-wake',
    title: "West Wake's Lunchbox",
    pages: [
      "The western current drags a line of empty life jackets and metal lunch boxes. Inside the lunch box is half an egg soaked in soy sauce, a napkin with a star instead of a name, and a tide table from the day before departure. The wake looks like it was left by a ship, but there is no smell of engine oil at all.",
      "If you follow the current, you will have to go far outside the signal network. Opening the lunch box's insulation protects the receiver battery, but fingerprints and fibers left inside will disappear. Hunger and evidence are wrapped in the same thin foil."
    ],
    choices: [
      {
        id: 'preserve-lunchbox',
        label: "Seal the lunch box and leave it as evidence of the wake.",
        stat: 'truth',
        result: "The lunch box was double sealed with wet string. Receiver batteries drain faster in the cold, but on the back of the napkin, you can see the departure time that doesn't match the schedule. Before anyone's identity, the suspicion remains that the official record is wrong."
      },
      {
        id: 'use-insulation',
        label: "Save the receiver by tearing off the insulation.",
        stat: 'mercy',
        result: "The noise of the potatoes surrounding the tin foil battery subsides and two nearby fishing boats are alerted. The traces in the lunch box are a mixture of seawater and handprints, so they can no longer be separated. Instead, only the small asterisks on the napkin remain intact between the notebooks."
      }
    ]
  },
  {
    day: 2,
    signalId: 'midnight-mark',
    title: "midnight chalk line",
    pages: [
      "Three white chalk lines are drawn on the half-submerged reef. In the waterproof pouch right next to it are a pair of dry socks, two bags of sugar, and a note that says, “I’m going to knock on the door.” If it were a marker measuring the height of the tide, the last line would be too high.",
      "The chalk will be washed away by the next wave and a sharp bend in route will be required to retrieve the bag. Nearby distress signals are weakening. Neither one shows the person's face, but one captures last night's actions and the other captures current life."
    ],
    choices: [
      {
        id: 'trace-marks',
        label: "Photograph the mark and retrieve the pocket.",
        stat: 'truth',
        result: "By leaving both the height of the line and the coordinates of the reef, it becomes possible to assume that it refers to three failed approaches rather than high tide. When I returned to the distress signal, the battery had already died. It is still unknown where the door to the note is."
      },
      {
        id: 'prioritize-live-signal',
        label: "Give up the chalk and head for the weak distress signal.",
        stat: 'mercy',
        result: "Follow the last wave and pull up the old man hanging on the empty wooden boat. When I looked back, the white line on the reef had disappeared without a trace. The old man repeats that someone knocked on the door three times at midnight."
      }
    ]
  },
  {
    day: 3,
    signalId: 'low-lantern',
    title: "lantern held low",
    pages: [
      "The lantern swinging just above the water is not tied to a boat, but to a small medicine cabinet. Inside are three painkillers, a children's thermometer, and a handover tag smeared with salt water. The handwriting on the handover crosses the number 7 in the same way as the last line of the ledger on the first day.",
      "The coral-colored thread from the lighthouse uniform hangs on the medicine cabinet handle. This does not yet prove a person's name, but it makes it possible that the dockside errand and the open sea medicine chest passed through the same hands. If you return the fever reducer to the village, you will have to give up testing its ingredients."
    ],
    choices: [
      {
        id: 'keep-medicine-sample',
        label: "Leave one pill and stitches in the evidence bag.",
        stat: 'truth',
        result: "One pill is sealed and the rest is sent on a rescue boat. The village runs out of food for one person, and the manufacturing number and coral-colored fiber remain in the record. For the first time, scattered traces of life point to the same travel route."
      },
      {
        id: 'send-all-medicine',
        label: "Send all medicines to the village clinic",
        stat: 'mercy',
        result: "The box is loaded onto the next supply boat, and the feverish child falls asleep that night. Although the stitches were dried separately, the manufacturing number of the medicine cannot be confirmed. It is not yet possible to point out anyone just based on the resemblance of handwriting."
      }
    ]
  },
  {
    day: 3,
    signalId: 'bell-note',
    title: "Sheet music folded under the bell",
    pages: [
      "A four-bar sheet of music appears under the west bell switch. Instead of musical notes, the words “pier, door, star, return” are written, and the round stains of a coffee cup overlap at the corners. Raon swallows the sentence while saying that he heard this rhythm at a lighthouse changing ceremony a long time ago.",
      "On the back of the score, there is a note to check the infirmary key every shift. The date is the day before the storm, and only one checkbox is empty. If you ask Raon the reason now, your concentration may be disturbed, but if you delay, your memory may close again."
    ],
    choices: [
      {
        id: 'press-rowan-now',
        label: "Ask Raon the reason for the empty checkbox now",
        stat: 'truth',
        result: "Raon admits the key was missing that day, but says he did not see the person who took it. While answering, the steering is delayed, causing the hull to scrape against a reef and a can of reserve fuel to leak. The clues have become clearer, but the remaining route is getting shorter."
      },
      {
        id: 'let-rowan-breathe',
        label: "Close the sheet music and wait for Raon to speak",
        stat: 'mercy',
        result: "The tremors in Raon's hands stopped, and the boat passed safely through the narrow waterway. After a while, he voluntarily confesses that he did not have the key, but cannot say the time or the witness. What was gained was trust, and what was lost was the moment to ask questions."
      }
    ]
  },
  {
    day: 4,
    signalId: 'breach',
    title: "Family photo on a cracked hull",
    pages: [
      "A palm-sized family photo hangs on a pump blade in the cracked hull of a shipwreck. The faces of the people in the photo have been erased by the water, but there is a bottle of milk on the table, just like the ledger from the first day. If you remove the photo, the pump will run again, and if you leave it in, the remaining layers of film will be preserved.",
      "Below the cabin, the regular tapping of survivors can be heard. If you save the pump, you can slow down the water, but the picture will disappear as it is pulverized by the wings. If the machine is dismantled for evidence, the time to get people out quickly decreases."
    ],
    choices: [
      {
        id: 'restart-pump',
        label: "Tear out the photo and turn the pump immediately",
        stat: 'mercy',
        result: "The film shatters into black pieces, but the water level goes down and the trapped mechanic is pulled out. He remembers seeing a coral-colored coat near the infirmary before the storm. He adds that he did not see the face, but only the warm hands of the person who saved him."
      },
      {
        id: 'recover-photo',
        label: "Stop the pump and carefully retrieve the photo layer.",
        stat: 'truth',
        result: "Read the lighthouse supply number and the time of the storm on the back of the photo. Meanwhile, the knocking in the cabin becomes weaker, and although the mechanic is rescued, it becomes difficult to use one leg for a long time. Accurate time is obtained and the cost of that accuracy is recorded."
      }
    ]
  },
  {
    day: 4,
    signalId: 'warm-voice',
    title: "voice in thermos",
    pages: [
      "A faint recorder operates in an old thermos bottle hanging from a buoy. Behind the voice saying, “Water first, name later,” you can hear the sound of cups clinking and a doorknob turning three times. Raon explains that it is an old rule of lighthouses used to share water.",
      "The battery can be regenerated only once more. You can listen to conversations beyond the door by removing noise, or transmit voices to the rescue channel to find people you remember. The former chooses the accuracy of words, and the latter chooses the possibility of living testimony."
    ],
    choices: [
      {
        id: 'clean-recording',
        label: "Eliminate noise with every last bit of power",
        stat: 'truth',
        result: "Behind the door, the phrase “Breath rather than a list” becomes clear, followed by the sound of someone placing keys on the floor. The owner of the voice has not been identified. The battery died and now I can't play the original sound to anyone."
      },
      {
        id: 'broadcast-voice',
        label: "The original sound will be broadcast once on the rescue team channel.",
        stat: 'mercy',
        result: "Three people shout out different names, and an old man cries that the voice resembles the person who made barley tea every day. The testimonies are inconsistent and have low recording value. But those in isolation discover that they are not the only ones who remember."
      }
    ]
  },
  {
    day: 5,
    signalId: 'west-glass',
    title: "empty space in the west glass",
    pages: [
      "When the western lens pieces are put together, it is revealed that some of the waveforms that were previously believed to be “signals from someone” were created by internal reflections of the lighthouse. Memories of empty chairs, cold tea, and hands tying knots overlapped and reflected light like real events. Raon asks if there was no signal, but the receiver still trembles at the same frequency.",
      "The recorded frequencies are a mixture of human transmissions and memory reflections and cannot be separated. Revealing the entire record would reduce the reliability of this route for rescue teams, while hiding the reflections would still allow access to callers who may be real. The very thought of proving existence is creating new signals."
    ],
    choices: [
      {
        id: 'publish-reflection',
        label: "Records are made public, including memory reflections.",
        stat: 'truth',
        result: "The rescue team determines that the data received from the lighthouse is uncertain and postpones the next supply by one day. Instead, all signals discovered thereafter are labeled “real” and “reflected” separately. In order not to erase someone, we also accept the possibility that someone might not exist."
      },
      {
        id: 'keep-channel-open',
        label: "Hide the reflection and keep the channel open",
        stat: 'mercy',
        result: "The weak waveform does not break, and Raon does not let go of the steering wheel. However, a rescue signal that is clearer than the actual one remains in the record, and another ship turns toward dangerous waters. To the extent that you protect hope, the risk becomes yours as well."
      }
    ]
  },
  {
    day: 5,
    signalId: 'orchard-tone',
    title: "Proof of existence of orchard",
    pages: [
      "When I open the low-frequency channel in the direction of the apple orchard, instead of a human voice, the receiver picks up the regular tremors of a bee-chasing can and a pinwheel. However, there is a hidden pattern of tapping the items on the market receipt on the first day in the correct order. It is too life-like to be a mechanical coincidence, and there is no transmitter to be a human transmission.",
      "An old bicycle, half-cut apples, and one person's wet boots remain in the orchard warehouse. All the items look like someone just left them, but the dust has been accumulating for months. The line between “was” and “is now” is today’s most dangerous path."
    ],
    choices: [
      {
        id: 'catalog-empty-life',
        label: "List the traces of an empty life one by one",
        stat: 'truth',
        result: "The size of a boot, the degree of oxidation of an apple, and the rust of a bicycle chain reveal that the traces are taken at different times. It wasn't just one morning left by one person. Instead, the possibility that multiple people's memories filled the same empty space becomes clear."
      },
      {
        id: 'answer-rhythm',
        label: "Answer by ringing the bell in order of receipt.",
        stat: 'mercy',
        result: "When the bell is rung for the last item, all the cans in the orchard stop for a moment and then shake all at once. It's a response that can't be proven, but Raon laughs for the first time. The few traces that were not cataloged are soon washed away by the rain."
      }
    ]
  },
  {
    day: 6,
    signalId: 'west-name',
    title: "name tag in the storm",
    pages: [
      "Two name tags dropped from the western rescue boat are tied to the same life jacket. The ink on one side was clear, and the other side was scratched off with a fingernail. There is time to send only one of the two coordinates to the rescue team before the storm wall closes.",
      "The coordinates of the clear name have been confirmed, but the waves are high, and the coordinates of the erased name are close, but the signal may be a memory reflection. Raon says no one's name makes the risk greater. However, the coordinates you send confirm the silence of the others."
    ],
    choices: [
      {
        id: 'send-verified-coordinate',
        label: "Send distant coordinates of confirmed name",
        stat: 'truth',
        result: "The rescue team goes into the distant wave wall and discovers the owner of the clear name tag. The nearby signal disappeared in the meantime, and it is not known whether it was a reflection or a survivor. As long as it is verifiable, the record of choosing life is accompanied by an empty coordinate."
      },
      {
        id: 'send-near-coordinate',
        label: "Send the nearest coordinates of the erased name",
        stat: 'mercy',
        result: "At the nearby coordinates, only an overturned empty boat is found, but a child hanging underneath it is rescued. The distant rescue ship is pushed beyond the storm wall and communication is cut off. The belief that people can be saved even if their names are erased has been proven, and a clear name becomes a thing of waiting."
      }
    ]
  },
  {
    day: 6,
    signalId: 'bell-echo',
    title: "A bell that can only ring twice",
    pages: [
      "With the main power cut off, only two manual weights remain in the lighthouse bell. The first ringing of the bell can gather the lifeboats into the safety channel, and the second can order the people at the infirmary door to leave the deck. Ringing twice in the same direction will definitely save one group, but the other group will not receive the signal.",
      "It is unlikely that you will be able to distinguish two different instructions amidst the noise of the storm. Dividing it once gives everyone a slim chance, and putting it all to one side creates results for which one can take responsibility. The weight of the weights removed or left over on the first day is transmitted to the bell rope."
    ],
    choices: [
      {
        id: 'split-bell-calls',
        label: "Send different signals to each group once",
        stat: 'mercy',
        result: "Half the lifeboats find a channel and several people in front of the infirmary fall out of the door. The rest misread the signal and stay in danger longer. Everyone was given a chance, but no one was given enough confidence."
      },
      {
        id: 'double-harbor-call',
        label: "Sound the lifeboat return signal both times.",
        stat: 'truth',
        result: "The lifeboats understand the beat and file into the safety channel. No instructions are given to the infirmary, so people keep knocking on the locked door. The power of the clear signal and the sound left outside can be heard at the same time."
      }
    ]
  },
  {
    day: 7,
    signalId: 'first-name',
    title: "first written name",
    pages: [
      "The first buoy on the final route has all the handwriting collected so far overlapped. The sequence of items across the ledger, the infirmary note, and the orchard revolve around one name, but none of them stands alone as proof. Instead of reading the name, Raon tells what the person did in order.",
      "He dispensed water, carried medicine, left the keys at the door, and rang the bell even after the signal was cut off. If you confirm the name, the memory becomes a biography of one person, and if you leave it blank, the actions of many people remain. You must choose the title of the final record."
    ],
    choices: [
      {
        id: 'write-provisional-name',
        label: "Write a tentative name next to the evidence.",
        stat: 'truth',
        result: "Leave a question mark after the name and write the evidence and counterexample. People get titles to call themselves, but there is also a risk that those titles will overshadow the actions of others. Raon quietly nods for not deleting the question mark."
      },
      {
        id: 'title-by-actions',
        label: "Instead of a name, give it a title with the action left behind.",
        stat: 'mercy',
        result: "The title of the record becomes “Those Who Passed the Water First.” Although we give up the confidence that we have recovered one person, we don't have to tell each other that our memories are wrong. The nameless pages are not empty but thickened by the weight of many hands."
      }
    ]
  },
  {
    day: 7,
    signalId: 'buried-call',
    title: "Chorus of Buried Calls",
    pages: [
      "Below the last reef, seven days' calls play simultaneously. The actual transmission, the lens reflection, the rescuers' recollection, and the response you sent form a chorus without distinction. It has all the breath of Mira, the sound of Raon's bells, and the beat of people shouting their names behind doors.",
      "Separating the original requires deleting some waveforms, and preserving the whole will forever obscure what is true. Each of the losses you picked over the past week comes back as a note. I now know that the lighthouse was not a machine that illuminated the truth, but a place where we decided what to carry together."
    ],
    choices: [
      {
        id: 'separate-source-tracks',
        label: "Erase uncertain waveforms and create records by source",
        stat: 'truth',
        result: "The remaining records are short and clear so investigators can reproduce them. There may have been someone's final well-being on the deleted floor, but there is no way to confirm. The truth became solid and memories became lighter."
      },
      {
        id: 'preserve-whole-chorus',
        label: "The entire chorus is left with a note that it is indistinguishable.",
        stat: 'mercy',
        result: "The file is classified as a joint memorial record, not evidence. It becomes difficult to assign exact responsibility, but no one's voice is erased as noise. Mira hears that your response was mixed in the last waveform and says that now this memory is not his alone."
      }
    ]
  }
];
