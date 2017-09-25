$(function () {

  $(document).keydown(function (e) {

    if (e.key === "s") {

      var link = $("#vjs_video_3_html5_api").attr("src");

      var coursename = $("#course-title-link").text();
      coursename = coursename.replace(/[\/:?><]/g, "");

      var folder = $("li.selected").parents("ul").prev("header").children("div").eq(1);
      folder = (folder.parents("section.module.open").eq(0).index() + 1) + " - " + folder.find("h2").text();
      folder = folder.replace(/[\/:?><]/g, "");

      var filename = $("li.selected").eq(1).index() + 1 + " - " + $("#module-clip-title").text().split(" : ").pop().trim() + "." + link.split("?")[0].split(".").pop();
      filename = filename.replace(/[\/:?><]/g, "");

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