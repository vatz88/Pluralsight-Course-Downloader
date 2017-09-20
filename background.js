flag = false;
filename = "";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "download") {
            filename = request.filename;
            flag = true;
            try {
                chrome.downloads.download({
                    url: request.link,
                    // filename: request.filename
                });
                sendResponse({
                    farewell: 'File: ' + request.filename + ' downloaded'
                });
            } catch (err) {
                alert("Error: " + err.message);
            }
        }
    });

var getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    if (flag) {
        flag = false;
        suggest({
            filename: filename
        });
    }
});