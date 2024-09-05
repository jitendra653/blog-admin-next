import Post from '../../../models/Post';
import { connectMongoDB } from "@/lib/mongodb";
import slugify from '../../../utils/slugify';
import { NextRequest, NextResponse } from "next/server";

interface PostData {
  title: string;
  description: string;
  image: string;
  content: string;
  category: string;
  tags: string[];
  status: string
}

export const GET = async (req: NextRequest) => {
  try {
    await connectMongoDB();
    const posts = await Post.countDocuments({});
    const draftpost = await Post.countDocuments({ status: "Draft" });
    const tags = await Post.distinct("tags", {});
    const category = await Post.distinct("category", {});


    const categoryOverview = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          value: { $sum: 1 },
        },
      },
    ]);

    const tagsOverview = await Post.aggregate([
      {
        $group: {
          _id: "$tags",
          value: { $sum: 1 },
        },
      },
    ]);
    const categoryOverviewData: any = [];
    categoryOverview.map((value, i) => {
      (value._id != null) && categoryOverviewData.push({ id: i, value: value?.value, label: value?._id })
    })

    function arrayToString(arr) {
      if (arr.length === 0) return '';
      if (arr.length === 1) return arr[0];
      if (arr.length === 2) return arr.join(' & ');

      let lastItem = arr.pop();
      return arr.join(', ') + ' & ' + lastItem;
    }
    const tagsOverviewData: any = [];
    tagsOverview.map((value) => {
      tagsOverviewData.push({ text: arrayToString(value?._id || []), value: value?.value })
    })
    return NextResponse.json({ tagsOverview: tagsOverviewData, categoryOverview: categoryOverviewData, totalBlogs: posts, draftBlogs: draftpost, totalTagsCount: tags.length, totalTags: tags, totalCategory: category, totalCategoryCount: category.length }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts', message: error.message }, { status: 500 });
  }
};

export async function POST(req: NextRequest) {
  try {
    const { title, description, image, content, category, tags, status }: PostData = await req.json();
    await connectMongoDB();
    const slug = await slugify(title);
    await Post.create({
      title,
      slug,
      description,
      content,
      image,
      category,
      tags,
      status
    });

    return NextResponse.json({ message: "Post saved." }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return NextResponse.json({ error: error.message, message: "An error occurred while saving the post." }, { status: 500 });
  }
}
