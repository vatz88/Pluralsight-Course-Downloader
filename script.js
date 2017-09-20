$(function () {

  $(document).keydown(function (e) {

    if (e.key === "s") {

      var link = $("#vjs_video_3_html5_api").attr("src");

      var coursename = $("#course-title-link").text();

      var folder = $("li.selected").parents("ul").prev("header").children("div");
      folder = folder.eq(0).text() + " - " + folder.eq(1).find("h2").text();

      var filename = $("li.selected").eq(1).index() + 1 + " - " + $("#module-clip-title").text().split(":").pop().trim() + "." + link.split("?")[0].split(".").pop();

      chrome.runtime.sendMessage({
        greeting: "download",
        link: link,
        filename: "Pluralsight/" + coursename + "/" + folder + "/" + filename
      }, function (response) {
        console.log(response.farewell);
      });

    }

  });

});