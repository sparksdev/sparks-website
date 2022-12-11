import prisma from './prisma-client'
import { nonce } from '@utilities/encryption/utilities'

export default class User {
  static async update(userId, data) {}

  static async create(userId) {
    return await prisma.user.create({
      data: {
        userId,
        challenge: nonce(),
      },
    })
  }

  static async delete(userId) {
    return await prisma.user.delete({ where: { userId } })
  }

  static async get(userId) {
    if (!userId) return undefined
    const user = await prisma.user.findUnique({
      where: { userId },
      include: {
        attestations: true,
        memberStats: true,
      },
    })

    if (!user) return undefined

    user.applications = {
      memberStats: user.memberStats.length,
    }

    return user
  }
}
