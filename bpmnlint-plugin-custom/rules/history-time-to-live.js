export default function() {

  function check(node, reporter) {

    if (node.$type !== 'bpmn:Process') {
      return;
    }

    const historyTimeToLive =
      node.get('camunda:historyTimeToLive');

    if (
      !historyTimeToLive ||
      historyTimeToLive.trim() === ''
    ) {
      reporter.report(
        node.id,
        'Process has no historyTimeToLive'
      );
    }
  }

 