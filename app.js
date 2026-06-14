import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';

import CamundaBpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

const modeler = new CamundaBpmnModeler({
  container: '#canvas',
  propertiesPanel: {
    parent: '#properties'
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule
  ]
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
id="Definitions_1"
targetNamespace="http://bpmn.io/schema/bpmn">

<bpmn:process id="Process_1" isExecutable="true">
<bpmn:startEvent id="StartEvent_1"/>
</bpmn:process>

<bpmndi:BPMNDiagram id="BPMNDiagram_1">
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
height="36"/>

</bpmndi:BPMNShape>

</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>

</bpmn:definitions>`;

async function openDiagram() {
  try {
    await modeler.importXML(xml);
    modeler.get('canvas').zoom('fit-viewport');
  } catch (err) {
    console.error(err);
  }
}

openDiagram();