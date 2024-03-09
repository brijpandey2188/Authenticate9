const s3 = require('../config/aws')
const utils = require("../utils/getfileinfo")

exports.uploadimagetos3 = async(image, fullpath ) => {
    try {
    const fileInfo = utils.fileinfo(image)

    const parentFolder = 'quiz-images/';

    const mediaData = image; // Replace with your actual base64-encoded data
    const mimeType = mediaData.split(";")[0].split(":")[1];

    let buffer;
    if (mimeType.startsWith("image/")) {
    // Handle image decoding
    buffer = Buffer.from(mediaData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    } else if (mimeType.startsWith("video/")) {
    // Handle video decoding
    buffer = Buffer.from(mediaData.replace(/^data:video\/\w+;base64,/, ""), 'base64');
    }

    // Convert base64 to a buffer
    //const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const fileName = fullpath+"."+fileInfo.ext
    // Prepare the parameters for S3 upload
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${parentFolder}${fileName}`,
        Body: buffer,
        ContentEncoding: 'base64',
        ACL: 'public-read', // Set the appropriate ACL based on your requirements
        ContentType: fileInfo.mime
    };
    
        // Upload the file to S3
        const data = await s3.s3.upload(params).promise();
        console.log(`Image uploaded successfully. File URL: ${data.Location}`);
        return data
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error
    }
}