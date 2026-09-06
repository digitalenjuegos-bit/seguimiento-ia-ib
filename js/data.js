// ============================================
// DATA - Datos iniciales del seguimiento IA
// Economía IB NM 2026 - Logos Academy
// ============================================
//
// Estructura por estudiante:
// { nombre, c1: {titulo, fuente, fPub, fElab, palabras, concepto, estatus,
//    notas:{A,B,C,D,E}, total, alertas:[]},
//   c2: {...}, c3: {...},
//   portafolio: {f:null, total45:null},
//   avance: 0.1666,
//   drive: { c1: [{nombre, tipo}], c2: [...], c3: [] } }

const ESTUDIANTES_INICIALES = [
  {
    nombre: "EMILIA TORRES",
    c1: {
      titulo: "Impuestos a los refrescos en México: las claves del aumento a las bebidas con azúcar y versiones light en 2026",
      fuente: "El País (López, A.I.)",
      fPub: "2025-10-17",
      fElab: "",
      palabras: 779,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 3, B: 2, C: 2, D: 2, E: 2 },
      total: 11,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "xPT 2 Comentario Económico #1.docx.pdf", tipo: "PDF" },
        { nombre: "xPT 2 Comentario Económico #1.docx", tipo: "Doc" }
      ],
      c2: [
        { nombre: "BORRADOR Comentario Económico #2 (10).pdf", tipo: "PDF" },
        { nombre: "BORRADOR Comentario Económico #2", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "FRANCISCO GARCIA",
    c1: {
      titulo: "Precio de la caja de banano sube a USD 7,50 a partir de 2026, según un nuevo Acuerdo Ministerial",
      fuente: "Revelo, R. Primicias",
      fPub: "2025-09-17",
      fElab: "2025-12-18",
      palabras: 637,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 2 },
      total: 10,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "INTERNO DE ECONOMIA (8).pdf", tipo: "PDF" }
      ],
      c2: [
        { nombre: "INTERNO DE ECONOMIA 2 (5).pdf", tipo: "PDF" }
      ],
      c3: []
    }
  },
  {
    nombre: "DOMENICA ZUNIGA",
    c1: {
      titulo: "Más impuestos al tabaco dispararán el mercado ilegal en México",
      fuente: "Expansión (Patiño, D.)",
      fPub: "2025-10-16",
      fElab: "2026-02-28",
      palabras: 796,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 3, D: 3, E: 2 },
      total: 12,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "COMENTARIO 1.pdf", tipo: "PDF" },
        { nombre: "COMENTARIO 1.docx", tipo: "Doc" }
      ],
      c2: [
        { nombre: "COMENTARIO 2.pdf", tipo: "PDF" },
        { nombre: "COMENTARIO 2.docx", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "OLENKA BRIONES",
    c1: {
      titulo: "Colapso del mercado del alquiler en Cataluña: ¿por qué la Ley de Vivienda está congelando el mercado en 2025?",
      fuente: "Eres Relocation (Álvarez, G.)",
      fPub: "2025-07-16",
      fElab: "",
      palabras: 629,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 3, B: 2, C: 2, D: 3, E: 3 },
      total: 13,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Comentario Económico 1 (11).pdf", tipo: "PDF" }
      ],
      c2: [
        { nombre: "COMENTARIO ECONÓMICO 2 (2).pdf", tipo: "PDF" }
      ],
      c3: []
    }
  },
  {
    nombre: "ESTEFANO GOMEZ",
    c1: {
      titulo: "Recaudación de impuestos rompe récord en Ecuador: SRI recibió más de USD 20.000 millones en 2024",
      fuente: "Primicias (Tapia, E.)",
      fPub: "2025-01-14",
      fElab: "",
      palabras: 795,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 2 },
      total: 10,
      alertas: ["⚠️ART.VIEJO C1"]
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Gómez Estéfano - Comentario Microeconómico.pdf", tipo: "PDF" }
      ],
      c2: [
        { nombre: "Comentario Macroeconómico (2).pdf", tipo: "PDF" },
        { nombre: "Comentario Macroeconómico (1).pdf", tipo: "PDF" }
      ],
      c3: []
    }
  },
  {
    nombre: "RENATA GUEDES",
    c1: {
      titulo: "Disminución de cosechas producen escasez de limón y alza de precios",
      fuente: "Diario La Hora — Tungurahua",
      fPub: "",
      fElab: "",
      palabras: 790,
      concepto: "Escasez",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 2 },
      total: 10,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Comentario económico - Renata Guedes (6).pdf", tipo: "PDF" },
        { nombre: "Comentario económico - Renata Guedes", tipo: "Doc" }
      ],
      c2: [
        { nombre: "Comentario macroeconomico (3).pdf", tipo: "PDF" },
        { nombre: "Comentario macroeconomico", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "CESAR PLUA",
    c1: {
      titulo: "El gasto en la cesta de la compra crece un 2,2%: la demanda de aceite de oliva aumenta el doble tras la bajada de precios",
      fuente: "Infobae (Redacción)",
      fPub: "2025-03-31",
      fElab: "2026-01-30",
      palabras: "",
      concepto: "Elección",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 3, D: 2, E: 2 },
      total: 11,
      alertas: ["⚠️ART.VIEJO C1"]
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Copia de Comentario Económico_1.docx", tipo: "Doc" },
        { nombre: "ADA 4: Comentario Económico", tipo: "Doc" },
        { nombre: "Comentario Económico_1.docx", tipo: "Doc" },
        { nombre: "Copia de ADA 4: Comentario Económico - El que saqué 9/10", tipo: "Doc" }
      ],
      c2: [
        { nombre: "Borrador Comentario Económico # 2 [2]", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "EMMILY TEJADA",
    c1: {
      titulo: "Cuánto costarán los cigarros y refrescos en México con alza de impuestos",
      fuente: "Infobae (Espinosa, J.)",
      fPub: "2025-09-21",
      fElab: "2025-11-05",
      palabras: 773,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 1 },
      total: 9,
      alertas: ["⬇️C1-BAJO"]
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "2026 - Comentario Económico microeconomìa.pdf", tipo: "PDF" },
        { nombre: "Entrega Final interno de economía- TEJADA 5.2", tipo: "Doc" },
        { nombre: "Entrega Final interno de economía- TEJADA 5.2", tipo: "Doc" },
        { nombre: "Entrega Final interno de economía- TEJADA 5.2.pdf", tipo: "PDF" },
        { nombre: "Entrega Final interno de economía- TEJADA 5.1.docx", tipo: "Doc" }
      ],
      c2: [
        { nombre: "2026 - Comentario Macroeconòmico.pdf", tipo: "PDF" }
      ],
      c3: []
    }
  },
  {
    nombre: "ALLISON VELASCO",
    c1: {
      titulo: "Impuesto sobre los refrescos azucarados de Santa Cruz, CA",
      fuente: "AP News",
      fPub: "2025-04-30",
      fElab: "",
      palabras: 799,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 2 },
      total: 10,
      alertas: ["⚠️ART.VIEJO C1"]
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Velasco Alisson_Borrador#1_ Comentario Economico (5).pdf", tipo: "PDF" },
        { nombre: "Velasco Alisson_Comentario Economico", tipo: "Doc" }
      ],
      c2: [
        { nombre: "Copia de Velasco Alisson_Borrador#2_ Comentario Economico (5).pdf", tipo: "PDF" },
        { nombre: "Copia de Velasco Alisson_Borrador#2: Comentario Economico", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "AMIR VIZCAINO",
    c1: {
      titulo: "Así subirán las tarifas eléctricas para grandes industrias tras el anuncio de Noboa de reducir el subsidio para empresas",
      fuente: "Primicias",
      fPub: "2025-06-02",
      fElab: "",
      palabras: 794,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 3, E: 2 },
      total: 11,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Final - Vizcaíno - Comentario #1 Microeconomía.pdf", tipo: "PDF" }
      ],
      c2: [
        { nombre: "Final - Vizcaíno - Comentario #2 Macroeconomía.pdf", tipo: "PDF" }
      ],
      c3: []
    }
  },
  {
    nombre: "VALERIE GAUNA",
    c1: {
      titulo: "Qué pasa en Ecuador tras la eliminación del subsidio al diésel",
      fuente: "Primicias",
      fPub: "2025-09-19",
      fElab: "",
      palabras: 789,
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 3, D: 3, E: 2 },
      total: 12,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "Comentario Microeconómico Final 2026", tipo: "Doc" },
        { nombre: "Comentario Microeconómico FINAL 2026.pdf", tipo: "PDF" }
      ],
      c2: [
        { nombre: "Comentario Macroeconómico FINAL.pdf", tipo: "PDF" },
        { nombre: "Comentario Macroeconómico", tipo: "Doc" }
      ],
      c3: []
    }
  },
  {
    nombre: "FIORELLA GARCES",
    c1: {
      titulo: "SBU 2026: el salario básico unificado sube a USD 482",
      fuente: "El Universo",
      fPub: "2025-12-18",
      fElab: "",
      palabras: "",
      concepto: "Intervención",
      estatus: "R1",
      notas: { A: 2, B: 2, C: 2, D: 2, E: 2 },
      total: 10,
      alertas: []
    },
    c2: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    c3: {
      titulo: "", fuente: "", fPub: "", fElab: "", palabras: "", concepto: "", estatus: "",
      notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: []
    },
    portafolio: { f: null, total45: null },
    avance: 0.1666,
    drive: {
      c1: [
        { nombre: "COMENTARIO MICROECONOMICO (1) (3).pdf", tipo: "PDF" },
        { nombre: "COMENTARIO MICROECONOMICO (1)", tipo: "Doc" }
      ],
      c2: [
        { nombre: "COMENTARIO MACROECONOMICO (4).pdf", tipo: "PDF" },
        { nombre: "COMENTARIO MACROECONOMICO", tipo: "Doc" }
      ],
      c3: []
    }
  }
];

// Exportar para uso en el navegador
if (typeof window !== 'undefined') {
  window.ESTUDIANTES_INICIALES = ESTUDIANTES_INICIALES;
}
