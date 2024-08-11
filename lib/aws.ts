import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_S3_REGION as string,
});

const s3 = new AWS.S3();

interface S3Image {
  url: string;
  key: string;
}

export const listImages = async (bucket: string): Promise<S3Image[]> => {
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucket,
    Prefix: '',
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return (
      data.Contents?.map(item => ({
        url: `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${item.Key}`,
        key: item.Key as string,
      })) || []
    );
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    return [];
  }
};

export const uploadImage = async (bucket: string, file: File): Promise<string> => {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: bucket,
    Key: file.name,
    Body: file,
    ContentType: file.type,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};

export const deleteImage = async (bucket: string, key: string): Promise<void> => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: bucket,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};
