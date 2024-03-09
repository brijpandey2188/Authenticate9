exports.fileinfo = (base64) => {
    let splitData = base64.split(";");
    let mimeType = splitData[0].split(":")[1];
    let fileExtension = mimeType.split("/")[1];

    return {
        mime: mimeType,
        ext: fileExtension,
    };
};