import Post from "../models/Post";

const slugify = async (title: string): Promise<string> => {
  const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  let uniqueSlug = slug;
  let counter = 1;
  
  while (await Post.exists({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
};

export default slugify;