import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteImage } from '../../lib/aws';

interface DeleteRequestBody {
  key: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  try {
    const bucketName = process.env.NEXT_PRIVATE_AWS_S3_BUCKET;
    const { key }: DeleteRequestBody = req.body;
    if (!bucketName || !key) {
      return res.status(400).json({ error: 'Bucket name or key not provided' });
    }
    if (typeof key !== 'string') {
      return res.status(400).json({ error: 'Invalid key format' });
    }
    await deleteImage(bucketName, key);
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Error deleting image', details: (error as Error).message });
  }
}
