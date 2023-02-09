import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MappingsService {
  mappings = {
    overview: {
      worksheetName: "Overview",
      candidateNameCell: "B1",
      interviewerNameCell: "B2",
      dateCell: "B3",
      communicationCell: "B4",
      practicalTaskScoreCell: "B6",
      overallImpressionCell: "B7",
      relevantExperienceCell: "B8",
      finalResultLevelCell: "B9",
      finalResultScoreCell: "E9"
    },
    tasks: {
      worksheetName: "Tasks",
      scoreColumn: "C",
      questionColumn: "D",
      aspNetScoreRow: 30,
      wpfScoreRow: 70,
      aspNetCoreCommentRows: [
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        24,
        25,
        26,
        27
      ],
      wpfCommentRows: [
        53,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        65,
        66,
        67,
        68
      ]
    },
    csQuestions: {
      worksheetName: "CS questions",
      questionColumn: "C",
      scoreColumn: "E",
      answerColumn: "G",
      codeReviewScoreCell: "E10",
      juniorScoreCell: "K11",
      regularScoreCell: "K12",
      seniorScoreCell: "K13",
      juniorResultCell: "L11",
      regularResultCell: "L12",
      seniorResultCell: "L13",
      sections: [
        {
          titleRow: 16,
          junior: {
            rows: [20, 21, 22],
            scoreRow: 31
          },
          regular: {
            rows: [23, 24, 25],
            scoreRow: 32
          },
          senior: {
            rows: [26, 27, 28, 29],
            scoreRow: 33
          }
        },
        {
          titleRow: 35,
          suddenDeath: {
            rows: [36, 37]
          },
          junior: {
            rows: [39, 40, 41, 42, 43],
            scoreRow: 0
          },
          regular: {
            rows: [44,45,46,47,48,49],
            scoreRow: 0
          },
          senior: {
            rows: [50,51,52,53,54],
            scoreRow: 0
          }
        },
        {
          titleRow: 60,
          junior: {
            rows: [64,65,66,67],
            scoreRow: 0
          },
          regular: {
            rows: [68,69,70,71],
            scoreRow: 0
          },
          senior: {
            rows: [72,73,74,75],
            scoreRow: 0
          }
        },
        {
          titleRow: 81,
          junior: {
            rows: [85],
            scoreRow: 0
          },
          regular: {
            rows: [89,90,91],
            scoreRow: 0
          },
          senior: {
            rows: [93,94,95,96],
            scoreRow: 0
          }
        },
        {
          titleRow: 102,
          suddenDeath: {
            rows: [103,104]
          },
          junior: {
            rows: [106,107,108],
            scoreRow: 0
          },
          regular: {
            rows: [109,110,111,112],
            scoreRow: 0
          },
          senior: {
            rows: [114,115,116,117,118],
            scoreRow: 0
          }
        },
        {
          titleRow: 124,
          junior: {
            rows: [
              128,
              129,
              130
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              131,
              132,
              133,
              134
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              135,
              136,
              137
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 143,
          junior: {
            rows: [
              147,
              148,
              149,
              150
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              151,
              152,
              153,
              154,
              155
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              156,
              157,
              158
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 164,
          suddenDeath: {
            rows: [
              165
            ]
          },
          junior: {
            rows: [
              168,
              169,
              170
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              171,
              172,
              173,
              174
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              175,
              176,
              177
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 183,
          suddenDeath: {
            rows: [
              184
            ]
          },
          junior: {
            rows: [
              187,
              188,
              189
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              190,
              191,
              192
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              193,
              194,
              195,
              196
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 202,
          junior: {
            rows: [
              206,
              207,
              208
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              209,
              210,
              211,
              212,
              213
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              214,
              215,
              216
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 222,
          mandatary: {
            rows: [
              223,
              224
            ]
          },
          junior: {
            rows: [
              226,
              227,
              228
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              229,
              230,
              231
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              232,
              233,
              234
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 240,
          junior: {
            rows: [
              244,
              245,
              246
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              247,
              248,
              249,
              250
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              251,
              252,
              253,
              254
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 260,
          junior: {
            rows: [
              264,
              265,
              266
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              267,
              268,
              269,
              270
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              271,
              272,
              274,
              275
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 281,
          junior: {
            rows: [
              285,
              286
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              288,
              289,
              290
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              291,
              292,
              293
            ],
            scoreRow: 0
          }
        },
        {
          titleRow: 299,
          suddenDeath: {
            rows: [
              300
            ]
          },
          junior: {
            rows: [
              303,
              304,
              305
            ],
            scoreRow: 0
          },
          regular: {
            rows: [
              306,
              307,
              308
            ],
            scoreRow: 0
          },
          senior: {
            rows: [
              309,
              310,
              311,
              312
            ],
            scoreRow: 0
          }
        }
      ]
    }
  };
}
