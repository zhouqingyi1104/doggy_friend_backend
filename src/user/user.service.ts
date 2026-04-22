import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUser(id: bigint) {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async getSchool(userId: bigint) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { colleges: true },
    });

    return user?.colleges?.name || '请选择学校';
  }

  async getRecommendSchools() {
    // MySQL ORDER BY RAND() is not natively supported in Prisma, so we fetch ids and random sample
    // Or we can use raw query for simplicity
    const colleges = await this.prisma.$queryRaw`SELECT id, name FROM colleges ORDER BY RAND() LIMIT 15`;
    return colleges;
  }

  async setCollege(userId: bigint, collegeId: bigint) {
    const college = await this.prisma.colleges.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      throw new HttpException('学校不存在', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.users.update({
      where: { id: userId },
      data: { college_id: collegeId },
    });
  }

  async searchCollege(name: string) {
    if (!name) {
      throw new HttpException('内容不能为空', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.colleges.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 20, // limit results
    });
  }

  async clearSchool(userId: bigint) {
    return this.prisma.users.update({
      where: { id: userId },
      data: { college_id: null },
    });
  }

  async updateUser(userId: bigint, nickname?: string, avatar?: string) {
    const dataToUpdate: any = { updated_at: new Date() };
    if (nickname) {
      dataToUpdate.nickname = nickname;
    }
    if (avatar) {
      dataToUpdate.avatar = avatar;
    }

    if (!nickname && !avatar) {
      throw new HttpException('没有需要更新的内容', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.users.update({
      where: { id: userId },
      data: dataToUpdate,
    });
  }

  async createOrUpdateProfile(
    userId: bigint,
    mobile: string,
    name: string,
    grade: string,
    major: string,
    studentNumber: string,
    college: string,
  ) {
    // Find first, because there might not be a unique constraint on user_id in the DB for upsert to work safely
    const existing = await this.prisma.user_profiles.findFirst({
      where: { user_id: userId },
    });

    if (existing) {
      return this.prisma.user_profiles.update({
        where: { id: existing.id },
        data: {
          // Removed mobile because user_profiles in db does not have mobile column. 
          name: name || existing.name,
          grade: grade ? parseInt(grade, 10) : existing.grade,
          major: major || existing.major,
          student_number: studentNumber || existing.student_number,
          college: college || existing.college,
        },
      });
    } else {
      return this.prisma.user_profiles.create({
        data: {
          user_id: userId,
          // mobile column not in schema
          name: name || '',
          grade: grade ? parseInt(grade, 10) : 0,
          major: major || '',
          student_number: studentNumber || '',
          college: college || '',
        },
      });
    }
  }
}