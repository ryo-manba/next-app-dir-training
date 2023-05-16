import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Article, Comment } from "@/app/types";
import type { Metadata, ResolvingMetadata } from 'next';
import ArticleContent from "./ArticleContent";
import Comments from "./Comments";
import { Heading } from "@/app/common/components";
import LoadingComments from "./LoadingComments";



export async function generateMetadata({
    params,
}: {
    params: { slug: string };
    parent?: ResolvingMetadata;
}): Promise<Metadata> {
    const article = await getArticle(params.slug);
    return {
        title: article?.title,
        description: article?.content,
    };
}

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

    const article = await articlePromise;

    return (
        <div>
            <ArticleContent article={article} />
            <Heading as="h2" mt={8} mb={4}>
                Comments
            </Heading>
            {/* @ts-expect-error 現状は jsx が Promise を返すと TypeScript が型エラーを報告するが、将来的には解決される */}
            <Suspense fallback={<LoadingComments />}>
                <Comments commentPromise={commentsPromise} />
            </Suspense>
        </div>
    )
}

// async function Comments({
//     commentPromise,
// }: {
//     commentPromise: Promise<Comment[]>;
// }) {
//     const comments = await commentPromise;
//     return (
//         <ul>
//             {comments?.map((comment) => (
//                 <li key={comment.id}>{comment.body}</li>
//             ))}
//         </ul>
//     )
// }