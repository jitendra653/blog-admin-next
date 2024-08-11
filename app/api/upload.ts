import type { NextApiRequest, NextApiResponse } from 'next';
import { uploadImage } from '../../lib/aws';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
    const file = req.body.file;
    if (!bucketName || !file) {
      return res.status(400).json({ error: 'Bucket name or file not provided' });
    }
    const imageUrl = await uploadImage(bucketName, file);
    res.status(200).json({ url: imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Error uploading image' });
  }
}
