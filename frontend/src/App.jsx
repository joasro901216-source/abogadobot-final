import React, { useState, useEffect, useMemo, useRef } from "react";
// Profesiones JSON embebido - mismo contenido que /mnt/data/src/assets/ff4975252637752b-autonomo_pro_v4_profesiones.json
// Intentamos fetch en runtime para cumplir spec, fallback a este objeto
const profesionesRaw = {
  "categorias": [
    {
      "categoria": "Construcción y Reformas",
      "profesiones": [
        { "nombre": "Albañil", "cnae": "4121", "iae": "501.3", "licencias": ["Alta IAE", "PRL 20h Construcción", "RETA"], "riesgo": "alto" },
        { "nombre": "Pintor / Empapelador", "cnae": "4334", "iae": "505.1", "licencias": ["Alta IAE"], "nombre_completo": "Pintor" },
        { "nombre": "Electricista", "cnae": "4321", "iae": "504.1", "licencias": ["Certificado Instalador Autorizado Baja Tensión", "Carnet RBT", "RETA"], "riesgo": "alto", "notas": "Obligatorio carnet oficial" },
        { "nombre": "Fontanero", "cnae": "4322", "iae": "504.2", "licencias": ["Carnet Instalador Fontanería"], "riesgo": "medio" },
        { "nombre": "Carpintero / Ebanista", "cnae": "3109", "iae": "463", "licencias": ["Alta IAE"], "riesgo": "medio" },
        { "nombre": "Climatización / Frigorista", "cnae": "4322", "iae": "504.3", "licencias": ["Carnet RITE", "Manipulador gases fluorados"], "riesgo": "alto" },
        { "nombre": "Soldador", "cnae": "2511", "iae": "504.7", "licencias": ["Certificado soldadura", "PRL"], "riesgo": "alto" }
      ]
    },
    {
      "categoria": "Hostelería y Alimentación",
      "profesiones": [
        { "nombre": "Bar / Cafetería", "cnae": "5630", "iae": "673.2", "licencias": ["Licencia apertura", "Manipulador alimentos", "Licencia terraza"] },
        { "nombre": "Restaurante", "cnae": "5610", "iae": "671", "licencias": ["Licencia apertura", "Registro sanitario"] },
        { "nombre": "Panadero / Pastelero", "cnae": "1071", "iae": "419.1", "licencias": ["Registro sanitario", "Manipulador alimentos"] },
        { "nombre": "Food Truck", "cnae": "5610", "iae": "671.5", "licencias": ["Licencia ambulante", "Manipulador alimentos"] }
      ]
    },
    {
      "categoria": "Todas las demás (80+)",
      "profesiones": [
        { "nombre": "Transportista Autónomo", "cnae": "4941", "iae": "722", "licencias": ["Autorización transporte", "CAP"] },
        { "nombre": "Taxista / VTC", "cnae": "4932", "iae": "721.2", "licencias": ["Licencia municipal"] },
        { "nombre": "Peluquero / Barbero", "cnae": "9602", "iae": "972.1", "licencias": ["Licencia apertura", "Titulación"] },
        { "nombre": "Esteticista / Uñas", "cnae": "9602", "iae": "972.1", "licencias": ["Licencia apertura"] },
        { "nombre": "Fisioterapeuta", "cnae": "8690", "iae": "839", "licencias": ["Colegiación", "Seguro RC"] },
        { "nombre": "Abogado", "cnae": "6910", "iae": "731", "licencias": ["Colegiación", "Seguro RC"] },
        { "nombre": "Gestor / Asesor", "cnae": "6920", "iae": "799", "licencias": ["Alta IAE"] },
        { "nombre": "Arquitecto", "cnae": "7111", "iae": "711", "licencias": ["Colegiación", "Seguro RC decenal"] },
        { "nombre": "Diseñador Web / Gráfico", "cnae": "7410", "iae": "861", "licencias": ["Alta IAE"] },
        { "nombre": "Marketing / Community", "cnae": "7311", "iae": "799", "licencias": ["Alta IAE"] },
        { "nombre": "Fotógrafo", "cnae": "7420", "iae": "973.1", "licencias": ["Alta IAE"] },
        { "nombre": "Tienda Ropa / Retail", "cnae": "4771", "iae": "651.2", "licencias": ["Licencia apertura"] },
        { "nombre": "E-commerce / Online", "cnae": "4791", "iae": "665", "licencias": ["Alta IAE", "LSSI", "RGPD"] },
        { "nombre": "Taller Mecánico", "cnae": "4520", "iae": "691.2", "licencias": ["Licencia apertura", "Gestor residuos"] },
        { "nombre": "Limpieza", "cnae": "8121", "iae": "921", "licencias": ["Alta IAE"] },
        { "nombre": "Jardinero", "cnae": "8130", "iae": "911", "licencias": ["Carnet fitosanitarios"] },
        { "nombre": "Profesor / Academia", "cnae": "8559", "iae": "933.9", "licencias": ["Alta IAE"] },
        { "nombre": "Informático / Programador", "cnae": "6201", "iae": "763", "licencias": ["Alta IAE"] },
        { "nombre": "Entrenador Personal", "cnae": "9313", "iae": "967.2", "licencias": ["Titulación deportiva"] },
        { "nombre": "Tatuador", "cnae": "9609", "iae": "972.2", "licencias": ["Higiénico-sanitario", "Licencia apertura"] },
        { "nombre": "Inmobiliaria", "cnae": "6831", "iae": "834", "licencias": ["Alta IAE", "Seguro RC"] }
      ]
    }
  ]
};

// Types



// Fallback professions full list
const FALLBACK_EXTRA = [
  { nombre: "Electricista", cnae: "4321", iae: "504.1", licencias: ["Carnet RBT", "Certificado Instalador Autorizado Baja Tensión", "RETA"], riesgo: "alto", notas: "Obligatorio carnet oficial" },
  { nombre: "Fontanero", cnae: "4322", iae: "504.2", licencias: ["Carnet Instalador Fontanería"] },
  { nombre: "Albañil", cnae: "4121", iae: "501.3", licencias: ["Alta IAE", "PRL 20h Construcción", "RETA"] },
  { nombre: "Pintor", cnae: "4334", iae: "505.1", licencias: ["Alta IAE"] },
  { nombre: "Carpintero", cnae: "3109", iae: "463", licencias: ["Alta IAE"] },
  { nombre: "Climatización", cnae: "4322", iae: "504.3", licencias: ["Carnet RITE", "Manipulador gases fluorados"] },
  { nombre: "Soldador", cnae: "2511", iae: "504.7", licencias: ["Certificado soldadura", "PRL"] },
  { nombre: "Bar", cnae: "5630", iae: "673.2", licencias: ["Licencia apertura", "Manipulador alimentos", "Licencia terraza"] },
  { nombre: "Restaurante", cnae: "5610", iae: "671", licencias: ["Licencia apertura", "Registro sanitario"] },
  { nombre: "Panadero", cnae: "1071", iae: "419.1", licencias: ["Registro sanitario", "Manipulador alimentos"] },
  { nombre: "Food Truck", cnae: "5610", iae: "671.5", licencias: ["Licencia ambulante", "Manipulador alimentos"] },
  { nombre: "Transportista", cnae: "4941", iae: "722", licencias: ["Autorización transporte", "CAP"] },
  { nombre: "Taxista", cnae: "4932", iae: "721.2", licencias: ["Licencia municipal"] },
  { nombre: "Peluquero", cnae: "9602", iae: "972.1", licencias: ["Licencia apertura", "Titulación"] },
  { nombre: "Esteticista", cnae: "9602", iae: "972.1", licencias: ["Licencia apertura"] },
  { nombre: "Fisioterapeuta", cnae: "8690", iae: "839", licencias: ["Colegiación", "Seguro RC"] },
  { nombre: "Abogado", cnae: "6910", iae: "731", licencias: ["Colegiación", "Seguro RC"] },
  { nombre: "Gestor", cnae: "6920", iae: "799", licencias: ["Alta IAE"] },
  { nombre: "Arquitecto", cnae: "7111", iae: "711", licencias: ["Colegiación", "Seguro RC decenal"] },
  { nombre: "Diseñador Web", cnae: "7410", iae: "861", licencias: ["Alta IAE"] },
  { nombre: "Marketing", cnae: "7311", iae: "799", licencias: ["Alta IAE"] },
  { nombre: "Fotógrafo", cnae: "7420", iae: "973.1", licencias: ["Alta IAE"] },
  { nombre: "Tienda", cnae: "4771", iae: "651.2", licencias: ["Licencia apertura"] },
  { nombre: "E-commerce", cnae: "4791", iae: "665", licencias: ["Alta IAE", "LSSI", "RGPD"] },
  { nombre: "Taller Mecánico", cnae: "4520", iae: "691.2", licencias: ["Licencia apertura", "Gestor residuos"] },
  { nombre: "Limpieza", cnae: "8121", iae: "921", licencias: ["Alta IAE"] },
  { nombre: "Jardinero", cnae: "8130", iae: "911", licencias: ["Carnet fitosanitarios"] },
  { nombre: "Profesor", cnae: "8559", iae: "933.9", licencias: ["Alta IAE"] },
  { nombre: "Informático", cnae: "6201", iae: "763", licencias: ["Alta IAE"] },
  { nombre: "Entrenador", cnae: "9313", iae: "967.2", licencias: ["Titulación deportiva"] },
  { nombre: "Tatuador", cnae: "9609", iae: "972.2", licencias: ["Higiénico-sanitario", "Licencia apertura"] },
  { nombre: "Inmobiliaria", cnae: "6831", iae: "834", licencias: ["Alta IAE", "Seguro RC"] },
  { nombre: "Agricultor", cnae: "0111", iae: "911", licencias: ["Registro REA", "Alta IAE"] },
];

function getCuotaReal(ingresos){
  if (ingresos <= 0) return 230;
  if (ingresos <= 670) return 230;
  if (ingresos <= 900) return 250;
  if (ingresos <= 1166) return 260;
  if (ingresos <= 1300) return 291;
  if (ingresos <= 1500) return 294;
  if (ingresos <= 1700) return 294;
  if (ingresos <= 1850) return 350;
  if (ingresos <= 2030) return 370;
  if (ingresos <= 2250) return 390;
  if (ingresos <= 2760) return 415;
  if (ingresos <= 3115) return 450;
  if (ingresos <= 4100) return 530;
  if (ingresos <= 6000) return 580;
  return 590;
}

const TRAMOS = [
  { rango: "≤ 670€", cuota: 230 },
  { rango: "670-900€", cuota: 250 },
  { rango: "900-1166€", cuota: 260 },
  { rango: "1166-1300€", cuota: 291 },
  { rango: "1300-1700€", cuota: 294 },
  { rango: "1700-1850€", cuota: 350 },
  { rango: "1850-2030€", cuota: 370 },
  { rango: "2030-2250€", cuota: 390 },
  { rango: "2250-2760€", cuota: 415 },
  { rango: "2760-3115€", cuota: 450 },
  { rango: "3115-4100€", cuota: 530 },
  { rango: "4100-6000€", cuota: 580 },
  { rango: "≥ 6000€", cuota: 590 },
];

export default function App() {
  // Flow state
  const [step, setStep] = useState(0);
  const [tipo, setTipo] = useState(null);
  const [selectedProf, setSelectedProf] = useState(null);
  const [customProf, setCustomProf] = useState("");
  const [search, setSearch] = useState("");
  const [empleados, setEmpleados] = useState(null);
  const [ingresos, setIngresos] = useState(1650);
  const [tarifaPlana, setTarifaPlana] = useState(true);
  const [form, setForm] = useState({ nombre: "", nif: "", direccion: "", actividad: "", fecha: new Date().toISOString().split("T")[0] });
  const [docChecked, setDocChecked] = useState(new Set());
  const [docTab, setDocTab] = useState("036");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const chatEndRef = useRef(null);

  // Profesiones parsed
  const allProfesiones = useMemo(() => {
    try {
      const data = profesionesRaw;
      if (data?.categorias) {
        const list = [];
        data.categorias.forEach((cat) => {
          cat.profesiones.forEach((p) => list.push({ ...p, categoria: cat.categoria }));
        });
        return list;
      }
    } catch {}
    return FALLBACK_EXTRA;
  }, []);

  const filteredProfs = useMemo(() => {
    if (!search) return allProfesiones;
    const q = search.toLowerCase();
    return allProfesiones.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.cnae.includes(q) ||
        p.iae.includes(q) ||
        p.categoria?.toLowerCase().includes(q)
    );
  }, [search, allProfesiones]);

  const cuotaCalculada = tarifaPlana ? 80 : getCuotaReal(ingresos);
  const irpf = Math.round(ingresos * 0.2);
  const iva = Math.round(ingresos * 0.21);
  const neto = ingresos - cuotaCalculada - irpf;

  // Docs checklist
  const docsList = useMemo(() => {
    const base = [
      "DNI / NIE vigente",
      "Certificado digital FNMT o Cl@ve",
      "Cuenta bancaria IBAN para domiciliación",
      "Modelo 036/037 – Alta censal AEAT",
      "Alta RETA – Seguridad Social",
    ];
    const profDocs = selectedProf?.licencias || [];
    const empDocs =
      empleados !== "solo" && empleados
        ? [
            "Contrato laboral + alta TGSS",
            "Prevención Riesgos Laborales",
            "Seguro accidentes convenio",
            "Registro horario obligatorio",
            empleados === "4+" ? "Delegado prevención + calendario laboral visado" : "Evaluación riesgos básica",
          ]
        : [];
    const extra =
      selectedProf?.nombre.toLowerCase().includes("electric") || selectedProf?.nombre.toLowerCase().includes("climat")
        ? ["Seguro Responsabilidad Civil 600k€ mínimo", "Libro registro instalaciones"]
        : selectedProf?.nombre.toLowerCase().includes("bar") || selectedProf?.nombre.toLowerCase().includes("restaurante") || selectedProf?.nombre.toLowerCase().includes("food")
        ? ["Alta Sanidad – Manipulador alimentos", "Licencia apertura Ayuntamiento", "Hoja reclamaciones oficial"]
        : selectedProf?.nombre.toLowerCase().includes("trans") || selectedProf?.nombre.toLowerCase().includes("taxi")
        ? ["Tarjeta transporte visada", "Seguro mercancías / viajeros"]
        : [];
    return [...base, ...profDocs, ...extra, ...empDocs];
  }, [selectedProf, empleados]);

  // Chatbot state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState(() => [
    {
      id: "init",
      role: "bot",
      text: "Hola, soy AbogadoBot. Especialista en autónomos 2025-2026. Pregúntame cuotas reales, modelos, baja médica, CESE, monitorio, falso autónomo, Kit Digital. ¿En qué te ayudo?",
    },
  ]);

  const pushBotContext = (text, actionLabel, actionStep) => {
    setChatHistory((h) => [
      ...h,
      { id: Date.now().toString(), role: "bot", text, actionLabel, actionStep },
    ]);
  };

  // Sync context to bot when profession or ingresos changes
  useEffect(() => {
    if (selectedProf && step >= 2) {
      pushBotContext(
        `Veo que eres **${selectedProf.nombre}** (CNAE ${selectedProf.cnae} / IAE ${selectedProf.iae}) con ${ingresos}€ netos. Cuota real 2025: ${cuotaCalculada}€ ${tarifaPlana ? "(tarifa plana 80€ activa)" : ""}.\n\n1. Necesitas ${selectedProf.licencias.join(", ")}.\n2. Tu IRPF trimestral modelo 130 será 20% s/ rendimiento.\n3. ¿Quieres que te prepare el checklist y los modelos?`,
        "Usar en mi expediente",
        4
      );
    }
  }, [selectedProf?.nombre]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Bot intelligence
  const answerBot = (q) => {
    const lower = q.toLowerCase();
    const profName = selectedProf?.nombre || customProf || "autónomo";
    const contextLine = `En tu caso como ${profName} con ${ingresos}€/mes:`;

    if (lower.includes("cuota") || lower.includes("cuanto pago") || lower.includes("tabla") || lower.includes("tramos")) {
      return {
        text: `${contextLine}\n\n**Tabla oficial 2025-2026**\n• ≤670€ → 230€\n• 670-900€ → 250€\n• 900-1166€ → 260€\n• 1166-1300€ → 291€\n• 1300-1700€ → 294€\n• 1700-1850€ → 350€\n• 1850-2030€ → 370€\n• 2030-2250€ → 390€\n• 2250-2760€ → 415€\n• 2760-3115€ → 450€\n• 3115-4100€ → 530€\n• 4100-6000€ → 580€\n• ≥6000€ → 590€\n\nTu cuota: **${cuotaCalculada}€**. Con tarifa plana primeros 12 meses: **80€**.\n\n1. Elige base entre tu tramo real\n2. Puedes cambiar cada 2 meses (6 veces/año)\n3. ¿Quieres que calcule IRPF + IVA?`,
        actionLabel: "Calcular cuota exacta",
        actionStep: 4,
      };
    }
    if (lower.includes("tarifa plana") || lower.includes("80")) {
      return {
        text: `${contextLine}\n\n**Tarifa plana 80€ 2025**\n1. Requisito: no haber sido autónomo 2 años (3 si ya tuviste bonificación)\n2. 12 meses a 80€ + 12 meses bonificación 50-30% si ingresos < SMI\n3. Se solicita en alta RETA marcando bonificación.\n\nAhorro tu primer año: ${(cuotaCalculada - 80) * 12}€. ¿La activo en tu expediente?`,
        actionLabel: "Activar tarifa plana",
        actionStep: 4,
      };
    }
    if (lower.includes("130") || lower.includes("303") || lower.includes("modelo") || lower.includes("iva") || lower.includes("irpf")) {
      return {
        text: `${contextLine}\n\n**Modelos 2025**\n• **Modelo 130**: IRPF 20% rendimiento neto. Plazo día 20: 20 Abr / 20 Jul / 20 Oct / 30 Ene. Si ingreso ${ingresos}€ → ${irpf}€ trimestral.\n• **Modelo 303**: IVA 21% facturado - soportado. Mismo plazo. Ej: ${iva}€ si todo al 21%.\n• **390**: resumen anual IVA – 30 Ene\n• **100**: Renta anual – 30 Jun\n• **036**: alta censal inicial\n\n1. Presenta 130 y 303 aunque sea 0€\n2. Domicilia 5 días antes del día 20\n3. ¿Genero tus modelos pre-rellenados?`,
        actionLabel: "Generar Modelo 036",
        actionStep: 6,
      };
    }
    if (lower.includes("baja") || lower.includes("medica") || lower.includes("incapacidad")) {
      return {
        text: `**Baja médica autónomo 2025**\n\n1. Día 1-3: sin prestación (carencia)\n2. Día 4-20: **60% base** → si base ${cuotaCalculada}€, cobras ~${Math.round(cuotaCalculada * 0.6)}€\n3. Día 21+: **75% base**\n4. Debes comunicar a mutua en 15 días, seguir cotizando salvo CESE\n\nCon ingresos ${ingresos}€ te recomiendo base mínima 1000€ para mejorar baja. ¿Quieres calcular prestación?`,
      };
    }
    if (lower.includes("cese") || lower.includes("paro")) {
      return {
        text: `**CESE – Paro autónomos**\n\n1. Requisito: 12 meses cotizados seguidos por CESE (cuota incluye 0,9% CESE)\n2. Duración: 4 meses (12-17 meses cotizados) hasta 24 meses (48+ meses)\n3. Cuantía: 70% base reguladora\n4. Motivos válidos: pérdidas 10%, ejecución judicial, divorcio con cierre, violencia género, etc.\n\nTu base actual ${cuotaCalculada}€ → paro estimado ${Math.round((ingresos * 0.7))}€/mes. ¿Preparo solicitud?`,
        actionLabel: "Ver checklist CESE",
        actionStep: 5,
      };
    }
    if (lower.includes("monitorio") || lower.includes("reclamar") || lower.includes("impago") || lower.includes("burofax")) {
      return {
        text: `**Recuperar impagos 2025**\n\n1. **Burofax previo** obligatorio: reclama deuda + intereses + 40€ gastos (Ley morosidad)\n2. **Monitorio <6000€**: sin abogado/procurador, tasa 0€, juzgado mercantil domicilio deudor. Plazo 20 días para oposición.\n3. **>6000€**: demanda verbal/ordinaria, necesitas abogado\n4. Si cliente no opone → ejecución directa + embargo\n\n¿Quieres que redacte burofax para tu actividad de ${profName}?`,
        actionLabel: "Generar burofax",
        actionStep: 6,
      };
    }
    if (lower.includes("falso") || lower.includes("trade") || lower.includes("75%")) {
      return {
        text: `**Falso autónomo vs TRADE**\n\n1. **TRADE legal**: 1 solo cliente >75% ingresos + contrato escrito + infraestructura propia + asume riesgo. Debe registrarse en SEPE.\n2. **Falso autónomo**: cliente te impone horario, herramientas, vacaciones → relación laboral encubierta. Multa Inspección 3.126-10.000€.\n3. Si eres ${profName} y facturas >75% a una empresa, exige contrato TRADE con 18 días vacaciones pagadas, preaviso, indemnización 12 días/año\n\n¿Analizo tu contrato actual?`,
      };
    }
    if (lower.includes("kit digital") || lower.includes("3000")) {
      return {
        text: `**Kit Digital 2025 – 3.000€ autónomos**\n\n1. Segmento III (0-2 empleados): 3.000€ bono\n2. Usable en web, e-commerce, gestión clientes, factura electrónica, ciberseguridad\n3. Trámite: alta en AceleraPyme, test autodiagnóstico, solicitud con certificado digital\n4. Plazo hasta 31 Dic 2025, justificación 3 meses\n\nComo ${profName} puedes pedir web + CRM. ¿Te guío en la solicitud?`,
        actionLabel: "Añadir a checklist",
        actionStep: 5,
      };
    }
    if (lower.includes("cnae") || lower.includes("iae") || lower.includes("licencia") || lower.includes("carnet") || lower.includes("rbt")) {
      if (selectedProf) {
        return {
          text: `${contextLine}\n\n**${selectedProf.nombre} – CNAE ${selectedProf.cnae} IAE ${selectedProf.iae}**\nLicencias: ${selectedProf.licencias.join(", ")}\n${selectedProf.notas || ""}\nRiesgo: ${selectedProf.riesgo || "medio"}\n\n1. Alta IAE en Modelo 036 casilla 201\n2. Licencia apertura Ayuntamiento (si local)\n3. ${selectedProf.nombre.toLowerCase().includes("electric") ? "Carnet RBT: curso 40h + examen Industria. Sin él multa 6.000€" : "Seguro RC obligatorio"}\n\n¿Incluyo esto en tu expediente?`,
          actionLabel: "Usar en mi expediente",
          actionStep: 5,
        };
      }
      return {
        text: `CNAE e IAE dependen de profesión. Dime tu profesión (ej: electricista, bar, e-commerce) y te digo CNAE, IAE y licencias exactas.`,
        actionLabel: "Elegir profesión",
        actionStep: 2,
      };
    }
    if (lower.includes("empleado") || lower.includes("contratar")) {
      return {
        text: `${contextLine}\n\nSi contratas:\n1. **1-3 empleados**: coste +33% salario (SS). Alta TGSS, contrato, prevención 300€/año\n2. **4+ empleados**: necesitas delegado prevención, calendario laboral visado, software fichaje\n3. Puedes bonificar contrato indefinido 275€/mes 3 años si menor 30\n\nCon ${ingresos}€ ingresos, contratar 1 empleado 1.300€ netos → coste real 1.730€/mes. ¿Calculo margen?`,
        actionLabel: "Ver empleados",
        actionStep: 3,
      };
    }
    // Default contextual
    return {
      text: `${contextLine}\n\nPuedo ayudarte con:\n1. **Cuota exacta** según tus ${ingresos}€ → ${cuotaCalculada}€ (tarifa plana 80€)\n2. **Modelos 130/303** plazos día 20 y cálculo IRPF ${irpf}€ / IVA ${iva}€\n3. **Licencias ${selectedProf ? selectedProf.nombre : "de tu profesión"}** y checklist\n4. **Baja, CESE, impagos, falso autónomo, Kit Digital 3.000€**\n\nDime qué necesitas y te preparo el modelo.`,
      actionLabel: step < 6 ? "Continuar expediente" : "Generar documentos",
      actionStep: step < 6 ? step + 1 : 6,
    };
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now().toString(), role: "user", text: chatInput };
    setChatHistory((h) => [...h, userMsg]);
    const answer = answerBot(chatInput);
    setTimeout(() => {
      setChatHistory((h) => [
        ...h,
        { id: (Date.now() + 1).toString(), role: "bot", text: answer.text, actionLabel: answer.actionLabel, actionStep: answer.actionStep },
      ]);
    }, 400);
    setChatInput("");
  };

  const handleDownload = (type) => {
    const content = `
AUTÓNOMO PRO ESPAÑA - ${type}
Generado: ${new Date().toLocaleString("es-ES")}
Backend: https://cxdnmkiizvberyddivdivnd.supabase.co
--------------------------------------------------
DATOS TITULAR:
Nombre: ${form.nombre || "[Pendiente]"}
NIF: ${form.nif || "[Pendiente]"}
Dirección: ${form.direccion || "[Pendiente]"}
Actividad: ${form.actividad || selectedProf?.nombre || customProf || "[Pendiente]"}
Fecha inicio: ${form.fecha}
CNAE: ${selectedProf?.cnae || "-"} | IAE: ${selectedProf?.iae || "-"}
Ingresos previstos: ${ingresos}€/mes
Cuota RETA: ${cuotaCalculada}€ ${tarifaPlana ? "(Tarifa plana 80€)" : `(Tramo oficial ${getCuotaReal(ingresos)}€)`}
Empleados: ${empleados || "solo"}
--------------------------------------------------
${type === "Modelo 036" ? `
MODELO 036 - ALTA CENSAL
Casilla 201: Alta IAE ${selectedProf?.iae || ""}
Casilla 400: CNAE ${selectedProf?.cnae || ""}
Casilla 500: Régimen General autónomos
Obligaciones: Modelo 130 trimestral (IRPF 20%), Modelo 303 trimestral (IVA 21%), Modelo 390 anual.
Domiciliación IBAN: [Tu IBAN]
Firma digital FNMT requerida.
` : type === "Alta RETA" ? `
ALTA RETA - SEGURIDAD SOCIAL
Régimen: RETA
Base cotización: ${ingresos}€ (mín ${Math.min(ingresos, 1500)}€)
Cuota: ${cuotaCalculada}€
Bonificación: ${tarifaPlana ? "Tarifa plana 80€ 12 meses art. 38 LETA" : "No"}
Mutua: [Elige Fremap/Mutua Universal]
CESE: Sí, cotización 0,9% incluida
Fecha efectos: ${form.fecha}
` : `
CONTRATO PRESTACIÓN SERVICIOS / TRADE
Entre: ${form.nombre || "AUTÓNOMO"} (NIF ${form.nif || ""})
Y cliente: [Nombre cliente]

Objeto: Servicios de ${form.actividad || selectedProf?.nombre}
Duración: Indefinida desde ${form.fecha}
Precio: ${ingresos}€/mes + IVA 21% = ${iva}€ IVA
Condiciones TRADE si >75%: vacaciones 18 días, preaviso 15 días, indemnización 12 días/año.
Cláusula impago: Burofax previo + monitorio <6000€ sin abogado + intereses 8% + 40€ gastos gestión.
Ley aplicable: Española, Juzgado domicilio prestador.
`}
--------------------------------------------------
Checklist documentos: ${docsList.join(", ")}
--------------------------------------------------
Generado por AutónomoPro España LIVE
Actualizado hoy BOE/AEAT/TGSS
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type.replace(/ /g, "_")}_${form.nif || "borrador"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-[Inter] selection:bg-[#00ff88]/30">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *{font-family:Inter,system-ui}
        .mono{font-family:'JetBrains Mono',monospace}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#242428;border-radius:10px}
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#08080a]/80 border-b border-[#1e1e22]">
        <div className="mx-auto max-w-[1680px] px-4 lg:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#00ff88] flex items-center justify-center font-extrabold text-black text-[13px]">AP</div>
              <span className="font-extrabold tracking-tight text-[16px]">AutónomoPro <span className="font-medium text-zinc-400">España</span></span>
            </div>
            <div className="hidden xl:flex items-center gap-2 ml-4 min-w-0">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[11px] font-semibold text-[#00ff88]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" /> LIVE • Render + Supabase conectado
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#1a1a1e] border border-[#242428] text-[11px] text-zinc-400 mono">Actualizado hoy BOE</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-[11px] text-zinc-500 mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> 08:00 BOE
            </div>
            <button onClick={() => setMobileChatOpen(true)} className="lg:hidden px-3 py-2 rounded-full bg-[#00ff88] text-black text-[12px] font-bold">AbogadoBot</button>
          </div>
        </div>
        {/* Progress */}
        <div className="h-[2px] bg-[#15151a] w-full">
          <div className="h-full bg-[#00ff88] transition-all duration-500" style={{ width: `${((step + 1) / 7) * 100}%` }} />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="mx-auto max-w-[1600px] px-0 lg:px-6 lg:py-6 flex flex-col lg:flex-row gap-0 lg:gap-6 w-full overflow-hidden">
        {/* LEFT 70% */}
        <div className="flex-1 lg:w-[70%] min-w-0 max-w-full overflow-hidden">
          {/* Steps indicator */}
          <div className="px-4 lg:px-0 py-4 flex items-center gap-2 overflow-x-auto">
            {["Hero", "Objetivo", "Profesión", "Equipo", "Ingresos", "Docs", "Expediente"].map((label, i) => (
              <button
                key={label}
                onClick={() => { setStep(i); setRefreshTick(t=>t+1); }}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full border text-[11px] font-medium transition cursor-pointer ${
                  i === step
                    ? "bg-white text-black border-white shadow"
                    : i < step
                    ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]"
                    : "bg-[#141416] border-[#242428] text-zinc-500 hover:border-zinc-600"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-black/10 lg:bg-black/5 flex items-center justify-center text-[10px] font-bold mono">{i}</span>
                {label}
              </button>
            ))}
          </div>

          <div key={refreshTick} className="bg-[#0f0f11] lg:rounded-[24px] border-y lg:border border-[#1e1e22] overflow-hidden">
            {/* STEP 0 HERO */}
            {step === 0 && (
              <div className="p-6 lg:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141416] border border-[#242428] text-[11px] text-zinc-400 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> V5 FINAL FUSIONADA • V4 + AbogadoBot
                </div>
                <h1 className="text-[34px] lg:text-[54px] font-[800] leading-[0.95] tracking-tight max-w-[720px]">
                  Hazte autónomo en <span className="text-[#00ff88]">10 minutos</span> con cálculos reales 2025-2026
                </h1>
                <p className="mt-4 text-[15px] leading-6 text-zinc-400 max-w-[600px]">
                  Plataforma oscura premium. Cuota real según tabla oficial TGSS, IRPF 20% modelo 130, IVA 21% modelo 303. Checklist dinámico por CNAE/IAE y generación de expediente listo para AEAT y Seguridad Social.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 max-w-[560px]">
                  {[
                    { k: "Cuota desde", v: "80€" },
                    { k: "Modelos", v: "036 / RETA / 130 / 303" },
                    { k: "Tiempo", v: "10 min" },
                  ].map((s) => (
                    <div key={s.k} className="bg-[#141416] border border-[#242428] rounded-xl p-3">
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500 mono">{s.k}</div>
                      <div className="text-[14px] font-bold mt-1">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 rounded-full bg-[#00ff88] text-black font-bold text-[13px] hover:bg-[#00e67a] transition">
                    Empezar expediente →
                  </button>
                  <button onClick={() => setMobileChatOpen(true)} className="lg:hidden px-5 py-3 rounded-full bg-[#1a1a1e] border border-[#242428] text-[13px]">Preguntar a AbogadoBot</button>
                </div>
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {TRAMOS.slice(0, 3).map((t) => (
                    <div key={t.rango} className="bg-[#141416]/60 border border-[#1e1e22] rounded-xl p-4 flex justify-between items-center">
                      <span className="text-[12px] text-zinc-400 mono">{t.rango} netos</span>
                      <span className="text-[13px] font-bold">{t.cuota}€ cuota</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <div className="p-6 lg:p-10">
                <h2 className="text-[26px] font-bold tracking-tight">¿Qué quieres hacer?</h2>
                <p className="text-[13px] text-zinc-500 mt-2">Elige tu objetivo para adaptar cálculos y modelos.</p>
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { id: "nuevo", title: "Hacerme autónomo", desc: "Alta desde cero, tarifa plana 80€, modelo 036, RETA, checklist licencias.", badge: "Recomendado" },
                    { id: "ya", title: "Ya soy autónomo", desc: "Revisar cuota real 2025, optimizar base, modelos 130/303, CESE, baja.", badge: "Optimización" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTipo(opt.id);
                        setStep(2);
                      }}
                      className={`text-left p-6 rounded-[16px] border transition group ${
                        tipo === opt.id ? "bg-[#00ff88]/10 border-[#00ff88]/30" : "bg-[#141416] border-[#242428] hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-[#1e1e22] group-hover:bg-white group-hover:text-black flex items-center justify-center text-[16px]">{opt.id === "nuevo" ? "🚀" : "📈"}</div>
                        <span className="text-[10px] px-2 py-1 rounded-full bg-[#1e1e22] border border-[#242428] mono">{opt.badge}</span>
                      </div>
                      <div className="mt-4 font-bold text-[16px]">{opt.title}</div>
                      <div className="mt-2 text-[12px] leading-5 text-zinc-400">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 Profesión */}
            {step === 2 && (
              <div className="p-6 lg:p-10">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[22px] font-bold">Tu profesión</h2>
                  <span className="text-[11px] mono text-zinc-500">{allProfesiones.length} profesiones cargadas JSON</span>
                </div>
                <div className="mt-5 flex flex-col lg:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Busca: Electricista, Bar, CNAE 4321, IAE 504.1..."
                      className="w-full h-[44px] px-4 pr-10 rounded-full bg-[#141416] border border-[#242428] text-[13px] outline-none focus:border-[#00ff88]/40"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-[12px]">⌘K</span>
                  </div>
                  <input
                    value={customProf}
                    onChange={(e) => setCustomProf(e.target.value)}
                    placeholder="Otra profesión libre"
                    className="h-[44px] px-4 rounded-full bg-[#0f0f11] border border-[#242428] text-[13px] w-full lg:w-[220px] outline-none"
                  />
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {filteredProfs.map((p) => (
                    <button
                      key={`${p.nombre}-${p.cnae}-${p.iae}`}
                      onClick={() => {
                        setSelectedProf(p);
                        setForm((f) => ({ ...f, actividad: p.nombre }));
                      }}
                      className={`text-left p-4 rounded-xl border flex justify-between items-start transition ${
                        selectedProf?.nombre === p.nombre && selectedProf?.cnae === p.cnae
                          ? "bg-[#00ff88]/10 border-[#00ff88]/40"
                          : "bg-[#141416] border-[#1e1e22] hover:border-[#2a2a30]"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-[13px]">{p.nombre}</div>
                        <div className="mt-1 flex gap-2 text-[10px] mono">
                          <span className="px-1.5 py-0.5 rounded bg-[#1e1e22] border border-[#242428]">CNAE {p.cnae}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#1e1e22] border border-[#242428]">IAE {p.iae}</span>
                        </div>
                        <div className="mt-2 text-[11px] text-zinc-500 line-clamp-1">{p.licencias.join(" • ")}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedProf?.nombre === p.nombre ? "bg-[#00ff88] border-[#00ff88] text-black" : "border-[#2a2a30]"}`}>
                        {selectedProf?.nombre === p.nombre ? "✓" : ""}
                      </div>
                    </button>
                  ))}
                </div>

                {selectedProf && (
                  <div className="mt-6 p-4 rounded-[14px] bg-[#141416] border border-[#00ff88]/20">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-bold text-[13px]">{selectedProf.nombre}</span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-[#1e1e22] mono">CNAE {selectedProf.cnae}</span>
                      <span className="text-[11px] px-2 py-1 rounded-full bg-[#1e1e22] mono">IAE {selectedProf.iae}</span>
                      {selectedProf.riesgo && <span className={`text-[10px] px-2 py-1 rounded-full ${selectedProf.riesgo === "alto" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-amber-500/10 text-amber-400"}`}>riesgo {selectedProf.riesgo}</span>}
                    </div>
                    <div className="mt-3 text-[12px] text-zinc-400">Licencias obligatorias: <span className="text-zinc-200">{selectedProf.licencias.join(", ")}</span></div>
                    {selectedProf.notas && <div className="mt-2 text-[11px] text-amber-300/80">⚠ {selectedProf.notas}</div>}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(1)} className="px-4 py-2 rounded-full bg-[#1a1a1e] border border-[#242428] text-[12px]">← Atrás</button>
                  <button disabled={!selectedProf && !customProf} onClick={() => setStep(3)} className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black font-bold text-[12px] disabled:opacity-40">Continuar → Equipo</button>
                </div>
              </div>
            )}

            {/* STEP 3 Empleados */}
            {step === 3 && (
              <div className="p-6 lg:p-10">
                <h2 className="text-[22px] font-bold">¿Solo o con empleados?</h2>
                <p className="text-[12px] text-zinc-500 mt-1">Afecta a checklist, prevención y coste SS.</p>
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {[
                    { id: "solo", title: "Solo", desc: "Sin empleados", cost: "0€ extra", icon: "👤" },
                    { id: "1-3", title: "1-3 empleados", desc: "Pequeño equipo", cost: "+33% SS / empleado", icon: "👥" },
                    { id: "4+", title: "4+ empleados", desc: "Delegado prevención", cost: "+Gestión laboral", icon: "🏢" },
                  ].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setEmpleados(o.id)}
                      className={`text-left p-5 rounded-[14px] border transition ${empleados === o.id ? "bg-white text-black border-white" : "bg-[#141416] border-[#242428] hover:border-zinc-700"}`}
                    >
                      <div className="text-[20px]">{o.icon}</div>
                      <div className="mt-3 font-bold text-[14px]">{o.title}</div>
                      <div className="text-[11px] mt-1 opacity-70">{o.desc}</div>
                      <div className="mt-3 text-[10px] mono px-2 py-1 rounded-full bg-black/10 inline-block">{o.cost}</div>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(2)} className="px-4 py-2 rounded-full bg-[#1a1a1e] border border-[#242428] text-[12px]">← Profesión</button>
                  <button disabled={!empleados} onClick={() => setStep(4)} className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black font-bold text-[12px] disabled:opacity-40">Continuar → Ingresos</button>
                </div>
              </div>
            )}

            {/* STEP 4 Ingresos */}
            {step === 4 && (
              <div className="p-6 lg:p-10">
                <h2 className="text-[22px] font-bold">Ingresos netos mensuales</h2>
                <div className="mt-6 p-5 rounded-[16px] bg-[#141416] border border-[#1e1e22]">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-zinc-400 mono">Rango 0€ — 8.000€</span>
                    <span className="text-[22px] font-extrabold">{ingresos}€</span>
                  </div>
                  <input type="range" min={0} max={8000} step={50} value={ingresos} onChange={(e) => setIngresos(parseInt(e.target.value))} className="w-full mt-4 accent-[#00ff88] h-1" />
                  <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-3">
                      <div className="text-[10px] text-zinc-500 mono uppercase">Cuota RETA real</div>
                      <div className="text-[18px] font-bold mt-1">{cuotaCalculada}€</div>
                      <div className="text-[10px] text-zinc-500">{tarifaPlana ? "Tarifa plana 80€" : `Tramo ${getCuotaReal(ingresos)}€`}</div>
                    </div>
                    <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-3">
                      <div className="text-[10px] text-zinc-500 mono uppercase">IRPF Modelo 130</div>
                      <div className="text-[18px] font-bold mt-1">{irpf}€</div>
                      <div className="text-[10px] text-zinc-500">20% trimestral</div>
                    </div>
                    <div className="bg-[#0f0f11] border border-[#1e1e22] rounded-xl p-3">
                      <div className="text-[10px] text-zinc-500 mono uppercase">IVA Modelo 303</div>
                      <div className="text-[18px] font-bold mt-1">{iva}€</div>
                      <div className="text-[10px] text-zinc-500">21% facturado</div>
                    </div>
                    <div className="bg-[#00ff88] text-black rounded-xl p-3">
                      <div className="text-[10px] mono uppercase opacity-70">Neto estimado</div>
                      <div className="text-[18px] font-extrabold mt-1">{neto}€</div>
                      <div className="text-[10px] opacity-70">tras cuota+IRPF</div>
                    </div>
                  </div>
                  <label className="mt-4 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={tarifaPlana} onChange={(e) => setTarifaPlana(e.target.checked)} className="accent-[#00ff88]" />
                    <span className="text-[12px]">Aplicar tarifa plana 80€ primeros 12 meses</span>
                  </label>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <div className="text-[11px] mono text-zinc-500 mb-2">Tabla oficial TGSS 2025-2026</div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {TRAMOS.map((t) => (
                      <div key={t.rango} className={`p-2.5 rounded-lg border text-[11px] mono flex justify-between ${ingresos <= parseInt(t.rango) || (t.rango.includes("≥") && ingresos >= 6000) ? "bg-[#00ff88]/10 border-[#00ff88]/20 text-[#00ff88]" : "bg-[#141416] border-[#1e1e22] text-zinc-400"}`}>
                        <span>{t.rango}</span>
                        <span className="font-bold">{t.cuota}€</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(3)} className="px-4 py-2 rounded-full bg-[#1a1a1e] border border-[#242428] text-[12px]">← Equipo</button>
                  <button onClick={() => setStep(5)} className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black font-bold text-[12px]">Continuar → Documentos</button>
                </div>
              </div>
            )}

            {/* STEP 5 Checklist */}
            {step === 5 && (
              <div className="p-6 lg:p-10">
                <h2 className="text-[22px] font-bold">Checklist dinámico</h2>
                <p className="text-[12px] text-zinc-500 mt-1">
                  Según {selectedProf?.nombre || customProf || "tu actividad"} + {empleados}
                </p>
                <div className="mt-6 space-y-2">
                  {docsList.map((doc) => {
                    const checked = docChecked.has(doc);
                    return (
                      <label key={doc} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${checked ? "bg-[#00ff88]/5 border-[#00ff88]/20" : "bg-[#141416] border-[#1e1e22]"}`}>
                        <input type="checkbox" checked={checked} onChange={() => {
                          const n = new Set(docChecked);
                          if (checked) n.delete(doc); else n.add(doc);
                          setDocChecked(n);
                        }} className="accent-[#00ff88] w-4 h-4" />
                        <span className={`text-[12px] ${checked ? "text-zinc-200 line-through decoration-zinc-600" : "text-zinc-300"}`}>{doc}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 text-[11px] mono text-zinc-500">{docChecked.size}/{docsList.length} completados • Tiempo estimado 10 min</div>
                <div className="mt-6 flex justify-between">
                  <button onClick={() => setStep(4)} className="px-4 py-2 rounded-full bg-[#1a1a1e] border border-[#242428] text-[12px]">← Ingresos</button>
                  <button onClick={() => setStep(6)} className="px-6 py-2.5 rounded-full bg-[#00ff88] text-black font-bold text-[12px]">Generar expediente →</button>
                </div>
              </div>
            )}

            {/* STEP 6 Formulario */}
            {step === 6 && (
              <div className="p-6 lg:p-10">
                <h2 className="text-[22px] font-bold">Generador expediente</h2>
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                  <div className="space-y-3">
                    {[
                      { k: "nombre", label: "Nombre completo", ph: "María García López" },
                      { k: "nif", label: "NIF / NIE", ph: "12345678Z" },
                      { k: "direccion", label: "Dirección fiscal", ph: "C/ Mayor 12, 28001 Madrid" },
                      { k: "actividad", label: "Actividad", ph: selectedProf?.nombre || "Electricista" },
                      { k: "fecha", label: "Fecha inicio", type: "date" },
                    ].map((f) => (
                      <div key={f.k}>
                        <div className="text-[11px] mono text-zinc-500 mb-1">{f.label}</div>
                        <input
                          type={f.type || "text"}
                          value={(form)[f.k]}
                          onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                          placeholder={f.ph}
                          className="w-full h-[40px] px-3 rounded-xl bg-[#141416] border border-[#242428] text-[13px] outline-none focus:border-[#00ff88]/30"
                        />
                      </div>
                    ))}
                    <div className="pt-2 grid grid-cols-3 gap-2">
                      <button onClick={() => handleDownload("Modelo 036")} className="py-2.5 rounded-full bg-white text-black font-bold text-[11px]">Descargar 036</button>
                      <button onClick={() => handleDownload("Alta RETA")} className="py-2.5 rounded-full bg-[#1a1a1e] border border-[#242428] text-[11px]">Alta RETA</button>
                      <button onClick={() => handleDownload("Contrato")} className="py-2.5 rounded-full bg-[#00ff88] text-black font-bold text-[11px]">Contrato</button>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-[16px] overflow-hidden">
                    <div className="flex gap-1 p-2 bg-[#141416] border-b border-[#1e1e22]">
                      {(["036", "RETA", "CONTRATO"]).map((t) => (
                        <button key={t} onClick={() => setDocTab(t)} className={`px-3 py-1.5 rounded-full text-[11px] mono font-medium ${docTab === t ? "bg-white text-black" : "bg-[#1e1e22] text-zinc-400"}`}>
                          {t === "036" ? "Modelo 036" : t === "RETA" ? "Alta RETA" : "Contrato TRADE"}
                        </button>
                      ))}
                    </div>
                    <div className="p-5 mono text-[11px] leading-[1.6] text-zinc-300 whitespace-pre-wrap max-h-[460px] overflow-y-auto">
                      {docTab === "036" && `MODELO 036 – ALTA CENSAL AEAT (Vista previa)
----------------------------------------
Titular: ${form.nombre || "—"}
NIF: ${form.nif || "—"}
Domicilio: ${form.direccion || "—"}
Actividad: ${form.actividad || selectedProf?.nombre || "—"} | CNAE ${selectedProf?.cnae || "—"} | IAE ${selectedProf?.iae || "—"}
Fecha inicio: ${form.fecha}
Régimen: Estimación directa simplificada
Obligaciones trimestrales:
 • Modelo 130 – IRPF 20% s/ ${ingresos}€ = ${irpf}€ – Plazo día 20 (Abr/Jul/Oct/Ene)
 • Modelo 303 – IVA 21% – ${iva}€ – mismo plazo
 • Modelo 390 – Resumen anual IVA – 30 Ene
Cuota RETA: ${cuotaCalculada}€ ${tarifaPlana ? "(Tarifa plana 80€ art.38 LETA)" : ""}
Empleados: ${empleados}

Casillas 036:
[201] Alta IAE ${selectedProf?.iae || ""}
[400] CNAE ${selectedProf?.cnae || ""}
[500] Régimen General
[600] Domiciliación bancaria

Firma con certificado FNMT. Presentación en sede electrónica AEAT.
`}
                      {docTab === "RETA" && `ALTA RETA – TESORERÍA GENERAL SEGURIDAD SOCIAL
----------------------------------------
Nombre: ${form.nombre || "—"} – NIF ${form.nif || "—"}
Domicilio: ${form.direccion || "—"}
Actividad: ${form.actividad || selectedProf?.nombre || "—"}
Base cotización elegida: ${ingresos}€ (mínimo tramo ${getCuotaReal(ingresos)}€)
Cuota resultante: ${cuotaCalculada}€/mes
${tarifaPlana ? "Bonificación: Tarifa plana 80€ – 12 meses + bonificación progresiva 12 meses adicionales si ingresos < SMI" : "Sin bonificación"}
Mutua colaboradora: FREMAP / Mutua Universal (elegir)
Contingencias: AT/EP + CESE 0,9% incluido
Fecha efectos: ${form.fecha}
CNAE: ${selectedProf?.cnae || "—"}

Licencias específicas: ${(selectedProf?.licencias || []).join(", ") || "Alta IAE"}

Presentación: Import@ss con certificado digital. Plazo 60 días previos a inicio.
`}
                      {docTab === "CONTRATO" && `CONTRATO DE PRESTACIÓN DE SERVICIOS – ${selectedProf?.nombre?.toUpperCase() || "AUTÓNOMO"}
----------------------------------------
En ${form.direccion || "Madrid"}, a ${form.fecha}

REUNIDOS:
Prestador: ${form.nombre || "—"} con NIF ${form.nif || "—"}, autónomo CNAE ${selectedProf?.cnae || "—"}
Cliente: [Razón social cliente] NIF [—]

OBJETO: Servicios de ${form.actividad || selectedProf?.nombre || "—"} conforme licencias ${selectedProf?.licencias?.join(", ") || "—"}

CONDICIONES ECONÓMICAS:
Precio: ${ingresos}€/mes + IVA 21% (${iva}€)
IRPF: -20% retención si cliente empresa = ${irpf}€
Cuota RETA: ${cuotaCalculada}€ a cargo prestador

TRADE (si >75% ingresos un cliente):
Vacaciones 18 días hábiles pagadas, preaviso 15 días, indemnización 12 días/año, interrupción justificada.

IMPAGOS:
Burofax previo obligatorio, 40€ gastos gestión + intereses 8% Ley morosidad.
Monitorio <6000€ sin abogado (art. 812 LEC) – 20 días oposición.
>6000€ demanda verbal/ordinaria.

PROTECCIÓN DATOS Y PRL: Conforme ${empleados !== "solo" ? "con empleados – evaluación riesgos" : "autónomo sin empleados"}

Firma: ____________________
`}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setStep(0)} className="px-4 py-2 rounded-full bg-[#1a1a1e] border border-[#242428] text-[12px]">Reiniciar flujo</button>
                  <div className="ml-auto text-[11px] mono text-zinc-500 self-center">Vista previa lista para descargar • BOE actualizado hoy</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT 30% Chatbot */}
        <div className="hidden lg:block w-[360px] shrink-0">
          <div className="sticky top-[70px] bg-[#0f0f11] border border-[#1e1e22] rounded-[20px] overflow-hidden flex flex-col h-[calc(100vh-84px)]">
            <div className="p-4 border-b border-[#1e1e22] flex items-center justify-between">
              <div>
                <div className="font-bold text-[14px] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#00ff88] text-black flex items-center justify-center text-[11px] font-extrabold">A</span>
                  AbogadoBot
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 mono">Pregúntame cualquier duda • 2025-2026</div>
              </div>
              <div className="text-[10px] px-2 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] mono">LIVE</div>
            </div>

            {/* context chip */}
            <div className="px-4 py-2 bg-[#141416] border-b border-[#1e1e22] flex flex-wrap gap-1.5">
              {selectedProf && <span className="text-[10px] px-2 py-1 rounded-full bg-[#1e1e22] border border-[#242428] mono">{selectedProf.nombre} • {ingresos}€ • {cuotaCalculada}€</span>}
              {!selectedProf && <span className="text-[10px] px-2 py-1 rounded-full bg-[#1e1e22] border border-[#242428] mono text-zinc-500">Sin profesión aún • Selecciona en paso 2</span>}
              {tarifaPlana && <span className="text-[10px] px-2 py-1 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] mono">Tarifa 80€</span>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-[14px] px-3 py-2.5 text-[12px] leading-5 ${m.role === "user" ? "bg-white text-black rounded-br-[4px]" : "bg-[#1a1a1e] border border-[#242428] text-zinc-200 rounded-bl-[4px]"}`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    {m.actionLabel && (
                      <button
                        onClick={() => {
                          if (m.actionStep !== undefined) setStep(m.actionStep);
                        }}
                        className="mt-2 px-2.5 py-1 rounded-full bg-[#00ff88] text-black text-[11px] font-bold"
                      >
                        {m.actionLabel} →
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-[#1e1e22] bg-[#0f0f11]">
              <div className="flex gap-2 mb-2 overflow-x-auto">
                {["Cuota real", "Modelo 130/303", "Baja médica", "Burofax impago", "Kit Digital 3000€"].map((s) => (
                  <button key={s} onClick={() => setChatInput(s)} className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-[#1a1a1e] border border-[#242428] text-zinc-400 hover:text-zinc-200">
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu duda legal..."
                  className="flex-1 h-[40px] px-4 rounded-full bg-[#141416] border border-[#242428] text-[12px] outline-none focus:border-[#00ff88]/30"
                />
                <button onClick={handleSend} className="w-[40px] h-[40px] rounded-full bg-[#00ff88] text-black flex items-center justify-center font-bold hover:bg-[#00e67a]">↑</button>
              </div>
              <div className="mt-2 text-[9px] mono text-zinc-600 text-center">Base: cuotas 230€-590€, tarifa 80€, CESE 12 meses, monitorio &lt;6000€ sin abogado, burofax, TRADE 75%, Kit 3000€</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Chat Bottom Sheet */}
      {mobileChatOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex flex-col">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setMobileChatOpen(false)} />
          <div className="bg-[#0f0f11] border-t border-[#1e1e22] rounded-t-[20px] h-[72vh] flex flex-col">
            <div className="p-4 border-b border-[#1e1e22] flex items-center justify-between">
              <div className="font-bold text-[14px]">AbogadoBot • {selectedProf?.nombre || "Autónomo"}</div>
              <button onClick={() => setMobileChatOpen(false)} className="w-8 h-8 rounded-full bg-[#1a1a1e] border border-[#242428]">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.map((m) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-[14px] px-3 py-2.5 text-[12px] ${m.role === "user" ? "bg-white text-black" : "bg-[#1a1a1e] border border-[#242428]"}`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    {m.actionLabel && (
                      <button onClick={() => { if (m.actionStep !== undefined) { setStep(m.actionStep); setMobileChatOpen(false); } }} className="mt-2 px-2.5 py-1 rounded-full bg-[#00ff88] text-black text-[11px] font-bold">
                        {m.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-[#1e1e22]">
              <div className="flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Tu duda..." className="flex-1 h-[42px] px-4 rounded-full bg-[#141416] border border-[#242428] text-[13px] outline-none" />
                <button onClick={handleSend} className="w-[42px] h-[42px] rounded-full bg-[#00ff88] text-black font-bold">↑</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 border-t border-[#1e1e22] bg-[#0a0a0c]">
        <div className="mx-auto max-w-[1680px] px-4 lg:px-6 py-4 flex flex-col lg:flex-row gap-2 justify-between items-start lg:items-center">
          <div className="text-[11px] mono text-zinc-500">
            Backend: <span className="text-zinc-300">https://cxdnmkiizvberyddivnd.supabase.co</span> • Frontend: <span className="text-[#00ff88]">Render LIVE</span> • Actualización diaria 08:00 BOE/AEAT/TGSS
          </div>
          <div className="text-[11px] mono text-zinc-600">AutónomoPro España V5 FINAL FUSIONADA • Cálculos reales 2025-2026 • No asesoramiento legal oficial, ver BOE</div>
        </div>
      </footer>
    </div>
  );
}
