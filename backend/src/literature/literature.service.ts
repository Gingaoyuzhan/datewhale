import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Work } from './entities/work.entity';
import { Passage } from './entities/passage.entity';
import { authorSeeds, workSeeds, passageSeeds } from './literature-seed';

@Injectable()
export class LiteratureService implements OnModuleInit {
  private readonly logger = new Logger(LiteratureService.name);

  // 内存缓存
  private passagesCache: Passage[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
    @InjectRepository(Passage)
    private passageRepository: Repository<Passage>,
  ) {}

  // 模块初始化时检查并填充种子数据
  async onModuleInit() {
    await this.seedDataIfEmpty();
  }

  // 检查并填充种子数据
  private async seedDataIfEmpty() {
    const authorCount = await this.authorRepository.count();
    if (authorCount > 0) {
      this.logger.log(`文学库已有 ${authorCount} 位作家，跳过种子数据初始化`);
      return;
    }

    this.logger.log('文学库为空，开始初始化种子数据...');

    try {
      // 1. 创建作家
      const authorMap = new Map<string, Author>();
      for (const seed of authorSeeds) {
        const author = this.authorRepository.create({
          name: seed.name,
          nameEn: seed.nameEn,
          era: seed.era,
          nationality: seed.nationality,
          styleTags: seed.styleTags,
          bio: seed.bio,
          plantType: seed.plantType,
          plantSymbol: seed.plantSymbol,
        });
        const savedAuthor = await this.authorRepository.save(author);
        authorMap.set(seed.name, savedAuthor);
        this.logger.log(`创建作家: ${seed.name}`);
      }

      // 2. 创建作品
      const workMap = new Map<string, Work>();
      for (const seed of workSeeds) {
        const author = authorMap.get(seed.authorName);
        if (!author) {
          this.logger.warn(`找不到作家: ${seed.authorName}，跳过作品: ${seed.title}`);
          continue;
        }
        const work = this.workRepository.create({
          title: seed.title,
          authorId: author.id,
          type: seed.type,
          era: seed.year,
        });
        const savedWork = await this.workRepository.save(work);
        workMap.set(`${seed.authorName}-${seed.title}`, savedWork);
      }
      this.logger.log(`创建了 ${workMap.size} 部作品`);

      // 3. 创建段落
      let passageCount = 0;
      for (const seed of passageSeeds) {
        const author = authorMap.get(seed.authorName);
        if (!author) {
          this.logger.warn(`找不到作家: ${seed.authorName}，跳过段落`);
          continue;
        }
        const work = seed.workTitle
          ? workMap.get(`${seed.authorName}-${seed.workTitle}`)
          : undefined;

        const passage = this.passageRepository.create({
          content: seed.content,
          authorId: author.id,
          workId: work?.id,
          emotionTags: seed.emotionTags,
          imageryTags: seed.imageryTags,
          sceneTags: seed.sceneTags,
          themeTags: seed.themeTags,
          contentLength: seed.content.length,
        });
        await this.passageRepository.save(passage);
        passageCount++;
      }
      this.logger.log(`创建了 ${passageCount} 条文学段落`);

      this.logger.log('文学库种子数据初始化完成！');
    } catch (error) {
      this.logger.error('种子数据初始化失败:', error);
    }
  }

  // 获取所有作家
  async getAllAuthors(): Promise<Author[]> {
    return this.authorRepository.find({
      order: { name: 'ASC' },
    });
  }

  // 获取作家详情
  async getAuthorById(id: number): Promise<Author | null> {
    return this.authorRepository.findOne({
      where: { id },
      relations: ['works'],
    });
  }

  // 获取段落详情
  async getPassageById(id: number): Promise<Passage | null> {
    return this.passageRepository.findOne({
      where: { id },
      relations: ['author', 'work'],
    });
  }

  // 获取所有段落（用于匹配，带缓存）
  async getAllPassages(): Promise<Passage[]> {
    const now = Date.now();

    // 检查缓存是否有效
    if (this.passagesCache && (now - this.cacheTimestamp) < this.CACHE_TTL) {
      this.logger.debug('使用缓存的文学段落数据');
      return this.passagesCache;
    }

    // 从数据库加载
    this.logger.log('从数据库加载文学段落数据');
    this.passagesCache = await this.passageRepository.find({
      relations: ['author', 'work'],
    });
    this.cacheTimestamp = now;

    return this.passagesCache;
  }

  // 清除缓存（在添加新段落后调用）
  clearCache(): void {
    this.passagesCache = null;
    this.cacheTimestamp = 0;
    this.logger.log('文学段落缓存已清除');
  }

  // 根据情感标签搜索段落
  async searchPassagesByEmotion(emotions: string[]): Promise<Passage[]> {
    if (!emotions.length) return [];

    const queryBuilder = this.passageRepository
      .createQueryBuilder('passage')
      .leftJoinAndSelect('passage.author', 'author')
      .leftJoinAndSelect('passage.work', 'work');

    // 使用JSONB包含查询
    const conditions = emotions.map(
      (_, index) => `passage.emotion_tags @> :emotion${index}`,
    );
    emotions.forEach((emotion, index) => {
      queryBuilder.setParameter(`emotion${index}`, JSON.stringify([emotion]));
    });

    return queryBuilder
      .where(conditions.join(' OR '))
      .limit(50)
      .getMany();
  }

  // 创建作家
  async createAuthor(authorData: Partial<Author>): Promise<Author> {
    const author = this.authorRepository.create(authorData);
    return this.authorRepository.save(author);
  }

  // 创建作品
  async createWork(workData: Partial<Work>): Promise<Work> {
    const work = this.workRepository.create(workData);
    return this.workRepository.save(work);
  }

  // 创建段落
  async createPassage(passageData: Partial<Passage>): Promise<Passage> {
    const passage = this.passageRepository.create({
      ...passageData,
      contentLength: passageData.content?.length || 0,
    });
    return this.passageRepository.save(passage);
  }

  // 批量创建段落
  async createPassages(passagesData: Partial<Passage>[]): Promise<Passage[]> {
    const passages = passagesData.map((data) =>
      this.passageRepository.create({
        ...data,
        contentLength: data.content?.length || 0,
      }),
    );
    return this.passageRepository.save(passages);
  }
}
