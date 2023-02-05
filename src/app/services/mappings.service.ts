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
      juniorScoreCell: "K11",
      regularScoreCell: "K12",
      seniorScoreCell: "K13",
      sections: [
        {
          titleRow: 16,
          juniorRows: [
            20,
            21,
            22
          ],
          regularRows: [
            23,
            24,
            25
          ],
          seniorRows: [
            26,
            27,
            28,
            29
          ]
        },
        {
          titleRow: 35,
          suddenDeathRows: [
            36,
            37
          ],
          juniorRows: [
            39,
            40,
            41,
            42,
            43
          ],
          regularRows: [
            44,
            45,
            46,
            47,
            48,
            49
          ],
          seniorRows: [
            50,
            51,
            52,
            53,
            54
          ]
        },
        {
          titleRow: 60,
          juniorRows: [
            64,
            65,
            66,
            67
          ],
          regularRows: [
            68,
            69,
            70,
            71
          ],
          seniorRows: [
            72,
            73,
            74,
            75
          ]
        },
        {
          titleRow: 81,
          juniorRows: [
            85
          ],
          regularRows: [
            89,
            90,
            91
          ],
          seniorRows: [
            93,
            94,
            95,
            96
          ]
        },
        {
          titleRow: 102,
          suddenDeathRows: [
            103,
            104
          ],
          juniorRows: [
            106,
            107,
            108
          ],
          regularRows: [
            109,
            110,
            111,
            112
          ],
          seniorRows: [
            114,
            115,
            116,
            117,
            118
          ]
        },
        {
          titleRow: 124,
          juniorRows: [
            128,
            129,
            130
          ],
          regularRows: [
            131,
            132,
            133,
            134
          ],
          seniorRows: [
            135,
            136,
            137
          ]
        },
        {
          titleRow: 143,
          juniorRows: [
            147,
            148,
            149,
            150
          ],
          regularRows: [
            151,
            152,
            153,
            154,
            155
          ],
          seniorRows: [
            156,
            157,
            158
          ]
        },
        {
          titleRow: 164,
          suddenDeathRows: [
            165
          ],
          juniorRows: [
            168,
            169,
            170
          ],
          regularRows: [
            171,
            172,
            173,
            174
          ],
          seniorRows: [
            175,
            176,
            177
          ]
        },
        {
          titleRow: 183,
          suddenDeathRows: [
            184
          ],
          juniorRows: [
            187,
            188,
            189
          ],
          regularRows: [
            190,
            191,
            192
          ],
          seniorRows: [
            193,
            194,
            195,
            196
          ]
        },
        {
          titleRow: 202,
          juniorRows: [
            206,
            207,
            208
          ],
          regularRows: [
            209,
            210,
            211,
            212,
            213
          ],
          seniorRows: [
            214,
            215,
            216
          ]
        },
        {
          titleRow: 222,
          mandataryRows: [
            223,
            224
          ],
          juniorRows: [
            226,
            227,
            228
          ],
          regularRows: [
            229,
            230,
            231
          ],
          seniorRows: [
            232,
            233,
            234
          ]
        },
        {
          titleRow: 240,
          juniorRows: [
            244,
            245,
            246
          ],
          regularRows: [
            247,
            248,
            249,
            250
          ],
          seniorRows: [
            251,
            252,
            253,
            254
          ]
        },
        {
          titleRow: 260,
          juniorRows: [
            264,
            265,
            266
          ],
          regularRows: [
            267,
            268,
            269,
            270
          ],
          seniorRows: [
            271,
            272,
            274,
            275
          ]
        },
        {
          titleRow: 281,
          juniorRows: [
            285,
            286
          ],
          regularRows: [
            288,
            289,
            290
          ],
          seniorRows: [
            291,
            292,
            293
          ]
        },
        {
          titleRow: 299,
          suddenDeathRows: [
            300
          ],
          juniorRows: [
            303,
            304,
            305
          ],
          regularRows: [
            306,
            307,
            308
          ],
          seniorRows: [
            309,
            310,
            311,
            312
          ]
        }
      ]
    }
  };
}
