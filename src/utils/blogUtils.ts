import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export async function getAllPosts(): Promise<CollectionEntry<"blog">[]> {
  const allBlogPosts = await getCollection("blog");

  return import.meta.env.PROD
    ? allBlogPosts.filter((post: CollectionEntry<"blog">) => !post.data.draft)
    : allBlogPosts;
}

export function sortPostsByDate(posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] {
  return [...posts].sort(
    (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );
}

export function sortPostsByPinAndDate(posts: CollectionEntry<"blog">[]): CollectionEntry<"blog">[] {
  const topPosts = posts.filter((blog: CollectionEntry<"blog">) => blog.data.badge === "Pin");
  const otherPosts = posts.filter((blog: CollectionEntry<"blog">) => blog.data.badge !== "Pin");

  const sortedTopPosts = sortPostsByDate(topPosts);
  const sortedOtherPosts = sortPostsByDate(otherPosts);

  return [...sortedTopPosts, ...sortedOtherPosts];
}

export function getTagsWithCount(posts: CollectionEntry<"blog">[]): Map<string, number> {
  const tagMap = new Map<string, number>();

  posts.forEach((post: CollectionEntry<"blog">) => {
    if (post.data.tags) {
      post.data.tags.forEach((tag: string) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    }
  });

  return tagMap;
}

export function getCategoriesWithPosts(posts: CollectionEntry<"blog">[]): Map<string, CollectionEntry<"blog">[]> {
  const categoryMap = new Map<string, CollectionEntry<"blog">[]>();

  posts.forEach((post: CollectionEntry<"blog">) => {
    if (post.data.categories) {
      post.data.categories.forEach((category: string) => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(post);
      });
    }
  });

  return categoryMap;
}

export function getPostsByYearAndMonth(posts: CollectionEntry<"blog">[]): Map<string, Map<string, CollectionEntry<"blog">[]>> {
  const postsByDate = new Map<string, Map<string, CollectionEntry<"blog">[]>>();

  posts.forEach((post: CollectionEntry<"blog">) => {
    const date = new Date(post.data.pubDate);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    if (!postsByDate.has(year)) {
      postsByDate.set(year, new Map<string, CollectionEntry<"blog">[]>());
    }

    const yearMap = postsByDate.get(year)!;
    if (!yearMap.has(month)) {
      yearMap.set(month, []);
    }

    yearMap.get(month)!.push(post);
  });

  return postsByDate;
}

export function generatePageLinks(totalPages: number): {
  active: string[];
  hidden: string[];
} {
  const pages = {
    active: [] as string[],
    hidden: [] as string[],
  };

  if (totalPages > 3) {
    pages.active.push("1");
    pages.active.push("...");
    pages.active.push(totalPages.toString());
    for (let i = 2; i <= totalPages - 1; i++) {
      pages.hidden.push(i.toString());
    }
  }
  else {
    for (let i = 1; i <= totalPages; i++) {
      pages.active.push(i.toString());
    }
  }

  return pages;
}

export async function getPostsWithStats(posts: CollectionEntry<"blog">[]): Promise<any[]> {
  return Promise.all(
    posts.map(async (blog: CollectionEntry<"blog">) => {
      const blogToRender = blog as any; // 解决 render() 缺失的类型错误
      const { remarkPluginFrontmatter } = await blogToRender.render();
      return {
        ...blog,
        remarkPluginFrontmatter: {
          readingTime: remarkPluginFrontmatter.readingTime,
          totalCharCount: remarkPluginFrontmatter.totalCharCount,
        },
      };
    }),
  );
}

export function getTagColorClass(count: number, max: number): string {
  const ratio = count / max;
  if (ratio > 0.8)
    return "tag-high";
  if (ratio > 0.6)
    return "tag-medium-high";
  if (ratio > 0.4)
    return "tag-medium";
  if (ratio > 0.2)
    return "tag-medium-low";
  return "tag-low";
}

export function getTagFontSize(count: number, max: number, min: number): number {
  const normalized = (count - min) / (max - min || 1);
  return 0.9 + normalized * 1.1;
}

export function getCategoryColorClass(index: number): string {
  const colorClasses = [
    "category-primary",
    "category-secondary",
    "category-accent",
    "category-info",
    "category-success",
    "category-warning",
    "category-error",
  ];
  return colorClasses[index % colorClasses.length];
}