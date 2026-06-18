/*
  Santoral Dominicano de Ordo Laudis.
  Fuente de trabajo: lista manual verificada por el responsable del proyecto,
  con enlaces a las fichas de Dominicos Argentina y Chile.
  Formato: "MM-DD": [[nombre, descripción, enlace, tieneLiturgiaDeLasHoras, etiquetaExtraOpcional]]
*/

const DOMINICAN_SANTORAL_SOURCE = "https://www.op.org.ar/nosotros/santos-y-santas/";

const DOMINICAN_SANTORAL = {
  "01-07": [
    [
      "San Raimundo de Peñafort",
      "Familia Dominicana",
      "https://www.op.org.ar/san-raimundo-de-panafort/",
      true
    ]
  ],
  "01-18": [
    [
      "Santa Margarita de Hungría",
      "Virgen",
      "https://www.op.org.ar/santa-margarita-de-hungria-virgen-2/",
      true
    ]
  ],
  "01-23": [
    [
      "Beato Enrique Seuze",
      "Presbítero",
      "https://www.op.org.ar/beato-enrique-seuze-presbitero/",
      true
    ]
  ],
  "01-28": [
    [
      "Santo Tomás de Aquino",
      "Doctor de la Iglesia",
      "https://www.op.org.ar/santo-tomas-de-aquino/",
      true
    ]
  ],
  "02-04": [
    [
      "Santa Catalina de Ricci",
      "Virgen",
      "https://www.op.org.ar/elementor-3647/",
      true
    ]
  ],
  "02-13": [
    [
      "Beato Jordán de Sajonia",
      "Presbítero",
      "https://www.op.org.ar/beato-jordan-de-sajonia-presbitero/",
      true
    ]
  ],
  "02-18": [
    [
      "Beato Angélico",
      "Presbítero",
      "https://www.op.org.ar/beato-juan-de-fiesole-angelico/",
      true
    ]
  ],
  "04-14": [
    [
      "Beato Pedro González Telmo",
      "Familia Dominicana",
      "https://www.op.org.ar/beato-pedro-gonzalez-telmo/",
      true
    ]
  ],
  "04-20": [
    [
      "Santa Inés de Montepulciano",
      "Familia Dominicana",
      "https://www.op.org.ar/santa-ines-de-montepulciano/",
      true
    ]
  ],
  "04-29": [
    [
      "Santa Catalina de Siena",
      "Virgen y Doctora de la Iglesia",
      "https://www.op.org.ar/santa-catalina-de-siena-virgen-y-doctora-de-la-iglesia/",
      true
    ]
  ],
  "04-30": [
    [
      "San Pío V",
      "Papa",
      "https://www.op.org.ar/san-pio-v-papa-2/",
      true
    ]
  ],
  "05-02": [
    [
      "San Antonino de Florencia",
      "Obispo",
      "https://www.op.org.ar/san-antonino-de-florencia-obispo/",
      true
    ]
  ],
  "05-05": [
    [
      "San Vicente Ferrer",
      "Presbítero",
      "https://www.op.org.ar/san-vicente-ferrer-presbitero/",
      true
    ]
  ],
  "05-08": [
    [
      "Patrocinio de la Virgen María sobre toda la Familia Dominicana",
      "Familia Dominicana",
      "https://www.op.org.ar/patrocinio-de-la-virgen-maria-sobre-toda-la-familia-dominicana/",
      true
    ]
  ],
  "05-12": [
    [
      "Beata Imelda Lambertini",
      "Familia Dominicana",
      "https://www.op.org.ar/beata-imelda-lambertini/",
      false,
      "Oración"
    ]
  ],
  "05-19": [
    [
      "San Francisco Coll y Guitart",
      "San Francisco Coll y Guitart",
      "https://www.op.org.ar/san-francisco-coll-y-guitart-presbitero/",
      true
    ]
  ],
  "06-04": [
    [
      "Pedro de Verona",
      "Presbítero y Mártir",
      "https://www.op.org.ar/san-pedro-de-verona-presbitero-y-martir/",
      true
    ]
  ],
  "07-04": [
    [
      "San Pier Giorgio Frassati",
      "Seglar",
      "https://www.op.org.ar/pier-giorgio-frassati/",
      true
    ]
  ],
  "07-09": [
    [
      "San Juan de Colonia y Compañeros Mártires",
      "Presbítero y Mártires",
      "https://www.op.org.ar/san-jacinto-de-colonia/",
      true
    ]
  ],
  "07-12": [
    [
      "San Ignacio Delgado, San Andrés Dung-Lac y Compañeros Mártires",
      "Obispo, Presbítero y Mártires",
      "https://www.op.org.ar/san-ignacio-delgado-obispo-y-companeros-martires/",
      true
    ]
  ],
  "07-22": [
    [
      "Santa María Magdalena",
      "Familia Dominicana",
      "https://www.op.org.ar/santa-maria-magdalena/",
      true
    ]
  ],
  "08-02": [
    [
      "Beata Juana de Aza",
      "Madre de Santo Domingo",
      "https://www.op.org.ar/beata-juana-de-aza-madre-de-santo-domingo/",
      true
    ]
  ],
  "08-17": [
    [
      "Santo Jacinto de Polonia",
      "Familia Dominicana",
      "https://www.op.org.ar/santo-jacinto-de-polonia/",
      true
    ]
  ],
  "08-18": [
    [
      "Beato Manés",
      "Hermano de Santo Domingo",
      "https://www.op.org.ar/beato-manes-de-guzman-hermano-de-n-p-santo-domingo/",
      true
    ]
  ],
  "08-28": [
    [
      "San Agustín de Hipona",
      "Obispo y Doctor de la Iglesia",
      "https://www.op.org.ar/san-agustin-de-hipona-obispo-y-doctor/",
      true
    ]
  ],
  "08-30": [
    [
      "Santa Rosa de Lima",
      "Virgen",
      "https://www.op.org.ar/santa-rosa-de-lima-virgen/",
      true
    ]
  ],
  "09-18": [
    [
      "San Juan Macías",
      "Hermano Cooperador",
      "https://www.op.org.ar/san-juan-macias-hermano-cooperador/",
      true
    ]
  ],
  "09-28": [
    [
      "Santos Lorenzo Ruiz, Domingo Ibáñez de Erquicia y Compañeros Mártires",
      "Mártires",
      "https://www.op.org.ar/santos-lorenzo-ruiz-domingo-ibanez-de-erquicia-y-companeros-martires/",
      true
    ]
  ],
  "10-04": [
    [
      "Nuestro Padre San Francisco de Asís",
      "Diácono",
      "https://www.op.org.ar/nuestro-padre-san-francisco-de-asis-diacono/",
      true
    ]
  ],
  "10-05": [
    [
      "San Bartolo Longo",
      "Seglar",
      "https://www.op.org.ar/beato-bartolome-longo-seglar/",
      true
    ]
  ],
  "10-09": [
    [
      "San Luis Bertrán",
      "Presbítero",
      "https://www.op.org.ar/san-luis-bertran-presbitero/",
      true
    ]
  ],
  "11-03": [
    [
      "San Martín de Porres",
      "Hermano Cooperador",
      "https://www.op.org.ar/san-martin-de-porres-hermano-cooperador/",
      true
    ]
  ],
  "11-07": [
    [
      "Todos los Santos de la Orden de Predicadores",
      "Familia Dominicana",
      "https://www.op.org.ar/todos-los-santos-de-la-orden-de-predicadores/",
      true
    ]
  ],
  "11-15": [
    [
      "San Alberto Magno",
      "Obispo y Doctor de la Iglesia",
      "https://www.op.org.ar/san-alberto-magno-obispo-y-doctor/",
      true
    ]
  ]
};
