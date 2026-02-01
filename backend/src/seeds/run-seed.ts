/**
 * 种子数据执行脚本
 * 用于初始化文学段落库
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { LiteratureService } from '../literature/literature.service';
import { AiService } from '../ai/ai.service';
import { AUTHORS_DATA, WORKS_DATA, PASSAGES_DATA } from './literature-seed';

async function bootstrap() {
  console.log('🌱 开始初始化文学段落库...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const literatureService = app.get(LiteratureService);
  const aiService = app.get(AiService);

  try {
    // 1. 创建作家
    console.log('📚 创建作家数据...');
    const authorMap = new Map<string, number>();

    for (const authorData of AUTHORS_DATA) {
      const author = await literatureService.createAuthor(authorData);
      authorMap.set(author.name, author.id);
      console.log(`  ✓ ${author.name} (${author.plantType})`);
    }
    console.log(`\n共创建 ${authorMap.size} 位作家\n`);

    // 2. 创建作品
    console.log('📖 创建作品数据...');
    const workMap = new Map<string, number>();

    for (const workData of WORKS_DATA) {
      const authorId = authorMap.get(workData.authorName);
      if (!authorId) {
        console.log(`  ⚠ 未找到作家: ${workData.authorName}`);
        continue;
      }

      const work = await literatureService.createWork({
        authorId,
        title: workData.title,
        type: workData.type,
        era: workData.era,
      });
      workMap.set(`${workData.authorName}-${workData.title}`, work.id);
      console.log(`  ✓ ${workData.authorName} - ${workData.title}`);
    }
    console.log(`\n共创建 ${workMap.size} 部作品\n`);

    // 3. 创建段落并生成向量嵌入
    console.log('✍️ 创建段落数据...');
    let passageCount = 0;

    for (const passageData of PASSAGES_DATA) {
      const authorId = authorMap.get(passageData.authorName);
      const workKey = `${passageData.authorName}-${passageData.workTitle}`;
      const workId = workMap.get(workKey);

      if (!authorId) {
        console.log(`  ⚠ 未找到作家: ${passageData.authorName}`);
        continue;
      }

      // 生成向量嵌入
      let embedding: string | undefined;
      try {
        const embeddingResult = await aiService.generateEmbedding(passageData.content);
        embedding = JSON.stringify(embeddingResult);
      } catch (err) {
        console.log(`  ⚠ 向量生成失败: ${passageData.content.slice(0, 20)}...`);
      }

      await literatureService.createPassage({
        authorId,
        workId,
        content: passageData.content,
        emotionTags: passageData.emotionTags,
        imageryTags: passageData.imageryTags,
        sceneTags: passageData.sceneTags,
        themeTags: passageData.themeTags,
        embedding,
      });

      passageCount++;
      console.log(`  ✓ [${passageCount}] ${passageData.content.slice(0, 30)}...`);

      // 避免API限流，添加延迟
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(`\n共创建 ${passageCount} 条段落\n`);
    console.log('🎉 文学段落库初始化完成！');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
