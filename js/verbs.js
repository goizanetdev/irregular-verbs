/**
 * Base de datos de verbos irregulares en inglés.
 * Generada y curada para IrregularVerbs — no depende de APIs externas.
 * Cada verbo incluye formas, IPA, traducción, nivel CEFR, categoría,
 * un ejemplo bilingüe verificado a mano y específico para ese verbo,
 * verbos relacionados y error frecuente.
 */
const VERBS = [
  {
    "id": "be-1",
    "infinitive": "be",
    "pastSimple": "was/were",
    "pastParticiple": "been",
    "translation": "ser / estar",
    "ipa": {
      "infinitive": "biː",
      "pastSimple": "wɒz / wɜː",
      "pastParticiple": "biːn"
    },
    "level": "A1",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "essential",
    "rank": 1,
    "example": {
      "en": "I was tired after the trip, but now I have been to Rome three times.",
      "es": "Estuve cansado después del viaje, pero ya he estado en Roma tres veces."
    },
    "mistake": "No añadas '-ed' a 'be': su pasado es 'was/were' y su participio 'been', formas irregulares que hay que memorizar.",
    "similar": [
      "wake",
      "hurt",
      "cost"
    ]
  },
  {
    "id": "have-2",
    "infinitive": "have",
    "pastSimple": "had",
    "pastParticiple": "had",
    "translation": "tener",
    "ipa": {
      "infinitive": "hæv",
      "pastSimple": "hæd",
      "pastParticiple": "hæd"
    },
    "level": "A1",
    "category": "posesión",
    "categoryLabel": "Posesión",
    "frequency": "essential",
    "rank": 2,
    "example": {
      "en": "She had a bad day yesterday, and she has had many like it this month.",
      "es": "Ella tuvo un mal día ayer, y ha tenido muchos así este mes."
    },
    "mistake": "'had' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": []
  },
  {
    "id": "do-3",
    "infinitive": "do",
    "pastSimple": "did",
    "pastParticiple": "done",
    "translation": "hacer",
    "ipa": {
      "infinitive": "duː",
      "pastSimple": "dɪd",
      "pastParticiple": "dʌn"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 3,
    "example": {
      "en": "She did all her chores before her parents came home.",
      "es": "Ella hizo todas sus tareas antes de que sus padres llegaran a casa."
    },
    "mistake": "No añadas '-ed' a 'do': su pasado es 'did' y su participio 'done', formas irregulares que hay que memorizar.",
    "similar": [
      "get",
      "take",
      "give"
    ]
  },
  {
    "id": "say-4",
    "infinitive": "say",
    "pastSimple": "said",
    "pastParticiple": "said",
    "translation": "decir",
    "ipa": {
      "infinitive": "seɪ",
      "pastSimple": "sed",
      "pastParticiple": "sed"
    },
    "level": "A1",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 4,
    "example": {
      "en": "He said nothing at all during the entire meeting.",
      "es": "Él no dijo nada en absoluto durante toda la reunión."
    },
    "mistake": "'said' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "tell",
      "mean",
      "meet"
    ]
  },
  {
    "id": "go-5",
    "infinitive": "go",
    "pastSimple": "went",
    "pastParticiple": "gone",
    "translation": "ir",
    "ipa": {
      "infinitive": "ɡəʊ",
      "pastSimple": "went",
      "pastParticiple": "ɡɒn"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 5,
    "example": {
      "en": "They went to the beach every day last summer.",
      "es": "Ellos iban a la playa todos los días el verano pasado."
    },
    "mistake": "No añadas '-ed' a 'go': su pasado es 'went' y su participio 'gone', formas irregulares que hay que memorizar.",
    "similar": [
      "come",
      "leave",
      "bring"
    ]
  },
  {
    "id": "get-6",
    "infinitive": "get",
    "pastSimple": "got",
    "pastParticiple": "gotten",
    "translation": "conseguir / obtener",
    "ipa": {
      "infinitive": "ɡet",
      "pastSimple": "ɡɒt",
      "pastParticiple": "ˈɡɒtən"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 6,
    "example": {
      "en": "She got a wonderful surprise on her birthday.",
      "es": "Ella recibió una sorpresa maravillosa en su cumpleaños."
    },
    "mistake": "No añadas '-ed' a 'get': su pasado es 'got' y su participio 'gotten', formas irregulares que hay que memorizar.",
    "similar": [
      "do",
      "take",
      "give"
    ]
  },
  {
    "id": "make-7",
    "infinitive": "make",
    "pastSimple": "made",
    "pastParticiple": "made",
    "translation": "hacer / fabricar",
    "ipa": {
      "infinitive": "meɪk",
      "pastSimple": "meɪd",
      "pastParticiple": "meɪd"
    },
    "level": "A1",
    "category": "creación",
    "categoryLabel": "Creación",
    "frequency": "essential",
    "rank": 7,
    "example": {
      "en": "He made a beautiful wooden chair for his daughter.",
      "es": "Él hizo una hermosa silla de madera para su hija."
    },
    "mistake": "'made' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "write",
      "build",
      "draw"
    ]
  },
  {
    "id": "know-8",
    "infinitive": "know",
    "pastSimple": "knew",
    "pastParticiple": "known",
    "translation": "saber / conocer",
    "ipa": {
      "infinitive": "nəʊ",
      "pastSimple": "njuː",
      "pastParticiple": "nəʊn"
    },
    "level": "A1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "essential",
    "rank": 8,
    "example": {
      "en": "I knew the answer, but I was too nervous to say it.",
      "es": "Yo sabía la respuesta, pero estaba demasiado nervioso para decirla."
    },
    "mistake": "No añadas '-ed' a 'know': su pasado es 'knew' y su participio 'known', formas irregulares que hay que memorizar.",
    "similar": [
      "think",
      "understand",
      "choose"
    ]
  },
  {
    "id": "think-9",
    "infinitive": "think",
    "pastSimple": "thought",
    "pastParticiple": "thought",
    "translation": "pensar",
    "ipa": {
      "infinitive": "θɪŋk",
      "pastSimple": "θɔːt",
      "pastParticiple": "θɔːt"
    },
    "level": "A1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "essential",
    "rank": 9,
    "example": {
      "en": "She thought about the offer for almost a week.",
      "es": "Ella pensó en la oferta durante casi una semana."
    },
    "mistake": "'thought' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "know",
      "understand",
      "choose"
    ]
  },
  {
    "id": "see-10",
    "infinitive": "see",
    "pastSimple": "saw",
    "pastParticiple": "seen",
    "translation": "ver",
    "ipa": {
      "infinitive": "siː",
      "pastSimple": "sɔː",
      "pastParticiple": "siːn"
    },
    "level": "A1",
    "category": "percepción",
    "categoryLabel": "Percepción",
    "frequency": "essential",
    "rank": 10,
    "example": {
      "en": "We saw a beautiful rainbow after the storm.",
      "es": "Vimos un hermoso arcoíris después de la tormenta."
    },
    "mistake": "No añadas '-ed' a 'see': su pasado es 'saw' y su participio 'seen', formas irregulares que hay que memorizar.",
    "similar": [
      "feel",
      "hear",
      "smell"
    ]
  },
  {
    "id": "come-11",
    "infinitive": "come",
    "pastSimple": "came",
    "pastParticiple": "come",
    "translation": "venir",
    "ipa": {
      "infinitive": "kʌm",
      "pastSimple": "keɪm",
      "pastParticiple": "kʌm"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 11,
    "example": {
      "en": "He came home late every night that week.",
      "es": "Él llegó a casa tarde todas las noches esa semana."
    },
    "mistake": "No añadas '-ed' a 'come': su pasado es 'came' y su participio 'come', formas irregulares que hay que memorizar.",
    "similar": [
      "go",
      "leave",
      "bring"
    ]
  },
  {
    "id": "take-12",
    "infinitive": "take",
    "pastSimple": "took",
    "pastParticiple": "taken",
    "translation": "tomar / coger",
    "ipa": {
      "infinitive": "teɪk",
      "pastSimple": "tʊk",
      "pastParticiple": "ˈteɪkən"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 12,
    "example": {
      "en": "She took the wrong bus and arrived an hour late.",
      "es": "Ella tomó el autobús equivocado y llegó una hora tarde."
    },
    "mistake": "No añadas '-ed' a 'take': su pasado es 'took' y su participio 'taken', formas irregulares que hay que memorizar.",
    "similar": [
      "give",
      "find",
      "get"
    ]
  },
  {
    "id": "give-13",
    "infinitive": "give",
    "pastSimple": "gave",
    "pastParticiple": "given",
    "translation": "dar",
    "ipa": {
      "infinitive": "ɡɪv",
      "pastSimple": "ɡeɪv",
      "pastParticiple": "ˈɡɪvən"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 13,
    "example": {
      "en": "They gave every child a small gift at the party.",
      "es": "Le dieron un pequeño regalo a cada niño en la fiesta."
    },
    "mistake": "No añadas '-ed' a 'give': su pasado es 'gave' y su participio 'given', formas irregulares que hay que memorizar.",
    "similar": [
      "take",
      "find",
      "put"
    ]
  },
  {
    "id": "find-14",
    "infinitive": "find",
    "pastSimple": "found",
    "pastParticiple": "found",
    "translation": "encontrar",
    "ipa": {
      "infinitive": "faɪnd",
      "pastSimple": "faʊnd",
      "pastParticiple": "faʊnd"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 14,
    "example": {
      "en": "He found his lost wallet under the car seat.",
      "es": "Él encontró su cartera perdida debajo del asiento del coche."
    },
    "mistake": "'found' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "give",
      "take",
      "put"
    ]
  },
  {
    "id": "tell-15",
    "infinitive": "tell",
    "pastSimple": "told",
    "pastParticiple": "told",
    "translation": "contar / decir",
    "ipa": {
      "infinitive": "tel",
      "pastSimple": "təʊld",
      "pastParticiple": "təʊld"
    },
    "level": "A1",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 15,
    "example": {
      "en": "She told her brother about the accident.",
      "es": "Ella le contó a su hermano sobre el accidente."
    },
    "mistake": "'told' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "say",
      "mean",
      "meet"
    ]
  },
  {
    "id": "feel-16",
    "infinitive": "feel",
    "pastSimple": "felt",
    "pastParticiple": "felt",
    "translation": "sentir",
    "ipa": {
      "infinitive": "fiːl",
      "pastSimple": "felt",
      "pastParticiple": "felt"
    },
    "level": "A1",
    "category": "percepción",
    "categoryLabel": "Percepción",
    "frequency": "essential",
    "rank": 16,
    "example": {
      "en": "He felt terrible after eating so much cake.",
      "es": "Él se sintió fatal después de comer tanto pastel."
    },
    "mistake": "'felt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "see",
      "hear",
      "smell"
    ]
  },
  {
    "id": "leave-17",
    "infinitive": "leave",
    "pastSimple": "left",
    "pastParticiple": "left",
    "translation": "dejar / salir",
    "ipa": {
      "infinitive": "liːv",
      "pastSimple": "left",
      "pastParticiple": "left"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 17,
    "example": {
      "en": "They left the party before midnight.",
      "es": "Se fueron de la fiesta antes de medianoche."
    },
    "mistake": "'left' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "bring",
      "come",
      "stand"
    ]
  },
  {
    "id": "put-18",
    "infinitive": "put",
    "pastSimple": "put",
    "pastParticiple": "put",
    "translation": "poner",
    "ipa": {
      "infinitive": "pʊt",
      "pastSimple": "pʊt",
      "pastParticiple": "pʊt"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 18,
    "example": {
      "en": "She put the keys on the kitchen table.",
      "es": "Ella puso las llaves sobre la mesa de la cocina."
    },
    "mistake": "'put' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "keep",
      "let",
      "begin"
    ]
  },
  {
    "id": "keep-19",
    "infinitive": "keep",
    "pastSimple": "kept",
    "pastParticiple": "kept",
    "translation": "mantener / guardar",
    "ipa": {
      "infinitive": "kiːp",
      "pastSimple": "kept",
      "pastParticiple": "kept"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 19,
    "example": {
      "en": "He kept the old letter for over twenty years.",
      "es": "Él guardó la vieja carta durante más de veinte años."
    },
    "mistake": "'kept' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "put",
      "let",
      "begin"
    ]
  },
  {
    "id": "let-20",
    "infinitive": "let",
    "pastSimple": "let",
    "pastParticiple": "let",
    "translation": "dejar / permitir",
    "ipa": {
      "infinitive": "let",
      "pastSimple": "let",
      "pastParticiple": "let"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 20,
    "example": {
      "en": "Her parents let her stay out late that night.",
      "es": "Sus padres la dejaron quedarse fuera hasta tarde esa noche."
    },
    "mistake": "'let' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "keep",
      "begin",
      "put"
    ]
  },
  {
    "id": "begin-21",
    "infinitive": "begin",
    "pastSimple": "began",
    "pastParticiple": "begun",
    "translation": "empezar",
    "ipa": {
      "infinitive": "bɪˈɡɪn",
      "pastSimple": "bɪˈɡæn",
      "pastParticiple": "bɪˈɡʌn"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 21,
    "example": {
      "en": "The concert began exactly on time.",
      "es": "El concierto empezó exactamente a tiempo."
    },
    "mistake": "No añadas '-ed' a 'begin': su pasado es 'began' y su participio 'begun', formas irregulares que hay que memorizar.",
    "similar": [
      "let",
      "keep",
      "put"
    ]
  },
  {
    "id": "bring-22",
    "infinitive": "bring",
    "pastSimple": "brought",
    "pastParticiple": "brought",
    "translation": "traer",
    "ipa": {
      "infinitive": "brɪŋ",
      "pastSimple": "brɔːt",
      "pastParticiple": "brɔːt"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 22,
    "example": {
      "en": "He brought flowers for his mother's birthday.",
      "es": "Él trajo flores para el cumpleaños de su madre."
    },
    "mistake": "'brought' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "stand",
      "leave",
      "run"
    ]
  },
  {
    "id": "write-23",
    "infinitive": "write",
    "pastSimple": "wrote",
    "pastParticiple": "written",
    "translation": "escribir",
    "ipa": {
      "infinitive": "raɪt",
      "pastSimple": "rəʊt",
      "pastParticiple": "ˈrɪtən"
    },
    "level": "A1",
    "category": "creación",
    "categoryLabel": "Creación",
    "frequency": "essential",
    "rank": 23,
    "example": {
      "en": "She wrote a long letter to her old friend.",
      "es": "Ella escribió una larga carta a su vieja amiga."
    },
    "mistake": "No añadas '-ed' a 'write': su pasado es 'wrote' y su participio 'written', formas irregulares que hay que memorizar.",
    "similar": [
      "make",
      "build",
      "draw"
    ]
  },
  {
    "id": "stand-24",
    "infinitive": "stand",
    "pastSimple": "stood",
    "pastParticiple": "stood",
    "translation": "estar de pie / soportar",
    "ipa": {
      "infinitive": "stænd",
      "pastSimple": "stʊd",
      "pastParticiple": "stʊd"
    },
    "level": "A2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 24,
    "example": {
      "en": "He stood by the door, waiting for the bus.",
      "es": "Él se quedó de pie junto a la puerta, esperando el autobús."
    },
    "mistake": "'stood' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "bring",
      "run",
      "leave"
    ]
  },
  {
    "id": "hear-25",
    "infinitive": "hear",
    "pastSimple": "heard",
    "pastParticiple": "heard",
    "translation": "oír",
    "ipa": {
      "infinitive": "hɪə",
      "pastSimple": "hɜːd",
      "pastParticiple": "hɜːd"
    },
    "level": "A1",
    "category": "percepción",
    "categoryLabel": "Percepción",
    "frequency": "essential",
    "rank": 25,
    "example": {
      "en": "I heard a strange sound coming from the basement.",
      "es": "Oí un ruido extraño que venía del sótano."
    },
    "mistake": "'heard' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "feel",
      "see",
      "smell"
    ]
  },
  {
    "id": "mean-27",
    "infinitive": "mean",
    "pastSimple": "meant",
    "pastParticiple": "meant",
    "translation": "significar",
    "ipa": {
      "infinitive": "miːn",
      "pastSimple": "ment",
      "pastParticiple": "ment"
    },
    "level": "A2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 26,
    "example": {
      "en": "She meant no harm when she said it.",
      "es": "Ella no quiso hacer daño al decirlo."
    },
    "mistake": "'meant' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "meet",
      "speak",
      "read"
    ]
  },
  {
    "id": "set-28",
    "infinitive": "set",
    "pastSimple": "set",
    "pastParticiple": "set",
    "translation": "fijar / colocar",
    "ipa": {
      "infinitive": "set",
      "pastSimple": "set",
      "pastParticiple": "set"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 27,
    "example": {
      "en": "He set the table before the guests arrived.",
      "es": "Él puso la mesa antes de que llegaran los invitados."
    },
    "mistake": "'set' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "let",
      "pay",
      "begin"
    ]
  },
  {
    "id": "meet-29",
    "infinitive": "meet",
    "pastSimple": "met",
    "pastParticiple": "met",
    "translation": "conocer / encontrarse con",
    "ipa": {
      "infinitive": "miːt",
      "pastSimple": "met",
      "pastParticiple": "met"
    },
    "level": "A1",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 28,
    "example": {
      "en": "They met each other at a friend's wedding.",
      "es": "Se conocieron en la boda de un amigo."
    },
    "mistake": "'met' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "mean",
      "speak",
      "read"
    ]
  },
  {
    "id": "run-30",
    "infinitive": "run",
    "pastSimple": "ran",
    "pastParticiple": "run",
    "translation": "correr",
    "ipa": {
      "infinitive": "rʌn",
      "pastSimple": "ræn",
      "pastParticiple": "rʌn"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 29,
    "example": {
      "en": "She ran five kilometers before breakfast.",
      "es": "Ella corrió cinco kilómetros antes del desayuno."
    },
    "mistake": "No añadas '-ed' a 'run': su pasado es 'ran' y su participio 'run', formas irregulares que hay que memorizar.",
    "similar": [
      "sit",
      "lie",
      "stand"
    ]
  },
  {
    "id": "pay-31",
    "infinitive": "pay",
    "pastSimple": "paid",
    "pastParticiple": "paid",
    "translation": "pagar",
    "ipa": {
      "infinitive": "peɪ",
      "pastSimple": "peɪd",
      "pastParticiple": "peɪd"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 30,
    "example": {
      "en": "He paid the bill without complaining.",
      "es": "Él pagó la cuenta sin quejarse."
    },
    "mistake": "'paid' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "set",
      "lead",
      "let"
    ]
  },
  {
    "id": "sit-32",
    "infinitive": "sit",
    "pastSimple": "sat",
    "pastParticiple": "sat",
    "translation": "sentarse",
    "ipa": {
      "infinitive": "sɪt",
      "pastSimple": "sæt",
      "pastParticiple": "sæt"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 31,
    "example": {
      "en": "The old man sat on the bench for hours.",
      "es": "El anciano se sentó en el banco durante horas."
    },
    "mistake": "'sat' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "run",
      "lie",
      "fall"
    ]
  },
  {
    "id": "speak-33",
    "infinitive": "speak",
    "pastSimple": "spoke",
    "pastParticiple": "spoken",
    "translation": "hablar",
    "ipa": {
      "infinitive": "spiːk",
      "pastSimple": "spəʊk",
      "pastParticiple": "ˈspəʊkən"
    },
    "level": "A1",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 32,
    "example": {
      "en": "She spoke French fluently after two years abroad.",
      "es": "Ella hablaba francés con fluidez después de dos años en el extranjero."
    },
    "mistake": "No añadas '-ed' a 'speak': su pasado es 'spoke' y su participio 'spoken', formas irregulares que hay que memorizar.",
    "similar": [
      "read",
      "meet",
      "mean"
    ]
  },
  {
    "id": "lie-34",
    "infinitive": "lie",
    "pastSimple": "lay",
    "pastParticiple": "lain",
    "translation": "tumbarse / yacer",
    "ipa": {
      "infinitive": "laɪ",
      "pastSimple": "leɪ",
      "pastParticiple": "leɪn"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 33,
    "example": {
      "en": "The cat lay in the sun all afternoon.",
      "es": "El gato se tumbó al sol toda la tarde."
    },
    "mistake": "No añadas '-ed' a 'lie': su pasado es 'lay' y su participio 'lain', formas irregulares que hay que memorizar.",
    "similar": [
      "sit",
      "run",
      "fall"
    ]
  },
  {
    "id": "lead-35",
    "infinitive": "lead",
    "pastSimple": "led",
    "pastParticiple": "led",
    "translation": "liderar / conducir",
    "ipa": {
      "infinitive": "liːd",
      "pastSimple": "led",
      "pastParticiple": "led"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 34,
    "example": {
      "en": "She led the team to victory in the final match.",
      "es": "Ella lideró al equipo hacia la victoria en el partido final."
    },
    "mistake": "'led' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "lose",
      "pay",
      "set"
    ]
  },
  {
    "id": "read-36",
    "infinitive": "read",
    "pastSimple": "read",
    "pastParticiple": "read",
    "translation": "leer",
    "ipa": {
      "infinitive": "riːd",
      "pastSimple": "red",
      "pastParticiple": "red"
    },
    "level": "A1",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "essential",
    "rank": 35,
    "example": {
      "en": "He read the whole novel in a single weekend.",
      "es": "Él leyó toda la novela en un solo fin de semana."
    },
    "mistake": "'read' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "speak",
      "send",
      "meet"
    ]
  },
  {
    "id": "grow-37",
    "infinitive": "grow",
    "pastSimple": "grew",
    "pastParticiple": "grown",
    "translation": "crecer",
    "ipa": {
      "infinitive": "ɡrəʊ",
      "pastSimple": "ɡruː",
      "pastParticiple": "ɡrəʊn"
    },
    "level": "A2",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "common",
    "rank": 36,
    "example": {
      "en": "The little tree grew almost two meters in one year.",
      "es": "El pequeño árbol creció casi dos metros en un año."
    },
    "mistake": "No añadas '-ed' a 'grow': su pasado es 'grew' y su participio 'grown', formas irregulares que hay que memorizar.",
    "similar": [
      "freeze",
      "spread",
      "burn"
    ]
  },
  {
    "id": "lose-38",
    "infinitive": "lose",
    "pastSimple": "lost",
    "pastParticiple": "lost",
    "translation": "perder",
    "ipa": {
      "infinitive": "luːz",
      "pastSimple": "lɒst",
      "pastParticiple": "lɒst"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 37,
    "example": {
      "en": "They lost the match by just one point.",
      "es": "Perdieron el partido por solo un punto."
    },
    "mistake": "'lost' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "lead",
      "break",
      "pay"
    ]
  },
  {
    "id": "fall-39",
    "infinitive": "fall",
    "pastSimple": "fell",
    "pastParticiple": "fallen",
    "translation": "caer",
    "ipa": {
      "infinitive": "fɔːl",
      "pastSimple": "fel",
      "pastParticiple": "ˈfɔːlən"
    },
    "level": "A1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 38,
    "example": {
      "en": "She fell on the ice and hurt her wrist.",
      "es": "Ella se cayó sobre el hielo y se lastimó la muñeca."
    },
    "mistake": "No añadas '-ed' a 'fall': su pasado es 'fell' y su participio 'fallen', formas irregulares que hay que memorizar.",
    "similar": [
      "lie",
      "sit",
      "rise"
    ]
  },
  {
    "id": "send-40",
    "infinitive": "send",
    "pastSimple": "sent",
    "pastParticiple": "sent",
    "translation": "enviar",
    "ipa": {
      "infinitive": "send",
      "pastSimple": "sent",
      "pastParticiple": "sent"
    },
    "level": "A2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "common",
    "rank": 39,
    "example": {
      "en": "He sent the package a week before her birthday.",
      "es": "Él envió el paquete una semana antes de su cumpleaños."
    },
    "mistake": "'sent' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "read",
      "speak",
      "meet"
    ]
  },
  {
    "id": "build-41",
    "infinitive": "build",
    "pastSimple": "built",
    "pastParticiple": "built",
    "translation": "construir",
    "ipa": {
      "infinitive": "bɪld",
      "pastSimple": "bɪlt",
      "pastParticiple": "bɪlt"
    },
    "level": "A2",
    "category": "creación",
    "categoryLabel": "Creación",
    "frequency": "common",
    "rank": 40,
    "example": {
      "en": "They built the whole cabin with their own hands.",
      "es": "Construyeron toda la cabaña con sus propias manos."
    },
    "mistake": "'built' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "draw",
      "write",
      "make"
    ]
  },
  {
    "id": "understand-42",
    "infinitive": "understand",
    "pastSimple": "understood",
    "pastParticiple": "understood",
    "translation": "entender",
    "ipa": {
      "infinitive": "ˌʌndəˈstænd",
      "pastSimple": "ˌʌndəˈstʊd",
      "pastParticiple": "ˌʌndəˈstʊd"
    },
    "level": "A1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "essential",
    "rank": 41,
    "example": {
      "en": "She understood the problem much better after his explanation.",
      "es": "Ella entendió mucho mejor el problema tras su explicación."
    },
    "mistake": "'understood' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "choose",
      "forget",
      "forgive"
    ]
  },
  {
    "id": "draw-43",
    "infinitive": "draw",
    "pastSimple": "drew",
    "pastParticiple": "drawn",
    "translation": "dibujar / tirar de",
    "ipa": {
      "infinitive": "drɔː",
      "pastSimple": "druː",
      "pastParticiple": "drɔːn"
    },
    "level": "A2",
    "category": "creación",
    "categoryLabel": "Creación",
    "frequency": "common",
    "rank": 42,
    "example": {
      "en": "He drew a detailed map of the old town.",
      "es": "Él dibujó un mapa detallado del pueblo antiguo."
    },
    "mistake": "No añadas '-ed' a 'draw': su pasado es 'drew' y su participio 'drawn', formas irregulares que hay que memorizar.",
    "similar": [
      "build",
      "write",
      "make"
    ]
  },
  {
    "id": "break-44",
    "infinitive": "break",
    "pastSimple": "broke",
    "pastParticiple": "broken",
    "translation": "romper",
    "ipa": {
      "infinitive": "breɪk",
      "pastSimple": "brəʊk",
      "pastParticiple": "ˈbrəʊkən"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 43,
    "example": {
      "en": "The kids broke the window while playing football.",
      "es": "Los niños rompieron la ventana mientras jugaban al fútbol."
    },
    "mistake": "No añadas '-ed' a 'break': su pasado es 'broke' y su participio 'broken', formas irregulares que hay que memorizar.",
    "similar": [
      "spend",
      "cut",
      "buy"
    ]
  },
  {
    "id": "spend-45",
    "infinitive": "spend",
    "pastSimple": "spent",
    "pastParticiple": "spent",
    "translation": "gastar / pasar (tiempo)",
    "ipa": {
      "infinitive": "spend",
      "pastSimple": "spent",
      "pastParticiple": "spent"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 44,
    "example": {
      "en": "She spent all her savings on the trip.",
      "es": "Ella gastó todos sus ahorros en el viaje."
    },
    "mistake": "'spent' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "break",
      "cut",
      "buy"
    ]
  },
  {
    "id": "cut-46",
    "infinitive": "cut",
    "pastSimple": "cut",
    "pastParticiple": "cut",
    "translation": "cortar",
    "ipa": {
      "infinitive": "kʌt",
      "pastSimple": "kʌt",
      "pastParticiple": "kʌt"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 45,
    "example": {
      "en": "He cut the rope with an old pocket knife.",
      "es": "Él cortó la cuerda con una vieja navaja."
    },
    "mistake": "'cut' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "spend",
      "break",
      "buy"
    ]
  },
  {
    "id": "rise-47",
    "infinitive": "rise",
    "pastSimple": "rose",
    "pastParticiple": "risen",
    "translation": "subir / levantarse",
    "ipa": {
      "infinitive": "raɪz",
      "pastSimple": "rəʊz",
      "pastParticiple": "ˈrɪzən"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 46,
    "example": {
      "en": "The sun rose slowly over the quiet mountains.",
      "es": "El sol salió lentamente sobre las tranquilas montañas."
    },
    "mistake": "No añadas '-ed' a 'rise': su pasado es 'rose' y su participio 'risen', formas irregulares que hay que memorizar.",
    "similar": [
      "drive",
      "fly",
      "fall"
    ]
  },
  {
    "id": "drive-48",
    "infinitive": "drive",
    "pastSimple": "drove",
    "pastParticiple": "driven",
    "translation": "conducir",
    "ipa": {
      "infinitive": "draɪv",
      "pastSimple": "drəʊv",
      "pastParticiple": "ˈdrɪvən"
    },
    "level": "A2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "essential",
    "rank": 47,
    "example": {
      "en": "She drove all night to reach the hospital in time.",
      "es": "Ella condujo toda la noche para llegar al hospital a tiempo."
    },
    "mistake": "No añadas '-ed' a 'drive': su pasado es 'drove' y su participio 'driven', formas irregulares que hay que memorizar.",
    "similar": [
      "rise",
      "fly",
      "fall"
    ]
  },
  {
    "id": "buy-49",
    "infinitive": "buy",
    "pastSimple": "bought",
    "pastParticiple": "bought",
    "translation": "comprar",
    "ipa": {
      "infinitive": "baɪ",
      "pastSimple": "bɔːt",
      "pastParticiple": "bɔːt"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 48,
    "example": {
      "en": "He bought a used bicycle for his son.",
      "es": "Él compró una bicicleta usada para su hijo."
    },
    "mistake": "'bought' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "wear",
      "cut",
      "catch"
    ]
  },
  {
    "id": "wear-50",
    "infinitive": "wear",
    "pastSimple": "wore",
    "pastParticiple": "worn",
    "translation": "llevar puesto",
    "ipa": {
      "infinitive": "weə",
      "pastSimple": "wɔː",
      "pastParticiple": "wɔːn"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 49,
    "example": {
      "en": "She wore a bright red dress to the party.",
      "es": "Ella llevó un vestido rojo brillante a la fiesta."
    },
    "mistake": "No añadas '-ed' a 'wear': su pasado es 'wore' y su participio 'worn', formas irregulares que hay que memorizar.",
    "similar": [
      "buy",
      "catch",
      "cut"
    ]
  },
  {
    "id": "choose-51",
    "infinitive": "choose",
    "pastSimple": "chose",
    "pastParticiple": "chosen",
    "translation": "elegir",
    "ipa": {
      "infinitive": "tʃuːz",
      "pastSimple": "tʃəʊz",
      "pastParticiple": "ˈtʃəʊzən"
    },
    "level": "A2",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 50,
    "example": {
      "en": "He chose the blue shirt instead of the green one.",
      "es": "Él eligió la camisa azul en lugar de la verde."
    },
    "mistake": "No añadas '-ed' a 'choose': su pasado es 'chose' y su participio 'chosen', formas irregulares que hay que memorizar.",
    "similar": [
      "understand",
      "forget",
      "forgive"
    ]
  },
  {
    "id": "catch-52",
    "infinitive": "catch",
    "pastSimple": "caught",
    "pastParticiple": "caught",
    "translation": "atrapar / coger",
    "ipa": {
      "infinitive": "kætʃ",
      "pastSimple": "kɔːt",
      "pastParticiple": "kɔːt"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 51,
    "example": {
      "en": "The goalkeeper caught the ball just in time.",
      "es": "El portero atrapó el balón justo a tiempo."
    },
    "mistake": "'caught' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "wear",
      "buy",
      "sell"
    ]
  },
  {
    "id": "fly-53",
    "infinitive": "fly",
    "pastSimple": "flew",
    "pastParticiple": "flown",
    "translation": "volar",
    "ipa": {
      "infinitive": "flaɪ",
      "pastSimple": "fluː",
      "pastParticiple": "fləʊn"
    },
    "level": "A2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 52,
    "example": {
      "en": "They flew to Japan for their honeymoon.",
      "es": "Volaron a Japón para su luna de miel."
    },
    "mistake": "No añadas '-ed' a 'fly': su pasado es 'flew' y su participio 'flown', formas irregulares que hay que memorizar.",
    "similar": [
      "drive",
      "rise",
      "swim"
    ]
  },
  {
    "id": "sing-54",
    "infinitive": "sing",
    "pastSimple": "sang",
    "pastParticiple": "sung",
    "translation": "cantar",
    "ipa": {
      "infinitive": "sɪŋ",
      "pastSimple": "sæŋ",
      "pastParticiple": "sʌŋ"
    },
    "level": "A2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "common",
    "rank": 53,
    "example": {
      "en": "She sang beautifully at her cousin's wedding.",
      "es": "Ella cantó maravillosamente en la boda de su prima."
    },
    "mistake": "No añadas '-ed' a 'sing': su pasado es 'sang' y su participio 'sung', formas irregulares que hay que memorizar.",
    "similar": [
      "teach",
      "send",
      "read"
    ]
  },
  {
    "id": "sell-55",
    "infinitive": "sell",
    "pastSimple": "sold",
    "pastParticiple": "sold",
    "translation": "vender",
    "ipa": {
      "infinitive": "sel",
      "pastSimple": "səʊld",
      "pastParticiple": "səʊld"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 54,
    "example": {
      "en": "He sold his old car to buy a new bike.",
      "es": "Él vendió su viejo coche para comprarse una bicicleta nueva."
    },
    "mistake": "'sold' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hold",
      "shoot",
      "catch"
    ]
  },
  {
    "id": "hold-56",
    "infinitive": "hold",
    "pastSimple": "held",
    "pastParticiple": "held",
    "translation": "sujetar / celebrar",
    "ipa": {
      "infinitive": "həʊld",
      "pastSimple": "held",
      "pastParticiple": "held"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 55,
    "example": {
      "en": "She held her baby close all through the night.",
      "es": "Ella sostuvo a su bebé cerca durante toda la noche."
    },
    "mistake": "'held' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "sell",
      "shoot",
      "catch"
    ]
  },
  {
    "id": "shoot-57",
    "infinitive": "shoot",
    "pastSimple": "shot",
    "pastParticiple": "shot",
    "translation": "disparar",
    "ipa": {
      "infinitive": "ʃuːt",
      "pastSimple": "ʃɒt",
      "pastParticiple": "ʃɒt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 56,
    "example": {
      "en": "The photographer shot over two hundred photos that day.",
      "es": "El fotógrafo tomó más de doscientas fotos ese día."
    },
    "mistake": "'shot' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hold",
      "sell",
      "throw"
    ]
  },
  {
    "id": "teach-58",
    "infinitive": "teach",
    "pastSimple": "taught",
    "pastParticiple": "taught",
    "translation": "enseñar",
    "ipa": {
      "infinitive": "tiːtʃ",
      "pastSimple": "tɔːt",
      "pastParticiple": "tɔːt"
    },
    "level": "A2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "common",
    "rank": 57,
    "example": {
      "en": "He taught mathematics at the local school for years.",
      "es": "Él enseñó matemáticas en la escuela local durante años."
    },
    "mistake": "'taught' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "sing",
      "send",
      "read"
    ]
  },
  {
    "id": "swim-59",
    "infinitive": "swim",
    "pastSimple": "swam",
    "pastParticiple": "swum",
    "translation": "nadar",
    "ipa": {
      "infinitive": "swɪm",
      "pastSimple": "swæm",
      "pastParticiple": "swʌm"
    },
    "level": "A2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 58,
    "example": {
      "en": "She swam across the lake despite the cold water.",
      "es": "Ella nadó a través del lago a pesar del agua fría."
    },
    "mistake": "No añadas '-ed' a 'swim': su pasado es 'swam' y su participio 'swum', formas irregulares que hay que memorizar.",
    "similar": [
      "fly",
      "drive",
      "rise"
    ]
  },
  {
    "id": "throw-60",
    "infinitive": "throw",
    "pastSimple": "threw",
    "pastParticiple": "thrown",
    "translation": "lanzar",
    "ipa": {
      "infinitive": "θrəʊ",
      "pastSimple": "θruː",
      "pastParticiple": "θrəʊn"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 59,
    "example": {
      "en": "He threw the ball straight into the basket.",
      "es": "Él lanzó el balón directo a la canasta."
    },
    "mistake": "No añadas '-ed' a 'throw': su pasado es 'threw' y su participio 'thrown', formas irregulares que hay que memorizar.",
    "similar": [
      "eat",
      "drink",
      "shoot"
    ]
  },
  {
    "id": "eat-61",
    "infinitive": "eat",
    "pastSimple": "ate",
    "pastParticiple": "eaten",
    "translation": "comer",
    "ipa": {
      "infinitive": "iːt",
      "pastSimple": "eɪt",
      "pastParticiple": "ˈiːtən"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 60,
    "example": {
      "en": "They ate dinner together for the first time in months.",
      "es": "Cenaron juntos por primera vez en meses."
    },
    "mistake": "No añadas '-ed' a 'eat': su pasado es 'ate' y su participio 'eaten', formas irregulares que hay que memorizar.",
    "similar": [
      "throw",
      "drink",
      "shoot"
    ]
  },
  {
    "id": "drink-62",
    "infinitive": "drink",
    "pastSimple": "drank",
    "pastParticiple": "drunk",
    "translation": "beber",
    "ipa": {
      "infinitive": "drɪŋk",
      "pastSimple": "dræŋk",
      "pastParticiple": "drʌŋk"
    },
    "level": "A1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "essential",
    "rank": 61,
    "example": {
      "en": "She drank a whole pot of coffee that morning.",
      "es": "Ella se bebió toda una cafetera esa mañana."
    },
    "mistake": "No añadas '-ed' a 'drink': su pasado es 'drank' y su participio 'drunk', formas irregulares que hay que memorizar.",
    "similar": [
      "eat",
      "throw",
      "win"
    ]
  },
  {
    "id": "forget-63",
    "infinitive": "forget",
    "pastSimple": "forgot",
    "pastParticiple": "forgotten",
    "translation": "olvidar",
    "ipa": {
      "infinitive": "fəˈɡet",
      "pastSimple": "fəˈɡɒt",
      "pastParticiple": "fəˈɡɒtən"
    },
    "level": "A2",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 62,
    "example": {
      "en": "He forgot his umbrella at the office again.",
      "es": "Él olvidó su paraguas en la oficina otra vez."
    },
    "mistake": "No añadas '-ed' a 'forget': su pasado es 'forgot' y su participio 'forgotten', formas irregulares que hay que memorizar.",
    "similar": [
      "forgive",
      "choose",
      "understand"
    ]
  },
  {
    "id": "wake-64",
    "infinitive": "wake",
    "pastSimple": "woke",
    "pastParticiple": "woken",
    "translation": "despertar",
    "ipa": {
      "infinitive": "weɪk",
      "pastSimple": "wəʊk",
      "pastParticiple": "ˈwəʊkən"
    },
    "level": "A2",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "common",
    "rank": 63,
    "example": {
      "en": "The loud noise woke the whole neighborhood.",
      "es": "El ruido fuerte despertó a todo el vecindario."
    },
    "mistake": "No añadas '-ed' a 'wake': su pasado es 'woke' y su participio 'woken', formas irregulares que hay que memorizar.",
    "similar": [
      "hurt",
      "cost",
      "shine"
    ]
  },
  {
    "id": "win-65",
    "infinitive": "win",
    "pastSimple": "won",
    "pastParticiple": "won",
    "translation": "ganar",
    "ipa": {
      "infinitive": "wɪn",
      "pastSimple": "wʌn",
      "pastParticiple": "wʌn"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 64,
    "example": {
      "en": "Their team won the championship for the third year.",
      "es": "Su equipo ganó el campeonato por tercer año."
    },
    "mistake": "'won' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hit",
      "drink",
      "shut"
    ]
  },
  {
    "id": "hit-66",
    "infinitive": "hit",
    "pastSimple": "hit",
    "pastParticiple": "hit",
    "translation": "golpear",
    "ipa": {
      "infinitive": "hɪt",
      "pastSimple": "hɪt",
      "pastParticiple": "hɪt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 65,
    "example": {
      "en": "The ball hit the window and broke the glass.",
      "es": "El balón golpeó la ventana y rompió el cristal."
    },
    "mistake": "'hit' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "win",
      "shut",
      "drink"
    ]
  },
  {
    "id": "hurt-67",
    "infinitive": "hurt",
    "pastSimple": "hurt",
    "pastParticiple": "hurt",
    "translation": "herir / doler",
    "ipa": {
      "infinitive": "hɜːt",
      "pastSimple": "hɜːt",
      "pastParticiple": "hɜːt"
    },
    "level": "A2",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "common",
    "rank": 66,
    "example": {
      "en": "She hurt her ankle during the race.",
      "es": "Ella se lastimó el tobillo durante la carrera."
    },
    "mistake": "'hurt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "cost",
      "wake",
      "shine"
    ]
  },
  {
    "id": "shut-68",
    "infinitive": "shut",
    "pastSimple": "shut",
    "pastParticiple": "shut",
    "translation": "cerrar",
    "ipa": {
      "infinitive": "ʃʌt",
      "pastSimple": "ʃʌt",
      "pastParticiple": "ʃʌt"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 67,
    "example": {
      "en": "He shut the door quietly so no one would wake up.",
      "es": "Él cerró la puerta con cuidado para que nadie despertara."
    },
    "mistake": "'shut' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hit",
      "deal",
      "win"
    ]
  },
  {
    "id": "cost-69",
    "infinitive": "cost",
    "pastSimple": "cost",
    "pastParticiple": "cost",
    "translation": "costar",
    "ipa": {
      "infinitive": "kɒst",
      "pastSimple": "kɒst",
      "pastParticiple": "kɒst"
    },
    "level": "A2",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "common",
    "rank": 68,
    "example": {
      "en": "The repairs cost much more than they expected.",
      "es": "Las reparaciones costaron mucho más de lo que esperaban."
    },
    "mistake": "'cost' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hurt",
      "wake",
      "shine"
    ]
  },
  {
    "id": "deal-70",
    "infinitive": "deal",
    "pastSimple": "dealt",
    "pastParticiple": "dealt",
    "translation": "tratar / lidiar con",
    "ipa": {
      "infinitive": "diːl",
      "pastSimple": "delt",
      "pastParticiple": "delt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 69,
    "example": {
      "en": "She dealt with the crisis calmly and quickly.",
      "es": "Ella lidió con la crisis con calma y rapidez."
    },
    "mistake": "'dealt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "dig",
      "shut",
      "feed"
    ]
  },
  {
    "id": "dig-71",
    "infinitive": "dig",
    "pastSimple": "dug",
    "pastParticiple": "dug",
    "translation": "cavar",
    "ipa": {
      "infinitive": "dɪɡ",
      "pastSimple": "dʌɡ",
      "pastParticiple": "dʌɡ"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 70,
    "example": {
      "en": "The dog dug a big hole in the backyard.",
      "es": "El perro cavó un gran agujero en el patio trasero."
    },
    "mistake": "'dug' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "deal",
      "feed",
      "fight"
    ]
  },
  {
    "id": "feed-72",
    "infinitive": "feed",
    "pastSimple": "fed",
    "pastParticiple": "fed",
    "translation": "alimentar",
    "ipa": {
      "infinitive": "fiːd",
      "pastSimple": "fed",
      "pastParticiple": "fed"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 71,
    "example": {
      "en": "She fed the stray cats every morning before work.",
      "es": "Ella alimentaba a los gatos callejeros cada mañana antes del trabajo."
    },
    "mistake": "'fed' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "dig",
      "fight",
      "deal"
    ]
  },
  {
    "id": "fight-73",
    "infinitive": "fight",
    "pastSimple": "fought",
    "pastParticiple": "fought",
    "translation": "luchar / pelear",
    "ipa": {
      "infinitive": "faɪt",
      "pastSimple": "fɔːt",
      "pastParticiple": "fɔːt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 72,
    "example": {
      "en": "The two brothers fought over the last slice of pizza.",
      "es": "Los dos hermanos pelearon por el último trozo de pizza."
    },
    "mistake": "'fought' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "feed",
      "dig",
      "deal"
    ]
  },
  {
    "id": "forgive-74",
    "infinitive": "forgive",
    "pastSimple": "forgave",
    "pastParticiple": "forgiven",
    "translation": "perdonar",
    "ipa": {
      "infinitive": "fəˈɡɪv",
      "pastSimple": "fəˈɡeɪv",
      "pastParticiple": "fəˈɡɪvən"
    },
    "level": "B1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 73,
    "example": {
      "en": "She forgave him after he apologized sincerely.",
      "es": "Ella lo perdonó después de que él se disculpara sinceramente."
    },
    "mistake": "No añadas '-ed' a 'forgive': su pasado es 'forgave' y su participio 'forgiven', formas irregulares que hay que memorizar.",
    "similar": [
      "forget",
      "choose",
      "dream"
    ]
  },
  {
    "id": "freeze-75",
    "infinitive": "freeze",
    "pastSimple": "froze",
    "pastParticiple": "frozen",
    "translation": "congelar",
    "ipa": {
      "infinitive": "friːz",
      "pastSimple": "frəʊz",
      "pastParticiple": "ˈfrəʊzən"
    },
    "level": "B1",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "common",
    "rank": 74,
    "example": {
      "en": "The pond froze solid during the cold January night.",
      "es": "El estanque se congeló por completo durante la fría noche de enero."
    },
    "mistake": "No añadas '-ed' a 'freeze': su pasado es 'froze' y su participio 'frozen', formas irregulares que hay que memorizar.",
    "similar": [
      "spread",
      "burn",
      "burst"
    ]
  },
  {
    "id": "hang-76",
    "infinitive": "hang",
    "pastSimple": "hung",
    "pastParticiple": "hung",
    "translation": "colgar",
    "ipa": {
      "infinitive": "hæŋ",
      "pastSimple": "hʌŋ",
      "pastParticiple": "hʌŋ"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 75,
    "example": {
      "en": "He hung the painting right above the fireplace.",
      "es": "Él colgó el cuadro justo encima de la chimenea."
    },
    "mistake": "'hung' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hide",
      "lend",
      "fight"
    ]
  },
  {
    "id": "hide-77",
    "infinitive": "hide",
    "pastSimple": "hid",
    "pastParticiple": "hidden",
    "translation": "esconder",
    "ipa": {
      "infinitive": "haɪd",
      "pastSimple": "hɪd",
      "pastParticiple": "ˈhɪdən"
    },
    "level": "A2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 76,
    "example": {
      "en": "The children hid behind the old wooden shed.",
      "es": "Los niños se escondieron detrás del viejo cobertizo de madera."
    },
    "mistake": "No añadas '-ed' a 'hide': su pasado es 'hid' y su participio 'hidden', formas irregulares que hay que memorizar.",
    "similar": [
      "hang",
      "lend",
      "light"
    ]
  },
  {
    "id": "lend-78",
    "infinitive": "lend",
    "pastSimple": "lent",
    "pastParticiple": "lent",
    "translation": "prestar",
    "ipa": {
      "infinitive": "lend",
      "pastSimple": "lent",
      "pastParticiple": "lent"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 77,
    "example": {
      "en": "She lent her neighbor some sugar and eggs.",
      "es": "Ella le prestó azúcar y huevos a su vecina."
    },
    "mistake": "'lent' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hide",
      "light",
      "hang"
    ]
  },
  {
    "id": "light-79",
    "infinitive": "light",
    "pastSimple": "lit",
    "pastParticiple": "lit",
    "translation": "encender",
    "ipa": {
      "infinitive": "laɪt",
      "pastSimple": "lɪt",
      "pastParticiple": "lɪt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 78,
    "example": {
      "en": "He lit the candles just before the guests arrived.",
      "es": "Él encendió las velas justo antes de que llegaran los invitados."
    },
    "mistake": "'lit' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "lend",
      "hide",
      "hang"
    ]
  },
  {
    "id": "ride-80",
    "infinitive": "ride",
    "pastSimple": "rode",
    "pastParticiple": "ridden",
    "translation": "montar / cabalgar",
    "ipa": {
      "infinitive": "raɪd",
      "pastSimple": "rəʊd",
      "pastParticiple": "ˈrɪdən"
    },
    "level": "A2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 79,
    "example": {
      "en": "She rode her bike to school every single day.",
      "es": "Ella iba en bicicleta a la escuela todos los días."
    },
    "mistake": "No añadas '-ed' a 'ride': su pasado es 'rode' y su participio 'ridden', formas irregulares que hay que memorizar.",
    "similar": [
      "creep",
      "swim",
      "dive"
    ]
  },
  {
    "id": "ring-81",
    "infinitive": "ring",
    "pastSimple": "rang",
    "pastParticiple": "rung",
    "translation": "sonar / llamar",
    "ipa": {
      "infinitive": "rɪŋ",
      "pastSimple": "ræŋ",
      "pastParticiple": "rʌŋ"
    },
    "level": "A2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "common",
    "rank": 80,
    "example": {
      "en": "The old church bell rang three times at noon.",
      "es": "La vieja campana de la iglesia sonó tres veces al mediodía."
    },
    "mistake": "No añadas '-ed' a 'ring': su pasado es 'rang' y su participio 'rung', formas irregulares que hay que memorizar.",
    "similar": [
      "swear",
      "teach",
      "sing"
    ]
  },
  {
    "id": "shake-82",
    "infinitive": "shake",
    "pastSimple": "shook",
    "pastParticiple": "shaken",
    "translation": "agitar / sacudir",
    "ipa": {
      "infinitive": "ʃeɪk",
      "pastSimple": "ʃʊk",
      "pastParticiple": "ˈʃeɪkən"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 81,
    "example": {
      "en": "The whole building shook during the earthquake.",
      "es": "Todo el edificio tembló durante el terremoto."
    },
    "mistake": "No añadas '-ed' a 'shake': su pasado es 'shook' y su participio 'shaken', formas irregulares que hay que memorizar.",
    "similar": [
      "light",
      "lend",
      "hide"
    ]
  },
  {
    "id": "shine-83",
    "infinitive": "shine",
    "pastSimple": "shone",
    "pastParticiple": "shone",
    "translation": "brillar",
    "ipa": {
      "infinitive": "ʃaɪn",
      "pastSimple": "ʃɒn",
      "pastParticiple": "ʃɒn"
    },
    "level": "B1",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "common",
    "rank": 82,
    "example": {
      "en": "The stars shone brightly over the quiet desert.",
      "es": "Las estrellas brillaron intensamente sobre el desierto silencioso."
    },
    "mistake": "'shone' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "sleep",
      "cost",
      "hurt"
    ]
  },
  {
    "id": "sleep-84",
    "infinitive": "sleep",
    "pastSimple": "slept",
    "pastParticiple": "slept",
    "translation": "dormir",
    "ipa": {
      "infinitive": "sliːp",
      "pastSimple": "slept",
      "pastParticiple": "slept"
    },
    "level": "A1",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "essential",
    "rank": 83,
    "example": {
      "en": "The baby slept peacefully through the entire night.",
      "es": "El bebé durmió plácidamente toda la noche."
    },
    "mistake": "'slept' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "shine",
      "cost",
      "hurt"
    ]
  },
  {
    "id": "smell-85",
    "infinitive": "smell",
    "pastSimple": "smelt",
    "pastParticiple": "smelt",
    "translation": "oler",
    "ipa": {
      "infinitive": "smel",
      "pastSimple": "smelt",
      "pastParticiple": "smelt"
    },
    "level": "A2",
    "category": "percepción",
    "categoryLabel": "Percepción",
    "frequency": "common",
    "rank": 84,
    "example": {
      "en": "She smelt smoke coming from the kitchen.",
      "es": "Ella olió humo que venía de la cocina."
    },
    "mistake": "'smelt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "hear",
      "feel",
      "see"
    ]
  },
  {
    "id": "spread-86",
    "infinitive": "spread",
    "pastSimple": "spread",
    "pastParticiple": "spread",
    "translation": "extender / propagar",
    "ipa": {
      "infinitive": "spred",
      "pastSimple": "spred",
      "pastParticiple": "spred"
    },
    "level": "B1",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "common",
    "rank": 85,
    "example": {
      "en": "The wildfire spread quickly across the dry hills.",
      "es": "El incendio forestal se propagó rápidamente por las colinas secas."
    },
    "mistake": "'spread' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "burn",
      "freeze",
      "burst"
    ]
  },
  {
    "id": "steal-87",
    "infinitive": "steal",
    "pastSimple": "stole",
    "pastParticiple": "stolen",
    "translation": "robar",
    "ipa": {
      "infinitive": "stiːl",
      "pastSimple": "stəʊl",
      "pastParticiple": "ˈstəʊlən"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 86,
    "example": {
      "en": "Someone stole her bicycle right outside the shop.",
      "es": "Alguien le robó la bicicleta justo fuera de la tienda."
    },
    "mistake": "No añadas '-ed' a 'steal': su pasado es 'stole' y su participio 'stolen', formas irregulares que hay que memorizar.",
    "similar": [
      "stick",
      "sweep",
      "tear"
    ]
  },
  {
    "id": "stick-88",
    "infinitive": "stick",
    "pastSimple": "stuck",
    "pastParticiple": "stuck",
    "translation": "pegar / atascar",
    "ipa": {
      "infinitive": "stɪk",
      "pastSimple": "stʌk",
      "pastParticiple": "stʌk"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 87,
    "example": {
      "en": "The label stuck firmly to the glass jar.",
      "es": "La etiqueta se pegó firmemente al tarro de cristal."
    },
    "mistake": "'stuck' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "steal",
      "sweep",
      "tear"
    ]
  },
  {
    "id": "sweep-89",
    "infinitive": "sweep",
    "pastSimple": "swept",
    "pastParticiple": "swept",
    "translation": "barrer",
    "ipa": {
      "infinitive": "swiːp",
      "pastSimple": "swept",
      "pastParticiple": "swept"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 88,
    "example": {
      "en": "She swept the porch before the sun went down.",
      "es": "Ella barrió el porche antes de que se pusiera el sol."
    },
    "mistake": "'swept' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "stick",
      "steal",
      "tear"
    ]
  },
  {
    "id": "swear-90",
    "infinitive": "swear",
    "pastSimple": "swore",
    "pastParticiple": "sworn",
    "translation": "jurar / maldecir",
    "ipa": {
      "infinitive": "sweə",
      "pastSimple": "swɔː",
      "pastParticiple": "swɔːn"
    },
    "level": "B2",
    "category": "comunicación",
    "categoryLabel": "Comunicación",
    "frequency": "common",
    "rank": 89,
    "example": {
      "en": "He swore he would never lie to her again.",
      "es": "Él juró que nunca más le mentiría."
    },
    "mistake": "No añadas '-ed' a 'swear': su pasado es 'swore' y su participio 'sworn', formas irregulares que hay que memorizar.",
    "similar": [
      "ring",
      "teach",
      "sing"
    ]
  },
  {
    "id": "tear-91",
    "infinitive": "tear",
    "pastSimple": "tore",
    "pastParticiple": "torn",
    "translation": "rasgar / romper (tela)",
    "ipa": {
      "infinitive": "teə",
      "pastSimple": "tɔː",
      "pastParticiple": "tɔːn"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 90,
    "example": {
      "en": "The dog tore the newspaper into tiny pieces.",
      "es": "El perro rompió el periódico en pedacitos."
    },
    "mistake": "No añadas '-ed' a 'tear': su pasado es 'tore' y su participio 'torn', formas irregulares que hay que memorizar.",
    "similar": [
      "blow",
      "sweep",
      "bend"
    ]
  },
  {
    "id": "blow-92",
    "infinitive": "blow",
    "pastSimple": "blew",
    "pastParticiple": "blown",
    "translation": "soplar",
    "ipa": {
      "infinitive": "bləʊ",
      "pastSimple": "bluː",
      "pastParticiple": "bləʊn"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 91,
    "example": {
      "en": "A strong wind blew all the leaves off the trees.",
      "es": "Un viento fuerte sopló todas las hojas de los árboles."
    },
    "mistake": "No añadas '-ed' a 'blow': su pasado es 'blew' y su participio 'blown', formas irregulares que hay que memorizar.",
    "similar": [
      "tear",
      "bend",
      "bite"
    ]
  },
  {
    "id": "bend-93",
    "infinitive": "bend",
    "pastSimple": "bent",
    "pastParticiple": "bent",
    "translation": "doblar",
    "ipa": {
      "infinitive": "bend",
      "pastSimple": "bent",
      "pastParticiple": "bent"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 92,
    "example": {
      "en": "He bent the metal bar with his bare hands.",
      "es": "Él dobló la barra de metal con sus propias manos."
    },
    "mistake": "'bent' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "blow",
      "bite",
      "tear"
    ]
  },
  {
    "id": "bite-94",
    "infinitive": "bite",
    "pastSimple": "bit",
    "pastParticiple": "bitten",
    "translation": "morder",
    "ipa": {
      "infinitive": "baɪt",
      "pastSimple": "bɪt",
      "pastParticiple": "ˈbɪtən"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 93,
    "example": {
      "en": "The dog bit the mailman's shoe by accident.",
      "es": "El perro mordió el zapato del cartero por accidente."
    },
    "mistake": "No añadas '-ed' a 'bite': su pasado es 'bit' y su participio 'bitten', formas irregulares que hay que memorizar.",
    "similar": [
      "bend",
      "bind",
      "blow"
    ]
  },
  {
    "id": "bind-95",
    "infinitive": "bind",
    "pastSimple": "bound",
    "pastParticiple": "bound",
    "translation": "atar / vincular",
    "ipa": {
      "infinitive": "baɪnd",
      "pastSimple": "baʊnd",
      "pastParticiple": "baʊnd"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 94,
    "example": {
      "en": "They bound the old letters together with a ribbon.",
      "es": "Ataron las viejas cartas juntas con una cinta."
    },
    "mistake": "'bound' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "bite",
      "bend",
      "blow"
    ]
  },
  {
    "id": "burn-96",
    "infinitive": "burn",
    "pastSimple": "burnt",
    "pastParticiple": "burnt",
    "translation": "quemar",
    "ipa": {
      "infinitive": "bɜːn",
      "pastSimple": "bɜːnt",
      "pastParticiple": "bɜːnt"
    },
    "level": "A2",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "common",
    "rank": 95,
    "example": {
      "en": "The candle burnt all night on the windowsill.",
      "es": "La vela se quemó toda la noche en el alféizar."
    },
    "mistake": "'burnt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "burst",
      "spread",
      "shrink"
    ]
  },
  {
    "id": "burst-97",
    "infinitive": "burst",
    "pastSimple": "burst",
    "pastParticiple": "burst",
    "translation": "estallar / reventar",
    "ipa": {
      "infinitive": "bɜːst",
      "pastSimple": "bɜːst",
      "pastParticiple": "bɜːst"
    },
    "level": "B2",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "rare",
    "rank": 96,
    "example": {
      "en": "The balloon burst with a loud pop.",
      "es": "El globo estalló con un fuerte estampido."
    },
    "mistake": "'burst' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "burn",
      "spread",
      "shrink"
    ]
  },
  {
    "id": "creep-98",
    "infinitive": "creep",
    "pastSimple": "crept",
    "pastParticiple": "crept",
    "translation": "arrastrarse / reptar",
    "ipa": {
      "infinitive": "kriːp",
      "pastSimple": "krept",
      "pastParticiple": "krept"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 97,
    "example": {
      "en": "The cat crept slowly toward the sleeping bird.",
      "es": "El gato se arrastró lentamente hacia el pájaro dormido."
    },
    "mistake": "'crept' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "dive",
      "flee",
      "kneel"
    ]
  },
  {
    "id": "dream-100",
    "infinitive": "dream",
    "pastSimple": "dreamt",
    "pastParticiple": "dreamt",
    "translation": "soñar",
    "ipa": {
      "infinitive": "driːm",
      "pastSimple": "dremt",
      "pastParticiple": "dremt"
    },
    "level": "A2",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 98,
    "example": {
      "en": "She dreamt about flying over the ocean.",
      "es": "Ella soñó que volaba sobre el océano."
    },
    "mistake": "'dreamt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "mistake",
      "prove",
      "forgive"
    ]
  },
  {
    "id": "dive-101",
    "infinitive": "dive",
    "pastSimple": "dove",
    "pastParticiple": "dived",
    "translation": "bucear / zambullirse",
    "ipa": {
      "infinitive": "daɪv",
      "pastSimple": "dəʊv",
      "pastParticiple": "daɪvd"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 99,
    "example": {
      "en": "He dove straight into the cold swimming pool.",
      "es": "Él se zambulló directo en la piscina fría."
    },
    "mistake": "No añadas '-ed' a 'dive': su pasado es 'dove' y su participio 'dived', formas irregulares que hay que memorizar.",
    "similar": [
      "flee",
      "creep",
      "kneel"
    ]
  },
  {
    "id": "fit-102",
    "infinitive": "fit",
    "pastSimple": "fit",
    "pastParticiple": "fit",
    "translation": "quedar bien / encajar",
    "ipa": {
      "infinitive": "fɪt",
      "pastSimple": "fɪt",
      "pastParticiple": "fɪt"
    },
    "level": "A2",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "common",
    "rank": 100,
    "example": {
      "en": "The old key no longer fit the new lock.",
      "es": "La vieja llave ya no encajaba en la cerradura nueva."
    },
    "mistake": "'fit' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "sleep",
      "shine",
      "weep"
    ]
  },
  {
    "id": "flee-103",
    "infinitive": "flee",
    "pastSimple": "fled",
    "pastParticiple": "fled",
    "translation": "huir",
    "ipa": {
      "infinitive": "fliː",
      "pastSimple": "fled",
      "pastParticiple": "fled"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 101,
    "example": {
      "en": "The villagers fled before the storm arrived.",
      "es": "Los aldeanos huyeron antes de que llegara la tormenta."
    },
    "mistake": "'fled' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "dive",
      "kneel",
      "leap"
    ]
  },
  {
    "id": "grind-104",
    "infinitive": "grind",
    "pastSimple": "ground",
    "pastParticiple": "ground",
    "translation": "moler / triturar",
    "ipa": {
      "infinitive": "ɡraɪnd",
      "pastSimple": "ɡraʊnd",
      "pastParticiple": "ɡraʊnd"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 102,
    "example": {
      "en": "She ground the coffee beans fresh every morning.",
      "es": "Ella molía los granos de café frescos cada mañana."
    },
    "mistake": "'ground' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "lay",
      "deal",
      "overcome"
    ]
  },
  {
    "id": "kneel-105",
    "infinitive": "kneel",
    "pastSimple": "knelt",
    "pastParticiple": "knelt",
    "translation": "arrodillarse",
    "ipa": {
      "infinitive": "niːl",
      "pastSimple": "nelt",
      "pastParticiple": "nelt"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 103,
    "example": {
      "en": "He knelt down to tie his daughter's shoes.",
      "es": "Él se arrodilló para atarle los zapatos a su hija."
    },
    "mistake": "'knelt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "flee",
      "leap",
      "dive"
    ]
  },
  {
    "id": "lay-106",
    "infinitive": "lay",
    "pastSimple": "laid",
    "pastParticiple": "laid",
    "translation": "colocar / poner (huevos)",
    "ipa": {
      "infinitive": "leɪ",
      "pastSimple": "leɪd",
      "pastParticiple": "leɪd"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 104,
    "example": {
      "en": "The hen laid three eggs that morning.",
      "es": "La gallina puso tres huevos esa mañana."
    },
    "mistake": "'laid' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "grind",
      "overcome",
      "seek"
    ]
  },
  {
    "id": "leap-107",
    "infinitive": "leap",
    "pastSimple": "leapt",
    "pastParticiple": "leapt",
    "translation": "saltar",
    "ipa": {
      "infinitive": "liːp",
      "pastSimple": "lept",
      "pastParticiple": "lept"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 105,
    "example": {
      "en": "The rabbit leapt over the small fence.",
      "es": "El conejo saltó por encima de la pequeña valla."
    },
    "mistake": "'leapt' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "kneel",
      "flee",
      "dive"
    ]
  },
  {
    "id": "mistake-108",
    "infinitive": "mistake",
    "pastSimple": "mistook",
    "pastParticiple": "mistaken",
    "translation": "confundir",
    "ipa": {
      "infinitive": "mɪˈsteɪk",
      "pastSimple": "mɪˈstʊk",
      "pastParticiple": "mɪˈsteɪkən"
    },
    "level": "B1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 106,
    "example": {
      "en": "He mistook her for someone else at the party.",
      "es": "Él la confundió con otra persona en la fiesta."
    },
    "mistake": "No añadas '-ed' a 'mistake': su pasado es 'mistook' y su participio 'mistaken', formas irregulares que hay que memorizar.",
    "similar": [
      "prove",
      "dream",
      "forgive"
    ]
  },
  {
    "id": "overcome-109",
    "infinitive": "overcome",
    "pastSimple": "overcame",
    "pastParticiple": "overcome",
    "translation": "superar",
    "ipa": {
      "infinitive": "ˌəʊvəˈkʌm",
      "pastSimple": "ˌəʊvəˈkeɪm",
      "pastParticiple": "ˌəʊvəˈkʌm"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 107,
    "example": {
      "en": "She overcame her fear of public speaking.",
      "es": "Ella superó su miedo a hablar en público."
    },
    "mistake": "No añadas '-ed' a 'overcome': su pasado es 'overcame' y su participio 'overcome', formas irregulares que hay que memorizar.",
    "similar": [
      "seek",
      "lay",
      "grind"
    ]
  },
  {
    "id": "prove-110",
    "infinitive": "prove",
    "pastSimple": "proved",
    "pastParticiple": "proven",
    "translation": "probar / demostrar",
    "ipa": {
      "infinitive": "pruːv",
      "pastSimple": "pruːvd",
      "pastParticiple": "ˈpruːvən"
    },
    "level": "B1",
    "category": "mental",
    "categoryLabel": "Procesos mentales",
    "frequency": "common",
    "rank": 108,
    "example": {
      "en": "The new evidence proved his innocence.",
      "es": "Las nuevas pruebas demostraron su inocencia."
    },
    "mistake": "No añadas '-ed' a 'prove': su pasado es 'proved' y su participio 'proven', formas irregulares que hay que memorizar.",
    "similar": [
      "mistake",
      "dream",
      "forgive"
    ]
  },
  {
    "id": "seek-111",
    "infinitive": "seek",
    "pastSimple": "sought",
    "pastParticiple": "sought",
    "translation": "buscar",
    "ipa": {
      "infinitive": "siːk",
      "pastSimple": "sɔːt",
      "pastParticiple": "sɔːt"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 109,
    "example": {
      "en": "They sought shelter from the sudden storm.",
      "es": "Buscaron refugio de la repentina tormenta."
    },
    "mistake": "'sought' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "overcome",
      "lay",
      "spit"
    ]
  },
  {
    "id": "shrink-112",
    "infinitive": "shrink",
    "pastSimple": "shrank",
    "pastParticiple": "shrunk",
    "translation": "encoger",
    "ipa": {
      "infinitive": "ʃrɪŋk",
      "pastSimple": "ʃræŋk",
      "pastParticiple": "ʃrʌŋk"
    },
    "level": "B2",
    "category": "cambio",
    "categoryLabel": "Cambio de estado",
    "frequency": "rare",
    "rank": 110,
    "example": {
      "en": "The wool sweater shrank after the first wash.",
      "es": "El suéter de lana encogió después del primer lavado."
    },
    "mistake": "No añadas '-ed' a 'shrink': su pasado es 'shrank' y su participio 'shrunk', formas irregulares que hay que memorizar.",
    "similar": [
      "burst",
      "burn",
      "spread"
    ]
  },
  {
    "id": "sink-113",
    "infinitive": "sink",
    "pastSimple": "sank",
    "pastParticiple": "sunk",
    "translation": "hundir",
    "ipa": {
      "infinitive": "sɪŋk",
      "pastSimple": "sæŋk",
      "pastParticiple": "sʌŋk"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 111,
    "example": {
      "en": "The old boat slowly sank into the lake.",
      "es": "El viejo barco se hundió lentamente en el lago."
    },
    "mistake": "No añadas '-ed' a 'sink': su pasado es 'sank' y su participio 'sunk', formas irregulares que hay que memorizar.",
    "similar": [
      "slide",
      "spin",
      "spring"
    ]
  },
  {
    "id": "slide-114",
    "infinitive": "slide",
    "pastSimple": "slid",
    "pastParticiple": "slid",
    "translation": "deslizar",
    "ipa": {
      "infinitive": "slaɪd",
      "pastSimple": "slɪd",
      "pastParticiple": "slɪd"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "common",
    "rank": 112,
    "example": {
      "en": "The children slid down the icy hill on a sled.",
      "es": "Los niños se deslizaron por la colina helada en un trineo."
    },
    "mistake": "'slid' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "sink",
      "spin",
      "spring"
    ]
  },
  {
    "id": "spin-115",
    "infinitive": "spin",
    "pastSimple": "spun",
    "pastParticiple": "spun",
    "translation": "girar",
    "ipa": {
      "infinitive": "spɪn",
      "pastSimple": "spʌn",
      "pastParticiple": "spʌn"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 113,
    "example": {
      "en": "The dancer spun gracefully across the stage.",
      "es": "La bailarina giró con gracia por el escenario."
    },
    "mistake": "'spun' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "slide",
      "sink",
      "spring"
    ]
  },
  {
    "id": "spit-116",
    "infinitive": "spit",
    "pastSimple": "spat",
    "pastParticiple": "spat",
    "translation": "escupir",
    "ipa": {
      "infinitive": "spɪt",
      "pastSimple": "spæt",
      "pastParticiple": "spæt"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 114,
    "example": {
      "en": "The old engine spat smoke into the air.",
      "es": "El viejo motor escupió humo al aire."
    },
    "mistake": "'spat' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "split",
      "strike",
      "seek"
    ]
  },
  {
    "id": "split-117",
    "infinitive": "split",
    "pastSimple": "split",
    "pastParticiple": "split",
    "translation": "dividir / partir",
    "ipa": {
      "infinitive": "splɪt",
      "pastSimple": "splɪt",
      "pastParticiple": "splɪt"
    },
    "level": "B1",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 115,
    "example": {
      "en": "The heavy log split cleanly in two.",
      "es": "El pesado tronco se partió limpiamente en dos."
    },
    "mistake": "'split' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "spit",
      "strike",
      "wind"
    ]
  },
  {
    "id": "spring-118",
    "infinitive": "spring",
    "pastSimple": "sprang",
    "pastParticiple": "sprung",
    "translation": "saltar / brotar",
    "ipa": {
      "infinitive": "sprɪŋ",
      "pastSimple": "spræŋ",
      "pastParticiple": "sprʌŋ"
    },
    "level": "B2",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 116,
    "example": {
      "en": "The cat sprang suddenly onto the table.",
      "es": "El gato saltó de repente sobre la mesa."
    },
    "mistake": "No añadas '-ed' a 'spring': su pasado es 'sprang' y su participio 'sprung', formas irregulares que hay que memorizar.",
    "similar": [
      "swing",
      "spin",
      "slide"
    ]
  },
  {
    "id": "strike-119",
    "infinitive": "strike",
    "pastSimple": "struck",
    "pastParticiple": "struck",
    "translation": "golpear / hacer huelga",
    "ipa": {
      "infinitive": "straɪk",
      "pastSimple": "strʌk",
      "pastParticiple": "strʌk"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 117,
    "example": {
      "en": "Lightning struck the old oak tree during the storm.",
      "es": "Un rayo golpeó el viejo roble durante la tormenta."
    },
    "mistake": "'struck' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "split",
      "spit",
      "wind"
    ]
  },
  {
    "id": "swing-120",
    "infinitive": "swing",
    "pastSimple": "swung",
    "pastParticiple": "swung",
    "translation": "balancear",
    "ipa": {
      "infinitive": "swɪŋ",
      "pastSimple": "swʌŋ",
      "pastParticiple": "swʌŋ"
    },
    "level": "B1",
    "category": "movimiento",
    "categoryLabel": "Movimiento",
    "frequency": "rare",
    "rank": 118,
    "example": {
      "en": "The children swung happily in the park all afternoon.",
      "es": "Los niños se columpiaron felices en el parque toda la tarde."
    },
    "mistake": "'swung' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "spring",
      "spin",
      "slide"
    ]
  },
  {
    "id": "weep-121",
    "infinitive": "weep",
    "pastSimple": "wept",
    "pastParticiple": "wept",
    "translation": "llorar",
    "ipa": {
      "infinitive": "wiːp",
      "pastSimple": "wept",
      "pastParticiple": "wept"
    },
    "level": "B2",
    "category": "estados",
    "categoryLabel": "Estados y existencia",
    "frequency": "rare",
    "rank": 119,
    "example": {
      "en": "She wept quietly when she heard the news.",
      "es": "Ella lloró en silencio cuando escuchó la noticia."
    },
    "mistake": "'wept' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "fit",
      "sleep",
      "shine"
    ]
  },
  {
    "id": "wind-122",
    "infinitive": "wind",
    "pastSimple": "wound",
    "pastParticiple": "wound",
    "translation": "enrollar / dar cuerda",
    "ipa": {
      "infinitive": "waɪnd",
      "pastSimple": "waʊnd",
      "pastParticiple": "waʊnd"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "rare",
    "rank": 120,
    "example": {
      "en": "He wound the old clock before going to bed.",
      "es": "Él le dio cuerda al viejo reloj antes de irse a la cama."
    },
    "mistake": "'wound' se usa igual para el pasado simple y el participio, no lo confundas con verbos donde ambas formas difieren.",
    "similar": [
      "withdraw",
      "strike",
      "split"
    ]
  },
  {
    "id": "withdraw-123",
    "infinitive": "withdraw",
    "pastSimple": "withdrew",
    "pastParticiple": "withdrawn",
    "translation": "retirar",
    "ipa": {
      "infinitive": "wɪðˈdrɔː",
      "pastSimple": "wɪðˈdruː",
      "pastParticiple": "wɪðˈdrɔːn"
    },
    "level": "B2",
    "category": "acción",
    "categoryLabel": "Acciones cotidianas",
    "frequency": "common",
    "rank": 121,
    "example": {
      "en": "He withdrew some money before the trip.",
      "es": "Él retiró algo de dinero antes del viaje."
    },
    "mistake": "No añadas '-ed' a 'withdraw': su pasado es 'withdrew' y su participio 'withdrawn', formas irregulares que hay que memorizar.",
    "similar": [
      "wind",
      "strike",
      "split"
    ]
  }
];

Object.freeze(VERBS);

window.App = window.App || {};
window.App.Verbs = VERBS;
