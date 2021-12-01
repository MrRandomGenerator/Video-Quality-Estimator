chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  let sumScore = 0;

  msg.commentData.map((comment) => {
    sumScore += SentimentAnalysis.getAnalysisScore(comment).comparative;
  });

  sendResponse({
    calculatedScore: sumScore / msg.commentData.length,
    dataPoints: msg.commentData.length,
  });
});
