var updateButton = document.getElementById("update");
var dataPoints = document.getElementById("dataPoints");

const normalize = (input) => {
  return (((input + 1) / 2) * 100).toFixed(3);
};

document.addEventListener("DOMContentLoaded", function () {
  var knob = pureknob.createKnob(300, 300);
  knob.setProperty("angleStart", -0.75 * Math.PI);
  knob.setProperty("angleEnd", 0.75 * Math.PI);
  knob.setProperty("trackWidth", 0.4);
  knob.setProperty("valMin", 0);
  knob.setProperty("valMax", 100);
  knob.setProperty("colorFG", "#F2F2F2");
  const node = knob.node();
  const elem = document.getElementById("some_element");
  elem.appendChild(node);

  updateButton.addEventListener(
    "click",
    function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "update", function (resp) {
          if (resp.data.dataPoints !== 0) {
            knob.setValue(normalize(resp.data.calculatedScore));
            dataPoints.innerText =
              "Calculated from " +
              resp.data.dataPoints +
              " comments with a score of " +
              resp.data.calculatedScore.toFixed(3);
            return;
          }
          dataPoints.innerText = "Please load comments.";
        });
      });
    },
    false
  );
});
