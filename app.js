// =========================
// CSS
// =========================

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';


// =========================
// Imports
// =========================

import lintModule from 'bpmn-js-bpmnlint';
import bpmnlintConfig from './bundled-config.js';

import CamundaBpmnModeler
  from 'camunda-bpmn-js/lib/camunda-platform/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';


// =========================
// Create Modeler
// =========================

const modeler = new CamundaBpmnModeler({
  container: '#canvas',

  propertiesPanel: {
    parent: '#properties'
  },

  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    lintModule
  ],

  linting: {
    bpmnlint: bpmnlintConfig
  }
});
const commandStack =
  modeler.get('commandStack');

const undoBtn =
  document.getElementById('undo-btn');

const redoBtn =
  document.getElementById('redo-btn');

undoBtn.onclick = () => {
  commandStack.undo();
};

redoBtn.onclick = () => {
  commandStack.redo();
};

// =========================
// Event Bus
// =========================

const eventBus = modeler.get('eventBus');

eventBus.on('linting.completed', function (event) {

  const tbody =
    document.getElementById('problems-list');

  tbody.innerHTML = '';

  const issues =
    event.issues || {};

  // -----------------------
  // Render bpmnlint issues
  // -----------------------

  Object.entries(issues)
    .forEach(([id, elementIssues]) => {

      elementIssues.forEach(issue => {

        const row =
          document.createElement('tr');

        row.innerHTML = `
          <td>${issue.category}</td>
          <td>${id}</td>
          <td>${issue.message}</td>
        `;

        row.onclick = () => {

          const element =
            modeler
              .get('elementRegistry')
              .get(id);

          if (element) {

            modeler
              .get('selection')
              .select(element);

            modeler
              .get('canvas')
              .scrollToElement(element);
          }
        };

        tbody.appendChild(row);
      });
    });

  // -----------------------
  // Render Custom Issues
  // -----------------------

  const customIssues =
    getCustomIssues();

  customIssues.forEach(issue => {

    const row =
      document.createElement('tr');

    row.innerHTML = `
      <td>${issue.category}</td>
      <td>${issue.id}</td>
      <td>${issue.message}</td>
    `;

    row.onclick = () => {

      const element =
        modeler
          .get('elementRegistry')
          .get(issue.id);

      if (element) {

        modeler
          .get('selection')
          .select(element);

        modeler
          .get('canvas')
          .scrollToElement(element);
      }
    };

    tbody.appendChild(row);
  });
});


// =========================
// Custom Validations
// =========================

function getCustomIssues() {

  const issues = [];

  const elementRegistry =
    modeler.get('elementRegistry');

  const processes =
    elementRegistry.filter(
      e => e.type === 'bpmn:Process'
    );

  processes.forEach(process => {

    const businessObject =
      process.businessObject;

    const ttl =
      businessObject.get(
        'camunda:historyTimeToLive'
      );

    if (!ttl) {

      issues.push({
        id: process.id,
        category: 'error',
        message:
          'Process has no historyTimeToLive'
      });
    }
  });

  return issues;
}


// =========================
// Output Panel
// =========================

function log(message) {

  const output =
    document.getElementById('output-text');

  output.textContent +=
    message + '\n';
}


// =========================
// Tabs
// =========================

const problemsTab =
  document.getElementById('problems-tab');

const outputTab =
  document.getElementById('output-tab');

const problemsPanel =
  document.getElementById('problems-panel');

const outputPanel =
  document.getElementById('output-panel');

problemsTab.onclick = () => {
  problemsPanel.style.display =
    'block';

  outputPanel.style.display =
    'none';
};

outputTab.onclick = () => {
  problemsPanel.style.display =
    'none';

  outputPanel.style.display =
    'block';
};


// =========================
// Initial BPMN XML
// =========================

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
id="Definitions_1"
targetNamespace="http://bpmn.io/schema/bpmn">

<bpmn:process
  id="Process_1"
  isExecutable="true">

  <bpmn:startEvent
    id="StartEvent_1" />

</bpmn:process>

<bpmndi:BPMNDiagram
  id="BPMNDiagram_1">

<bpmndi:BPMNPlane
  id="BPMNPlane_1"
  bpmnElement="Process_1">

<bpmndi:BPMNShape
  id="StartEvent_1_di"
  bpmnElement="StartEvent_1">

<dc:Bounds
  x="180"
  y="120"
  width="36"
  height="36" />

</bpmndi:BPMNShape>

</bpmndi:BPMNPlane>

</bpmndi:BPMNDiagram>

</bpmn:definitions>`;


// =========================
// Import Diagram
// =========================

async function openDiagram() {

  try {

    await modeler.importXML(xml);

    modeler
      .get('canvas')
      .zoom('fit-viewport');

    log('Diagram loaded.');

  } catch (err) {

    console.error(err);

    log('Failed to load diagram.');
  }
}

openDiagram();