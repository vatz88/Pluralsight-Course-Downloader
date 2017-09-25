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
                });
                sendResponse({
                    farewell: 'File: ' + filename + ' downloaded'
                });
            } catch (err) {
                alert("Error: " + err.message);
            }
        }
    });

chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
    if (flag) {
        flag = false;
        suggest({
            filename: filename
        });
    }
});