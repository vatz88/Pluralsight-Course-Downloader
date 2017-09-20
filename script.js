$(function () {
  console.log("Hey! script working!");
  $(document).keydown(function (e) {
    if (e.key === "s") {
      var link = $("#vjs_video_3_html5_api").attr("src");
      var fname = $("li.selected").eq(1).index() + 1 + " - " + $("#module-clip-title").text().split(":").pop().trim() + "." + link.split("?")[0].split(".").pop();
      chrome.runtime.sendMessage({
        greeting: "download",
        link: link,
        filename: fname
      }, function (response) {
        console.log(response.farewell);
      });
    }
  });
});