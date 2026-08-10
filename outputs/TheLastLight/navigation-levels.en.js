/* Generated from work/navigation-levels.json. */
'use strict';
window.NAVIGATION_LEVELS = {
  "schemaVersion": 1,
  "grid": {
    "width": 6,
    "height": 6
  },
  "coordinateSystem": "[x,y], origin top-left; x grows right, y grows down",
  "rules": {
    "input": "orthogonal only: U, R, D, L",
    "moveCost": "one player command costs one move; automatic current pushes cost zero",
    "completion": "reach goal after collecting every signal, activating every switch, and rescuing every survivor",
    "currents": "entering a current immediately pushes one cell in its direction; chained currents resolve in sequence; an illegal push makes the whole command illegal",
    "switches": "permanent once entered; each opens the listed gates",
    "gates": "impassable until their linked switch is active",
    "moveLimit": "soft mode is a mastery target; hard mode blocks commands beyond the budget; undo and restart are free and unlimited"
  },
  "levels": [
    {
      "id": "nav-01",
      "day": 1,
      "title": "first light",
      "targetMinutes": [
        3,
        4
      ],
      "introduced": [
        "movement",
        "reefs",
        "signals"
      ],
      "briefing": "After retrieving the two memory signals, reach the northeast lighthouse buoy.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          4
        ],
        [
          2,
          3
        ],
        [
          2,
          2
        ],
        [
          4,
          4
        ],
        [
          4,
          3
        ],
        [
          4,
          2
        ]
      ],
      "signals": [
        {
          "id": "harbor-bell",
          "pos": [
            1,
            4
          ]
        },
        {
          "id": "dawn-code",
          "pos": [
            4,
            1
          ]
        }
      ],
      "currents": [],
      "switches": [],
      "gates": [],
      "survivors": [],
      "moveLimit": 15,
      "limitMode": "soft",
      "verifiedOptimalMoves": 10,
      "minimalSolution": "URUUURRRUR"
    },
    {
      "id": "nav-02",
      "day": 2,
      "title": "direction the sea moves",
      "targetMinutes": [
        3,
        4
      ],
      "introduced": [
        "currents"
      ],
      "briefing": "When you enter the current, you are pushed one space further in the direction of the arrow. Follow your signal and go to the lighthouse.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          1,
          0
        ],
        [
          1,
          1
        ],
        [
          1,
          2
        ],
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          3,
          1
        ],
        [
          3,
          2
        ],
        [
          3,
          3
        ],
        [
          3,
          4
        ]
      ],
      "signals": [
        {
          "id": "west-wake",
          "pos": [
            2,
            5
          ]
        },
        {
          "id": "midnight-mark",
          "pos": [
            2,
            2
          ]
        },
        {
          "id": "east-wake",
          "pos": [
            4,
            0
          ]
        },
        {
          "id": "return-call",
          "pos": [
            5,
            3
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            1,
            5
          ],
          "dir": "R"
        },
        {
          "pos": [
            3,
            0
          ],
          "dir": "R"
        }
      ],
      "switches": [],
      "gates": [],
      "survivors": [],
      "moveLimit": 18,
      "limitMode": "soft",
      "verifiedOptimalMoves": 14,
      "minimalSolution": "RUUUUURRDDDUUU"
    },
    {
      "id": "nav-03",
      "day": 3,
      "title": "locked route",
      "targetMinutes": [
        4,
        5
      ],
      "introduced": [
        "switches",
        "gates"
      ],
      "briefing": "The locked bronze door answers the western bell. Retrieve the five signals and return.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          1
        ],
        [
          2,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          4,
          1
        ],
        [
          4,
          2
        ],
        [
          4,
          3
        ],
        [
          4,
          4
        ],
        [
          4,
          5
        ]
      ],
      "signals": [
        {
          "id": "low-lantern",
          "pos": [
            1,
            4
          ]
        },
        {
          "id": "bell-note",
          "pos": [
            1,
            1
          ]
        },
        {
          "id": "west-warning",
          "pos": [
            0,
            3
          ]
        },
        {
          "id": "open-water",
          "pos": [
            3,
            0
          ]
        },
        {
          "id": "sunken-letter",
          "pos": [
            3,
            5
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            2,
            0
          ],
          "dir": "R"
        }
      ],
      "switches": [
        {
          "id": "west-bell",
          "pos": [
            1,
            1
          ],
          "opens": [
            "bronze-gate"
          ]
        }
      ],
      "gates": [
        {
          "id": "bronze-gate",
          "pos": [
            4,
            0
          ]
        }
      ],
      "survivors": [],
      "moveLimit": 19,
      "limitMode": "soft",
      "verifiedOptimalMoves": 15,
      "minimalSolution": "RRRLLUULUURURRR"
    },
    {
      "id": "nav-04",
      "day": 4,
      "title": "weight of one person",
      "targetMinutes": [
        4,
        5
      ],
      "introduced": [
        "survivors"
      ],
      "briefing": "Don't just follow the signs. Rescue the southern drifter, turn on the rescue light, and head to the lighthouse.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          0
        ],
        [
          2,
          1
        ],
        [
          2,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          4,
          0
        ],
        [
          4,
          1
        ],
        [
          4,
          2
        ]
      ],
      "signals": [
        {
          "id": "breach",
          "pos": [
            2,
            5
          ]
        },
        {
          "id": "warm-voice",
          "pos": [
            3,
            3
          ]
        },
        {
          "id": "far-shore",
          "pos": [
            3,
            1
          ]
        },
        {
          "id": "chapel-flash",
          "pos": [
            5,
            2
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            1,
            5
          ],
          "dir": "R"
        }
      ],
      "switches": [
        {
          "id": "rescue-lamp",
          "pos": [
            5,
            3
          ],
          "opens": [
            "north-gate"
          ]
        }
      ],
      "gates": [
        {
          "id": "north-gate",
          "pos": [
            5,
            1
          ]
        }
      ],
      "survivors": [
        {
          "id": "rowan",
          "pos": [
            5,
            5
          ]
        }
      ],
      "moveLimit": 21,
      "limitMode": "soft",
      "verifiedOptimalMoves": 17,
      "minimalSolution": "RRUUUUDDRRDDUUUUU"
    },
    {
      "id": "nav-05",
      "day": 5,
      "title": "remaining fuel",
      "targetMinutes": [
        5,
        6
      ],
      "introduced": [
        "move-limit"
      ],
      "briefing": "Fuel only allows 22 steers. Plan a course that embraces both your signal and the drifter.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          5
        ],
        [
          2,
          4
        ],
        [
          2,
          2
        ],
        [
          2,
          1
        ],
        [
          4,
          4
        ],
        [
          4,
          3
        ],
        [
          4,
          1
        ],
        [
          4,
          0
        ]
      ],
      "signals": [
        {
          "id": "west-glass",
          "pos": [
            0,
            3
          ]
        },
        {
          "id": "orchard-tone",
          "pos": [
            1,
            2
          ]
        },
        {
          "id": "split-star",
          "pos": [
            3,
            3
          ]
        },
        {
          "id": "east-glass",
          "pos": [
            5,
            2
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            0,
            4
          ],
          "dir": "U"
        },
        {
          "pos": [
            3,
            2
          ],
          "dir": "R"
        }
      ],
      "switches": [
        {
          "id": "fuel-valve",
          "pos": [
            1,
            0
          ],
          "opens": [
            "fuel-gate"
          ]
        }
      ],
      "gates": [
        {
          "id": "fuel-gate",
          "pos": [
            5,
            1
          ]
        }
      ],
      "survivors": [
        {
          "id": "mara",
          "pos": [
            3,
            5
          ]
        }
      ],
      "moveLimit": 22,
      "limitMode": "hard",
      "verifiedOptimalMoves": 18,
      "minimalSolution": "UUUURDDDRRDDUUURUU"
    },
    {
      "id": "nav-06",
      "day": 6,
      "title": "two promises",
      "targetMinutes": [
        5,
        7
      ],
      "introduced": [
        "multiple-switches",
        "multiple-survivors"
      ],
      "briefing": "Open the strait with the western bell, and open the final door with the eastern rescue light. Don't leave anyone behind.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          0
        ],
        [
          2,
          1
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          2,
          5
        ],
        [
          3,
          0
        ],
        [
          4,
          0
        ]
      ],
      "signals": [
        {
          "id": "west-name",
          "pos": [
            1,
            4
          ]
        },
        {
          "id": "bell-echo",
          "pos": [
            0,
            1
          ]
        },
        {
          "id": "mid-sea-name",
          "pos": [
            3,
            4
          ]
        },
        {
          "id": "east-name",
          "pos": [
            4,
            2
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            1,
            2
          ],
          "dir": "R"
        },
        {
          "pos": [
            3,
            2
          ],
          "dir": "R"
        }
      ],
      "switches": [
        {
          "id": "west-bell",
          "pos": [
            0,
            0
          ],
          "opens": [
            "strait-gate"
          ]
        },
        {
          "id": "east-lamp",
          "pos": [
            5,
            4
          ],
          "opens": [
            "lighthouse-gate"
          ]
        }
      ],
      "gates": [
        {
          "id": "strait-gate",
          "pos": [
            2,
            2
          ]
        },
        {
          "id": "lighthouse-gate",
          "pos": [
            5,
            1
          ]
        }
      ],
      "survivors": [
        {
          "id": "sena",
          "pos": [
            1,
            5
          ]
        },
        {
          "id": "tomas",
          "pos": [
            5,
            5
          ]
        }
      ],
      "moveLimit": 25,
      "limitMode": "hard",
      "verifiedOptimalMoves": 22,
      "minimalSolution": "RUULUUURDDRDDLRRDUUUUU"
    },
    {
      "id": "nav-07",
      "day": 7,
      "title": "seventh dawn",
      "targetMinutes": [
        6,
        7
      ],
      "introduced": [
        "full-rule-synthesis"
      ],
      "briefing": "Check all signals and survivors in the three areas and open the two doors one by one to reach the final light.",
      "start": [
        0,
        5
      ],
      "goal": [
        5,
        0
      ],
      "reefs": [
        [
          2,
          0
        ],
        [
          2,
          1
        ],
        [
          2,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          5
        ],
        [
          4,
          0
        ]
      ],
      "signals": [
        {
          "id": "first-name",
          "pos": [
            1,
            2
          ]
        },
        {
          "id": "buried-call",
          "pos": [
            0,
            2
          ]
        },
        {
          "id": "unlit-star",
          "pos": [
            1,
            0
          ]
        },
        {
          "id": "middle-wake",
          "pos": [
            3,
            3
          ]
        },
        {
          "id": "keeper-code",
          "pos": [
            4,
            2
          ]
        },
        {
          "id": "last-name",
          "pos": [
            5,
            3
          ]
        }
      ],
      "currents": [
        {
          "pos": [
            1,
            4
          ],
          "dir": "R"
        },
        {
          "pos": [
            3,
            4
          ],
          "dir": "R"
        }
      ],
      "switches": [
        {
          "id": "memory-bell",
          "pos": [
            0,
            0
          ],
          "opens": [
            "memory-gate"
          ]
        },
        {
          "id": "keeper-lens",
          "pos": [
            3,
            5
          ],
          "opens": [
            "lens-gate"
          ]
        }
      ],
      "gates": [
        {
          "id": "memory-gate",
          "pos": [
            2,
            4
          ]
        },
        {
          "id": "lens-gate",
          "pos": [
            5,
            1
          ]
        }
      ],
      "survivors": [
        {
          "id": "rowan",
          "pos": [
            0,
            4
          ]
        },
        {
          "id": "mira",
          "pos": [
            3,
            5
          ]
        },
        {
          "id": "ion",
          "pos": [
            5,
            5
          ]
        }
      ],
      "moveLimit": 28,
      "limitMode": "hard",
      "verifiedOptimalMoves": 24,
      "minimalSolution": "UUUUURDDDDRDLRRUULLURURU"
    }
  ]
};
