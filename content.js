function waitForEl(el) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(() => {
      if (document.querySelector(el)) {
        clearInterval(intervalId);
        resolve();
      }
    }, 500);
  });
}

waitForEl("#comments #header-author").then(() => {
  // comments should be loaded here
  chrome.runtime.sendMessage({ commentData: DOMtoString() });
});

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

function DOMtoString() {
  let comments = [];

  var commentCount = getElementByXpath(
    "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]"
  ).childElementCount;

  for (var i = 1; i < commentCount - 2; i++) {
    var commentText = getElementByXpath(
      "/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/ytd-comments/ytd-item-section-renderer/div[3]/ytd-comment-thread-renderer[" +
        i +
        "]/ytd-comment-renderer/div[3]/div[2]/ytd-expander/div/yt-formatted-string[2]"
    );
    comments.push(commentText.innerText);
  }

  return comments;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.runtime.sendMessage(
    { commentData: DOMtoString(), data: request },
    (resp) => {
      //console.log(resp);
      sendResponse({ commentData: DOMtoString(), data: resp });
    }
  );
  return true;
});
