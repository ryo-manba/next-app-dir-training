import { Card, CardHeader, CardBody, Text, Heading } from '@/app/common/components';
import { Article } from '@/app/types';

export default function ArticleContent({ article }: { article: Article }) {
  return (
    <Card as='article'>
      <CardHeader>
        <Heading as='h1'>{article.title}</Heading>
      </CardHeader>
      <CardBody>
        <Text as='p' fontSize='md'>
          {article.content}
        </Text>
      </CardBody>
    </Card>
  );
}
