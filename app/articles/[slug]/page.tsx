import { notFound } from "next/navigation";
import { Article, Comment } from "@/app/types";

const getArticle = async (slug: string) => {
    const res = await fetch(`http://localhost:3000/api/articles/${slug}`, {
        next: { revalidate: 60 },
    });

    if (res.status === 404) {
        // notFound 関数を呼び出すと、 not-found.tsxを表示する
        notFound();
    }

    if (!res.ok) {
        throw new Error("Failed to fetch article");
    }
    const data = await res.json();
    return data as Article;
};

const getComments = async (slug: string) => {
    console.log('getComments slug:', slug);
    // コメントは投稿されたら即座に反映したいのでキャッシュしない
    const res = await fetch(
        `http://localhost:3000/api/articles/${slug}/comments`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch comments");
    }

    const data = await res.json();
    console.log('data', data);
    return data as Comment[];
};

export default async function ArticleDetail({
    params,
}: {
    params: { slug: string };
}) {
    const articlePromise = getArticle(params.slug);
    const commentsPromise = getComments(params.slug);

    const [article, comments] = await Promise.all([
        articlePromise,
        commentsPromise,
    ]);

    console.log('article', article);
    console.log('comments', comments);

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
            <h2>Comments</h2>
            <ul>
                {comments?.map((comment) => (
                    <li key={comment.id}>{comment.body}</li>
                ))}
            </ul>
        </div>
    )
}