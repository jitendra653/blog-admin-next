import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk';
import { deleteImage } from '@/lib/aws';

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  region: process.env.AWS_S3_REGION!,
});

const s3 = new AWS.S3();

const listImages = async (bucket: string): Promise<string[]> => {
  const params: AWS.S3.ListObjectsV2Request = {
    Bucket: bucket,
    Prefix: '',
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    return data.Contents?.map(item => `https://${bucket}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${item.Key}`) || [];
  } catch (error) {
    console.error('Error fetching images from S3:', error);
    return [];
  }
};

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;

  if (!bucketName) {
    return res.status(400).json({ error: 'Bucket name is not defined' });
  }

  const images = await listImages(bucketName);
  return res.status(200).json({ images });
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;
    const { key }: { key: string } = req.body;

    if (!bucketName || !key) {
      return res.status(400).json({ error: 'Bucket name or key not provided' });
    }

    await deleteImage(bucketName, key);
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Error deleting image' });
  }
}
