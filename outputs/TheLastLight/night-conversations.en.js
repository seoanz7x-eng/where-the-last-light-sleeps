'use strict';

// 플레이어는 그날의 choices 중 한 명만 선택하고,
// 선택한 인물의 questions 세 개 중 두 개만 들을 수 있다.
// day는 플레이어에게 보이는 1~7일을 사용한다.
window.NIGHT_CONVERSATIONS = [
  {
    day: 1,
    title: "First night · wet matches",
    choices: [
      {
        id: 'd1-rowan',
        name: "Rowan",
        intro: "Rowan is cutting off a frayed piece of rope in front of a dock warehouse. The kettle next to me smells like burnt coffee.",
        questions: [
          {
            id: 'd1-rowan-rope',
            label: "Why tie a rope when you don't even have a boat?",
            stat: 'truth',
            answer: "“If you let it go, it will drink water and rot overnight. Equipment is equipment, whether a ship comes or not.” Rowan pulls the knot one more time. “And when your hands are idle, you start thinking useless things.”"
          },
          {
            id: 'd1-rowan-alone',
            label: "Are you alone on this dock?",
            stat: 'mercy',
            answer: "“The seagulls are too noisy to be alone. They don’t even pay rent and they knock on the roof every morning.” He laughs and then sneaks the second cup away from the storage room. It doesn't say who the cup belongs to."
          },
          {
            id: 'd1-rowan-light',
            label: "Are you scared of lighthouse lights?",
            stat: 'truth',
            answer: "“What’s scarier is the order rather than the lights. Today it blinked two, three, two, but it’s a signal that isn’t on the route chart.” Rowan drinks coffee without looking at the lighthouse. “It’s too accurate to say it’s a malfunction.”"
          }
        ]
      },
      {
        id: 'd1-adele',
        name: "Adele",
        intro: "Adele is oiling the hinges of an empty mailbox. It is said that the lid must be opened quietly even if there is no one to deliver it.",
        questions: [
          {
            id: 'd1-adele-seventeen',
            label: "There are 16 houses, so why is there a letter for number 17?",
            stat: 'truth',
            answer: "“There is number 17 on the delivery ticket, but it is not on the map. Administratively, one of them is incorrect.” Adele writes the date in the blank space. “If I write a ghost address, the report will be finished faster, but I don’t leave work like that.”"
          },
          {
            id: 'd1-adele-repeat',
            label: "Why do you deliver the same letter every day?",
            stat: 'mercy',
            answer: "“There is no signature to receive it. There is no return address.” Adele straightens the crumpled corners of the envelope. “To be honest, I want to stop now, but I hate that I feel like I gave up before the letter.”"
          },
          {
            id: 'd1-adele-recognize',
            label: "Have you seen me?",
            stat: 'mercy',
            answer: "Adele looks at the note in your pocket longer than your face. “The handwriting is not unfamiliar. But to say that I even know the people would be a bigger lie than the postal law.” Instead of saying sorry, she gives him a new envelope."
          }
        ]
      }
    ]
  },
  {
    day: 2,
    title: "Second night, after ringing three times",
    choices: [
      {
        id: 'd2-noah',
        name: "Noah",
        intro: "Noah is wrapping the broken fruit in a piece of cloth. The only place you will sit is a sack of fertilizer, but you insist that it is a pretty good chair.",
        questions: [
          {
            id: 'd2-noah-fruit',
            label: "Glass fruit show the real past?",
            stat: 'truth',
            answer: "“Most of the time. But there are times when two fruits show the same scene differently.” Noah puts healthy and cracked fruits side by side. “So, if you see one and pretend not to notice them all, I will kick you out with a shovel.”"
          },
          {
            id: 'd2-noah-raon',
            label: "Do you know a kid named Raon?",
            stat: 'mercy',
            answer: "“I don’t remember meeting you in person, but I know it because the fruits mumble its name every night.” Noah shrugs. “At first, I thought it was the name of a tree and even gave it water. For three days.”"
          },
          {
            id: 'd2-noah-stay',
            label: "Why do you stay here?",
            stat: 'mercy',
            answer: "“Someone needs to water it, but I left it to Rowan and they poured salt water as well.” Noah refers to a dead sapling. “And you don’t even know if you can go outside yet. Not knowing is no reason to run away.”"
          }
        ]
      },
      {
        id: 'd2-mare',
        name: "Mare",
        intro: "Mare dries the wet bell rope next to the stove. It is noticeable that the rescue diary was laid out before the prayer book.",
        questions: [
          {
            id: 'd2-mare-signal',
            label: "What signal did the bell ring three times today?",
            stat: 'truth',
            answer: "“The interval is different from the the Siren distress signal. It is closer to the short and long pattern used when someone responds that they are ‘alive.’” Mare blocks your hand from writing Confirmed. “There is a difference between being close and being the same.”"
          },
          {
            id: 'd2-mare-names',
            label: "Are the twenty-seven names on the wall a list of passengers on board?",
            stat: 'truth',
            answer: "“The number is correct, but I don’t know when this wall was engraved. It could be a memorial list or a boarding report.” Mare does not clean the salty last line. “If you scratch a stone because you want to read it quickly, that is damage.”"
          },
          {
            id: 'd2-mare-stop',
            label: "Can I stop if the bell gets hard?",
            stat: 'mercy',
            answer: "“Of course. Enduring pain doesn’t make you a truthful person.” Mare adds as you feel relieved. “But don’t just storm out without saying anything—the cost of repairing a door is more expensive than praying.”"
          }
        ]
      }
    ]
  },
  {
    day: 3,
    title: "Third night, before breaking the seal",
    choices: [
      {
        id: 'd3-isol',
        name: "Isol",
        intro: "Isol dries wet socks on the observatory stove and disassembles a barometer. It doesn't seem like he has any intention of apologizing for the smell in the room.",
        questions: [
          {
            id: 'd3-isol-real',
            label: "Is this island a real place?",
            stat: 'truth',
            answer: "“The compass says place, the clock says no. The tide table points to the same day every day.” Isol shrugs with a screw in his mouth. “If three machines are fighting and I make the decision first, that’s not science, it’s temperament.”"
          },
          {
            id: 'd3-isol-time',
            label: "Why do all records stop at 11:47?",
            stat: 'truth',
            answer: "“The air pressure and temperature at that time return the same every day. “It is highly likely that it was the time of the accident, but there is no data on whose time stopped.” Isol sees your expression and puts down his pencil. “Don’t ask me to read information to your face that doesn’t exist.”"
          },
          {
            id: 'd3-isol-rude',
            label: "Are you really this rude to everyone?",
            stat: 'mercy',
            answer: "“No, it’s more rude to someone you like.” Isol laughs for a moment and fills your teacup with hot water. “The sugar was confiscated by Adele. They said it was because of blood pressure, but they didn’t tell me whether it was my blood pressure or theirs.”"
          }
        ]
      },
      {
        id: 'd3-adele',
        name: "Adele",
        intro: "Adele places a red letter in the middle of the table and fills out the opening confirmation form. The knife is ready, but I won't touch it until you decide.",
        questions: [
          {
            id: 'd3-adele-sender',
            label: "Is sender M Mira?",
            stat: 'truth',
            answer: "“It’s a possibility, but it’s not confirmed. “There are three names starting with M in the same boat.” Adele shows three lines of the embarkation ticket. “Drawing a red line first on the desired answer is closer to scribbling than research.”"
          },
          {
            id: 'd3-adele-open',
            label: "Even if it seems like it was addressed to me, I might not read it, right?",
            stat: 'mercy',
            answer: "“Of course, just because you are the recipient doesn’t give you an obligation to take care of it right away.” Adele puts the envelope into the locker. “I will also record my decision not to read it. My occupational disease lasts longer than my consideration.”"
          },
          {
            id: 'd3-adele-outside',
            label: "What happened to the people outside the island?",
            stat: 'mercy',
            answer: "“I have letters postmarked the year after the accident and the year after. Some people moved, some went to school, some stayed at the same address.” Adele hides the content and shows only the date. “The fact that I continued to live is not the same as saying that I was okay.”"
          }
        ]
      }
    ]
  },
  {
    day: 4,
    title: "Fourth night · After flowing backwards",
    choices: [
      {
        id: 'd4-rowan',
        name: "Rowan",
        intro: "Rowan dries the tenons wet in the backflow one by one. Push your hand that brings the paper closer to the fire three times.",
        questions: [
          {
            id: 'd4-rowan-wheel',
            label: "The ledger says that Mira turned the steering wheel.",
            stat: 'truth',
            answer: "“That may be true, but what is missing is which way it went and by whose orders.” Rowan refers to the next wet and smudged line. “If you find a single verb and write a verdict, the sailors will be the first to laugh at you.”"
          },
          {
            id: 'd4-rowan-aboard',
            label: "Have you also ridden the Siren?",
            stat: 'truth',
            answer: "Instead of answering, Rowan shows a rope burn on his palm. “I remember taking this line that day and the deck tilting to the right.” He lowers his sleeves. “I wouldn’t say my memory is more accurate than my boarding pass.”"
          },
          {
            id: 'd4-rowan-hand',
            label: "Why did you suddenly hold my hand during the day?",
            stat: 'mercy',
            answer: "“I thought you were going to walk into the water—I’m sorry if you were expecting a fancy reason.” Rowan clears his throat. “And I’m a little scared too. Don’t write that in the ledger.”"
          }
        ]
      },
      {
        id: 'd4-noah',
        name: "Noah",
        intro: "Noah sorts the broken fruit pieces by color, then gives up and rearranges them in order of size. When you laugh, he insists that it was his original plan.",
        questions: [
          {
            id: 'd4-noah-vest',
            label: "Who gave the child the life jacket?",
            stat: 'truth',
            answer: "“I could see my uniform sleeves and hands. My face was still cracked by the water.” Noah freezes the scene and zooms in on the knot. “It’s the same way you tie it, but I don’t know if you’re the only one who uses the same knot.”"
          },
          {
            id: 'd4-noah-lie',
            label: "Was lying about being good at swimming bad?",
            stat: 'mercy',
            answer: "“I understand if you meant to put the child on the boat. Still, the child has the right to be angry later.” Noah rolls a piece of glass in his palm. “It’s disgusting to set the other person’s mood just because you meant it well.”"
          },
          {
            id: 'd4-noah-wrong',
            label: "Could it be that the fruit scene itself is wrong?",
            stat: 'truth',
            answer: "“Even if the scene is right, things can go wrong. If you just see the person falling, it’s easy to think that someone pushed them.” Noah deliberately kicks the bucket at your feet. “Look, just now, it looks like the bucket attacked me, doesn’t it?”"
          }
        ]
      }
    ]
  },
  {
    day: 5,
    title: "Fifth Night Before finalizing the name",
    choices: [
      {
        id: 'd5-mare',
        name: "Mare",
        intro: "Mare reveals M.B. under the sleeves. Do not cover the affiliate name tag again. Instead, he drags a chair to the other side while you watch.",
        questions: [
          {
            id: 'd5-mare-family',
            label: "If we have the same last name, are we family?",
            stat: 'truth',
            answer: "“Don’t make a family relationship certificate with just a name tag—even a similar face is not proof.” Mare's voice becomes sharper and then lowers slightly. “However, it is true that I feel angry and worried at the same time when I see you. Let’s find out why until the end tomorrow.”"
          },
          {
            id: 'd5-mare-forgive',
            label: "Can you forgive me?",
            stat: 'mercy',
            answer: "“Start by deciding whether you are asking for forgiveness from the person who survived, the person who disobeyed orders, or the person who was scared.” Mare slams down his glass of water. “It will be easier for both of us if we forgive quickly. So I won’t do it now.”"
          },
          {
            id: 'd5-mare-letters',
            label: "Who sent the letter after the accident?",
            stat: 'truth',
            answer: "“Survivors, families, and rescuers. Even the same people wrote different stories every year.” Mare straightens the folds of a letter. “The part about who stayed on the ship until the end is repeated, but I will intentionally not read the names until tomorrow.”"
          }
        ]
      },
      {
        id: 'd5-isol',
        name: "Isol",
        intro: "Isol placed a heavy anemometer on the command list. For an act that is hidden, it is too blatant for anyone to see.",
        questions: [
          {
            id: 'd5-isol-name',
            label: "Is “this—” on the captain’s list your name?",
            stat: 'truth',
            answer: "“That is highly likely. How many old people from the Lee clan are on this island?” Isol still doesn't put away the anemometer. “Acknowledging the name and acknowledging the whole day are different, so I will record it tomorrow.”"
          },
          {
            id: 'd5-isol-delay',
            label: "Are you the one who delayed the route change by 41 seconds?",
            stat: 'truth',
            answer: "“It is a vision written by my own hand, and commands similar to my voice remain, so if I deny it, it will become ugly.” Isol looked out the window and gritted his teeth. “But if I tell you why I’m late, it will sound like an excuse. Still, you have to listen to judge.”"
          },
          {
            id: 'd5-isol-blame',
            label: "So who is to blame?",
            stat: 'mercy',
            answer: "“If you pick just one person, you’ll sleep well at night, so you can pick me.” Isol puts pressure records and breakdown reports in front of you. “But if you reduce the cause to make it easier, the next ship will break in the same place. Even if it’s annoying, look at everything.”"
          }
        ]
      }
    ]
  },
  {
    day: 6,
    title: "Sixth Night: Words left after the sinking",
    choices: [
      {
        id: 'd6-rowan',
        name: "Rowan",
        intro: "Rowan loads drinking water and biscuits onto the last ship. I check the expiration date carefully to see if I can leave.",
        questions: [
          {
            id: 'd6-rowan-role',
            label: "What did you do on deck that day?",
            stat: 'truth',
            answer: "“Deckman lowered the lifeboat and counted the passengers.” Rowan shows its ledger stopped at the twenty-sixth. “I stopped the rescue team from going back to pick up the last person. “Because the boat was already half bent.”"
          },
          {
            id: 'd6-rowan-mira',
            label: "Did Mira really save 26 people?",
            stat: 'truth',
            answer: "“Mira Bell was the one who changed the course to a shallow bay to buy time and put the last vest on Raon.” Rowan looks straight in your face. “But don’t make him a hero who wasn’t afraid. He was the same person who shouted for help when he saw the ship leaving.”"
          },
          {
            id: 'd6-rowan-goodbye',
            label: "Will you be sad if I leave?",
            stat: 'mercy',
            answer: "“I’m sure it’s disappointing. So if they catch me, I’ll be the bad guy.” Rowan forces a bag of biscuits into your pocket. “I don’t know where your body can eat, but saying goodbye empty-handed doesn’t suit your constitution.”"
          }
        ]
      },
      {
        id: 'd6-mare',
        name: "Mare",
        intro: "Mare wears an old line armband over her nun's habit. Today I sit closer to the infirmary door than the altar.",
        questions: [
          {
            id: 'd6-mare-sister',
            label: "Are you really Mira's older sister?",
            stat: 'truth',
            answer: "“Marena Bell. the Siren was well-intentioned and Mira’s older sister.” Mare says his name without avoiding it for the first time. “I don’t know if I’m exactly the same person here now, but the memory of being angry at Mira that day is mine.”"
          },
          {
            id: 'd6-mare-scream',
            label: "Why were you yelling like that from behind the door?",
            stat: 'mercy',
            answer: "“Because Mira locked the infirmary door from the outside to prevent me from jumping back on deck.” Mare rubs the scar on the back of his hand. “Rather than saying thank you for saving my life, I first said that I hated him for making the decision on my own. Both words were sincere.”"
          },
          {
            id: 'd6-mare-responsibility',
            label: "Can you tell Mira that he did nothing wrong?",
            stat: 'truth',
            answer: "“That’s too easy a sentence, but it’s true that people survived because Mira disobeyed orders and turned his ship toward the rocks.” Mare takes your hand and lets go. “Fault, responsibility, and result are not the same words. “Let’s take the three separately today.”"
          }
        ]
      }
    ]
  },
  {
    day: 7,
    title: "Seventh Night Before Climbing the Lighthouse",
    choices: [
      {
        id: 'd7-noah',
        name: "Noah",
        intro: "Noah puts the last transparent seed into a small paper bag. On the envelope, instead of a name, he wrote, “Do not give too much water.”",
        questions: [
          {
            id: 'd7-noah-future',
            label: "Are you the future I never had?",
            stat: 'truth',
            answer: "“I don’t know because there’s no way to check if it was something you thought about or if it just happened after you lived here for a week.” Noah clicks his tongue when you are disappointed. “No matter what the Lighthouse explains, it doesn’t mean the number of flower pots I watered will decrease. Thirteen, not counting the ones Rowan killed.”"
          },
          {
            id: 'd7-noah-afraid',
            label: "Aren’t you afraid of disappearing?",
            stat: 'mercy',
            answer: "“It’s scary, and it’s especially unfair that my last meal was Adele’s salt-free soup.” Noah laughs and wipes his eyes with his sleeve. “So don’t tell me you’re not scared. Instead, stay by my side when it’s over.”"
          },
          {
            id: 'd7-noah-seed',
            label: "Can I really take this seed?",
            stat: 'mercy',
            answer: "“It will probably disappear down the stairs, but put it in your pocket anyway.” Noah pushes some dirt under your fingernails. “If the seed can’t go, let’s test whether the soil can go. Even if it fails, I’ll still have data to laugh at.”"
          }
        ]
      },
      {
        id: 'd7-adele',
        name: "Adele",
        intro: "Adele places the last letter and return stamp side by side. As of today, neither side goes first.",
        questions: [
          {
            id: 'd7-adele-addressee',
            label: "Who is the real recipient of the last letter?",
            stat: 'truth',
            answer: "“The envelope doesn’t have a person’s name written on it, but a place called ‘Siren Island.’” Adele shakes his head when you try to point at him. “You can decide whether the island is the same as yours or not after looking at the lighthouse records. It is beyond the deliveryman’s authority.”"
          },
          {
            id: 'd7-adele-end',
            label: "Do you want the delivery to end?",
            stat: 'mercy',
            answer: "“I want to, but I’m scared that I’ll be nothing after it’s over.” Adele pockets the return stamp. “Just because you have two emotions doesn’t mean your work is done wrong. I’m going to try to believe that today.”"
          },
          {
            id: 'd7-adele-choice',
            label: "What light would you choose?",
            stat: 'truth',
            answer: "“I wouldn’t recommend it. “If you let go, you lose the details, if you spread the word, you lose control of the story, and if you keep it, you can hold onto other people’s tomorrows.” Adele only gives you an empty confirmation. “Read and sign the cost, not the pretty name—that’s the final delivery terms.”"
          }
        ]
      }
    ]
  }
];

