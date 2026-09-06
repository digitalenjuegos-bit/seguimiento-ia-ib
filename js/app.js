// ============================================
// APP - Seguimiento IA - Economía IB NM 2026
// Logos Academy
// ============================================
//
// Panel privado del docente para seguir el avance de la Evaluación Interna
// (IA) de Economía IB Nivel Medio: 3 comentarios económicos (C1 micro,
// C2 macro, C3 internacional), cada uno /14 (A=3,B=2,C=3,D=3,E=3), más
// portafolio (F /3, total /45).
//
// Persistencia: Firebase RTDB (nodo 'seguimiento_ia_ib') si está disponible;
// si no, localStorage (modo local). Acceso con clave DOCENTE2026.

(function () {
  'use strict';

  // ===== Constantes =====
  var CLAVE_ACCESO = 'DOCENTE2026';
  var LS_KEY = 'seguimiento_ia_ib_data';
  var LS_EDITLOG = 'seguimiento_ia_ib_editLog';
  var LS_SESSION = 'seguimiento_ia_ib_session';
  var MAX_EDITLOG_LOCAL = 500;

  // ===== Estado =====
  var db = null;
  var estudiantes = [];
  var estudianteActual = null; // índice en 'estudiantes'
  var storageMode = 'local';   // 'local' | 'cloud'

  // ===== Helpers DOM =====
  function $(id) { return document.getElementById(id); }

  // ===== Inicialización Firebase =====
  function initFirebase() {
    if (window.FIREBASE_CONFIGURED && window.firebase && !window.firebase.apps.length) {
      try {
        window.firebase.initializeApp(window.FIREBASE_CONFIG);
        db = window.firebase.database();
        return true;
      } catch (e) {
        console.warn('Firebase init falló:', e);
        db = null;
        return false;
      }
    }
    return false;
  }

  // ===== Persistencia: Firebase =====
  function fbWrite(path, data) {
    if (!db) return Promise.reject(new Error('Firebase no disponible'));
    return db.ref(path).update(data);
  }

  function fbRead(path) {
    if (!db) return Promise.reject(new Error('Firebase no disponible'));
    return db.ref(path).once('value').then(function (snap) { return snap.val(); });
  }

  function fbPush(path, data) {
    if (!db) return Promise.reject(new Error('Firebase no disponible'));
    return db.ref(path).push(data);
  }

  // ===== Persistencia: localStorage =====
  function lsRead() {
    try {
      var raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function lsWrite(data) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; }
  }

  // ===== Normalizar estructura de estudiante =====
  // Firebase RTDB elimina valores null y objetos vacíos al guardar.
  // Al leer, hay que reconstruir la estructura completa para que
  // la edición no falle por campos faltantes (notas, drive, etc.).
  function normalizarEstudiante(est) {
    ['c1', 'c2', 'c3'].forEach(function (k) {
      if (!est[k]) est[k] = {};
      var c = est[k];
      if (c.titulo === undefined) c.titulo = '';
      if (c.fuente === undefined) c.fuente = '';
      if (c.fPub === undefined) c.fPub = '';
      if (c.fElab === undefined) c.fElab = '';
      if (c.palabras === undefined) c.palabras = '';
      if (c.concepto === undefined) c.concepto = '';
      if (c.estatus === undefined) c.estatus = '';
      if (!c.notas) c.notas = {};
      ['A', 'B', 'C', 'D', 'E'].forEach(function (l) {
        if (c.notas[l] === undefined) c.notas[l] = null;
      });
      if (c.total === undefined) c.total = null;
      if (!c.alertas) c.alertas = [];
      if (c.retroalimentacion === undefined) c.retroalimentacion = '';
    });
    if (!est.portafolio) est.portafolio = { f: null, total45: null };
    if (est.portafolio.f === undefined) est.portafolio.f = null;
    if (est.portafolio.total45 === undefined) est.portafolio.total45 = null;
    if (est.avance === undefined || est.avance === null || est.avance === '') est.avance = 0.1666;
    if (!est.drive) est.drive = { c1: [], c2: [], c3: [] };
    ['c1', 'c2', 'c3'].forEach(function (k) {
      if (!est.drive[k]) est.drive[k] = [];
    });
    return est;
  }

  // ===== Cargar datos =====
  function cargarDatos() {
    // 1. Intentar Firebase
    if (db) {
      return fbRead(window.FB_PATH).then(function (val) {
        if (val && val.estudiantes && Array.isArray(val.estudiantes)) {
          estudiantes = val.estudiantes.map(normalizarEstudiante);
          storageMode = 'cloud';
          return;
        }
        // No hay datos en la nube: sembrar con los iniciales
        estudiantes = JSON.parse(JSON.stringify(window.ESTUDIANTES_INICIALES)).map(normalizarEstudiante);
        storageMode = 'cloud';
        return persistirTodo().catch(function () { /* si falla, queda local */ });
      }).catch(function () {
        // Firebase falló: modo local
        cargarLocal();
        return Promise.resolve();
      });
    }
    cargarLocal();
    return Promise.resolve();
  }

  function cargarLocal() {
    storageMode = 'local';
    var local = lsRead();
    if (local && local.estudiantes && Array.isArray(local.estudiantes)) {
      estudiantes = local.estudiantes.map(normalizarEstudiante);
    } else {
      estudiantes = JSON.parse(JSON.stringify(window.ESTUDIANTES_INICIALES)).map(normalizarEstudiante);
      lsWrite({ estudiantes: estudiantes });
    }
  }

  // ===== Persistir todo =====
  function persistirTodo() {
    var data = { estudiantes: estudiantes };
    if (db) {
      return fbWrite(window.FB_PATH, data);
    }
    return Promise.resolve(lsWrite(data));
  }

  // ===== Log de ediciones =====
  function logEdicion(estudianteNombre, campo, valor) {
    var entry = {
      ts: new Date().toISOString(),
      estudiante: estudianteNombre,
      campo: campo,
      valor: valor
    };
    if (db) {
      fbPush(window.FB_PATH + '/_editLog', entry).catch(function () {});
    }
    // También en localStorage (acotado)
    try {
      var log = JSON.parse(localStorage.getItem(LS_EDITLOG) || '[]');
      log.push(entry);
      if (log.length > MAX_EDITLOG_LOCAL) log = log.slice(-MAX_EDITLOG_LOCAL);
      localStorage.setItem(LS_EDITLOG, JSON.stringify(log));
    } catch (e) {}
  }

  // ===== Login =====
  function checkSession() {
    try { return sessionStorage.getItem(LS_SESSION) === 'ok'; }
    catch (e) { return false; }
  }

  function doLogin() {
    var key = $('loginKey').value;
    if (key === CLAVE_ACCESO) {
      try { sessionStorage.setItem(LS_SESSION, 'ok'); } catch (e) {}
      $('loginError').hidden = true;
      showApp();
    } else {
      $('loginError').hidden = false;
      $('loginKey').value = '';
      $('loginKey').focus();
    }
  }

  function doLogout() {
    try { sessionStorage.removeItem(LS_SESSION); } catch (e) {}
    $('app').hidden = true;
    $('loginScreen').hidden = false;
    $('loginKey').value = '';
    $('loginError').hidden = true;
    $('loginKey').focus();
  }

  function showApp() {
    $('loginScreen').hidden = true;
    $('app').hidden = false;
    initFirebase();
    cargarDatos().then(function () {
      verificarConexion();
      renderGeneral();
      mostrarVista('general');
    });
  }

  // ===== Verificar conexión / badge =====
  function verificarConexion() {
    var badge = $('storageBadge');
    if (!db) {
      badge.textContent = 'Modo local (sin Firebase)';
      badge.className = 'storage-badge local';
      return;
    }
    fbRead(window.FB_PATH).then(function () {
      badge.textContent = 'Conectado a la nube (Firebase)';
      badge.className = 'storage-badge cloud';
    }).catch(function () {
      badge.textContent = 'Sin conexión — modo local';
      badge.className = 'storage-badge error';
    });
  }

  // ===== Banda de color por nota =====
  function bandaNota(n) {
    if (n === null || n === undefined || n === '') return '';
    if (n >= 13) return 'verde';
    if (n >= 10) return 'amarillo';
    if (n >= 7) return 'naranja';
    if (n >= 4) return 'rojo';
    return 'rojo-oscuro';
  }

  function badgeNota(n) {
    var b = bandaNota(n);
    if (!b) return '<span class="nota-pendiente">—</span>';
    return '<span class="nota-cell">' + n + '<span class="badge badge-' + b + '"></span></span>';
  }

  // ===== Indicador de entrega (Drive) =====
  function entregasDrive(est) {
    var count = 0;
    ['c1', 'c2', 'c3'].forEach(function (k) {
      if (est.drive && est.drive[k] && est.drive[k].length > 0) count++;
    });
    return count;
  }

  // ===== Render vista general =====
  function renderGeneral() {
    var tbody = $('generalBody');
    tbody.innerHTML = '';

    var sumC1 = 0, sumC2 = 0, sumC3 = 0, sumEntregas = 0;

    estudiantes.forEach(function (est, idx) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-idx', idx);
      tr.addEventListener('click', function () { abrirDetalle(idx); });

      var c1n = est.c1 && est.c1.total;
      var c2n = est.c2 && est.c2.total;
      var c3n = est.c3 && est.c3.total;
      if (c1n !== null && c1n !== undefined && c1n !== '') sumC1++;
      if (c2n !== null && c2n !== undefined && c2n !== '') sumC2++;
      if (c3n !== null && c3n !== undefined && c3n !== '') sumC3++;

      var entregas = entregasDrive(est);
      sumEntregas += entregas;

      var alertas = [];
      ['c1', 'c2', 'c3'].forEach(function (k) {
        if (est[k] && est[k].alertas && est[k].alertas.length) {
          alertas = alertas.concat(est[k].alertas);
        }
      });

      var avance = (est.avance !== null && est.avance !== undefined && est.avance !== '')
        ? (Math.round(est.avance * 100) + '%') : '—';

      tr.innerHTML =
        '<td class="nombre">' + esc(est.nombre) + '</td>' +
        '<td>' + badgeNota(c1n) + '</td>' +
        '<td>' + badgeNota(c2n) + '</td>' +
        '<td>' + badgeNota(c3n) + '</td>' +
        '<td>' + (est.portafolio && est.portafolio.total45 ? est.portafolio.total45 : '<span class="nota-pendiente">—</span>') + '</td>' +
        '<td class="avance-cell">' + avance + '</td>' +
        '<td class="alertas-cell">' + (alertas.length ? alertas.join(' ') : '') + '</td>';

      tbody.appendChild(tr);
    });

    $('sumEstudiantes').textContent = estudiantes.length;
    $('sumC1').textContent = sumC1;
    $('sumC2').textContent = sumC2;
    $('sumC3').textContent = sumC3;
    $('sumEntregas').textContent = sumEntregas;
  }

  // ===== Vista detalle =====
  function abrirDetalle(idx) {
    estudianteActual = idx;
    var est = estudiantes[idx];

    $('detailName').textContent = est.nombre;
    var avance = (est.avance !== null && est.avance !== undefined && est.avance !== '')
      ? (Math.round(est.avance * 100) + '%') : '—';
    var entregas = entregasDrive(est);
    $('detailAvance').textContent = 'Avance: ' + avance + ' · ' + entregas + '/3 comentarios con entrega final';

    // Alertas
    var alertas = [];
    ['c1', 'c2', 'c3'].forEach(function (k) {
      if (est[k] && est[k].alertas && est[k].alertas.length) {
        alertas = alertas.concat(est[k].alertas);
      }
    });
    var alertasCard = $('detailAlertasCard');
    if (alertas.length) {
      alertasCard.hidden = false;
      $('detailAlertas').innerHTML = alertas.map(function (a) {
        return '<div class="alerta-item">' + esc(a) + '</div>';
      }).join('');
    } else {
      alertasCard.hidden = true;
    }

    // Comentarios
    renderComentarios(est);

    // Portafolio
    $('pfF').value = (est.portafolio && est.portafolio.f !== null && est.portafolio.f !== undefined) ? est.portafolio.f : '';
    $('pfTotal45').value = (est.portafolio && est.portafolio.total45 !== null && est.portafolio.total45 !== undefined) ? est.portafolio.total45 : '';
    $('pfAvance').value = (est.avance !== null && est.avance !== undefined && est.avance !== '') ? est.avance : 0.1666;

    // Drive
    renderDrive(est);

    $('saveStatus').textContent = '';
    mostrarVista('detail');
  }

  function renderComentarios(est) {
    var container = $('comentariosContainer');
    container.innerHTML = '';

    var defs = [
      { key: 'c1', label: 'Comentario 1 — Microeconomía', cls: 'c1' },
      { key: 'c2', label: 'Comentario 2 — Macroeconomía', cls: 'c2' },
      { key: 'c3', label: 'Comentario 3 — Economía Internacional', cls: 'c3' }
    ];

    defs.forEach(function (def) {
      var c = est[def.key] || {};
      var notas = c.notas || {};
      var total = (c.total !== null && c.total !== undefined && c.total !== '') ? c.total : '—';
      var palabras = c.palabras;
      var palabrasWarn = (palabras !== null && palabras !== undefined && palabras !== '' && Number(palabras) > 800);
      var palabrasVal = (palabras !== null && palabras !== undefined) ? palabras : '';
      var palabrasLabel = palabrasWarn ? 'Palabras <span class="warn">⚠</span>' : 'Palabras';

      var card = document.createElement('section');
      card.className = 'card comentario-card ' + def.cls;
      card.innerHTML =
        '<div class="comentario-head">' +
          '<span class="comentario-tag">' + def.label + '</span>' +
          '<span class="comentario-total">Total: <span data-total="' + def.key + '">' + total + '</span> /14</span>' +
        '</div>' +
        '<div class="form-grid">' +
          '<div class="form-field full"><label>Título del artículo</label>' +
            '<input type="text" data-c="' + def.key + '" data-field="titulo" value="' + escAttr(c.titulo || '') + '"></div>' +
          '<div class="form-field"><label>Fuente</label>' +
            '<input type="text" data-c="' + def.key + '" data-field="fuente" value="' + escAttr(c.fuente || '') + '"></div>' +
          '<div class="form-field"><label>F. publicación</label>' +
            '<input type="date" data-c="' + def.key + '" data-field="fPub" value="' + escAttr(c.fPub || '') + '"></div>' +
          '<div class="form-field"><label>F. elaboración</label>' +
            '<input type="date" data-c="' + def.key + '" data-field="fElab" value="' + escAttr(c.fElab || '') + '"></div>' +
          '<div class="form-field"><label>' + palabrasLabel + '</label>' +
            '<input type="number" data-c="' + def.key + '" data-field="palabras" value="' + escAttr(palabrasVal) + '"></div>' +
          '<div class="form-field"><label>Concepto clave</label>' +
            '<input type="text" data-c="' + def.key + '" data-field="concepto" value="' + escAttr(c.concepto || '') + '"></div>' +
          '<div class="form-field"><label>Estatus</label>' +
            '<input type="text" data-c="' + def.key + '" data-field="estatus" value="' + escAttr(c.estatus || '') + '" placeholder="R1, R2, Final…"></div>' +
        '</div>' +
        '<div class="notas-grid">' +
          '<div class="nota-input"><label>A /3</label><input type="number" min="0" max="3" data-c="' + def.key + '" data-nota="A" value="' + escAttr(notas.A !== null && notas.A !== undefined ? notas.A : '') + '"></div>' +
          '<div class="nota-input"><label>B /2</label><input type="number" min="0" max="2" data-c="' + def.key + '" data-nota="B" value="' + escAttr(notas.B !== null && notas.B !== undefined ? notas.B : '') + '"></div>' +
          '<div class="nota-input"><label>C /3</label><input type="number" min="0" max="3" data-c="' + def.key + '" data-nota="C" value="' + escAttr(notas.C !== null && notas.C !== undefined ? notas.C : '') + '"></div>' +
          '<div class="nota-input"><label>D /3</label><input type="number" min="0" max="3" data-c="' + def.key + '" data-nota="D" value="' + escAttr(notas.D !== null && notas.D !== undefined ? notas.D : '') + '"></div>' +
          '<div class="nota-input"><label>E /3</label><input type="number" min="0" max="3" data-c="' + def.key + '" data-nota="E" value="' + escAttr(notas.E !== null && notas.E !== undefined ? notas.E : '') + '"></div>' +
        '</div>';

      container.appendChild(card);
    });
  }

  function renderDrive(est) {
    var container = $('driveContainer');
    container.innerHTML = '';

    var defs = [
      { key: 'c1', label: 'C1 — Microeconomía' },
      { key: 'c2', label: 'C2 — Macroeconomía' },
      { key: 'c3', label: 'C3 — Economía Internacional' }
    ];

    var grid = document.createElement('div');
    grid.className = 'drive-grid';

    defs.forEach(function (def) {
      var files = (est.drive && est.drive[def.key]) ? est.drive[def.key] : [];
      var col = document.createElement('div');
      col.className = 'drive-col';
      col.innerHTML = '<h4>' + def.label + ' <span class="th-sub">(' + files.length + ')</span></h4>';

      var filesDiv = document.createElement('div');
      filesDiv.className = 'drive-files';
      filesDiv.setAttribute('data-drive', def.key);

      if (files.length === 0) {
        filesDiv.innerHTML = '<div class="drive-empty">Sin archivos en Entrega final</div>';
      } else {
        files.forEach(function (f, i) {
          var item = document.createElement('div');
          item.className = 'drive-file';
          item.innerHTML =
            '<span class="file-name">' + esc(f.nombre) + '</span>' +
            '<span class="file-tipo ' + (f.tipo === 'PDF' ? 'pdf' : '') + '">' + esc(f.tipo || '') + '</span>' +
            '<button type="button" class="file-del" data-drive="' + def.key + '" data-idx="' + i + '" title="Eliminar archivo" aria-label="Eliminar archivo">&times;</button>';
          filesDiv.appendChild(item);
        });
      }
      col.appendChild(filesDiv);

      // Añadir archivo
      var add = document.createElement('div');
      add.className = 'drive-add';
      add.innerHTML =
        '<input type="text" placeholder="Nombre del archivo" data-add-name="' + def.key + '">' +
        '<select data-add-tipo="' + def.key + '"><option value="PDF">PDF</option><option value="Doc">Doc</option></select>' +
        '<button type="button" data-add-btn="' + def.key + '">Añadir</button>';
      col.appendChild(add);

      grid.appendChild(col);
    });

    container.appendChild(grid);
  }

  // ===== Guardar detalle =====
  function guardarDetalle() {
    if (estudianteActual === null) return;
    var est = estudiantes[estudianteActual];

    // Comentarios
    ['c1', 'c2', 'c3'].forEach(function (k) {
      var c = est[k] || (est[k] = { titulo: '', fuente: '', fPub: '', fElab: '', palabras: '', concepto: '', estatus: '', notas: { A: null, B: null, C: null, D: null, E: null }, total: null, alertas: [] });
      if (!c.notas) c.notas = { A: null, B: null, C: null, D: null, E: null };
      var inputs = document.querySelectorAll('[data-c="' + k + '"]');
      inputs.forEach(function (inp) {
        var field = inp.getAttribute('data-field');
        if (field) {
          c[field] = inp.value;
        }
      });
      // Notas
      ['A', 'B', 'C', 'D', 'E'].forEach(function (letra) {
        var inp = document.querySelector('[data-c="' + k + '"][data-nota="' + letra + '"]');
        if (inp) {
          var v = inp.value;
          c.notas[letra] = (v === '' || v === null || v === undefined) ? null : Number(v);
        }
      });
      // Total = suma de notas
      var suma = 0, hay = false;
      ['A', 'B', 'C', 'D', 'E'].forEach(function (letra) {
        if (c.notas[letra] !== null && c.notas[letra] !== undefined) { suma += c.notas[letra]; hay = true; }
      });
      c.total = hay ? suma : null;
      // Actualizar total en el DOM
      var totalEl = document.querySelector('[data-total="' + k + '"]');
      if (totalEl) totalEl.textContent = (c.total !== null) ? c.total : '—';
    });

    // Portafolio
    est.portafolio = est.portafolio || { f: null, total45: null };
    var fVal = $('pfF').value;
    est.portafolio.f = (fVal === '') ? null : Number(fVal);
    var t45 = $('pfTotal45').value;
    est.portafolio.total45 = (t45 === '') ? null : Number(t45);

    // Avance
    var av = $('pfAvance').value;
    est.avance = (av === '') ? 0.1666 : Number(av);

    // Drive (leer del DOM)
    ['c1', 'c2', 'c3'].forEach(function (k) {
      est.drive = est.drive || { c1: [], c2: [], c3: [] };
      var filesDiv = document.querySelector('[data-drive="' + k + '"]');
      var files = [];
      if (filesDiv) {
        var items = filesDiv.querySelectorAll('.drive-file');
        items.forEach(function (it) {
          var name = it.querySelector('.file-name').textContent;
          var tipo = it.querySelector('.file-tipo').textContent;
          files.push({ nombre: name, tipo: tipo });
        });
      }
      est.drive[k] = files;
    });

    // Persistir
    persistirTodo().then(function () {
      logEdicion(est.nombre, 'detalle', 'guardado');
      var st = $('saveStatus');
      st.textContent = storageMode === 'cloud' ? 'Guardado en la nube ✓' : 'Guardado localmente ✓';
      st.className = 'save-status';
      setTimeout(function () { st.textContent = ''; }, 2500);
      renderGeneral();
    }).catch(function () {
      var st = $('saveStatus');
      st.textContent = 'Error al guardar';
      st.className = 'save-status error';
    });
  }

  // ===== Añadir / eliminar archivo Drive =====
  function addDriveFile(key) {
    var nameInput = document.querySelector('[data-add-name="' + key + '"]');
    var tipoSelect = document.querySelector('[data-add-tipo="' + key + '"]');
    var name = nameInput.value.trim();
    if (!name) return;
    var tipo = tipoSelect.value;

    var filesDiv = document.querySelector('[data-drive="' + key + '"]');
    var empty = filesDiv.querySelector('.drive-empty');
    if (empty) empty.remove();

    var item = document.createElement('div');
    item.className = 'drive-file';
    item.innerHTML =
      '<span class="file-name">' + esc(name) + '</span>' +
      '<span class="file-tipo ' + (tipo === 'PDF' ? 'pdf' : '') + '">' + esc(tipo) + '</span>' +
      '<button type="button" class="file-del" data-drive="' + key + '" data-idx="' + filesDiv.children.length + '" title="Eliminar archivo" aria-label="Eliminar archivo">&times;</button>';
    filesDiv.appendChild(item);
    nameInput.value = '';
  }

  function removeDriveFile(key, idx) {
    var filesDiv = document.querySelector('[data-drive="' + key + '"]');
    var items = filesDiv.querySelectorAll('.drive-file');
    if (items[idx]) items[idx].remove();
    if (filesDiv.querySelectorAll('.drive-file').length === 0) {
      filesDiv.innerHTML = '<div class="drive-empty">Sin archivos en Entrega final</div>';
    }
  }

  // ===== Backup JSON =====
  function descargarBackup() {
    var backup = {
      _meta: {
        app: 'seguimiento_ia_ib',
        exportDate: new Date().toISOString(),
        storageMode: storageMode
      },
      estudiantes: estudiantes
    };
    var blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var today = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = 'seguimiento_ia_ib_backup_' + today + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ===== Importación de evaluaciones (JSON) =====
  var importModo = 'individual'; // 'individual' | 'masivo'

  // Normaliza un nombre para comparación: minúsculas, sin tildes, espacios colapsados.
  // Ej.: "renata guedez" NO coincide con "RENATA GUEDES" (guedez != guedes).
  function normalizarNombre(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function buscarEstudiante(nombre) {
    var n = normalizarNombre(nombre);
    for (var i = 0; i < estudiantes.length; i++) {
      if (normalizarNombre(estudiantes[i].nombre) === n) return i;
    }
    return -1;
  }

  // Normaliza el campo "comentario": acepta 1, "1", "C1", "c1", "Comentario 1", "comentario1".
  // Devuelve 'c1' | 'c2' | 'c3' | null.
  function normalizarComentario(valor) {
    if (valor === undefined || valor === null) return null;
    var s = String(valor).trim().toUpperCase();
    var m = s.match(/^(?:C|COMENTARIO)\s*([123])$/);
    if (m) return 'c' + m[1];
    if (/^[123]$/.test(s)) return 'c' + s;
    return null;
  }

  // Validación estricta de un objeto de evaluación JSON.
  // Devuelve { ok, errores[], idx, cKey, suma, hayNota }.
  function validarEvaluacion(obj) {
    var errores = [];
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
      return { ok: false, errores: ['El JSON no es un objeto válido.'] };
    }

    // Estudiante: si el JSON lo trae, debe coincidir con la lista (comparación normalizada).
    // Si no lo trae y estamos en vista detalle, se usa el estudiante abierto.
    var idx = -1;
    if (obj.estudiante !== undefined && obj.estudiante !== null && String(obj.estudiante).trim() !== '') {
      idx = buscarEstudiante(obj.estudiante);
      if (idx === -1) errores.push('Estudiante no encontrado: "' + obj.estudiante + '".');
    } else if (importModo === 'individual' && estudianteActual !== null) {
      idx = estudianteActual;
    } else {
      errores.push('Falta el campo "estudiante" o no coincide con la lista.');
    }

    // Comentario: 1, 2 o 3 (acepta también "C1", "c1", "Comentario 1")
    var cKey = normalizarComentario(obj.comentario);
    if (!cKey) errores.push('El campo "comentario" debe ser 1, 2 o 3 (o "C1", "C2", "C3").');

    // Notas: A 0-3, B 0-2, C 0-3, D 0-3, E 0-3
    var limites = { A: 3, B: 2, C: 3, D: 3, E: 3 };
    var suma = 0, hayNota = false;
    var notas = obj.notas;
    if (!notas || typeof notas !== 'object') {
      errores.push('Falta el campo "notas" (objeto con A, B, C, D, E).');
    } else {
      ['A', 'B', 'C', 'D', 'E'].forEach(function (l) {
        var v = notas[l];
        if (v === undefined || v === null || v === '') return;
        v = Number(v);
        if (isNaN(v) || v < 0 || v > limites[l]) {
          errores.push('Nota ' + l + ' inválida: debe ser 0-' + limites[l] + '.');
        } else {
          suma += v; hayNota = true;
        }
      });
      if (!hayNota) errores.push('El campo "notas" no tiene valores válidos.');
    }

    // Palabras: número >= 0
    if (obj.palabras !== undefined && obj.palabras !== null && obj.palabras !== '') {
      var p = Number(obj.palabras);
      if (isNaN(p) || p < 0) errores.push('El campo "palabras" debe ser un número mayor o igual a 0.');
    }

    // Alertas: arreglo de textos
    if (obj.alertas !== undefined && obj.alertas !== null) {
      if (!Array.isArray(obj.alertas)) {
        errores.push('El campo "alertas" debe ser un arreglo de textos.');
      } else {
        obj.alertas.forEach(function (a) {
          if (typeof a !== 'string') errores.push('Cada alerta debe ser un texto.');
        });
      }
    }

    return { ok: errores.length === 0, errores: errores, idx: idx, cKey: cKey, suma: suma, hayNota: hayNota };
  }

  // Importa una o varias evaluaciones desde un string JSON.
  // Acepta un objeto único o un arreglo de objetos.
  function importarEvaluacion(jsonStr) {
    var results = $('importResults');
    results.innerHTML = '';

    var parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      results.innerHTML = '<div class="import-err">JSON inválido: ' + esc(e.message) + '</div>';
      return;
    }

    var items = Array.isArray(parsed) ? parsed : [parsed];
    var okCount = 0, errCount = 0;
    var importados = [];

    items.forEach(function (obj) {
      var v = validarEvaluacion(obj);
      var nombreRef = (obj && typeof obj === 'object' && obj.estudiante) ? obj.estudiante : '(estudiante actual)';
      if (!v.ok) {
        errCount++;
        results.innerHTML += '<div class="import-err">' + esc(nombreRef) + ': ' + esc(v.errores.join('; ')) + '</div>';
        return;
      }

      // Aplicar al estudiante
      var est = estudiantes[v.idx];
      var c = est[v.cKey] || (est[v.cKey] = {});
      if (obj.titulo !== undefined) c.titulo = String(obj.titulo);
      if (obj.fuente !== undefined) c.fuente = String(obj.fuente);
      if (obj.fechaPublicacion !== undefined) c.fPub = String(obj.fechaPublicacion);
      if (obj.fechaElaboracion !== undefined) c.fElab = String(obj.fechaElaboracion);
      if (obj.palabras !== undefined && obj.palabras !== null && obj.palabras !== '') c.palabras = Number(obj.palabras);
      if (obj.conceptoClave !== undefined) c.concepto = String(obj.conceptoClave);
      if (obj.estatus !== undefined) c.estatus = String(obj.estatus);
      if (obj.retroalimentacion !== undefined) c.retroalimentacion = String(obj.retroalimentacion);
      if (!c.notas) c.notas = {};
      ['A', 'B', 'C', 'D', 'E'].forEach(function (l) {
        if (obj.notas && obj.notas[l] !== undefined && obj.notas[l] !== null && obj.notas[l] !== '') {
          c.notas[l] = Number(obj.notas[l]);
        }
      });
      // Total siempre recalculado = suma A-E (regla de la rúbrica)
      c.total = v.suma;
      if (Array.isArray(obj.alertas)) c.alertas = obj.alertas.slice();

      okCount++;
      importados.push({ est: est, cKey: v.cKey, total: c.total });
      results.innerHTML += '<div class="import-ok">✓ ' + esc(est.nombre) + ' — ' + esc(v.cKey.toUpperCase()) + ' importado (total ' + c.total + '/14).</div>';
    });

    if (okCount > 0) {
      persistirTodo().then(function () {
        importados.forEach(function (imp) {
          logEdicion(imp.est.nombre, 'importacion_' + imp.cKey, 'total ' + imp.total);
        });
        renderGeneral();
        if (estudianteActual !== null) abrirDetalle(estudianteActual);
        var st = $('saveStatus');
        if (st) {
          st.textContent = okCount + ' evaluación(es) importada(s) ✓';
          st.className = 'save-status';
          setTimeout(function () { st.textContent = ''; }, 3000);
        }
        if (errCount === 0) cerrarModalImportar();
      }).catch(function () {
        results.innerHTML += '<div class="import-err">Error al guardar en la nube. Revisa la conexión.</div>';
      });
    }
  }

  // ===== Modal de importación =====
  function abrirModalImportar(modo) {
    importModo = modo;
    $('importModalTitle').textContent = (modo === 'masivo')
      ? 'Importación masiva de evaluaciones'
      : 'Importar evaluación';
    var ta = $('importTextarea');
    ta.value = '';
    $('importResults').innerHTML = '';
    ta.placeholder = (modo === 'individual' && estudianteActual !== null)
      ? '{"comentario":1,"titulo":"...","notas":{"A":3,"B":2,"C":2,"D":2,"E":2}}'
      : '[{"estudiante":"EMILIA TORRES","comentario":1,"titulo":"...","notas":{"A":3,"B":2,"C":2,"D":2,"E":2}}]';
    $('importModal').hidden = false;
    ta.focus();
  }

  function cerrarModalImportar() {
    $('importModal').hidden = true;
  }

  // ===== Navegación de vistas =====
  function mostrarVista(vista) {
    $('viewGeneral').classList.toggle('active', vista === 'general');
    $('viewDetail').classList.toggle('active', vista === 'detail');
    window.scrollTo(0, 0);
  }

  // ===== Escapado =====
  function esc(s) {
    return String(s === null || s === undefined ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escAttr(s) {
    return esc(s).replace(/"/g, '&quot;');
  }

  // ===== Eventos =====
  function bindEvents() {
    $('loginForm').addEventListener('submit', function (e) { e.preventDefault(); doLogin(); });
    $('btnLogout').addEventListener('click', doLogout);
    $('btnBack').addEventListener('click', function () { mostrarVista('general'); });
    $('btnSaveDetail').addEventListener('click', guardarDetalle);
    $('btnBackup').addEventListener('click', descargarBackup);

    // Importación de evaluaciones
    $('btnImportarMasiva').addEventListener('click', function () { abrirModalImportar('masivo'); });
    $('btnImportar').addEventListener('click', function () { abrirModalImportar('individual'); });
    $('importModalClose').addEventListener('click', cerrarModalImportar);
    $('importModalCancel').addEventListener('click', cerrarModalImportar);
    $('importModalConfirm').addEventListener('click', function () {
      importarEvaluacion($('importTextarea').value);
    });
    // Cerrar con Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !$('importModal').hidden) cerrarModalImportar();
    });
    // Cerrar al hacer clic fuera del modal
    $('importModal').addEventListener('click', function (e) {
      if (e.target === $('importModal')) cerrarModalImportar();
    });

    // Delegación para añadir/eliminar archivos del Drive
    $('driveContainer').addEventListener('click', function (e) {
      var del = e.target.closest('.file-del');
      if (del) {
        removeDriveFile(del.getAttribute('data-drive'), Number(del.getAttribute('data-idx')));
        return;
      }
      var addBtn = e.target.closest('[data-add-btn]');
      if (addBtn) {
        addDriveFile(addBtn.getAttribute('data-add-btn'));
      }
    });
  }

  // ===== Service Worker =====
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('SW registration falló:', err);
      });
    }
  }

  // ===== Init =====
  function init() {
    bindEvents();
    registerSW();

    if (checkSession()) {
      showApp();
    } else {
      $('loginScreen').hidden = false;
      $('loginKey').focus();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
