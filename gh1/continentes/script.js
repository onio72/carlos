// script.js
// Este archivo implementa la lógica del juego de arrastrar y soltar

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  const labels = document.querySelectorAll('.label');
  const dropZones = document.querySelectorAll('.drop-zone');
  const scoreDisplay = document.getElementById('score');
  const checkBtn = document.getElementById('check-btn');
  const resetBtn = document.getElementById('reset-btn');
  const labelsContainer = document.getElementById('labels-container');

  // Estado del juego
  let score = 0.0;
  const totalZones = dropZones.length; // Total de zonas para calcular puntuación sobre 10

  /**
   * Restablece todas las zonas y etiquetas al estado inicial
   */
  function resetGame() {
    score = 0.0;
    scoreDisplay.textContent = score.toFixed(1);
    // Restaurar zonas
    dropZones.forEach(zone => {
      zone.classList.remove('correct', 'incorrect', 'over');
      zone.dataset.filled = '';
      zone.dataset.labelName = '';
      // Si tiene una etiqueta dentro, devuélvela al contenedor original
      const childLabel = zone.querySelector('.label');
      if (childLabel) {
        childLabel.removeAttribute('style');
        // Determinar a qué columna pertenece la etiqueta
        const labelName = childLabel.dataset.name;
        const isOcean = labelName.includes('Océano');
        const targetColumn = isOcean ? 
          document.querySelector('.labels-column:nth-child(2)') : 
          document.querySelector('.labels-column:nth-child(1)');
        targetColumn.appendChild(childLabel);
      }
    });
    // Restaurar las etiquetas para que sean arrastrables
    labels.forEach(label => {
      label.setAttribute('draggable', 'true');
    });
    // Habilitar el botón de comprobación
    checkBtn.disabled = false;
  }

  /**
   * Gestiona el inicio del arrastre de una etiqueta
   */
  function handleDragStart(ev) {
    ev.dataTransfer.setData('text/plain', ev.target.id);
    ev.dataTransfer.effectAllowed = 'move';
  }

  /**
   * Gestiona cuando una etiqueta entra en una zona
   */
  function handleDragEnter(ev) {
    ev.preventDefault();
    this.classList.add('over');
  }

  /**
   * Gestiona cuando una etiqueta sale de una zona
   */
  function handleDragLeave(ev) {
    this.classList.remove('over');
  }

  /**
   * Permite el soltado en una zona
   */
  function handleDragOver(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  }

  /**
   * Gestiona el soltado en una zona
   */
  function handleDrop(ev) {
    ev.preventDefault();
    this.classList.remove('over');
    const labelId = ev.dataTransfer.getData('text/plain');
    const label = document.getElementById(labelId);
    if (!label) return;
    // Si la zona ya tiene una etiqueta, devuélvela al contenedor de etiquetas
    const existing = this.querySelector('.label');
    if (existing) {
      existing.removeAttribute('style');
      // Determinar a qué columna pertenece la etiqueta
      const existingLabelName = existing.dataset.name;
      const isOcean = existingLabelName.includes('Océano');
      const targetColumn = isOcean ? 
        document.querySelector('.labels-column:nth-child(2)') : 
        document.querySelector('.labels-column:nth-child(1)');
      targetColumn.appendChild(existing);
    }
    // Colocar la nueva etiqueta en la zona
    this.appendChild(label);
    // Centrar la etiqueta dentro de la zona
    label.style.position = 'absolute';
    label.style.top = '50%';
    label.style.left = '50%';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.cursor = 'default';
    // Marcar la zona como ocupada
    this.dataset.filled = 'true';
    this.dataset.labelName = label.dataset.name;
  }

  /**
   * Comprueba las respuestas y calcula la puntuación de 0 a 10
   */
  function checkAnswers() {
    let correctAnswers = 0;
    
    dropZones.forEach(zone => {
      // Limpiar estilos anteriores
      zone.classList.remove('correct', 'incorrect');
      const expected = zone.dataset.target;
      const filled = zone.dataset.filled === 'true';
      const labelName = zone.dataset.labelName;
      
      if (filled && labelName && labelName === expected) {
        zone.classList.add('correct');
        correctAnswers++;
      } else {
        zone.classList.add('incorrect');
      }
    });
    
    // Calcular puntuación de 0 a 10 con una cifra decimal
    score = (correctAnswers / totalZones) * 10;
    scoreDisplay.textContent = score.toFixed(1);
    
    // Deshabilitar el botón después de comprobar para evitar recalcular múltiples veces
    checkBtn.disabled = true;
  }

  // Asignar eventos a etiquetas
  labels.forEach(label => {
    label.addEventListener('dragstart', handleDragStart);
  });

  // Asignar eventos a zonas de soltado
  dropZones.forEach(zone => {
    zone.addEventListener('dragenter', handleDragEnter);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
  });

  // Asignar evento al botón de comprobación
  checkBtn.addEventListener('click', checkAnswers);
  resetBtn.addEventListener('click', resetGame);
});