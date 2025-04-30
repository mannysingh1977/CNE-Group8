const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


const account = "<account name hided";
const accountKey = "<key hided>";

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
);


var containerName = 'democontainer1';

async function createContainer() {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    var blobName = "newblob" + new Date().getTime();
    var filePath = "./newblob.jpg";

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
}

createContainer();